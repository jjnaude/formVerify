"""
Train a robust digit classifier on MNIST + SVHN combined data.

Architecture: Small ResNet-style CNN with batch norm.
Input: 1x32x32 grayscale (SVHN resized, MNIST padded from 28→32)
Output: 10 classes (digits 0-9)

Exports to ONNX for browser deployment via ONNX Runtime Web.
"""

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, ConcatDataset
from torchvision import datasets, transforms
import os

# --- Model ---

class ResBlock(nn.Module):
    def __init__(self, channels):
        super().__init__()
        self.conv1 = nn.Conv2d(channels, channels, 3, padding=1, bias=False)
        self.bn1 = nn.BatchNorm2d(channels)
        self.conv2 = nn.Conv2d(channels, channels, 3, padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(channels)

    def forward(self, x):
        residual = x
        out = torch.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        return torch.relu(out + residual)


class DigitClassifier(nn.Module):
    """Small CNN: ~85K params, input 1x32x32, output 10 logits."""
    def __init__(self):
        super().__init__()
        self.features = nn.Sequential(
            # 1x32x32 → 32x32x32
            nn.Conv2d(1, 32, 3, padding=1, bias=False),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            # 32x32x32 → 32x16x16
            nn.MaxPool2d(2),
            ResBlock(32),
            # 32x16x16 → 64x16x16
            nn.Conv2d(32, 64, 3, padding=1, bias=False),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            # 64x16x16 → 64x8x8
            nn.MaxPool2d(2),
            ResBlock(64),
            # 64x8x8 → 64x4x4
            nn.AdaptiveAvgPool2d(4),
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(64 * 4 * 4, 128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, 10),
        )

    def forward(self, x):
        return self.classifier(self.features(x))


# --- Data ---

DATA_DIR = '/workspaces/formVerify/data/training'
os.makedirs(DATA_DIR, exist_ok=True)

# MNIST: pad 28→32, normalize
mnist_transform = transforms.Compose([
    transforms.Pad(2),  # 28→32
    transforms.RandomAffine(degrees=10, translate=(0.1, 0.1), scale=(0.85, 1.15)),
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,)),
])

mnist_test_transform = transforms.Compose([
    transforms.Pad(2),
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,)),
])

# SVHN: convert to grayscale, normalize
svhn_transform = transforms.Compose([
    transforms.Grayscale(),
    transforms.RandomAffine(degrees=10, translate=(0.1, 0.1), scale=(0.85, 1.15)),
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,)),
])

svhn_test_transform = transforms.Compose([
    transforms.Grayscale(),
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,)),
])

print("Downloading datasets...")
mnist_train = datasets.MNIST(DATA_DIR, train=True, download=True, transform=mnist_transform)
mnist_test = datasets.MNIST(DATA_DIR, train=False, download=True, transform=mnist_test_transform)
svhn_train = datasets.SVHN(DATA_DIR, split='train', download=True, transform=svhn_transform)
svhn_test = datasets.SVHN(DATA_DIR, split='test', download=True, transform=svhn_test_transform)

# Combined training set
train_dataset = ConcatDataset([mnist_train, svhn_train])
train_loader = DataLoader(train_dataset, batch_size=128, shuffle=True, num_workers=2)

# Separate test loaders for reporting
mnist_test_loader = DataLoader(mnist_test, batch_size=256, num_workers=2)
svhn_test_loader = DataLoader(svhn_test, batch_size=256, num_workers=2)

print(f"Training: {len(mnist_train)} MNIST + {len(svhn_train)} SVHN = {len(train_dataset)} total")
print(f"Test: {len(mnist_test)} MNIST + {len(svhn_test)} SVHN")

# --- Training ---

device = 'cpu'
model = DigitClassifier().to(device)
param_count = sum(p.numel() for p in model.parameters())
print(f"\nModel: {param_count:,} parameters")

optimizer = optim.Adam(model.parameters(), lr=1e-3)
scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=3, gamma=0.5)
criterion = nn.CrossEntropyLoss()

NUM_EPOCHS = 8

for epoch in range(NUM_EPOCHS):
    model.train()
    total_loss = 0
    correct = 0
    total = 0

    for batch_idx, (data, target) in enumerate(train_loader):
        data, target = data.to(device), target.to(device)
        optimizer.zero_grad()
        output = model(data)
        loss = criterion(output, target)
        loss.backward()
        optimizer.step()

        total_loss += loss.item()
        pred = output.argmax(dim=1)
        correct += pred.eq(target).sum().item()
        total += target.size(0)

        if batch_idx % 100 == 0:
            print(f"  Epoch {epoch+1}/{NUM_EPOCHS}, batch {batch_idx}/{len(train_loader)}, "
                  f"loss: {loss.item():.4f}", end='\r')

    train_acc = 100. * correct / total
    scheduler.step()
    print(f"  Epoch {epoch+1}/{NUM_EPOCHS}: loss={total_loss/len(train_loader):.4f}, "
          f"train_acc={train_acc:.1f}%, lr={scheduler.get_last_lr()[0]:.6f}")

# --- Evaluation ---

def evaluate(model, loader, name):
    model.eval()
    correct = 0
    total = 0
    with torch.no_grad():
        for data, target in loader:
            data, target = data.to(device), target.to(device)
            output = model(data)
            pred = output.argmax(dim=1)
            correct += pred.eq(target).sum().item()
            total += target.size(0)
    acc = 100. * correct / total
    print(f"  {name}: {correct}/{total} ({acc:.1f}%)")
    return acc

print("\nTest accuracy:")
mnist_acc = evaluate(model, mnist_test_loader, "MNIST")
svhn_acc = evaluate(model, svhn_test_loader, "SVHN")

# --- Export to ONNX ---

OUTPUT_DIR = '/workspaces/formVerify/public/models'
ONNX_PATH = os.path.join(OUTPUT_DIR, 'digit-classifier.onnx')

model.eval()
dummy_input = torch.randn(1, 1, 32, 32)

torch.onnx.export(
    model,
    dummy_input,
    ONNX_PATH,
    input_names=['input'],
    output_names=['logits'],
    dynamic_axes={'input': {0: 'batch'}, 'logits': {0: 'batch'}},
    opset_version=12,
)

file_size = os.path.getsize(ONNX_PATH) / 1024
print(f"\nExported to {ONNX_PATH} ({file_size:.0f} KB)")
print(f"Input: 1x1x32x32 float32 (grayscale, normalized to [-1,1])")
print(f"Output: 1x10 logits")
