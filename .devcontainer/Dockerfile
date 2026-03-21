FROM mcr.microsoft.com/devcontainers/typescript-node:22

# Install Python 3 for future model training scripts
RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

# Install Claude Code CLI
RUN npm install -g @anthropic-ai/claude-code
