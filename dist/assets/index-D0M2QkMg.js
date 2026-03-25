var xy=Object.defineProperty;var Sy=(e,t,r)=>t in e?xy(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var mu=(e,t,r)=>Sy(e,typeof t!="symbol"?t+"":t,r);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function r(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(n){if(n.ep)return;n.ep=!0;const a=r(n);fetch(n.href,a)}})();const Iy="modulepreload",Ty=function(e){return"/formVerify/"+e},gu={},ky=function(t,r,i){let n=Promise.resolve();if(r&&r.length>0){let s=function(d){return Promise.all(d.map(c=>Promise.resolve(c).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),l=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));n=s(r.map(d=>{if(d=Ty(d),d in gu)return;gu[d]=!0;const c=d.endsWith(".css"),h=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${h}`))return;const f=document.createElement("link");if(f.rel=c?"stylesheet":Iy,c||(f.as="script"),f.crossOrigin="",f.href=d,l&&f.setAttribute("nonce",l),document.head.appendChild(f),c)return new Promise((y,_)=>{f.addEventListener("load",y),f.addEventListener("error",()=>_(new Error(`Unable to preload CSS for ${d}`)))})}))}function a(s){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=s,window.dispatchEvent(o),!o.defaultPrevented)throw s}return n.then(s=>{for(const o of s||[])o.status==="rejected"&&a(o.reason);return t().catch(a)})};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const bi=globalThis,Da=bi.ShadowRoot&&(bi.ShadyCSS===void 0||bi.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Na=Symbol(),yu=new WeakMap;let _c=class{constructor(t,r,i){if(this._$cssResult$=!0,i!==Na)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=r}get styleSheet(){let t=this.o;const r=this.t;if(Da&&t===void 0){const i=r!==void 0&&r.length===1;i&&(t=yu.get(r)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&yu.set(r,t))}return t}toString(){return this.cssText}};const Ey=e=>new _c(typeof e=="string"?e:e+"",void 0,Na),Pa=(e,...t)=>{const r=e.length===1?e[0]:t.reduce((i,n,a)=>i+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+e[a+1],e[0]);return new _c(r,e,Na)},Cy=(e,t)=>{if(Da)e.adoptedStyleSheets=t.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet);else for(const r of t){const i=document.createElement("style"),n=bi.litNonce;n!==void 0&&i.setAttribute("nonce",n),i.textContent=r.cssText,e.appendChild(i)}},_u=Da?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let r="";for(const i of t.cssRules)r+=i.cssText;return Ey(r)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:zy,defineProperty:Ay,getOwnPropertyDescriptor:Oy,getOwnPropertyNames:Ry,getOwnPropertySymbols:My,getPrototypeOf:By}=Object,vt=globalThis,wu=vt.trustedTypes,Dy=wu?wu.emptyScript:"",dn=vt.reactiveElementPolyfillSupport,Or=(e,t)=>e,xi={toAttribute(e,t){switch(t){case Boolean:e=e?Dy:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=e!==null;break;case Number:r=e===null?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch{r=null}}return r}},Ua=(e,t)=>!zy(e,t),bu={attribute:!0,type:String,converter:xi,reflect:!1,useDefault:!1,hasChanged:Ua};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),vt.litPropertyMetadata??(vt.litPropertyMetadata=new WeakMap);let er=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,r=bu){if(r.state&&(r.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((r=Object.create(r)).wrapped=!0),this.elementProperties.set(t,r),!r.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(t,i,r);n!==void 0&&Ay(this.prototype,t,n)}}static getPropertyDescriptor(t,r,i){const{get:n,set:a}=Oy(this.prototype,t)??{get(){return this[r]},set(s){this[r]=s}};return{get:n,set(s){const o=n==null?void 0:n.call(this);a==null||a.call(this,s),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??bu}static _$Ei(){if(this.hasOwnProperty(Or("elementProperties")))return;const t=By(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Or("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Or("properties"))){const r=this.properties,i=[...Ry(r),...My(r)];for(const n of i)this.createProperty(n,r[n])}const t=this[Symbol.metadata];if(t!==null){const r=litPropertyMetadata.get(t);if(r!==void 0)for(const[i,n]of r)this.elementProperties.set(i,n)}this._$Eh=new Map;for(const[r,i]of this.elementProperties){const n=this._$Eu(r,i);n!==void 0&&this._$Eh.set(n,r)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const r=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const n of i)r.unshift(_u(n))}else t!==void 0&&r.push(_u(t));return r}static _$Eu(t,r){const i=r.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(r=>r(this))}addController(t){var r;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((r=t.hostConnected)==null||r.call(t))}removeController(t){var r;(r=this._$EO)==null||r.delete(t)}_$E_(){const t=new Map,r=this.constructor.elementProperties;for(const i of r.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Cy(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(r=>{var i;return(i=r.hostConnected)==null?void 0:i.call(r)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(r=>{var i;return(i=r.hostDisconnected)==null?void 0:i.call(r)})}attributeChangedCallback(t,r,i){this._$AK(t,i)}_$ET(t,r){var a;const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(n!==void 0&&i.reflect===!0){const s=(((a=i.converter)==null?void 0:a.toAttribute)!==void 0?i.converter:xi).toAttribute(r,i.type);this._$Em=t,s==null?this.removeAttribute(n):this.setAttribute(n,s),this._$Em=null}}_$AK(t,r){var a,s;const i=this.constructor,n=i._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=i.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((a=o.converter)==null?void 0:a.fromAttribute)!==void 0?o.converter:xi;this._$Em=n;const d=l.fromAttribute(r,o.type);this[n]=d??((s=this._$Ej)==null?void 0:s.get(n))??d,this._$Em=null}}requestUpdate(t,r,i,n=!1,a){var s;if(t!==void 0){const o=this.constructor;if(n===!1&&(a=this[t]),i??(i=o.getPropertyOptions(t)),!((i.hasChanged??Ua)(a,r)||i.useDefault&&i.reflect&&a===((s=this._$Ej)==null?void 0:s.get(t))&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,r,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,r,{useDefault:i,reflect:n,wrapped:a},s){i&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,s??r??this[t]),a!==!0||s!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(r=void 0),this._$AL.set(t,r)),n===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(r){Promise.reject(r)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[a,s]of this._$Ep)this[a]=s;this._$Ep=void 0}const n=this.constructor.elementProperties;if(n.size>0)for(const[a,s]of n){const{wrapped:o}=s,l=this[a];o!==!0||this._$AL.has(a)||l===void 0||this.C(a,void 0,s,l)}}let t=!1;const r=this._$AL;try{t=this.shouldUpdate(r),t?(this.willUpdate(r),(i=this._$EO)==null||i.forEach(n=>{var a;return(a=n.hostUpdate)==null?void 0:a.call(n)}),this.update(r)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(r)}willUpdate(t){}_$AE(t){var r;(r=this._$EO)==null||r.forEach(i=>{var n;return(n=i.hostUpdated)==null?void 0:n.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(r=>this._$ET(r,this[r]))),this._$EM()}updated(t){}firstUpdated(t){}};er.elementStyles=[],er.shadowRootOptions={mode:"open"},er[Or("elementProperties")]=new Map,er[Or("finalized")]=new Map,dn==null||dn({ReactiveElement:er}),(vt.reactiveElementVersions??(vt.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Rr=globalThis,$u=e=>e,Si=Rr.trustedTypes,vu=Si?Si.createPolicy("lit-html",{createHTML:e=>e}):void 0,wc="$lit$",$t=`lit$${Math.random().toFixed(9).slice(2)}$`,bc="?"+$t,Ny=`<${bc}>`,Gt=document,Br=()=>Gt.createComment(""),Dr=e=>e===null||typeof e!="object"&&typeof e!="function",La=Array.isArray,Py=e=>La(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",pn=`[ 	
\f\r]`,mr=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,xu=/-->/g,Su=/>/g,Ct=RegExp(`>|${pn}(?:([^\\s"'>=/]+)(${pn}*=${pn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Iu=/'/g,Tu=/"/g,$c=/^(?:script|style|textarea|title)$/i,Uy=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),he=Uy(1),nr=Symbol.for("lit-noChange"),me=Symbol.for("lit-nothing"),ku=new WeakMap,Nt=Gt.createTreeWalker(Gt,129);function vc(e,t){if(!La(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return vu!==void 0?vu.createHTML(t):t}const Ly=(e,t)=>{const r=e.length-1,i=[];let n,a=t===2?"<svg>":t===3?"<math>":"",s=mr;for(let o=0;o<r;o++){const l=e[o];let d,c,h=-1,f=0;for(;f<l.length&&(s.lastIndex=f,c=s.exec(l),c!==null);)f=s.lastIndex,s===mr?c[1]==="!--"?s=xu:c[1]!==void 0?s=Su:c[2]!==void 0?($c.test(c[2])&&(n=RegExp("</"+c[2],"g")),s=Ct):c[3]!==void 0&&(s=Ct):s===Ct?c[0]===">"?(s=n??mr,h=-1):c[1]===void 0?h=-2:(h=s.lastIndex-c[2].length,d=c[1],s=c[3]===void 0?Ct:c[3]==='"'?Tu:Iu):s===Tu||s===Iu?s=Ct:s===xu||s===Su?s=mr:(s=Ct,n=void 0);const y=s===Ct&&e[o+1].startsWith("/>")?" ":"";a+=s===mr?l+Ny:h>=0?(i.push(d),l.slice(0,h)+wc+l.slice(h)+$t+y):l+$t+(h===-2?o:y)}return[vc(e,a+(e[r]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]};class Nr{constructor({strings:t,_$litType$:r},i){let n;this.parts=[];let a=0,s=0;const o=t.length-1,l=this.parts,[d,c]=Ly(t,r);if(this.el=Nr.createElement(d,i),Nt.currentNode=this.el.content,r===2||r===3){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(n=Nt.nextNode())!==null&&l.length<o;){if(n.nodeType===1){if(n.hasAttributes())for(const h of n.getAttributeNames())if(h.endsWith(wc)){const f=c[s++],y=n.getAttribute(h).split($t),_=/([.?@])?(.*)/.exec(f);l.push({type:1,index:a,name:_[2],strings:y,ctor:_[1]==="."?qy:_[1]==="?"?Vy:_[1]==="@"?Gy:Ni}),n.removeAttribute(h)}else h.startsWith($t)&&(l.push({type:6,index:a}),n.removeAttribute(h));if($c.test(n.tagName)){const h=n.textContent.split($t),f=h.length-1;if(f>0){n.textContent=Si?Si.emptyScript:"";for(let y=0;y<f;y++)n.append(h[y],Br()),Nt.nextNode(),l.push({type:2,index:++a});n.append(h[f],Br())}}}else if(n.nodeType===8)if(n.data===bc)l.push({type:2,index:a});else{let h=-1;for(;(h=n.data.indexOf($t,h+1))!==-1;)l.push({type:7,index:a}),h+=$t.length-1}a++}}static createElement(t,r){const i=Gt.createElement("template");return i.innerHTML=t,i}}function ar(e,t,r=e,i){var s,o;if(t===nr)return t;let n=i!==void 0?(s=r._$Co)==null?void 0:s[i]:r._$Cl;const a=Dr(t)?void 0:t._$litDirective$;return(n==null?void 0:n.constructor)!==a&&((o=n==null?void 0:n._$AO)==null||o.call(n,!1),a===void 0?n=void 0:(n=new a(e),n._$AT(e,r,i)),i!==void 0?(r._$Co??(r._$Co=[]))[i]=n:r._$Cl=n),n!==void 0&&(t=ar(e,n._$AS(e,t.values),n,i)),t}let Wy=class{constructor(t,r){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:r},parts:i}=this._$AD,n=((t==null?void 0:t.creationScope)??Gt).importNode(r,!0);Nt.currentNode=n;let a=Nt.nextNode(),s=0,o=0,l=i[0];for(;l!==void 0;){if(s===l.index){let d;l.type===2?d=new Wa(a,a.nextSibling,this,t):l.type===1?d=new l.ctor(a,l.name,l.strings,this,t):l.type===6&&(d=new Hy(a,this,t)),this._$AV.push(d),l=i[++o]}s!==(l==null?void 0:l.index)&&(a=Nt.nextNode(),s++)}return Nt.currentNode=Gt,n}p(t){let r=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,r),r+=i.strings.length-2):i._$AI(t[r])),r++}},Wa=class xc{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,r,i,n){this.type=2,this._$AH=me,this._$AN=void 0,this._$AA=t,this._$AB=r,this._$AM=i,this.options=n,this._$Cv=(n==null?void 0:n.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const r=this._$AM;return r!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=r.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,r=this){t=ar(this,t,r),Dr(t)?t===me||t==null||t===""?(this._$AH!==me&&this._$AR(),this._$AH=me):t!==this._$AH&&t!==nr&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Py(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==me&&Dr(this._$AH)?this._$AA.nextSibling.data=t:this.T(Gt.createTextNode(t)),this._$AH=t}$(t){var a;const{values:r,_$litType$:i}=t,n=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=Nr.createElement(vc(i.h,i.h[0]),this.options)),i);if(((a=this._$AH)==null?void 0:a._$AD)===n)this._$AH.p(r);else{const s=new Wy(n,this),o=s.u(this.options);s.p(r),this.T(o),this._$AH=s}}_$AC(t){let r=ku.get(t.strings);return r===void 0&&ku.set(t.strings,r=new Nr(t)),r}k(t){La(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let i,n=0;for(const a of t)n===r.length?r.push(i=new xc(this.O(Br()),this.O(Br()),this,this.options)):i=r[n],i._$AI(a),n++;n<r.length&&(this._$AR(i&&i._$AB.nextSibling,n),r.length=n)}_$AR(t=this._$AA.nextSibling,r){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,r);t!==this._$AB;){const n=$u(t).nextSibling;$u(t).remove(),t=n}}setConnected(t){var r;this._$AM===void 0&&(this._$Cv=t,(r=this._$AP)==null||r.call(this,t))}};class Ni{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,r,i,n,a){this.type=1,this._$AH=me,this._$AN=void 0,this.element=t,this.name=r,this._$AM=n,this.options=a,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=me}_$AI(t,r=this,i,n){const a=this.strings;let s=!1;if(a===void 0)t=ar(this,t,r,0),s=!Dr(t)||t!==this._$AH&&t!==nr,s&&(this._$AH=t);else{const o=t;let l,d;for(t=a[0],l=0;l<a.length-1;l++)d=ar(this,o[i+l],r,l),d===nr&&(d=this._$AH[l]),s||(s=!Dr(d)||d!==this._$AH[l]),d===me?t=me:t!==me&&(t+=(d??"")+a[l+1]),this._$AH[l]=d}s&&!n&&this.j(t)}j(t){t===me?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class qy extends Ni{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===me?void 0:t}}let Vy=class extends Ni{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==me)}};class Gy extends Ni{constructor(t,r,i,n,a){super(t,r,i,n,a),this.type=5}_$AI(t,r=this){if((t=ar(this,t,r,0)??me)===nr)return;const i=this._$AH,n=t===me&&i!==me||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,a=t!==me&&(i===me||n);n&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var r;typeof this._$AH=="function"?this._$AH.call(((r=this.options)==null?void 0:r.host)??this.element,t):this._$AH.handleEvent(t)}}class Hy{constructor(t,r,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=r,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){ar(this,t)}}const cn=Rr.litHtmlPolyfillSupport;cn==null||cn(Nr,Wa),(Rr.litHtmlVersions??(Rr.litHtmlVersions=[])).push("3.3.2");const Fy=(e,t,r)=>{const i=(r==null?void 0:r.renderBefore)??t;let n=i._$litPart$;if(n===void 0){const a=(r==null?void 0:r.renderBefore)??null;i._$litPart$=n=new Wa(t.insertBefore(Br(),a),a,void 0,r??{})}return n._$AI(e),n};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pt=globalThis;class Ut extends er{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var r;const t=super.createRenderRoot();return(r=this.renderOptions).renderBefore??(r.renderBefore=t.firstChild),t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Fy(r,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return nr}}var yc;Ut._$litElement$=!0,Ut.finalized=!0,(yc=Pt.litElementHydrateSupport)==null||yc.call(Pt,{LitElement:Ut});const hn=Pt.litElementPolyfillSupport;hn==null||hn({LitElement:Ut});(Pt.litElementVersions??(Pt.litElementVersions=[])).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const qa=e=>(t,r)=>{r!==void 0?r.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const jy={attribute:!0,type:String,converter:xi,reflect:!1,hasChanged:Ua},Ky=(e=jy,t,r)=>{const{kind:i,metadata:n}=r;let a=globalThis.litPropertyMetadata.get(n);if(a===void 0&&globalThis.litPropertyMetadata.set(n,a=new Map),i==="setter"&&((e=Object.create(e)).wrapped=!0),a.set(r.name,e),i==="accessor"){const{name:s}=r;return{set(o){const l=t.get.call(this);t.set.call(this,o),this.requestUpdate(s,l,e,!0,o)},init(o){return o!==void 0&&this.C(s,void 0,e,o),o}}}if(i==="setter"){const{name:s}=r;return function(o){const l=this[s];t.call(this,o),this.requestUpdate(s,l,e,!0,o)}}throw Error("Unsupported decorator location: "+i)};function Sc(e){return(t,r)=>typeof r=="object"?Ky(e,t,r):((i,n,a)=>{const s=n.hasOwnProperty(a);return n.constructor.createProperty(a,i),s?Object.getOwnPropertyDescriptor(n,a):void 0})(e,t,r)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ae(e){return Sc({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Yy=(e,t,r)=>(r.configurable=!0,r.enumerable=!0,Reflect.decorate&&typeof t!="object"&&Object.defineProperty(e,t,r),r);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Qy(e,t){return(r,i,n)=>{const a=s=>{var o;return((o=s.renderRoot)==null?void 0:o.querySelector(e))??null};return Yy(r,i,{get(){return a(this)}})}}const fa=(e,t)=>t.some(r=>e instanceof r);let Eu,Cu;function Zy(){return Eu||(Eu=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Xy(){return Cu||(Cu=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const ma=new WeakMap,fn=new WeakMap,Pi=new WeakMap;function Jy(e){const t=new Promise((r,i)=>{const n=()=>{e.removeEventListener("success",a),e.removeEventListener("error",s)},a=()=>{r(Lt(e.result)),n()},s=()=>{i(e.error),n()};e.addEventListener("success",a),e.addEventListener("error",s)});return Pi.set(t,e),t}function e_(e){if(ma.has(e))return;const t=new Promise((r,i)=>{const n=()=>{e.removeEventListener("complete",a),e.removeEventListener("error",s),e.removeEventListener("abort",s)},a=()=>{r(),n()},s=()=>{i(e.error||new DOMException("AbortError","AbortError")),n()};e.addEventListener("complete",a),e.addEventListener("error",s),e.addEventListener("abort",s)});ma.set(e,t)}let ga={get(e,t,r){if(e instanceof IDBTransaction){if(t==="done")return ma.get(e);if(t==="store")return r.objectStoreNames[1]?void 0:r.objectStore(r.objectStoreNames[0])}return Lt(e[t])},set(e,t,r){return e[t]=r,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function Ic(e){ga=e(ga)}function t_(e){return Xy().includes(e)?function(...t){return e.apply(ya(this),t),Lt(this.request)}:function(...t){return Lt(e.apply(ya(this),t))}}function r_(e){return typeof e=="function"?t_(e):(e instanceof IDBTransaction&&e_(e),fa(e,Zy())?new Proxy(e,ga):e)}function Lt(e){if(e instanceof IDBRequest)return Jy(e);if(fn.has(e))return fn.get(e);const t=r_(e);return t!==e&&(fn.set(e,t),Pi.set(t,e)),t}const ya=e=>Pi.get(e);function i_(e,t,{blocked:r,upgrade:i,blocking:n,terminated:a}={}){const s=indexedDB.open(e,t),o=Lt(s);return i&&s.addEventListener("upgradeneeded",l=>{i(Lt(s.result),l.oldVersion,l.newVersion,Lt(s.transaction),l)}),r&&s.addEventListener("blocked",l=>r(l.oldVersion,l.newVersion,l)),o.then(l=>{a&&l.addEventListener("close",()=>a()),n&&l.addEventListener("versionchange",d=>n(d.oldVersion,d.newVersion,d))}).catch(()=>{}),o}const n_=["get","getKey","getAll","getAllKeys","count"],a_=["put","add","delete","clear"],mn=new Map;function zu(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(mn.get(t))return mn.get(t);const r=t.replace(/FromIndex$/,""),i=t!==r,n=a_.includes(r);if(!(r in(i?IDBIndex:IDBObjectStore).prototype)||!(n||n_.includes(r)))return;const a=async function(s,...o){const l=this.transaction(s,n?"readwrite":"readonly");let d=l.store;return i&&(d=d.index(o.shift())),(await Promise.all([d[r](...o),n&&l.done]))[0]};return mn.set(t,a),a}Ic(e=>({...e,get:(t,r,i)=>zu(t,r)||e.get(t,r,i),has:(t,r)=>!!zu(t,r)||e.has(t,r)}));const s_=["continue","continuePrimaryKey","advance"],Au={},_a=new WeakMap,Tc=new WeakMap,o_={get(e,t){if(!s_.includes(t))return e[t];let r=Au[t];return r||(r=Au[t]=function(...i){_a.set(this,Tc.get(this)[t](...i))}),r}};async function*u_(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const r=new Proxy(t,o_);for(Tc.set(r,t),Pi.set(r,ya(t));t;)yield r,t=await(_a.get(r)||t.continue()),_a.delete(r)}function Ou(e,t){return t===Symbol.asyncIterator&&fa(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&fa(e,[IDBIndex,IDBObjectStore])}Ic(e=>({...e,get(t,r,i){return Ou(t,r)?u_:e.get(t,r,i)},has(t,r){return Ou(t,r)||e.has(t,r)}}));const l_="formVerify",d_=1;let gn=null;function Va(){return gn||(gn=i_(l_,d_,{upgrade(e){const t=e.createObjectStore("captures",{keyPath:"id",autoIncrement:!0});t.createIndex("by-timestamp","timestamp"),t.createIndex("by-status","status")}})),gn}async function Ga(e){const t=await Va(),r={blob:e,timestamp:Date.now(),status:"captured"};return t.add("captures",r)}async function kc(e){return(await Va()).get("captures",e)}async function Ec(e,t){const r=await Va(),i=await r.get("captures",e);i&&(i.status=t,await r.put("captures",i))}const p_=Object.freeze(Object.defineProperty({__proto__:null,getCapture:kc,saveCapture:Ga,updateCaptureStatus:Ec},Symbol.toStringTag,{value:"Module"}));var c_=Object.defineProperty,h_=Object.getOwnPropertyDescriptor,Lr=(e,t,r,i)=>{for(var n=i>1?void 0:i?h_(t,r):t,a=e.length-1,s;a>=0;a--)(s=e[a])&&(n=(i?s(t,r,n):s(n))||n);return i&&n&&c_(t,r,n),n};let Ht=class extends Ut{constructor(){super(...arguments),this._state="idle",this._error="",this._previewUrl="",this._stream=null,this._capturedBlob=null}disconnectedCallback(){super.disconnectedCallback(),this._stopStream(),this._revokePreview()}async _startCamera(){try{this._stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"},width:{ideal:3840},height:{ideal:2160}},audio:!1}),this._state="streaming",await this.updateComplete,this._video.srcObject=this._stream}catch(e){this._error=e instanceof DOMException&&e.name==="NotAllowedError"?"Camera permission denied. Please allow camera access and try again.":"Could not access camera. Ensure a camera is available.",this._state="error"}}_stopStream(){if(this._stream){for(const e of this._stream.getTracks())e.stop();this._stream=null}}_revokePreview(){this._previewUrl&&(URL.revokeObjectURL(this._previewUrl),this._previewUrl="")}async _capture(){const e=this._video,t=document.createElement("canvas");t.width=e.videoWidth,t.height=e.videoHeight,t.getContext("2d").drawImage(e,0,0),this._capturedBlob=await new Promise((i,n)=>{t.toBlob(a=>a?i(a):n(new Error("Canvas toBlob failed")),"image/jpeg",.92)}),this._stopStream(),this._revokePreview(),this._previewUrl=URL.createObjectURL(this._capturedBlob),this._state="preview"}_retake(){this._revokePreview(),this._capturedBlob=null,this._startCamera()}async _accept(){if(!this._capturedBlob)return;const e=await Ga(this._capturedBlob);this._revokePreview(),this._capturedBlob=null,this._state="idle",this.dispatchEvent(new CustomEvent("capture-saved",{detail:{id:e},bubbles:!0,composed:!0}))}render(){switch(this._state){case"idle":return he`
          <div class="viewfinder">
            <p class="message">Tap the button below to start the camera</p>
          </div>
          <div class="controls">
            <button class="start-btn" @click=${this._startCamera}>Open Camera</button>
          </div>
        `;case"streaming":return he`
          <div class="viewfinder">
            <video autoplay playsinline muted></video>
            <div class="overlay">
              <div class="guide">
                <div class="corner tl"></div>
                <div class="corner tr"></div>
                <div class="corner bl"></div>
                <div class="corner br"></div>
              </div>
            </div>
          </div>
          <div class="controls">
            <button class="capture-btn" @click=${this._capture} aria-label="Capture photo"></button>
          </div>
        `;case"preview":return he`
          <div class="viewfinder">
            <img class="preview-img" src=${this._previewUrl} alt="Captured photo" />
          </div>
          <div class="controls">
            <button class="retake-btn" @click=${this._retake}>Retake</button>
            <button class="accept-btn" @click=${this._accept}>Accept</button>
          </div>
        `;case"error":return he`
          <p class="error-msg">${this._error}</p>
          <div class="controls">
            <button class="start-btn" @click=${this._startCamera}>Try Again</button>
          </div>
        `}}};Ht.styles=Pa`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: 100%;
    }

    .viewfinder {
      position: relative;
      width: 100%;
      max-width: 600px;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #000;
      overflow: hidden;
    }

    video,
    .preview-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    /* A4 portrait guide overlay */
    .overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }

    .guide {
      /* A4 ratio 210:297 ≈ 0.707 */
      width: 70%;
      aspect-ratio: 210 / 297;
      border: 2px dashed rgba(255, 255, 255, 0.6);
      border-radius: 4px;
    }

    .corner {
      position: absolute;
      width: 20px;
      height: 20px;
      border-color: rgba(255, 255, 255, 0.9);
      border-style: solid;
      border-width: 0;
    }

    .corner.tl {
      top: 0;
      left: 0;
      border-top-width: 3px;
      border-left-width: 3px;
    }
    .corner.tr {
      top: 0;
      right: 0;
      border-top-width: 3px;
      border-right-width: 3px;
    }
    .corner.bl {
      bottom: 0;
      left: 0;
      border-bottom-width: 3px;
      border-left-width: 3px;
    }
    .corner.br {
      bottom: 0;
      right: 0;
      border-bottom-width: 3px;
      border-right-width: 3px;
    }

    .controls {
      display: flex;
      gap: 16px;
      padding: 16px;
      justify-content: center;
      width: 100%;
      max-width: 600px;
    }

    button {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .capture-btn {
      background: #1a73e8;
      color: white;
      width: 72px;
      height: 72px;
      border-radius: 50%;
      padding: 0;
      border: 4px solid white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .capture-btn:active {
      background: #1557b0;
    }

    .retake-btn {
      background: #e0e0e0;
      color: #333;
    }

    .accept-btn {
      background: #34a853;
      color: white;
    }

    .start-btn {
      background: #1a73e8;
      color: white;
    }

    .error-msg {
      color: #d93025;
      padding: 24px;
      text-align: center;
    }

    .message {
      color: #666;
      padding: 24px;
      text-align: center;
    }
  `;Lr([Ae()],Ht.prototype,"_state",2);Lr([Ae()],Ht.prototype,"_error",2);Lr([Ae()],Ht.prototype,"_previewUrl",2);Lr([Qy("video")],Ht.prototype,"_video",2);Ht=Lr([qa("camera-capture")],Ht);let ti=null,gr=null;function f_(){return ti?Promise.resolve(ti):gr||(gr=new Promise((e,t)=>{const r=document.createElement("script");r.src="/formVerify/opencv.js",r.async=!0,r.onload=()=>{const i=window.cv;i!=null&&i.Mat?(ti=i,e(i)):i&&typeof i.then=="function"?i.then(n=>{delete n.then,window.cv=n,ti=n,e(n)}):t(new Error("OpenCV.js loaded but cv is not available"))},r.onerror=()=>{gr=null,t(new Error("Failed to load OpenCV.js"))},document.head.appendChild(r)}),gr)}function m_(e,t){const r=new e.Mat;t.channels()===4?e.cvtColor(t,r,e.COLOR_RGBA2GRAY):t.channels()===3?e.cvtColor(t,r,e.COLOR_RGB2GRAY):t.copyTo(r);try{return g_(e,r)}finally{r.delete()}}function g_(e,t){const r=e.getPredefinedDictionary(e.DICT_4X4_50),i=new e.aruco_DetectorParameters,n=new e.aruco_RefineParameters(10,3,!0),a=new e.aruco_ArucoDetector(r,i,n),s=new e.MatVector,o=new e.Mat,l=new e.MatVector;try{a.detectMarkers(t,s,o,l);const d=[];for(let c=0;c<o.rows;c++){const h=o.intAt(c,0);if(h<0||h>3)continue;const f=s.get(c),y=[];for(let _=0;_<4;_++)y.push({x:f.floatAt(0,_*2),y:f.floatAt(0,_*2+1)});f.delete(),d.push({id:h,corners:y})}return d}finally{s.delete(),o.delete(),l.delete(),a.delete(),n.delete(),i.delete(),r.delete()}}const ri=2339,ii=1654;function ni(e){const t=[2,3,0,1][e.id];return e.corners[t]}function y_(e,t,r){const i=new Map(r.map(f=>[f.id,f]));if(i.size<4)return null;for(let f=0;f<4;f++)if(!i.has(f))return null;const n=ni(i.get(0)),a=ni(i.get(1)),s=ni(i.get(2)),o=ni(i.get(3)),l=e.matFromArray(4,1,e.CV_32FC2,[n.x,n.y,a.x,a.y,s.x,s.y,o.x,o.y]),d=e.matFromArray(4,1,e.CV_32FC2,[0,0,ri,0,ri,ii,0,ii]),c=e.getPerspectiveTransform(l,d),h=new e.Mat;try{return e.warpPerspective(t,h,c,new e.Size(ri,ii),e.INTER_LINEAR,e.BORDER_CONSTANT,new e.Scalar(255,255,255,255)),{corrected:h,width:ri,height:ii}}finally{l.delete(),d.delete(),c.delete()}}function __(e,t,r=.92){const i=document.createElement("canvas");return i.width=t.cols,i.height=t.rows,e.imshow(i,t),new Promise((n,a)=>{i.toBlob(s=>s?n(s):a(new Error("matToBlob failed")),"image/jpeg",r)})}function w_(e,t){const r=new e.Mat;t.channels()===4?e.cvtColor(t,r,e.COLOR_RGBA2GRAY):t.channels()===3?e.cvtColor(t,r,e.COLOR_RGB2GRAY):t.copyTo(r);const i=new e.CLAHE(2,new e.Size(4,4)),n=new e.Mat;i.apply(r,n),r.delete(),i.delete();const a=new e.Mat;return e.threshold(n,a,0,255,e.THRESH_BINARY|e.THRESH_OTSU),n.delete(),a}const wa=2339,Ii=1654,Wt=34,Ti=Math.round(.0308*Ii),ir=34,b_=11,ki=Wt+b_,$_=14,v_=["90L RUC","7.6L Sharps","20L Sharps","25L Sharps","2.5L Specibin","5L Specibin","10L Specibin","20L Specibin","25L Specibin","Pharma 5L","Pharma 20L","50L Box","142L Box","Other"],x_=["received","gross_kg","nett_kg"];function S_(e,t){const r=new e.Mat;e.cvtColor(t,r,e.COLOR_RGBA2GRAY);try{const i=I_(e,r),n=T_(e,r,i),a=n,s=i[3],{dividers:o,tableStripImage:l}=k_(e,r,t,a,s),d=Math.round(o.slice(1).reduce((_,w,S)=>_+(w-o[S]),0)/(o.length-1)),c=[],h=new Map,f=new Map,y=new Map;for(let _=0;_<$_;_++){const w=o[_],$=(_<o.length-1?o[_+1]:Math.min(wa,w+d))-w,b=E_(e,t,w,$,d,a,s,i);h.set(_,b);for(let T=0;T<3;T++){const I=i[T],A=i[T+1]-I,O=T>0,x=O?4:3;let z;O?z=2*ir+ki+Wt:z=2*ir+Wt;const N=w+(d-z)/2,q=I+(A-Ti)/2;let G=0;for(let H=0;H<x;H++){const R=Math.round(N+G),F=Math.round(q),K=Wt,X=Ti,ue=Math.max(0,Math.min(R,wa-K)),W=Math.max(0,Math.min(F,Ii-X)),fe=v_[_],P=x_[T],U=`${P}_${fe.replace(/[\s.]/g,"_")}`,J=`${U}_d${H}`,ee=t.roi(new e.Rect(ue,W,K,X)),_e=Ei(e,ee),He=w_(e,ee),Fe=Ei(e,He);He.delete(),ee.delete();const It={cellId:J,row:P,col:fe,digitIndex:H,isDecimal:O&&H>=3,fieldId:U,imageData:_e,preprocessedData:Fe};c.push(It),f.set(J,_e),y.set(J,Fe),O&&H===2?G+=ki:G+=ir}}}return{digits:c,debug:{rowBounds:i,headerTop:n,tableStripImage:l,columnDividers:o,avgColumnWidth:d,columnCrops:h,digitCrops:f,digitPreprocessed:y}}}finally{r.delete()}}function I_(e,t){const r=new e.Mat;e.Canny(t,r,50,150);const i=new e.Mat;e.HoughLinesP(r,i,1,Math.PI/180,40,40,3);const n=[];for(let h=0;h<i.rows;h++){const f=i.intAt(h,0),y=i.intAt(h,1),_=i.intAt(h,2),w=i.intAt(h,3),S=Math.abs(Math.atan2(w-y,_-f)*180/Math.PI);(S<3||S>177)&&n.push((y+w)/2)}i.delete(),r.delete(),n.sort((h,f)=>h-f);const a=[];let s=[n[0]];for(let h=1;h<n.length;h++)n[h]-n[h-1]<10?s.push(n[h]):(a.push(s),s=[n[h]]);a.push(s);const l=a.map(h=>Math.round(h.reduce((f,y)=>f+y,0)/h.length)).filter(h=>h>150&&h<500);let d=null,c=1/0;for(let h=0;h<l.length;h++)for(let f=h+1;f<l.length;f++){const y=l[f]-l[h];if(!(y<40||y>80))for(let _=f+1;_<l.length;_++){const w=l[_]-l[f];if(!(w<40||w>80))for(let S=_+1;S<l.length;S++){const $=l[S]-l[_];if($<40||$>80)continue;const b=(y+w+$)/3,T=Math.abs(y-b)+Math.abs(w-b)+Math.abs($-b),I=(l[h]+l[S])/2,E=(.1485+.2145)/2*Ii+.0308*Ii/2,A=T+Math.abs(I-E)*.5;A<c&&(c=A,d=[l[h],l[f],l[_],l[S]])}}}if(!d)throw new Error("Could not detect row boundaries in form image");return d}function T_(e,t,r){const i=new e.Mat;e.Canny(t,i,50,150);const n=new e.Mat;e.HoughLinesP(i,n,1,Math.PI/180,40,40,3);const a=[];for(let c=0;c<n.rows;c++){const h=n.intAt(c,0),f=n.intAt(c,1),y=n.intAt(c,2),_=n.intAt(c,3),w=Math.abs(Math.atan2(_-f,y-h)*180/Math.PI);(w<3||w>177)&&a.push((f+_)/2)}n.delete(),i.delete(),a.sort((c,h)=>c-h);const s=[];let o=[a[0]];for(let c=1;c<a.length;c++)a[c]-a[c-1]<10?o.push(a[c]):(s.push(o),o=[a[c]]);s.push(o);const d=s.map(c=>Math.round(c.reduce((h,f)=>h+f,0)/c.length)).filter(c=>c<r[0]&&c>r[0]-100);return d.length>0?d[0]:r[0]-57}function k_(e,t,r,i,n){const a=n-i,s=t.roi(new e.Rect(0,i,t.cols,a)),o=new e.Mat;e.Sobel(s,o,e.CV_32F,1,0,3);const l=new e.Mat;e.convertScaleAbs(o,l),o.delete();const d=new Float64Array(t.cols);for(let z=0;z<t.cols;z++){let N=0;for(let q=0;q<a;q++)N+=l.ucharAt(q,z);d[z]=N}l.delete();const c=new Float64Array(t.cols),h=3,f=7,y=[];let _=0;for(let z=-f;z<=f;z++){const N=Math.exp(-z*z/(2*h*h));y.push(N),_+=N}for(let z=0;z<y.length;z++)y[z]/=_;for(let z=0;z<t.cols;z++){let N=0;for(let q=0;q<y.length;q++){const G=Math.max(0,Math.min(t.cols-1,z+q-f));N+=d[G]*y[q]}c[z]=N}const S=Math.max(...Array.from(c))*.35,$=[];for(let z=2;z<t.cols-2;z++)c[z]>S&&c[z]>c[z-1]&&c[z]>c[z+1]&&c[z]>c[z-2]&&c[z]>c[z+2]&&$.push({x:z,strength:c[z]});$.sort((z,N)=>N.strength-z.strength);const b=[];for(const z of $)b.some(N=>Math.abs(N.x-z.x)<80)||b.push(z);b.sort((z,N)=>z.x-N.x);let T=null,I=1/0;for(let z=0;z<=b.length-15;z++){const N=b.slice(z,z+15).map(R=>R.x),q=[];for(let R=1;R<N.length;R++)q.push(N[R]-N[R-1]);const G=q.reduce((R,F)=>R+F,0)/q.length,H=q.reduce((R,F)=>R+(F-G)**2,0)/q.length;H<I&&(I=H,T=N)}const E=T?T.slice(0,14):b.slice(0,14).map(z=>z.x),A=r.roi(new e.Rect(0,i,r.cols,a)),O=new e.Mat;A.copyTo(O),A.delete();for(const z of E)e.line(O,new e.Point(z,0),new e.Point(z,a),new e.Scalar(0,255,0,255),2);const x=Ei(e,O);return O.delete(),s.delete(),{dividers:E,tableStripImage:x}}function E_(e,t,r,i,n,a,s,o){const l=s-a,d=Math.min(i,wa-r),c=Math.max(d,n),h=t.roi(new e.Rect(Math.round(r),a,Math.round(d),l));let f;if(d<n){f=new e.Mat(l,c,t.type(),new e.Scalar(255,255,255,255));const _=f.roi(new e.Rect(0,0,d,l));h.copyTo(_),_.delete()}else f=new e.Mat,h.copyTo(f);h.delete();for(const _ of o){const w=_-a;e.line(f,new e.Point(0,w),new e.Point(c,w),new e.Scalar(0,255,255,255),1)}for(let _=0;_<3;_++){const w=o[_]-a,$=o[_+1]-a-w,b=_>0,T=b?4:3;let I;b?I=2*ir+ki+Wt:I=2*ir+Wt;const E=(n-I)/2,A=w+($-Ti)/2;let O=0;for(let x=0;x<T;x++){const z=E+O,N=b&&x>=3?new e.Scalar(255,165,0,255):new e.Scalar(0,255,0,255);e.rectangle(f,new e.Point(Math.round(z),Math.round(A)),new e.Point(Math.round(z+Wt),Math.round(A+Ti)),N,1),b&&x===2?O+=ki:O+=ir}}const y=Ei(e,f);return f.delete(),y}function Ei(e,t){const r=new e.Mat;t.channels()===1?e.cvtColor(t,r,e.COLOR_GRAY2RGBA):t.channels()===3?e.cvtColor(t,r,e.COLOR_RGB2RGBA):t.copyTo(r);const i=new ImageData(new Uint8ClampedArray(r.data.slice()),r.cols,r.rows);return r.delete(),i}/*!
 * ONNX Runtime Web v1.24.3
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */var Ha=Object.defineProperty,C_=Object.getOwnPropertyDescriptor,z_=Object.getOwnPropertyNames,A_=Object.prototype.hasOwnProperty,O_=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),L=(e,t)=>()=>(e&&(t=e(e=0)),t),lr=(e,t)=>{for(var r in t)Ha(e,r,{get:t[r],enumerable:!0})},R_=(e,t,r,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of z_(t))!A_.call(e,n)&&n!==r&&Ha(e,n,{get:()=>t[n],enumerable:!(i=C_(t,n))||i.enumerable});return e},Pr=e=>R_(Ha({},"__esModule",{value:!0}),e),yr,_t,tr,Ru,Cc,zc=L(()=>{yr=new Map,_t=[],tr=(e,t,r)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let i=yr.get(e);if(i===void 0)yr.set(e,{backend:t,priority:r});else{if(i.priority>r)return;if(i.priority===r&&i.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${r}`)}if(r>=0){let n=_t.indexOf(e);n!==-1&&_t.splice(n,1);for(let a=0;a<_t.length;a++)if(yr.get(_t[a]).priority<=r){_t.splice(a,0,e);return}_t.push(e)}return}throw new TypeError("not a valid backend")},Ru=async e=>{let t=yr.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let r=!!t.initPromise;try{return r||(t.initPromise=t.backend.init(e)),await t.initPromise,t.initialized=!0,t.backend}catch(i){return r||(t.error=`${i}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},Cc=async e=>{let t=e.executionProviders||[],r=t.map(l=>typeof l=="string"?l:l.name),i=r.length===0?_t:r,n,a=[],s=new Set;for(let l of i){let d=await Ru(l);typeof d=="string"?a.push({name:l,err:d}):(n||(n=d),n===d&&s.add(l))}if(!n)throw new Error(`no available backend found. ERR: ${a.map(l=>`[${l.name}] ${l.err}`).join(", ")}`);for(let{name:l,err:d}of a)r.includes(l)&&console.warn(`removing requested execution provider "${l}" from session options because it is not available: ${d}`);let o=t.filter(l=>s.has(typeof l=="string"?l:l.name));return[n,new Proxy(e,{get:(l,d)=>d==="executionProviders"?o:Reflect.get(l,d)})]}}),M_=L(()=>{zc()}),Ac,B_=L(()=>{Ac="1.24.3"}),yn,Ee,Oc=L(()=>{B_(),yn="warning",Ee={wasm:{},webgl:{},webgpu:{},versions:{common:Ac},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);yn=e}},get logLevel(){return yn}},Object.defineProperty(Ee,"logLevel",{enumerable:!0})}),xe,D_=L(()=>{Oc(),xe=Ee}),Rc,Mc,N_=L(()=>{Rc=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);r.width=e.dims[3],r.height=e.dims[2];let i=r.getContext("2d");if(i!=null){let n,a;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],a=e.dims[3]):(n=e.dims[3],a=e.dims[2]);let s=(t==null?void 0:t.format)!==void 0?t.format:"RGB",o=t==null?void 0:t.norm,l,d;o===void 0||o.mean===void 0?l=[255,255,255,255]:typeof o.mean=="number"?l=[o.mean,o.mean,o.mean,o.mean]:(l=[o.mean[0],o.mean[1],o.mean[2],0],o.mean[3]!==void 0&&(l[3]=o.mean[3])),o===void 0||o.bias===void 0?d=[0,0,0,0]:typeof o.bias=="number"?d=[o.bias,o.bias,o.bias,o.bias]:(d=[o.bias[0],o.bias[1],o.bias[2],0],o.bias[3]!==void 0&&(d[3]=o.bias[3]));let c=a*n,h=0,f=c,y=c*2,_=-1;s==="RGBA"?(h=0,f=c,y=c*2,_=c*3):s==="RGB"?(h=0,f=c,y=c*2):s==="RBG"&&(h=0,y=c,f=c*2);for(let w=0;w<a;w++)for(let S=0;S<n;S++){let $=(e.data[h++]-d[0])*l[0],b=(e.data[f++]-d[1])*l[1],T=(e.data[y++]-d[2])*l[2],I=_===-1?255:(e.data[_++]-d[3])*l[3];i.fillStyle="rgba("+$+","+b+","+T+","+I+")",i.fillRect(S,w,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},Mc=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),i;if(r!=null){let n,a,s;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],a=e.dims[1],s=e.dims[3]):(n=e.dims[3],a=e.dims[2],s=e.dims[1]);let o=t!==void 0&&t.format!==void 0?t.format:"RGB",l=t==null?void 0:t.norm,d,c;l===void 0||l.mean===void 0?d=[255,255,255,255]:typeof l.mean=="number"?d=[l.mean,l.mean,l.mean,l.mean]:(d=[l.mean[0],l.mean[1],l.mean[2],255],l.mean[3]!==void 0&&(d[3]=l.mean[3])),l===void 0||l.bias===void 0?c=[0,0,0,0]:typeof l.bias=="number"?c=[l.bias,l.bias,l.bias,l.bias]:(c=[l.bias[0],l.bias[1],l.bias[2],0],l.bias[3]!==void 0&&(c[3]=l.bias[3]));let h=a*n;if(t!==void 0&&(t.format!==void 0&&s===4&&t.format!=="RGBA"||s===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let f=4,y=0,_=1,w=2,S=3,$=0,b=h,T=h*2,I=-1;o==="RGBA"?($=0,b=h,T=h*2,I=h*3):o==="RGB"?($=0,b=h,T=h*2):o==="RBG"&&($=0,T=h,b=h*2),i=r.createImageData(n,a);for(let E=0;E<a*n;y+=f,_+=f,w+=f,S+=f,E++)i.data[y]=(e.data[$++]-c[0])*d[0],i.data[_]=(e.data[b++]-c[1])*d[1],i.data[w]=(e.data[T++]-c[2])*d[2],i.data[S]=I===-1?255:(e.data[I++]-c[3])*d[3]}else throw new Error("Can not access image data");return i}}),ai,Bc,Dc,Nc,Pc,Uc,P_=L(()=>{Fa(),ai=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:r,width:i}=t,n=t.norm??{mean:255,bias:0},a,s;typeof n.mean=="number"?a=[n.mean,n.mean,n.mean,n.mean]:a=[n.mean[0],n.mean[1],n.mean[2],n.mean[3]??255],typeof n.bias=="number"?s=[n.bias,n.bias,n.bias,n.bias]:s=[n.bias[0],n.bias[1],n.bias[2],n.bias[3]??0];let o=t.format!==void 0?t.format:"RGBA",l=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",d=r*i,c=l==="RGBA"?new Float32Array(d*4):new Float32Array(d*3),h=4,f=0,y=1,_=2,w=3,S=0,$=d,b=d*2,T=-1;o==="RGB"&&(h=3,f=0,y=1,_=2,w=-1),l==="RGBA"?T=d*3:l==="RBG"?(S=0,b=d,$=d*2):l==="BGR"&&(b=0,$=d,S=d*2);for(let I=0;I<d;I++,f+=h,_+=h,y+=h,w+=h)c[S++]=(e[f]+s[0])/a[0],c[$++]=(e[y]+s[1])/a[1],c[b++]=(e[_]+s[2])/a[2],T!==-1&&w!==-1&&(c[T++]=(e[w]+s[3])/a[3]);return l==="RGBA"?new Ue("float32",c,[1,4,r,i]):new Ue("float32",c,[1,3,r,i])},Bc=async(e,t)=>{let r=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,i=typeof ImageData<"u"&&e instanceof ImageData,n=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,a=typeof e=="string",s,o=t??{},l=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},d=c=>typeof HTMLCanvasElement<"u"&&c instanceof HTMLCanvasElement||c instanceof OffscreenCanvas?c.getContext("2d"):null;if(r){let c=l();c.width=e.width,c.height=e.height;let h=d(c);if(h!=null){let f=e.height,y=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(f=t.resizedHeight,y=t.resizedWidth),t!==void 0){if(o=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");o.tensorFormat="RGBA",o.height=f,o.width=y}else o.tensorFormat="RGBA",o.height=f,o.width=y;h.drawImage(e,0,0),s=h.getImageData(0,0,y,f).data}else throw new Error("Can not access image data")}else if(i){let c,h;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(c=t.resizedHeight,h=t.resizedWidth):(c=e.height,h=e.width),t!==void 0&&(o=t),o.format="RGBA",o.height=c,o.width=h,t!==void 0){let f=l();f.width=h,f.height=c;let y=d(f);if(y!=null)y.putImageData(e,0,0),s=y.getImageData(0,0,h,c).data;else throw new Error("Can not access image data")}else s=e.data}else if(n){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let c=l();c.width=e.width,c.height=e.height;let h=d(c);if(h!=null){let f=e.height,y=e.width;return h.drawImage(e,0,0,y,f),s=h.getImageData(0,0,y,f).data,o.height=f,o.width=y,ai(s,o)}else throw new Error("Can not access image data")}else{if(a)return new Promise((c,h)=>{let f=l(),y=d(f);if(!e||!y)return h();let _=new Image;_.crossOrigin="Anonymous",_.src=e,_.onload=()=>{f.width=_.width,f.height=_.height,y.drawImage(_,0,0,f.width,f.height);let w=y.getImageData(0,0,f.width,f.height);o.height=f.height,o.width=f.width,c(ai(w.data,o))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(s!==void 0)return ai(s,o);throw new Error("Input data provided is not supported - aborted tensor creation")},Dc=(e,t)=>{let{width:r,height:i,download:n,dispose:a}=t,s=[1,i,r,4];return new Ue({location:"texture",type:"float32",texture:e,dims:s,download:n,dispose:a})},Nc=(e,t)=>{let{dataType:r,dims:i,download:n,dispose:a}=t;return new Ue({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,dims:i,download:n,dispose:a})},Pc=(e,t)=>{let{dataType:r,dims:i,download:n,dispose:a}=t;return new Ue({location:"ml-tensor",type:r??"float32",mlTensor:e,dims:i,download:n,dispose:a})},Uc=(e,t,r)=>new Ue({location:"cpu-pinned",type:e,data:t,dims:r??[t.length]})}),Mt,Er,_n,Lc,U_=L(()=>{Mt=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),Er=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),_n=!1,Lc=()=>{if(!_n){_n=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.Float16Array,i=typeof r<"u"&&r.from;e&&(Mt.set("int64",BigInt64Array),Er.set(BigInt64Array,"int64")),t&&(Mt.set("uint64",BigUint64Array),Er.set(BigUint64Array,"uint64")),i?(Mt.set("float16",r),Er.set(r,"float16")):Mt.set("float16",Uint16Array)}}}),Wc,qc,L_=L(()=>{Fa(),Wc=e=>{let t=1;for(let r=0;r<e.length;r++){let i=e[r];if(typeof i!="number"||!Number.isSafeInteger(i))throw new TypeError(`dims[${r}] must be an integer, got: ${i}`);if(i<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${i}`);t*=i}return t},qc=(e,t)=>{switch(e.location){case"cpu":return new Ue(e.type,e.data,t);case"cpu-pinned":return new Ue({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new Ue({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new Ue({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new Ue({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),Ue,Fa=L(()=>{N_(),P_(),U_(),L_(),Ue=class{constructor(e,t,r){Lc();let i,n;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,i=e.type,n=e.dims,e.location){case"cpu-pinned":{let s=Mt.get(i);if(!s)throw new TypeError(`unsupported type "${i}" to create tensor from pinned buffer`);if(!(e.data instanceof s))throw new TypeError(`buffer should be of type ${s.name}`);this.cpuData=e.data;break}case"texture":{if(i!=="float32")throw new TypeError(`unsupported type "${i}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint64"&&i!=="int8"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let s,o;if(typeof e=="string")if(i=e,o=r,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");s=t}else{let l=Mt.get(e);if(l===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&l===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${l.name} as data.`);e==="uint64"||e==="int64"?s=l.from(t,BigInt):s=l.from(t)}else if(t instanceof l)s=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")s=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&l!==Uint16Array)s=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${i} tensor's data must be type of ${l}`)}else if(o=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let l=typeof e[0];if(l==="string")i="string",s=e;else if(l==="boolean")i="bool",s=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${l}.`)}else if(e instanceof Uint8ClampedArray)i="uint8",s=Uint8Array.from(e);else{let l=Er.get(e.constructor);if(l===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);i=l,s=e}if(o===void 0)o=[s.length];else if(!Array.isArray(o))throw new TypeError("A tensor's dims must be a number array");n=o,this.cpuData=s,this.dataLocation="cpu"}let a=Wc(n);if(this.cpuData&&a!==this.cpuData.length&&!((i==="uint4"||i==="int4")&&Math.ceil(a/2)===this.cpuData.length))throw new Error(`Tensor's size(${a}) does not match data length(${this.cpuData.length}).`);this.type=i,this.dims=n,this.size=a}static async fromImage(e,t){return Bc(e,t)}static fromTexture(e,t){return Dc(e,t)}static fromGpuBuffer(e,t){return Nc(e,t)}static fromMLTensor(e,t){return Pc(e,t)}static fromPinnedBuffer(e,t,r){return Uc(e,t,r)}toDataURL(e){return Rc(this,e)}toImageData(e){return Mc(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return qc(this,e)}}}),et,Vc=L(()=>{Fa(),et=Ue}),Ci,wn,st,tt,qt,Vt,Gc=L(()=>{Oc(),Ci=(e,t)=>{(typeof Ee.trace>"u"?!Ee.wasm.trace:!Ee.trace)||console.timeStamp(`${e}::ORT::${t}`)},wn=(e,t)=>{var n;let r=((n=new Error().stack)==null?void 0:n.split(/\r\n|\r|\n/g))||[],i=!1;for(let a=0;a<r.length;a++){if(i&&!r[a].includes("TRACE_FUNC")){let s=`FUNC_${e}::${r[a].trim().split(" ")[1]}`;t&&(s+=`::${t}`),Ci("CPU",s);return}r[a].includes("TRACE_FUNC")&&(i=!0)}},st=e=>{(typeof Ee.trace>"u"?!Ee.wasm.trace:!Ee.trace)||wn("BEGIN",e)},tt=e=>{(typeof Ee.trace>"u"?!Ee.wasm.trace:!Ee.trace)||wn("END",e)},qt=e=>{(typeof Ee.trace>"u"?!Ee.wasm.trace:!Ee.trace)||console.time(`ORT::${e}`)},Vt=e=>{(typeof Ee.trace>"u"?!Ee.wasm.trace:!Ee.trace)||console.timeEnd(`ORT::${e}`)}}),Hc,W_=L(()=>{zc(),Vc(),Gc(),Hc=class Fc{constructor(t){this.handler=t}async run(t,r,i){st(),qt("InferenceSession.run");let n={},a={};if(typeof t!="object"||t===null||t instanceof et||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let s=!0;if(typeof r=="object"){if(r===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(r instanceof et)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(r)){if(r.length===0)throw new TypeError("'fetches' cannot be an empty array.");s=!1;for(let d of r){if(typeof d!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(d)===-1)throw new RangeError(`'fetches' contains invalid output name: ${d}.`);n[d]=null}if(typeof i=="object"&&i!==null)a=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else{let d=!1,c=Object.getOwnPropertyNames(r);for(let h of this.outputNames)if(c.indexOf(h)!==-1){let f=r[h];(f===null||f instanceof et)&&(d=!0,s=!1,n[h]=f)}if(d){if(typeof i=="object"&&i!==null)a=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else a=r}}else if(typeof r<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let d of this.inputNames)if(typeof t[d]>"u")throw new Error(`input '${d}' is missing in 'feeds'.`);if(s)for(let d of this.outputNames)n[d]=null;let o=await this.handler.run(t,n,a),l={};for(let d in o)if(Object.hasOwnProperty.call(o,d)){let c=o[d];c instanceof et?l[d]=c:l[d]=new et(c.type,c.data,c.dims)}return Vt("InferenceSession.run"),tt(),l}async release(){return this.handler.dispose()}static async create(t,r,i,n){st(),qt("InferenceSession.create");let a,s={};if(typeof t=="string"){if(a=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(a=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let c=t,h=0,f=t.byteLength;if(typeof r=="object"&&r!==null)s=r;else if(typeof r=="number"){if(h=r,!Number.isSafeInteger(h))throw new RangeError("'byteOffset' must be an integer.");if(h<0||h>=c.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${c.byteLength}).`);if(f=t.byteLength-h,typeof i=="number"){if(f=i,!Number.isSafeInteger(f))throw new RangeError("'byteLength' must be an integer.");if(f<=0||h+f>c.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${c.byteLength-h}].`);if(typeof n=="object"&&n!==null)s=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else if(typeof i<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof r<"u")throw new TypeError("'options' must be an object.");a=new Uint8Array(c,h,f)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[o,l]=await Cc(s),d=await o.createInferenceSessionHandler(a,l);return Vt("InferenceSession.create"),tt(),new Fc(d)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),ja,q_=L(()=>{W_(),ja=Hc}),V_=L(()=>{}),G_=L(()=>{}),H_=L(()=>{}),F_=L(()=>{}),j_={};lr(j_,{InferenceSession:()=>ja,TRACE:()=>Ci,TRACE_EVENT_BEGIN:()=>qt,TRACE_EVENT_END:()=>Vt,TRACE_FUNC_BEGIN:()=>st,TRACE_FUNC_END:()=>tt,Tensor:()=>et,env:()=>xe,registerBackend:()=>tr});var Ve=L(()=>{M_(),D_(),q_(),Vc(),V_(),G_(),Gc(),H_(),F_()}),Ka=L(()=>{}),jc={};lr(jc,{default:()=>Kc});var bn,$n,Kc,K_=L(()=>{var e;eg(),Yt(),Ya(),bn="ort-wasm-proxy-worker",$n=((e=globalThis.self)==null?void 0:e.name)===bn,$n&&(self.onmessage=t=>{let{type:r,in:i}=t.data;try{switch(r){case"init-wasm":Qa(i.wasm).then(()=>{hs(i).then(()=>{postMessage({type:r})},n=>{postMessage({type:r,err:n})})},n=>{postMessage({type:r,err:n})});break;case"init-ep":{let{epName:n,env:a}=i;fs(a,n).then(()=>{postMessage({type:r})},s=>{postMessage({type:r,err:s})});break}case"copy-from":{let{buffer:n}=i,a=Di(n);postMessage({type:r,out:a});break}case"create":{let{model:n,options:a}=i;ms(n,a).then(s=>{postMessage({type:r,out:s})},s=>{postMessage({type:r,err:s})});break}case"release":gs(i),postMessage({type:r});break;case"run":{let{sessionId:n,inputIndices:a,inputs:s,outputIndices:o,options:l}=i;ys(n,a,s,o,new Array(o.length).fill(null),l).then(d=>{d.some(c=>c[3]!=="cpu")?postMessage({type:r,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:r,out:d},ws([...s,...d]))},d=>{postMessage({type:r,err:d})});break}case"end-profiling":_s(i),postMessage({type:r});break;default:}}catch(n){postMessage({type:r,err:n})}}),Kc=$n?null:t=>new Worker(t??Pe,{type:"module",name:bn})}),Yc={};lr(Yc,{default:()=>Qc});async function Mu(e={}){var hu,fu;var t=e,r=!!globalThis.window,i=!!globalThis.WorkerGlobalScope,n=i&&((hu=self.name)==null?void 0:hu.startsWith("em-pthread"));t.mountExternalData=(u,p)=>{u.startsWith("./")&&(u=u.substring(2)),(t.Zc||(t.Zc=new Map)).set(u,p)},t.unmountExternalData=()=>{delete t.Zc},globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,ae:!0}).buffer.constructor;let a=u=>async(...p)=>{var g;try{if(t.$c)throw Error("Session already started");let m=t.$c={Nd:p[0],errors:[]},v=await u(...p);if(t.$c!==m)throw Error("Session mismatch");(g=t.gd)==null||g.flush();let k=m.errors;if(0<k.length){let C=await Promise.all(k);if(C=C.filter(B=>B),0<C.length)throw Error(C.join(`
`))}return v}finally{t.$c=null}};t.jsepInit=(u,p)=>{if(u==="webgpu"){[t.gd,t.Dd,t.Hd,t.jd,t.Gd,t.ac,t.Id,t.Kd,t.Ed,t.Fd,t.Jd]=p;let g=t.gd;t.jsepRegisterBuffer=(m,v,k,C)=>g.registerBuffer(m,v,k,C),t.jsepGetBuffer=m=>g.getBuffer(m),t.jsepCreateDownloader=(m,v,k)=>g.createDownloader(m,v,k),t.jsepOnCreateSession=m=>{g.onCreateSession(m)},t.jsepOnReleaseSession=m=>{g.onReleaseSession(m)},t.jsepOnRunStart=m=>g.onRunStart(m),t.Ld=(m,v)=>{g.upload(m,v)}}else if(u==="webnn"){let g=p[0];[t.Zd,t.vd,t.webnnEnsureTensor,t.xd,t.webnnDownloadTensor,t.Yd,t.webnnEnableTraceEvent]=p.slice(1),t.webnnReleaseTensorId=t.vd,t.webnnUploadTensor=t.xd,t.webnnRegisterMLContext=t.Yd,t.webnnOnRunStart=m=>g.onRunStart(m),t.webnnOnRunEnd=g.onRunEnd.bind(g),t.webnnOnReleaseSession=m=>{g.onReleaseSession(m)},t.webnnCreateMLTensorDownloader=(m,v)=>g.createMLTensorDownloader(m,v),t.webnnRegisterMLTensor=(m,v,k,C)=>g.registerMLTensor(m,v,k,C),t.webnnCreateMLContext=m=>g.createMLContext(m),t.webnnRegisterMLConstant=(m,v,k,C,B,V)=>g.registerMLConstant(m,v,k,C,B,t.Zc,V),t.webnnRegisterGraphInput=g.registerGraphInput.bind(g),t.webnnIsGraphInput=g.isGraphInput.bind(g),t.webnnRegisterGraphOutput=g.registerGraphOutput.bind(g),t.webnnIsGraphOutput=g.isGraphOutput.bind(g),t.webnnCreateTemporaryTensor=g.createTemporaryTensor.bind(g),t.webnnIsGraphInputOutputTypeSupported=g.isGraphInputOutputTypeSupported.bind(g)}};let s=()=>{let u=p=>(...g)=>{let m=it;return g=p(...g),it!=m?new Promise((v,k)=>{Qi={resolve:v,reject:k}}):g};(()=>{for(let p of["_OrtAppendExecutionProvider","_OrtCreateSession","_OrtRun","_OrtRunWithBinding","_OrtBindInput"])t[p]=u(t[p])})(),a!==void 0&&(t._OrtRun=a(t._OrtRun),t._OrtRunWithBinding=a(t._OrtRunWithBinding)),s=void 0};t.asyncInit=()=>{s==null||s()};var o,l,d=(u,p)=>{throw p},c=import.meta.url,h="";if(r||i){try{h=new URL(".",c).href}catch{}i&&(l=u=>{var p=new XMLHttpRequest;return p.open("GET",u,!1),p.responseType="arraybuffer",p.send(null),new Uint8Array(p.response)}),o=async u=>{if(O(u))return new Promise((g,m)=>{var v=new XMLHttpRequest;v.open("GET",u,!0),v.responseType="arraybuffer",v.onload=()=>{v.status==200||v.status==0&&v.response?g(v.response):m(v.status)},v.onerror=m,v.send(null)});var p=await fetch(u,{credentials:"same-origin"});if(p.ok)return p.arrayBuffer();throw Error(p.status+" : "+p.url)}}var f,y,_,w,S,$,b=console.log.bind(console),T=console.error.bind(console),I=b,E=T,A=!1,O=u=>u.startsWith("file://");function x(){ft.buffer!=N.buffer&&U()}if(n){let u=function(p){try{var g=p.data,m=g.Uc;if(m==="load"){let v=[];self.onmessage=k=>v.push(k),$=()=>{postMessage({Uc:"loaded"});for(let k of v)u(k);self.onmessage=u};for(let k of g.Ad)t[k]&&!t[k].proxy||(t[k]=(...C)=>{postMessage({Uc:"callHandler",zd:k,args:C})},k=="print"&&(I=t[k]),k=="printErr"&&(E=t[k]));ft=g.Vd,U(),y=g.Wd,He(),ei()}else if(m==="run"){(function(v){var k=(x(),F)[v+52>>>2>>>0];v=(x(),F)[v+56>>>2>>>0],vo(k,k-v),se(k)})(g.Tc),tn(g.Tc,0,0,1,0,0),vs(),ji(g.Tc),z||(go(),z=!0);try{fg(g.Pd,g.dd)}catch(v){if(v!="unwind")throw v}}else g.target!=="setimmediate"&&(m==="checkMailbox"?z&&jr():m&&(E(`worker: received unknown command ${m}`),E(g)))}catch(v){throw yo(),v}};var z=!1;self.onunhandledrejection=p=>{throw p.reason||p},self.onmessage=u}var N,q,G,H,R,F,K,X,ue,W,fe,P=!1;function U(){var u=ft.buffer;t.HEAP8=N=new Int8Array(u),G=new Int16Array(u),t.HEAPU8=q=new Uint8Array(u),H=new Uint16Array(u),t.HEAP32=R=new Int32Array(u),t.HEAPU32=F=new Uint32Array(u),K=new Float32Array(u),X=new Float64Array(u),ue=new BigInt64Array(u),W=new BigUint64Array(u)}function J(){P=!0,n?$():ut.tb()}function ee(u){throw E(u="Aborted("+u+")"),A=!0,u=new WebAssembly.RuntimeError(u+". Build with -sASSERTIONS for more info."),S==null||S(u),u}function _e(){return{a:{ma:N0,hb:D0,g:mg,J:gg,f:yg,o:_g,h:wg,ha:bg,b:$g,T:vg,Ia:Es,n:xg,_:Os,Ya:Rs,Ea:Ms,Ga:Bs,Za:Ds,Wa:Ns,Pa:Ps,Va:Us,ka:Ls,Fa:Ws,Ca:qs,Xa:Vs,Da:Gs,cb:Sg,ea:Ig,xa:Tg,va:Eg,da:zg,O:Ag,H:Og,wa:Rg,Z:Lg,ya:Wg,Sa:qg,Aa:Gg,Ja:Hg,ta:Fg,fa:jg,Ra:ji,$a:Kg,R:Xg,s:i0,c:Hi,ib:n0,y:a0,M:s0,D:o0,m:u0,t:Xs,jb:l0,I:d0,S:p0,j:c0,v:h0,r:f0,l:m0,Ma:g0,Na:y0,Oa:_0,Ka:ro,La:io,ua:no,eb:b0,bb:v0,u:x0,aa:S0,ga:I0,ab:$0,V:T0,_a:k0,Ba:E0,F:w0,U:C0,la:Xr,za:A0,gb:z0,fb:O0,Ta:uo,Ua:lo,Ha:dr,$:po,ja:co,Qa:ho,ia:fo,lb:by,na:hy,mb:wy,oa:cy,G:iy,d:W0,q:U0,w:P0,B:Z0,pb:ly,K:ey,x:V0,pa:dy,X:fy,ba:uy,nb:_y,ob:yy,ra:ny,qa:oy,qb:ay,N:ty,Y:py,e:q0,A:G0,k:L0,kb:$y,p:F0,z:j0,C:H0,E:K0,L:X0,rb:ry,Q:my,ca:J0,W:gy,sb:Q0,sa:Y0,P:sy,i:M0,a:ft,db:Ne}}}async function He(){function u(m,v){var k=ut=m.exports;m={};for(let[C,B]of Object.entries(k))typeof B=="function"?(k=Yg(B),m[C]=k):m[C]=B;return ut=m,ut=(function(){var C=ut,B=j=>ae=>j(ae)>>>0,V=j=>()=>j()>>>0;return(C=Object.assign({},C)).ub=B(C.ub),C.Yb=V(C.Yb),C._b=B(C._b),C.mc=B(C.mc),C.nc=V(C.nc),C.rc=B(C.rc),C})(),bs.push(ut.$b),mo=(m=ut).ub,go=m.vb,t._OrtInit=m.wb,t._OrtGetLastError=m.xb,t._OrtCreateSessionOptions=m.yb,t._OrtAppendExecutionProvider=m.zb,t._OrtAddFreeDimensionOverride=m.Ab,t._OrtAddSessionConfigEntry=m.Bb,t._OrtReleaseSessionOptions=m.Cb,t._OrtCreateSession=m.Db,t._OrtReleaseSession=m.Eb,t._OrtGetInputOutputCount=m.Fb,t._OrtGetInputOutputMetadata=m.Gb,t._OrtFree=m.Hb,t._OrtCreateTensor=m.Ib,t._OrtGetTensorData=m.Jb,t._OrtReleaseTensor=m.Kb,t._OrtCreateRunOptions=m.Lb,t._OrtAddRunConfigEntry=m.Mb,t._OrtReleaseRunOptions=m.Nb,t._OrtCreateBinding=m.Ob,t._OrtBindInput=m.Pb,t._OrtBindOutput=m.Qb,t._OrtClearBoundOutputs=m.Rb,t._OrtReleaseBinding=m.Sb,t._OrtRunWithBinding=m.Tb,t._OrtRun=m.Ub,t._OrtEndProfiling=m.Vb,t._JsepOutput=m.Wb,t._JsepGetNodeName=m.Xb,Jr=m.Yb,nt=t._free=m.Zb,hr=t._malloc=m._b,tn=m.bc,yo=m.cc,_o=m.dc,wo=m.ec,rn=m.fc,bo=m.gc,$o=m.hc,le=m.ic,fr=m.jc,vo=m.kc,se=m.lc,nn=m.mc,oe=m.nc,xo=m.oc,an=m.pc,So=m.qc,Io=m.rc,To=m.sc,sn=m.tc,ko=m.uc,Eo=m.vc,Co=m.wc,zo=m.xc,Ao=m.yc,Oo=m.zc,Ro=m.Ac,Mo=m.Bc,Bo=m.Cc,Do=m.Dc,No=m.Ec,Po=m.Fc,Uo=m.Gc,Lo=m.Hc,Wo=m.Ic,qo=m.Jc,Vo=m.Kc,Go=m.Lc,Ho=m.Mc,Fo=m.Nc,jo=m.Oc,Ko=m.Pc,Yo=m.Rc,Qo=m.Sc,Zo=m.bd,Xo=m.cd,Jo=m.hd,eu=m.kd,tu=m.ld,ru=m.md,iu=m.nd,nu=m.od,au=m.pd,su=m.qd,ou=m.rd,uu=m.wd,lu=m.Rd,du=m.Sd,pu=m.Td,cu=m.Ud,y=v,ut}var p,g=_e();return t.instantiateWasm?new Promise(m=>{t.instantiateWasm(g,(v,k)=>{m(u(v,k))})}):n?u(new WebAssembly.Instance(y,_e()),y):(fe??(fe=t.locateFile?t.locateFile?t.locateFile("ort-wasm-simd-threaded.jsep.wasm",h):h+"ort-wasm-simd-threaded.jsep.wasm":new URL("/formVerify/assets/ort-wasm-simd-threaded.jsep-C887KxcQ.wasm",import.meta.url).href),p=await(async function(m){var v=fe;if(!f&&!O(v))try{var k=fetch(v,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(k,m)}catch(C){E(`wasm streaming compile failed: ${C}`),E("falling back to ArrayBuffer instantiation")}return(async function(C,B){try{var V=await(async function(j){if(!f)try{var ae=await o(j);return new Uint8Array(ae)}catch{}if(j==fe&&f)j=new Uint8Array(f);else{if(!l)throw"both async and sync fetching of the wasm failed";j=l(j)}return j})(C);return await WebAssembly.instantiate(V,B)}catch(j){E(`failed to asynchronously prepare wasm: ${j}`),ee(j)}})(v,m)})(g),u(p.instance,p.module))}class Fe{constructor(p){mu(this,"name","ExitStatus");this.message=`Program terminated with exit(${p})`,this.status=p}}var It=u=>{u.terminate(),u.onmessage=()=>{}},Wr=[],De=0,Re=null,ct=u=>{ht.length==0&&(Ss(),xs(ht[0]));var p=ht.pop();if(!p)return 6;pr.push(p),Tt[u.Tc]=p,p.Tc=u.Tc;var g={Uc:"run",Pd:u.Od,dd:u.dd,Tc:u.Tc};return p.postMessage(g,u.ud),0},$e=0,re=(u,p,...g)=>{var m,v=16*g.length,k=oe(),C=nn(v),B=C>>>3;for(m of g)typeof m=="bigint"?((x(),ue)[B++>>>0]=1n,(x(),ue)[B++>>>0]=m):((x(),ue)[B++>>>0]=0n,(x(),X)[B++>>>0]=m);return u=_o(u,0,v,C,p),se(k),u};function Ne(u){if(n)return re(0,1,u);if(_=u,!(0<$e)){for(var p of pr)It(p);for(p of ht)It(p);ht=[],pr=[],Tt={},A=!0}d(0,new Fe(u))}function qr(u){if(n)return re(1,0,u);dr(u)}var dr=u=>{if(_=u,n)throw qr(u),"unwind";Ne(u)},ht=[],pr=[],bs=[],Tt={},$s=u=>{var p=u.Tc;delete Tt[p],ht.push(u),pr.splice(pr.indexOf(u),1),u.Tc=0,wo(p)};function vs(){bs.forEach(u=>u())}var xs=u=>new Promise(p=>{u.onmessage=v=>{var k=v.data;if(v=k.Uc,k.ad&&k.ad!=Jr()){var C=Tt[k.ad];C?C.postMessage(k,k.ud):E(`Internal error! Worker sent a message "${v}" to target pthread ${k.ad}, but that thread no longer exists!`)}else v==="checkMailbox"?jr():v==="spawnThread"?ct(k):v==="cleanupThread"?Fr(()=>{$s(Tt[k.Qd])}):v==="loaded"?(u.loaded=!0,p(u)):k.target==="setimmediate"?u.postMessage(k):v==="uncaughtException"?u.onerror(k.error):v==="callHandler"?t[k.zd](...k.args):v&&E(`worker sent an unknown command ${v}`)},u.onerror=v=>{throw E(`worker sent an error! ${v.filename}:${v.lineno}: ${v.message}`),v};var g,m=[];for(g of[])t.propertyIsEnumerable(g)&&m.push(g);u.postMessage({Uc:"load",Ad:m,Vd:ft,Wd:y})});function Ss(){var u=new Worker((()=>{let p=URL;return import.meta.url>"file:"&&import.meta.url<"file;"?new p("ort.bundle.min.mjs",import.meta.url):new URL(import.meta.url)})(),{type:"module",workerData:"em-pthread",name:"em-pthread"});ht.push(u)}var ft,fg=(u,p)=>{$e=0,u=sn(u,p),0<$e?_=u:rn(u)},Vr=[],Gr=0;function mg(u){var p=new Wi(u>>>=0);return(x(),N)[p.Vc+12>>>0]==0&&(Is(p,!0),Gr--),Ts(p,!1),Vr.push(p),Io(u)}var Zt=0,gg=()=>{le(0,0);var u=Vr.pop();xo(u.ed),Zt=0};function Is(u,p){p=p?1:0,(x(),N)[u.Vc+12>>>0]=p}function Ts(u,p){p=p?1:0,(x(),N)[u.Vc+13>>>0]=p}class Wi{constructor(p){this.ed=p,this.Vc=p-24}}var qi=u=>{var p=Zt;if(!p)return fr(0),0;var g=new Wi(p);(x(),F)[g.Vc+16>>>2>>>0]=p;var m=(x(),F)[g.Vc+4>>>2>>>0];if(!m)return fr(0),p;for(var v of u){if(v===0||v===m)break;if(So(v,m,g.Vc+16))return fr(v),p}return fr(m),p};function yg(){return qi([])}function _g(u){return qi([u>>>0])}function wg(u,p,g,m){return qi([u>>>0,p>>>0,g>>>0,m>>>0])}var bg=()=>{var u=Vr.pop();u||ee("no exception to throw");var p=u.ed;throw(x(),N)[u.Vc+13>>>0]==0&&(Vr.push(u),Ts(u,!0),Is(u,!1),Gr++),an(p),Zt=p};function $g(u,p,g){var m=new Wi(u>>>=0);throw p>>>=0,g>>>=0,(x(),F)[m.Vc+16>>>2>>>0]=0,(x(),F)[m.Vc+4>>>2>>>0]=p,(x(),F)[m.Vc+8>>>2>>>0]=g,an(u),Gr++,Zt=u}var vg=()=>Gr;function ks(u,p,g,m){return n?re(2,1,u,p,g,m):Es(u,p,g,m)}function Es(u,p,g,m){if(u>>>=0,p>>>=0,g>>>=0,m>>>=0,!globalThis.SharedArrayBuffer)return 6;var v=[];return n&&v.length===0?ks(u,p,g,m):(u={Od:g,Tc:u,dd:m,ud:v},n?(u.Uc="spawnThread",postMessage(u,v),0):ct(u))}function xg(u){throw Zt||(Zt=u>>>0),Zt}var Cs=globalThis.TextDecoder&&new TextDecoder,zs=(u,p,g,m)=>{if(g=p+g,m)return g;for(;u[p]&&!(p>=g);)++p;return p},As=(u,p=0,g,m)=>{if(16<(g=zs(u,p>>>=0,g,m))-p&&u.buffer&&Cs)return Cs.decode(u.buffer instanceof ArrayBuffer?u.subarray(p,g):u.slice(p,g));for(m="";p<g;){var v=u[p++];if(128&v){var k=63&u[p++];if((224&v)==192)m+=String.fromCharCode((31&v)<<6|k);else{var C=63&u[p++];65536>(v=(240&v)==224?(15&v)<<12|k<<6|C:(7&v)<<18|k<<12|C<<6|63&u[p++])?m+=String.fromCharCode(v):(v-=65536,m+=String.fromCharCode(55296|v>>10,56320|1023&v))}}else m+=String.fromCharCode(v)}return m},Te=(u,p,g)=>(u>>>=0)?As((x(),q),u,p,g):"";function Os(u,p,g){return n?re(3,1,u,p,g):0}function Rs(u,p){if(n)return re(4,1,u,p)}function Ms(u,p){if(n)return re(5,1,u,p)}function Bs(u,p,g){if(n)return re(6,1,u,p,g)}function Ds(u,p,g){return n?re(7,1,u,p,g):0}function Ns(u,p){if(n)return re(8,1,u,p)}function Ps(u,p,g){if(n)return re(9,1,u,p,g)}function Us(u,p,g,m){if(n)return re(10,1,u,p,g,m)}function Ls(u,p,g,m){if(n)return re(11,1,u,p,g,m)}function Ws(u,p,g,m){if(n)return re(12,1,u,p,g,m)}function qs(u){if(n)return re(13,1,u)}function Vs(u,p){if(n)return re(14,1,u,p)}function Gs(u,p,g){if(n)return re(15,1,u,p,g)}var Sg=()=>ee(""),rt=u=>{u>>>=0;for(var p="";;){var g=(x(),q)[u++>>>0];if(!g)return p;p+=String.fromCharCode(g)}},Vi={},Gi={},Xt=class extends Error{constructor(u){super(u),this.name="BindingError"}};function ot(u,p,g={}){return(function(m,v,k={}){var C=v.name;if(!m)throw new Xt(`type "${C}" must have a positive integer typeid pointer`);if(Gi.hasOwnProperty(m)){if(k.Bd)return;throw new Xt(`Cannot register type '${C}' twice`)}Gi[m]=v,Vi.hasOwnProperty(m)&&(v=Vi[m],delete Vi[m],v.forEach(B=>B()))})(u,p,g)}var Hs=(u,p,g)=>{switch(p){case 1:return g?m=>(x(),N)[m>>>0]:m=>(x(),q)[m>>>0];case 2:return g?m=>(x(),G)[m>>>1>>>0]:m=>(x(),H)[m>>>1>>>0];case 4:return g?m=>(x(),R)[m>>>2>>>0]:m=>(x(),F)[m>>>2>>>0];case 8:return g?m=>(x(),ue)[m>>>3>>>0]:m=>(x(),W)[m>>>3>>>0];default:throw new TypeError(`invalid integer width (${p}): ${u}`)}};function Ig(u,p,g,m,v){u>>>=0,g>>>=0,p=rt(p>>>0);let k=C=>C;if(m=m===0n){let C=8*g;k=B=>BigInt.asUintN(C,B),v=k(v)}ot(u,{name:p,Qc:k,Xc:(C,B)=>(typeof B=="number"&&(B=BigInt(B)),B),Wc:Hs(p,g,!m),Yc:null})}function Tg(u,p,g,m){ot(u>>>=0,{name:p=rt(p>>>0),Qc:function(v){return!!v},Xc:function(v,k){return k?g:m},Wc:function(v){return this.Qc((x(),q)[v>>>0])},Yc:null})}var Fs=[],kt=[0,1,,1,null,1,!0,1,!1,1];function Hi(u){9<(u>>>=0)&&--kt[u+1]==0&&(kt[u]=void 0,Fs.push(u))}var qe=u=>{if(!u)throw new Xt(`Cannot use deleted val. handle = ${u}`);return kt[u]},je=u=>{switch(u){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let p=Fs.pop()||kt.length;return kt[p]=u,kt[p+1]=1,p}};function Fi(u){return this.Qc((x(),F)[u>>>2>>>0])}var kg={name:"emscripten::val",Qc:u=>{var p=qe(u);return Hi(u),p},Xc:(u,p)=>je(p),Wc:Fi,Yc:null};function Eg(u){return ot(u>>>0,kg)}var Cg=(u,p)=>{switch(p){case 4:return function(g){return this.Qc((x(),K)[g>>>2>>>0])};case 8:return function(g){return this.Qc((x(),X)[g>>>3>>>0])};default:throw new TypeError(`invalid float width (${p}): ${u}`)}};function zg(u,p,g){g>>>=0,ot(u>>>=0,{name:p=rt(p>>>0),Qc:m=>m,Xc:(m,v)=>v,Wc:Cg(p,g),Yc:null})}function Ag(u,p,g,m,v){u>>>=0,g>>>=0,p=rt(p>>>0);let k=B=>B;if(m===0){var C=32-8*g;k=B=>B<<C>>>C,v=k(v)}ot(u,{name:p,Qc:k,Xc:(B,V)=>V,Wc:Hs(p,g,m!==0),Yc:null})}function Og(u,p,g){function m(k){var C=(x(),F)[k>>>2>>>0];return k=(x(),F)[k+4>>>2>>>0],new v((x(),N).buffer,k,C)}var v=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][p];ot(u>>>=0,{name:g=rt(g>>>0),Qc:m,Wc:m},{Bd:!0})}var mt=(u,p,g)=>{var m=(x(),q);if(p>>>=0,0<g){var v=p;g=p+g-1;for(var k=0;k<u.length;++k){var C=u.codePointAt(k);if(127>=C){if(p>=g)break;m[p++>>>0]=C}else if(2047>=C){if(p+1>=g)break;m[p++>>>0]=192|C>>6,m[p++>>>0]=128|63&C}else if(65535>=C){if(p+2>=g)break;m[p++>>>0]=224|C>>12,m[p++>>>0]=128|C>>6&63,m[p++>>>0]=128|63&C}else{if(p+3>=g)break;m[p++>>>0]=240|C>>18,m[p++>>>0]=128|C>>12&63,m[p++>>>0]=128|C>>6&63,m[p++>>>0]=128|63&C,k++}}m[p>>>0]=0,u=p-v}else u=0;return u},Hr=u=>{for(var p=0,g=0;g<u.length;++g){var m=u.charCodeAt(g);127>=m?p++:2047>=m?p+=2:55296<=m&&57343>=m?(p+=4,++g):p+=3}return p};function Rg(u,p){ot(u>>>=0,{name:p=rt(p>>>0),Qc(g){var m=(x(),F)[g>>>2>>>0];return m=Te(g+4,m,!0),nt(g),m},Xc(g,m){m instanceof ArrayBuffer&&(m=new Uint8Array(m));var v=typeof m=="string";if(!(v||ArrayBuffer.isView(m)&&m.BYTES_PER_ELEMENT==1))throw new Xt("Cannot pass non-string to std::string");var k=v?Hr(m):m.length,C=hr(4+k+1),B=C+4;return(x(),F)[C>>>2>>>0]=k,v?mt(m,B,k+1):(x(),q).set(m,B>>>0),g!==null&&g.push(nt,C),C},Wc:Fi,Yc(g){nt(g)}})}var js=globalThis.TextDecoder?new TextDecoder("utf-16le"):void 0,Mg=(u,p,g)=>{if(u>>>=1,16<(p=zs((x(),H),u,p/2,g))-u&&js)return js.decode((x(),H).slice(u,p));for(g="";u<p;++u){var m=(x(),H)[u>>>0];g+=String.fromCharCode(m)}return g},Bg=(u,p,g)=>{if(g??(g=2147483647),2>g)return 0;var m=p;g=(g-=2)<2*u.length?g/2:u.length;for(var v=0;v<g;++v){var k=u.charCodeAt(v);(x(),G)[p>>>1>>>0]=k,p+=2}return(x(),G)[p>>>1>>>0]=0,p-m},Dg=u=>2*u.length,Ng=(u,p,g)=>{var m="";u>>>=2;for(var v=0;!(v>=p/4);v++){var k=(x(),F)[u+v>>>0];if(!k&&!g)break;m+=String.fromCodePoint(k)}return m},Pg=(u,p,g)=>{if(p>>>=0,g??(g=2147483647),4>g)return 0;var m=p;g=m+g-4;for(var v=0;v<u.length;++v){var k=u.codePointAt(v);if(65535<k&&v++,(x(),R)[p>>>2>>>0]=k,(p+=4)+4>g)break}return(x(),R)[p>>>2>>>0]=0,p-m},Ug=u=>{for(var p=0,g=0;g<u.length;++g)65535<u.codePointAt(g)&&g++,p+=4;return p};function Lg(u,p,g){if(u>>>=0,p>>>=0,g=rt(g>>>=0),p===2)var m=Mg,v=Bg,k=Dg;else m=Ng,v=Pg,k=Ug;ot(u,{name:g,Qc:C=>{var B=(x(),F)[C>>>2>>>0];return B=m(C+4,B*p,!0),nt(C),B},Xc:(C,B)=>{if(typeof B!="string")throw new Xt(`Cannot pass non-string to C++ string type ${g}`);var V=k(B),j=hr(4+V+p);return(x(),F)[j>>>2>>>0]=V/p,v(B,j+4,V+p),C!==null&&C.push(nt,j),j},Wc:Fi,Yc(C){nt(C)}})}function Wg(u,p){ot(u>>>=0,{Cd:!0,name:p=rt(p>>>0),Qc:()=>{},Xc:()=>{}})}function qg(u){tn(u>>>0,!i,1,!r,131072,!1),vs()}var Fr=u=>{if(!A)try{if(u(),!(0<$e))try{n?Jr()&&rn(_):dr(_)}catch(p){p instanceof Fe||p=="unwind"||d(0,p)}}catch(p){p instanceof Fe||p=="unwind"||d(0,p)}},Vg=!Atomics.waitAsync||((fu=globalThis.navigator)==null?void 0:fu.userAgent)&&91>Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)||[])[2]);function ji(u){u>>>=0,Vg||(Atomics.waitAsync((x(),R),u>>>2,u).value.then(jr),u+=128,Atomics.store((x(),R),u>>>2,1))}var jr=()=>Fr(()=>{var u=Jr();u&&(ji(u),$o())});function Gg(u,p){(u>>>=0)==p>>>0?setTimeout(jr):n?postMessage({ad:u,Uc:"checkMailbox"}):(u=Tt[u])&&u.postMessage({Uc:"checkMailbox"})}var Ki=[];function Hg(u,p,g,m,v){for(p>>>=0,v>>>=0,Ki.length=0,g=v>>>3,m=v+m>>>3;g<m;){var k;k=(x(),ue)[g++>>>0]?(x(),ue)[g++>>>0]:(x(),X)[g++>>>0],Ki.push(k)}return(p?on[p]:B0[u])(...Ki)}var Fg=()=>{$e=0};function jg(u){u>>>=0,n?postMessage({Uc:"cleanupThread",Qd:u}):$s(Tt[u])}function Kg(u){}var Kr=u=>{try{u()}catch(p){ee(p)}};function Yg(u){var p=(...g)=>{Yr.push(u);try{return u(...g)}finally{A||(Yr.pop(),it&&gt===1&&Yr.length===0&&(gt=0,$e+=1,Kr(du),typeof Fibers<"u"&&Fibers.ce()))}};return Qs.set(u,p),p}var gt=0,it=null,Ks=0,Yr=[],Yi=new Map,Ys=new Map,Qs=new Map,Qg=0,Qi=null,Zg=[],Zs=u=>(function(p){if(!A){if(gt===0){var g=!1,m=!1;p((v=0)=>{if(!A&&(Ks=v,g=!0,m)){gt=2,Kr(()=>pu(it)),typeof MainLoop<"u"&&MainLoop.yd&&MainLoop.resume(),v=!1;try{var k=(function(){var V=(x(),R)[it+8>>>2>>>0];return V=Ys.get(V),V=Qs.get(V),--$e,V()})()}catch(V){k=V,v=!0}var C=!1;if(!it){var B=Qi;B&&(Qi=null,(v?B.reject:B.resolve)(k),C=!0)}if(v&&!C)throw k}}),m=!0,g||(gt=1,it=(function(){var v=hr(65548),k=v+12;if((x(),F)[v>>>2>>>0]=k,(x(),F)[v+4>>>2>>>0]=k+65536,k=Yr[0],!Yi.has(k)){var C=Qg++;Yi.set(k,C),Ys.set(C,k)}return k=Yi.get(k),(x(),R)[v+8>>>2>>>0]=k,v})(),typeof MainLoop<"u"&&MainLoop.yd&&MainLoop.pause(),Kr(()=>lu(it)))}else gt===2?(gt=0,Kr(cu),nt(it),it=null,Zg.forEach(Fr)):ee(`invalid state: ${gt}`);return Ks}})(p=>{u().then(p)});function Xg(u){return u>>>=0,Zs(async()=>{var p=await qe(u);return je(p)})}var Zi=[],Jg=u=>{var p=Zi.length;return Zi.push(u),p},e0=(u,p)=>{for(var g=Array(u),m=0;m<u;++m){var v=m,k=(x(),F)[p+4*m>>>2>>>0],C=Gi[k];if(C===void 0)throw u=`parameter ${m}`,k=mo(k),p=rt(k),nt(k),new Xt(`${u} has unknown type ${p}`);g[v]=C}return g},t0=(u,p,g)=>{var m=[];return u=u(m,g),m.length&&((x(),F)[p>>>2>>>0]=je(m)),u},r0={},Qr=u=>{var p=r0[u];return p===void 0?rt(u):p};function i0(u,p,g){var[m,...v]=e0(u,p>>>0);p=m.Xc.bind(m);var k=v.map(V=>V.Wc.bind(V));u--;var C={toValue:qe};switch(u=k.map((V,j)=>{var ae=`argFromPtr${j}`;return C[ae]=V,`${ae}(args${j?"+"+8*j:""})`}),g){case 0:var B="toValue(handle)";break;case 2:B="new (toValue(handle))";break;case 3:B="";break;case 1:C.getStringOrSymbol=Qr,B="toValue(handle)[getStringOrSymbol(methodName)]"}return B+=`(${u})`,m.Cd||(C.toReturnWire=p,C.emval_returnValue=t0,B=`return emval_returnValue(toReturnWire, destructorsRef, ${B})`),B=`return function (handle, methodName, destructorsRef, args) {
  ${B}
  }`,g=new Function(Object.keys(C),B)(...Object.values(C)),B=`methodCaller<(${v.map(V=>V.name)}) => ${m.name}>`,Jg(Object.defineProperty(g,"name",{value:B}))}function n0(u,p){return p>>>=0,(u=qe(u>>>0))==qe(p)}function a0(u){return(u>>>=0)?(u=Qr(u),je(globalThis[u])):je(globalThis)}function s0(u){return u=Qr(u>>>0),je(t[u])}function o0(u,p){return p>>>=0,u=qe(u>>>0),p=qe(p),je(u[p])}function u0(u){9<(u>>>=0)&&(kt[u+1]+=1)}function Xs(u,p,g,m,v){return Zi[u>>>0](p>>>0,g>>>0,m>>>0,v>>>0)}function l0(u,p,g,m,v){return Xs(u>>>0,p>>>0,g>>>0,m>>>0,v>>>0)}function d0(){return je([])}function p0(u){u=qe(u>>>0);for(var p=Array(u.length),g=0;g<u.length;g++)p[g]=u[g];return je(p)}function c0(u){return je(Qr(u>>>0))}function h0(){return je({})}function f0(u){for(var p=qe(u>>>=0);p.length;){var g=p.pop();p.pop()(g)}Hi(u)}function m0(u,p,g){p>>>=0,g>>>=0,u=qe(u>>>0),p=qe(p),g=qe(g),u[p]=g}function g0(u,p){u=-9007199254740992>u||9007199254740992<u?NaN:Number(u),p>>>=0,u=new Date(1e3*u),(x(),R)[p>>>2>>>0]=u.getUTCSeconds(),(x(),R)[p+4>>>2>>>0]=u.getUTCMinutes(),(x(),R)[p+8>>>2>>>0]=u.getUTCHours(),(x(),R)[p+12>>>2>>>0]=u.getUTCDate(),(x(),R)[p+16>>>2>>>0]=u.getUTCMonth(),(x(),R)[p+20>>>2>>>0]=u.getUTCFullYear()-1900,(x(),R)[p+24>>>2>>>0]=u.getUTCDay(),u=(u.getTime()-Date.UTC(u.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,(x(),R)[p+28>>>2>>>0]=u}var Js=u=>u%4==0&&(u%100!=0||u%400==0),eo=[0,31,60,91,121,152,182,213,244,274,305,335],to=[0,31,59,90,120,151,181,212,243,273,304,334];function y0(u,p){u=-9007199254740992>u||9007199254740992<u?NaN:Number(u),p>>>=0,u=new Date(1e3*u),(x(),R)[p>>>2>>>0]=u.getSeconds(),(x(),R)[p+4>>>2>>>0]=u.getMinutes(),(x(),R)[p+8>>>2>>>0]=u.getHours(),(x(),R)[p+12>>>2>>>0]=u.getDate(),(x(),R)[p+16>>>2>>>0]=u.getMonth(),(x(),R)[p+20>>>2>>>0]=u.getFullYear()-1900,(x(),R)[p+24>>>2>>>0]=u.getDay();var g=(Js(u.getFullYear())?eo:to)[u.getMonth()]+u.getDate()-1|0;(x(),R)[p+28>>>2>>>0]=g,(x(),R)[p+36>>>2>>>0]=-60*u.getTimezoneOffset(),g=new Date(u.getFullYear(),6,1).getTimezoneOffset();var m=new Date(u.getFullYear(),0,1).getTimezoneOffset();u=0|(g!=m&&u.getTimezoneOffset()==Math.min(m,g)),(x(),R)[p+32>>>2>>>0]=u}function _0(u){u>>>=0;var p=new Date((x(),R)[u+20>>>2>>>0]+1900,(x(),R)[u+16>>>2>>>0],(x(),R)[u+12>>>2>>>0],(x(),R)[u+8>>>2>>>0],(x(),R)[u+4>>>2>>>0],(x(),R)[u>>>2>>>0],0),g=(x(),R)[u+32>>>2>>>0],m=p.getTimezoneOffset(),v=new Date(p.getFullYear(),6,1).getTimezoneOffset(),k=new Date(p.getFullYear(),0,1).getTimezoneOffset(),C=Math.min(k,v);return 0>g?(x(),R)[u+32>>>2>>>0]=+(v!=k&&C==m):0<g!=(C==m)&&(v=Math.max(k,v),p.setTime(p.getTime()+6e4*((0<g?C:v)-m))),(x(),R)[u+24>>>2>>>0]=p.getDay(),g=(Js(p.getFullYear())?eo:to)[p.getMonth()]+p.getDate()-1|0,(x(),R)[u+28>>>2>>>0]=g,(x(),R)[u>>>2>>>0]=p.getSeconds(),(x(),R)[u+4>>>2>>>0]=p.getMinutes(),(x(),R)[u+8>>>2>>>0]=p.getHours(),(x(),R)[u+12>>>2>>>0]=p.getDate(),(x(),R)[u+16>>>2>>>0]=p.getMonth(),(x(),R)[u+20>>>2>>>0]=p.getYear(),u=p.getTime(),BigInt(isNaN(u)?-1:u/1e3)}function ro(u,p,g,m,v,k,C){return n?re(16,1,u,p,g,m,v,k,C):-52}function io(u,p,g,m,v,k){if(n)return re(17,1,u,p,g,m,v,k)}var cr={},w0=()=>performance.timeOrigin+performance.now();function no(u,p){if(n)return re(18,1,u,p);if(cr[u]&&(clearTimeout(cr[u].id),delete cr[u]),!p)return 0;var g=setTimeout(()=>{delete cr[u],Fr(()=>bo(u,performance.timeOrigin+performance.now()))},p);return cr[u]={id:g,be:p},0}function b0(u,p,g,m){u>>>=0,p>>>=0,g>>>=0,m>>>=0;var v=new Date().getFullYear(),k=new Date(v,0,1).getTimezoneOffset();v=new Date(v,6,1).getTimezoneOffset();var C=Math.max(k,v);(x(),F)[u>>>2>>>0]=60*C,(x(),R)[p>>>2>>>0]=+(k!=v),u=(p=B=>{var V=Math.abs(B);return`UTC${0<=B?"-":"+"}${String(Math.floor(V/60)).padStart(2,"0")}${String(V%60).padStart(2,"0")}`})(k),p=p(v),v<k?(mt(u,g,17),mt(p,m,17)):(mt(u,m,17),mt(p,g,17))}var $0=()=>Date.now();function v0(u,p,g){return g>>>=0,0<=u&&3>=u?(u===0?u=Date.now():u=performance.timeOrigin+performance.now(),u=Math.round(1e6*u),(x(),ue)[g>>>3>>>0]=BigInt(u),0):28}var Xi=[],ao=(u,p)=>{Xi.length=0;for(var g;g=(x(),q)[u++>>>0];){var m=g!=105;p+=(m&=g!=112)&&p%8?4:0,Xi.push(g==112?(x(),F)[p>>>2>>>0]:g==106?(x(),ue)[p>>>3>>>0]:g==105?(x(),R)[p>>>2>>>0]:(x(),X)[p>>>3>>>0]),p+=m?8:4}return Xi};function x0(u,p,g){return u>>>=0,p=ao(p>>>0,g>>>0),on[u](...p)}function S0(u,p,g){return u>>>=0,p=ao(p>>>0,g>>>0),on[u](...p)}var I0=()=>{};function T0(u,p){return E(Te(u>>>0,p>>>0))}var k0=()=>{throw $e+=1,"unwind"};function E0(){return 4294901760}var C0=()=>navigator.hardwareConcurrency,Et={},Zr=u=>{var p;return(p=/\bwasm-function\[\d+\]:(0x[0-9a-f]+)/.exec(u))?+p[1]:(p=/:(\d+):\d+(?:\)|$)/.exec(u))?2147483648|+p[1]:0},so=u=>{for(var p of u)(u=Zr(p))&&(Et[u]=p)};function z0(){var u=Error().stack.toString().split(`
`);return u[0]=="Error"&&u.shift(),so(u),Et.sd=Zr(u[3]),Et.Md=u,Et.sd}function Xr(u){if(!(u=Et[u>>>0]))return 0;var p;if(p=/^\s+at .*\.wasm\.(.*) \(.*\)$/.exec(u))u=p[1];else if(p=/^\s+at (.*) \(.*\)$/.exec(u))u=p[1];else{if(!(p=/^(.+?)@/.exec(u)))return 0;u=p[1]}nt(Xr.td??0),p=Hr(u)+1;var g=hr(p);return g&&mt(u,g,p),Xr.td=g,Xr.td}function A0(u){u>>>=0;var p=(x(),q).length;if(u<=p||4294901760<u)return!1;for(var g=1;4>=g;g*=2){var m=p*(1+.2/g);m=Math.min(m,u+100663296);e:{m=(Math.min(4294901760,65536*Math.ceil(Math.max(u,m)/65536))-ft.buffer.byteLength+65535)/65536|0;try{ft.grow(m),U();var v=1;break e}catch{}v=void 0}if(v)return!0}return!1}function O0(u,p,g){if(u>>>=0,p>>>=0,Et.sd==u)var m=Et.Md;else(m=Error().stack.toString().split(`
`))[0]=="Error"&&m.shift(),so(m);for(var v=3;m[v]&&Zr(m[v])!=u;)++v;for(u=0;u<g&&m[u+v];++u)(x(),R)[p+4*u>>>2>>>0]=Zr(m[u+v]);return u}var Ji,en={},oo=()=>{var m;if(!Ji){var u,p={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(((m=globalThis.navigator)==null?void 0:m.language)??"C").replace("-","_")+".UTF-8",_:"./this.program"};for(u in en)en[u]===void 0?delete p[u]:p[u]=en[u];var g=[];for(u in p)g.push(`${u}=${p[u]}`);Ji=g}return Ji};function uo(u,p){if(n)return re(19,1,u,p);u>>>=0,p>>>=0;var g,m=0,v=0;for(g of oo()){var k=p+m;(x(),F)[u+v>>>2>>>0]=k,m+=mt(g,k,1/0)+1,v+=4}return 0}function lo(u,p){if(n)return re(20,1,u,p);u>>>=0,p>>>=0;var g=oo();for(var m of((x(),F)[u>>>2>>>0]=g.length,u=0,g))u+=Hr(m)+1;return(x(),F)[p>>>2>>>0]=u,0}function po(u){return n?re(21,1,u):52}function co(u,p,g,m){return n?re(22,1,u,p,g,m):52}function ho(u,p,g,m){return n?re(23,1,u,p,g,m):70}var R0=[null,[],[]];function fo(u,p,g,m){if(n)return re(24,1,u,p,g,m);p>>>=0,g>>>=0,m>>>=0;for(var v=0,k=0;k<g;k++){var C=(x(),F)[p>>>2>>>0],B=(x(),F)[p+4>>>2>>>0];p+=8;for(var V=0;V<B;V++){var j=u,ae=(x(),q)[C+V>>>0],pe=R0[j];ae===0||ae===10?((j===1?I:E)(As(pe)),pe.length=0):pe.push(ae)}v+=B}return(x(),F)[m>>>2>>>0]=v,0}function M0(u){return u>>>0}n||(function(){for(var u=t.numThreads-1;u--;)Ss();Wr.push(async()=>{var p=(async function(){if(!n)return Promise.all(ht.map(xs))})();De++,await p,--De==0&&Re&&(p=Re,Re=null,p())})})(),n||(ft=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),U()),t.wasmBinary&&(f=t.wasmBinary),t.stackSave=()=>oe(),t.stackRestore=u=>se(u),t.stackAlloc=u=>nn(u),t.setValue=function(u,p,g="i8"){switch(g.endsWith("*")&&(g="*"),g){case"i1":case"i8":(x(),N)[u>>>0]=p;break;case"i16":(x(),G)[u>>>1>>>0]=p;break;case"i32":(x(),R)[u>>>2>>>0]=p;break;case"i64":(x(),ue)[u>>>3>>>0]=BigInt(p);break;case"float":(x(),K)[u>>>2>>>0]=p;break;case"double":(x(),X)[u>>>3>>>0]=p;break;case"*":(x(),F)[u>>>2>>>0]=p;break;default:ee(`invalid type for setValue: ${g}`)}},t.getValue=function(u,p="i8"){switch(p.endsWith("*")&&(p="*"),p){case"i1":case"i8":return(x(),N)[u>>>0];case"i16":return(x(),G)[u>>>1>>>0];case"i32":return(x(),R)[u>>>2>>>0];case"i64":return(x(),ue)[u>>>3>>>0];case"float":return(x(),K)[u>>>2>>>0];case"double":return(x(),X)[u>>>3>>>0];case"*":return(x(),F)[u>>>2>>>0];default:ee(`invalid type for getValue: ${p}`)}},t.UTF8ToString=Te,t.stringToUTF8=mt,t.lengthBytesUTF8=Hr;var mo,go,Jr,nt,hr,tn,yo,_o,wo,rn,bo,$o,le,fr,vo,se,nn,oe,xo,an,So,Io,To,sn,ko,Eo,Co,zo,Ao,Oo,Ro,Mo,Bo,Do,No,Po,Uo,Lo,Wo,qo,Vo,Go,Ho,Fo,jo,Ko,Yo,Qo,Zo,Xo,Jo,eu,tu,ru,iu,nu,au,su,ou,uu,lu,du,pu,cu,ut,B0=[Ne,qr,ks,Os,Rs,Ms,Bs,Ds,Ns,Ps,Us,Ls,Ws,qs,Vs,Gs,ro,io,no,uo,lo,po,co,ho,fo],on={929356:(u,p,g,m,v)=>{if(t===void 0||!t.Zc)return 1;if((u=Te(Number(u>>>0))).startsWith("./")&&(u=u.substring(2)),!(u=t.Zc.get(u)))return 2;if(p=Number(p>>>0),g=Number(g>>>0),m=Number(m>>>0),p+g>u.byteLength)return 3;try{let k=u.subarray(p,p+g);switch(v){case 0:(x(),q).set(k,m>>>0);break;case 1:t.Xd?t.Xd(m,k):t.Ld(m,k);break;default:return 4}return 0}catch{return 4}},930180:(u,p,g)=>{t.xd(u,(x(),q).subarray(p>>>0,p+g>>>0))},930244:()=>t.Zd(),930286:u=>{t.vd(u)},930323:()=>{t.Ed()},930354:()=>{t.Fd()},930383:()=>{t.Jd()},930408:u=>t.Dd(u),930441:u=>t.Hd(u),930473:(u,p,g)=>{t.jd(Number(u),Number(p),Number(g),!0)},930536:(u,p,g)=>{t.jd(Number(u),Number(p),Number(g))},930593:()=>typeof wasmOffsetConverter<"u",930650:u=>{t.ac("Abs",u,void 0)},930701:u=>{t.ac("Neg",u,void 0)},930752:u=>{t.ac("Floor",u,void 0)},930805:u=>{t.ac("Ceil",u,void 0)},930857:u=>{t.ac("Reciprocal",u,void 0)},930915:u=>{t.ac("Sqrt",u,void 0)},930967:u=>{t.ac("Exp",u,void 0)},931018:u=>{t.ac("Erf",u,void 0)},931069:u=>{t.ac("Sigmoid",u,void 0)},931124:(u,p,g)=>{t.ac("HardSigmoid",u,{alpha:p,beta:g})},931203:u=>{t.ac("Log",u,void 0)},931254:u=>{t.ac("Sin",u,void 0)},931305:u=>{t.ac("Cos",u,void 0)},931356:u=>{t.ac("Tan",u,void 0)},931407:u=>{t.ac("Asin",u,void 0)},931459:u=>{t.ac("Acos",u,void 0)},931511:u=>{t.ac("Atan",u,void 0)},931563:u=>{t.ac("Sinh",u,void 0)},931615:u=>{t.ac("Cosh",u,void 0)},931667:u=>{t.ac("Asinh",u,void 0)},931720:u=>{t.ac("Acosh",u,void 0)},931773:u=>{t.ac("Atanh",u,void 0)},931826:u=>{t.ac("Tanh",u,void 0)},931878:u=>{t.ac("Not",u,void 0)},931929:(u,p,g)=>{t.ac("Clip",u,{min:p,max:g})},931998:u=>{t.ac("Clip",u,void 0)},932050:(u,p)=>{t.ac("Elu",u,{alpha:p})},932108:u=>{t.ac("Gelu",u,void 0)},932160:u=>{t.ac("Relu",u,void 0)},932212:(u,p)=>{t.ac("LeakyRelu",u,{alpha:p})},932276:(u,p)=>{t.ac("ThresholdedRelu",u,{alpha:p})},932346:(u,p)=>{t.ac("Cast",u,{to:p})},932404:u=>{t.ac("Add",u,void 0)},932455:u=>{t.ac("Sub",u,void 0)},932506:u=>{t.ac("Mul",u,void 0)},932557:u=>{t.ac("Div",u,void 0)},932608:u=>{t.ac("Pow",u,void 0)},932659:u=>{t.ac("Equal",u,void 0)},932712:u=>{t.ac("Greater",u,void 0)},932767:u=>{t.ac("GreaterOrEqual",u,void 0)},932829:u=>{t.ac("Less",u,void 0)},932881:u=>{t.ac("LessOrEqual",u,void 0)},932940:(u,p,g,m,v)=>{t.ac("ReduceMean",u,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:m?Array.from((x(),R).subarray(Number(m)>>>0,Number(v)>>>0)):[]})},933115:(u,p,g,m,v)=>{t.ac("ReduceMax",u,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:m?Array.from((x(),R).subarray(Number(m)>>>0,Number(v)>>>0)):[]})},933289:(u,p,g,m,v)=>{t.ac("ReduceMin",u,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:m?Array.from((x(),R).subarray(Number(m)>>>0,Number(v)>>>0)):[]})},933463:(u,p,g,m,v)=>{t.ac("ReduceProd",u,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:m?Array.from((x(),R).subarray(Number(m)>>>0,Number(v)>>>0)):[]})},933638:(u,p,g,m,v)=>{t.ac("ReduceSum",u,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:m?Array.from((x(),R).subarray(Number(m)>>>0,Number(v)>>>0)):[]})},933812:(u,p,g,m,v)=>{t.ac("ReduceL1",u,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:m?Array.from((x(),R).subarray(Number(m)>>>0,Number(v)>>>0)):[]})},933985:(u,p,g,m,v)=>{t.ac("ReduceL2",u,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:m?Array.from((x(),R).subarray(Number(m)>>>0,Number(v)>>>0)):[]})},934158:(u,p,g,m,v)=>{t.ac("ReduceLogSum",u,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:m?Array.from((x(),R).subarray(Number(m)>>>0,Number(v)>>>0)):[]})},934335:(u,p,g,m,v)=>{t.ac("ReduceSumSquare",u,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:m?Array.from((x(),R).subarray(Number(m)>>>0,Number(v)>>>0)):[]})},934515:(u,p,g,m,v)=>{t.ac("ReduceLogSumExp",u,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:m?Array.from((x(),R).subarray(Number(m)>>>0,Number(v)>>>0)):[]})},934695:u=>{t.ac("Where",u,void 0)},934748:(u,p,g)=>{t.ac("Transpose",u,{perm:p?Array.from((x(),R).subarray(Number(p)>>>0,Number(g)>>>0)):[]})},934872:(u,p,g,m)=>{t.ac("DepthToSpace",u,{blocksize:p,mode:Te(g),format:m?"NHWC":"NCHW"})},935005:(u,p,g,m)=>{t.ac("DepthToSpace",u,{blocksize:p,mode:Te(g),format:m?"NHWC":"NCHW"})},935138:(u,p,g,m,v,k,C,B,V,j,ae,pe,we,ve,yt)=>{t.ac("ConvTranspose",u,{format:V?"NHWC":"NCHW",autoPad:p,dilations:[g],group:m,kernelShape:[v],pads:[k,C],strides:[B],wIsConst:()=>!!(x(),N)[j>>>0],outputPadding:ae?Array.from((x(),R).subarray(Number(ae)>>>0,Number(pe)>>>0)):[],outputShape:we?Array.from((x(),R).subarray(Number(we)>>>0,Number(ve)>>>0)):[],activation:Te(yt)})},935571:(u,p,g,m,v,k,C,B,V,j,ae,pe,we,ve)=>{t.ac("ConvTranspose",u,{format:B?"NHWC":"NCHW",autoPad:p,dilations:Array.from((x(),R).subarray(Number(g)>>>0,2+(Number(g)>>>0)>>>0)),group:m,kernelShape:Array.from((x(),R).subarray(Number(v)>>>0,2+(Number(v)>>>0)>>>0)),pads:Array.from((x(),R).subarray(Number(k)>>>0,4+(Number(k)>>>0)>>>0)),strides:Array.from((x(),R).subarray(Number(C)>>>0,2+(Number(C)>>>0)>>>0)),wIsConst:()=>!!(x(),N)[V>>>0],outputPadding:j?Array.from((x(),R).subarray(Number(j)>>>0,Number(ae)>>>0)):[],outputShape:pe?Array.from((x(),R).subarray(Number(pe)>>>0,Number(we)>>>0)):[],activation:Te(ve)})},936232:(u,p,g,m,v,k,C,B,V,j,ae,pe,we,ve,yt)=>{t.ac("ConvTranspose",u,{format:V?"NHWC":"NCHW",autoPad:p,dilations:[g],group:m,kernelShape:[v],pads:[k,C],strides:[B],wIsConst:()=>!!(x(),N)[j>>>0],outputPadding:ae?Array.from((x(),R).subarray(Number(ae)>>>0,Number(pe)>>>0)):[],outputShape:we?Array.from((x(),R).subarray(Number(we)>>>0,Number(ve)>>>0)):[],activation:Te(yt)})},936665:(u,p,g,m,v,k,C,B,V,j,ae,pe,we,ve)=>{t.ac("ConvTranspose",u,{format:B?"NHWC":"NCHW",autoPad:p,dilations:Array.from((x(),R).subarray(Number(g)>>>0,2+(Number(g)>>>0)>>>0)),group:m,kernelShape:Array.from((x(),R).subarray(Number(v)>>>0,2+(Number(v)>>>0)>>>0)),pads:Array.from((x(),R).subarray(Number(k)>>>0,4+(Number(k)>>>0)>>>0)),strides:Array.from((x(),R).subarray(Number(C)>>>0,2+(Number(C)>>>0)>>>0)),wIsConst:()=>!!(x(),N)[V>>>0],outputPadding:j?Array.from((x(),R).subarray(Number(j)>>>0,Number(ae)>>>0)):[],outputShape:pe?Array.from((x(),R).subarray(Number(pe)>>>0,Number(we)>>>0)):[],activation:Te(ve)})},937326:(u,p)=>{t.ac("GlobalAveragePool",u,{format:p?"NHWC":"NCHW"})},937417:(u,p,g,m,v,k,C,B,V,j,ae,pe,we,ve)=>{t.ac("AveragePool",u,{format:ve?"NHWC":"NCHW",auto_pad:p,ceil_mode:g,count_include_pad:m,storage_order:v,dilations:k?Array.from((x(),R).subarray(Number(k)>>>0,Number(C)>>>0)):[],kernel_shape:B?Array.from((x(),R).subarray(Number(B)>>>0,Number(V)>>>0)):[],pads:j?Array.from((x(),R).subarray(Number(j)>>>0,Number(ae)>>>0)):[],strides:pe?Array.from((x(),R).subarray(Number(pe)>>>0,Number(we)>>>0)):[]})},937896:(u,p)=>{t.ac("GlobalAveragePool",u,{format:p?"NHWC":"NCHW"})},937987:(u,p,g,m,v,k,C,B,V,j,ae,pe,we,ve)=>{t.ac("AveragePool",u,{format:ve?"NHWC":"NCHW",auto_pad:p,ceil_mode:g,count_include_pad:m,storage_order:v,dilations:k?Array.from((x(),R).subarray(Number(k)>>>0,Number(C)>>>0)):[],kernel_shape:B?Array.from((x(),R).subarray(Number(B)>>>0,Number(V)>>>0)):[],pads:j?Array.from((x(),R).subarray(Number(j)>>>0,Number(ae)>>>0)):[],strides:pe?Array.from((x(),R).subarray(Number(pe)>>>0,Number(we)>>>0)):[]})},938466:(u,p)=>{t.ac("GlobalMaxPool",u,{format:p?"NHWC":"NCHW"})},938553:(u,p,g,m,v,k,C,B,V,j,ae,pe,we,ve)=>{t.ac("MaxPool",u,{format:ve?"NHWC":"NCHW",auto_pad:p,ceil_mode:g,count_include_pad:m,storage_order:v,dilations:k?Array.from((x(),R).subarray(Number(k)>>>0,Number(C)>>>0)):[],kernel_shape:B?Array.from((x(),R).subarray(Number(B)>>>0,Number(V)>>>0)):[],pads:j?Array.from((x(),R).subarray(Number(j)>>>0,Number(ae)>>>0)):[],strides:pe?Array.from((x(),R).subarray(Number(pe)>>>0,Number(we)>>>0)):[]})},939028:(u,p)=>{t.ac("GlobalMaxPool",u,{format:p?"NHWC":"NCHW"})},939115:(u,p,g,m,v,k,C,B,V,j,ae,pe,we,ve)=>{t.ac("MaxPool",u,{format:ve?"NHWC":"NCHW",auto_pad:p,ceil_mode:g,count_include_pad:m,storage_order:v,dilations:k?Array.from((x(),R).subarray(Number(k)>>>0,Number(C)>>>0)):[],kernel_shape:B?Array.from((x(),R).subarray(Number(B)>>>0,Number(V)>>>0)):[],pads:j?Array.from((x(),R).subarray(Number(j)>>>0,Number(ae)>>>0)):[],strides:pe?Array.from((x(),R).subarray(Number(pe)>>>0,Number(we)>>>0)):[]})},939590:(u,p,g,m,v)=>{t.ac("Gemm",u,{alpha:p,beta:g,transA:m,transB:v})},939694:u=>{t.ac("MatMul",u,void 0)},939748:(u,p,g,m)=>{t.ac("ArgMax",u,{keepDims:!!p,selectLastIndex:!!g,axis:m})},939856:(u,p,g,m)=>{t.ac("ArgMin",u,{keepDims:!!p,selectLastIndex:!!g,axis:m})},939964:(u,p)=>{t.ac("Softmax",u,{axis:p})},940027:(u,p)=>{t.ac("Concat",u,{axis:p})},940087:(u,p,g,m,v)=>{t.ac("Split",u,{axis:p,numOutputs:g,splitSizes:m?Array.from((x(),R).subarray(Number(m)>>>0,Number(v)>>>0)):[]})},940243:u=>{t.ac("Expand",u,void 0)},940297:(u,p)=>{t.ac("Gather",u,{axis:Number(p)})},940368:(u,p)=>{t.ac("GatherElements",u,{axis:Number(p)})},940447:(u,p)=>{t.ac("GatherND",u,{batch_dims:Number(p)})},940526:(u,p,g,m,v,k,C,B,V,j,ae)=>{t.ac("Resize",u,{antialias:p,axes:g?Array.from((x(),R).subarray(Number(g)>>>0,Number(m)>>>0)):[],coordinateTransformMode:Te(v),cubicCoeffA:k,excludeOutside:C,extrapolationValue:B,keepAspectRatioPolicy:Te(V),mode:Te(j),nearestMode:Te(ae)})},940888:(u,p,g,m,v,k,C)=>{t.ac("Slice",u,{starts:p?Array.from((x(),R).subarray(Number(p)>>>0,Number(g)>>>0)):[],ends:m?Array.from((x(),R).subarray(Number(m)>>>0,Number(v)>>>0)):[],axes:k?Array.from((x(),R).subarray(Number(k)>>>0,Number(C)>>>0)):[]})},941152:u=>{t.ac("Tile",u,void 0)},941204:(u,p,g)=>{t.ac("InstanceNormalization",u,{epsilon:p,format:g?"NHWC":"NCHW"})},941318:(u,p,g)=>{t.ac("InstanceNormalization",u,{epsilon:p,format:g?"NHWC":"NCHW"})},941432:u=>{t.ac("Range",u,void 0)},941485:(u,p)=>{t.ac("Einsum",u,{equation:Te(p)})},941566:(u,p,g,m,v)=>{t.ac("Pad",u,{mode:p,value:g,pads:m?Array.from((x(),R).subarray(Number(m)>>>0,Number(v)>>>0)):[]})},941709:(u,p,g,m,v,k)=>{t.ac("BatchNormalization",u,{epsilon:p,momentum:g,spatial:!!v,trainingMode:!!m,format:k?"NHWC":"NCHW"})},941878:(u,p,g,m,v,k)=>{t.ac("BatchNormalization",u,{epsilon:p,momentum:g,spatial:!!v,trainingMode:!!m,format:k?"NHWC":"NCHW"})},942047:(u,p,g)=>{t.ac("CumSum",u,{exclusive:Number(p),reverse:Number(g)})},942144:(u,p,g)=>{t.ac("DequantizeLinear",u,{axis:p,blockSize:g})},942234:(u,p,g,m,v)=>{t.ac("GridSample",u,{align_corners:p,mode:Te(g),padding_mode:Te(m),format:v?"NHWC":"NCHW"})},942404:(u,p,g,m,v)=>{t.ac("GridSample",u,{align_corners:p,mode:Te(g),padding_mode:Te(m),format:v?"NHWC":"NCHW"})},942574:(u,p)=>{t.ac("ScatterND",u,{reduction:Te(p)})},942659:(u,p,g,m,v,k,C,B,V)=>{t.ac("Attention",u,{numHeads:p,isUnidirectional:g,maskFilterValue:m,scale:v,doRotary:k,qkvHiddenSizes:C?Array.from((x(),R).subarray(Number(B)>>>0,Number(B)+C>>>0)):[],pastPresentShareBuffer:!!V})},942931:u=>{t.ac("BiasAdd",u,void 0)},942986:u=>{t.ac("BiasSplitGelu",u,void 0)},943047:u=>{t.ac("FastGelu",u,void 0)},943103:(u,p,g,m,v,k,C,B,V,j,ae,pe,we,ve,yt,un)=>{t.ac("Conv",u,{format:pe?"NHWC":"NCHW",auto_pad:p,dilations:g?Array.from((x(),R).subarray(Number(g)>>>0,Number(m)>>>0)):[],group:v,kernel_shape:k?Array.from((x(),R).subarray(Number(k)>>>0,Number(C)>>>0)):[],pads:B?Array.from((x(),R).subarray(Number(B)>>>0,Number(V)>>>0)):[],strides:j?Array.from((x(),R).subarray(Number(j)>>>0,Number(ae)>>>0)):[],w_is_const:()=>!!(x(),N)[Number(we)>>>0],activation:Te(ve),activation_params:yt?Array.from((x(),K).subarray(Number(yt)>>>0,Number(un)>>>0)):[]})},943687:u=>{t.ac("Gelu",u,void 0)},943739:(u,p,g,m,v,k,C,B,V)=>{t.ac("GroupQueryAttention",u,{numHeads:p,kvNumHeads:g,scale:m,softcap:v,doRotary:k,rotaryInterleaved:C,smoothSoftmax:B,localWindowSize:V})},943956:(u,p,g,m)=>{t.ac("LayerNormalization",u,{axis:p,epsilon:g,simplified:!!m})},944067:(u,p,g,m)=>{t.ac("LayerNormalization",u,{axis:p,epsilon:g,simplified:!!m})},944178:(u,p,g,m,v,k)=>{t.ac("MatMulNBits",u,{k:p,n:g,accuracyLevel:m,bits:v,blockSize:k})},944305:(u,p,g,m,v,k)=>{t.ac("MultiHeadAttention",u,{numHeads:p,isUnidirectional:g,maskFilterValue:m,scale:v,doRotary:k})},944464:(u,p)=>{t.ac("QuickGelu",u,{alpha:p})},944528:(u,p,g,m,v)=>{t.ac("RotaryEmbedding",u,{interleaved:!!p,numHeads:g,rotaryEmbeddingDim:m,scale:v})},944667:(u,p,g)=>{t.ac("SkipLayerNormalization",u,{epsilon:p,simplified:!!g})},944769:(u,p,g)=>{t.ac("SkipLayerNormalization",u,{epsilon:p,simplified:!!g})},944871:(u,p,g,m)=>{t.ac("GatherBlockQuantized",u,{gatherAxis:p,quantizeAxis:g,blockSize:m})},944992:u=>{t.Id(u)},945026:(u,p)=>t.Kd(Number(u),Number(p),t.$c.Nd,t.$c.errors)};function D0(u,p,g){return Zs(async()=>{await t.Gd(Number(u),Number(p),Number(g))})}function N0(){return typeof wasmOffsetConverter<"u"}function P0(u,p,g,m){var v=oe();try{return Mo(u,p,g,m)}catch(k){if(se(v),k!==k+0)throw k;le(1,0)}}function U0(u,p,g){var m=oe();try{return zo(u,p,g)}catch(v){if(se(m),v!==v+0)throw v;le(1,0)}}function L0(u,p,g){var m=oe();try{To(u,p,g)}catch(v){if(se(m),v!==v+0)throw v;le(1,0)}}function W0(u,p){var g=oe();try{return sn(u,p)}catch(m){if(se(g),m!==m+0)throw m;le(1,0)}}function q0(u){var p=oe();try{ko(u)}catch(g){if(se(p),g!==g+0)throw g;le(1,0)}}function V0(u,p,g,m,v,k,C){var B=oe();try{return Oo(u,p,g,m,v,k,C)}catch(V){if(se(B),V!==V+0)throw V;le(1,0)}}function G0(u,p){var g=oe();try{Bo(u,p)}catch(m){if(se(g),m!==m+0)throw m;le(1,0)}}function H0(u,p,g,m,v,k){var C=oe();try{Eo(u,p,g,m,v,k)}catch(B){if(se(C),B!==B+0)throw B;le(1,0)}}function F0(u,p,g,m){var v=oe();try{Ro(u,p,g,m)}catch(k){if(se(v),k!==k+0)throw k;le(1,0)}}function j0(u,p,g,m,v){var k=oe();try{Co(u,p,g,m,v)}catch(C){if(se(k),C!==C+0)throw C;le(1,0)}}function K0(u,p,g,m,v,k,C){var B=oe();try{No(u,p,g,m,v,k,C)}catch(V){if(se(B),V!==V+0)throw V;le(1,0)}}function Y0(u,p,g,m,v,k,C){var B=oe();try{Po(u,p,g,m,v,k,C)}catch(V){if(se(B),V!==V+0)throw V;le(1,0)}}function Q0(u,p,g,m,v,k,C,B){var V=oe();try{qo(u,p,g,m,v,k,C,B)}catch(j){if(se(V),j!==j+0)throw j;le(1,0)}}function Z0(u,p,g,m,v){var k=oe();try{return Do(u,p,g,m,v)}catch(C){if(se(k),C!==C+0)throw C;le(1,0)}}function X0(u,p,g,m,v,k,C,B){var V=oe();try{Vo(u,p,g,m,v,k,C,B)}catch(j){if(se(V),j!==j+0)throw j;le(1,0)}}function J0(u,p,g,m,v,k,C,B,V,j,ae,pe){var we=oe();try{Uo(u,p,g,m,v,k,C,B,V,j,ae,pe)}catch(ve){if(se(we),ve!==ve+0)throw ve;le(1,0)}}function ey(u,p,g,m,v,k){var C=oe();try{return Lo(u,p,g,m,v,k)}catch(B){if(se(C),B!==B+0)throw B;le(1,0)}}function ty(u,p,g){var m=oe();try{return Go(u,p,g)}catch(v){if(se(m),v!==v+0)throw v;return le(1,0),0n}}function ry(u,p,g,m,v,k,C,B,V){var j=oe();try{Ao(u,p,g,m,v,k,C,B,V)}catch(ae){if(se(j),ae!==ae+0)throw ae;le(1,0)}}function iy(u){var p=oe();try{return Ho(u)}catch(g){if(se(p),g!==g+0)throw g;le(1,0)}}function ny(u,p,g){var m=oe();try{return Fo(u,p,g)}catch(v){if(se(m),v!==v+0)throw v;le(1,0)}}function ay(u,p){var g=oe();try{return uu(u,p)}catch(m){if(se(g),m!==m+0)throw m;return le(1,0),0n}}function sy(u,p,g,m,v){var k=oe();try{jo(u,p,g,m,v)}catch(C){if(se(k),C!==C+0)throw C;le(1,0)}}function oy(u){var p=oe();try{return Ko(u)}catch(g){if(se(p),g!==g+0)throw g;return le(1,0),0n}}function uy(u,p,g,m,v,k){var C=oe();try{return eu(u,p,g,m,v,k)}catch(B){if(se(C),B!==B+0)throw B;le(1,0)}}function ly(u,p,g,m,v,k){var C=oe();try{return tu(u,p,g,m,v,k)}catch(B){if(se(C),B!==B+0)throw B;le(1,0)}}function dy(u,p,g,m,v,k,C,B){var V=oe();try{return Wo(u,p,g,m,v,k,C,B)}catch(j){if(se(V),j!==j+0)throw j;le(1,0)}}function py(u,p,g,m,v){var k=oe();try{return ru(u,p,g,m,v)}catch(C){if(se(k),C!==C+0)throw C;return le(1,0),0n}}function cy(u,p,g,m){var v=oe();try{return iu(u,p,g,m)}catch(k){if(se(v),k!==k+0)throw k;le(1,0)}}function hy(u,p,g,m){var v=oe();try{return nu(u,p,g,m)}catch(k){if(se(v),k!==k+0)throw k;le(1,0)}}function fy(u,p,g,m,v,k,C,B,V,j,ae,pe){var we=oe();try{return au(u,p,g,m,v,k,C,B,V,j,ae,pe)}catch(ve){if(se(we),ve!==ve+0)throw ve;le(1,0)}}function my(u,p,g,m,v,k,C,B,V,j,ae){var pe=oe();try{Xo(u,p,g,m,v,k,C,B,V,j,ae)}catch(we){if(se(pe),we!==we+0)throw we;le(1,0)}}function gy(u,p,g,m,v,k,C,B,V,j,ae,pe,we,ve,yt,un){var vy=oe();try{Jo(u,p,g,m,v,k,C,B,V,j,ae,pe,we,ve,yt,un)}catch(ln){if(se(vy),ln!==ln+0)throw ln;le(1,0)}}function yy(u,p,g,m){var v=oe();try{return su(u,p,g,m)}catch(k){if(se(v),k!==k+0)throw k;le(1,0)}}function _y(u,p,g,m,v){var k=oe();try{return ou(u,p,g,m,v)}catch(C){if(se(k),C!==C+0)throw C;le(1,0)}}function wy(u,p,g){var m=oe();try{return Yo(u,p,g)}catch(v){if(se(m),v!==v+0)throw v;le(1,0)}}function by(u,p,g){var m=oe();try{return Qo(u,p,g)}catch(v){if(se(m),v!==v+0)throw v;le(1,0)}}function $y(u,p,g,m){var v=oe();try{Zo(u,p,g,m)}catch(k){if(se(v),k!==k+0)throw k;le(1,0)}}function ei(){if(0<De)Re=ei;else if(n)w==null||w(t),J();else{for(var u=Wr;0<u.length;)u.shift()(t);0<De?Re=ei:(t.calledRun=!0,A||(J(),w==null||w(t)))}}return n||(ut=await He(),ei()),t.PTR_SIZE=4,P?t:new Promise((u,p)=>{w=u,S=p})}var Qc,Bu,Y_=L(()=>{var e,t;Qc=Mu,Bu=(t=(e=globalThis.self)==null?void 0:e.name)==null?void 0:t.startsWith("em-pthread"),Bu&&Mu()}),vn,ba,Du,Pe,Zc,si,Nu,Pu,xn,Uu,Sn,Xc,In,Jc,Ya=L(()=>{Ka(),vn=typeof location>"u"?void 0:location.origin,ba=import.meta.url>"file:"&&import.meta.url<"file;",Du=()=>{{if(ba){let e=URL;return new URL(new e("ort.bundle.min.mjs",import.meta.url).href,vn).href}return import.meta.url}},Pe=Du(),Zc=()=>{if(Pe&&!Pe.startsWith("blob:"))return Pe.substring(0,Pe.lastIndexOf("/")+1)},si=(e,t)=>{try{let r=t??Pe;return(r?new URL(e,r):new URL(e)).origin===vn}catch{return!1}},Nu=(e,t)=>{let r=t??Pe;try{return(r?new URL(e,r):new URL(e)).href}catch{return}},Pu=(e,t)=>`${t??"./"}${e}`,xn=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},Uu=async e=>(await import(e)).default,Sn=(K_(),Pr(jc)).default,Xc=async()=>{if(!Pe)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(si(Pe))return[void 0,Sn()];let e=await xn(Pe);return[e,Sn(e)]},In=(Y_(),Pr(Yc)).default,Jc=async(e,t,r,i)=>{let n=In&&!(e||t);if(n)if(Pe)n=si(Pe)||i&&!r;else if(i&&!r)n=!0;else throw new Error("cannot determine the script source URL.");if(n)return[void 0,In];{let a="ort-wasm-simd-threaded.jsep.mjs",s=e??Nu(a,t),o=r&&s&&!si(s,t),l=o?await xn(s):s??Pu(a,t);return[o?l:void 0,await Uu(l)]}}}),Tn,oi,_r,kn,Lu,Wu,qu,Qa,be,Yt=L(()=>{Ya(),oi=!1,_r=!1,kn=!1,Lu=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},Wu=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},qu=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},Qa=async e=>{if(oi)return Promise.resolve();if(_r)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(kn)throw new Error("previous call to 'initializeWebAssembly()' failed.");_r=!0;let t=e.initTimeout,r=e.numThreads;if(e.simd!==!1){if(e.simd==="relaxed"){if(!qu())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!Wu())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let i=Lu();r>1&&!i&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=r=1);let n=e.wasmPaths,a=typeof n=="string"?n:void 0,s=n==null?void 0:n.mjs,o=(s==null?void 0:s.href)??s,l=n==null?void 0:n.wasm,d=(l==null?void 0:l.href)??l,c=e.wasmBinary,[h,f]=await Jc(o,a,r>1,!!c||!!d),y=!1,_=[];if(t>0&&_.push(new Promise(w=>{setTimeout(()=>{y=!0,w()},t)})),_.push(new Promise((w,S)=>{let $={numThreads:r};if(c)$.wasmBinary=c,$.locateFile=b=>b;else if(d||a)$.locateFile=b=>d??a+b;else if(o&&o.indexOf("blob:")!==0)$.locateFile=b=>new URL(b,o).href;else if(h){let b=Zc();b&&($.locateFile=T=>b+T)}f($).then(b=>{_r=!1,oi=!0,Tn=b,w(),h&&URL.revokeObjectURL(h)},b=>{_r=!1,kn=!0,S(b)})})),await Promise.race(_),y)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},be=()=>{if(oi&&Tn)return Tn;throw new Error("WebAssembly is not initialized yet.")}}),Je,zi,ye,Za=L(()=>{Yt(),Je=(e,t)=>{let r=be(),i=r.lengthBytesUTF8(e)+1,n=r._malloc(i);return r.stringToUTF8(e,n,i),t.push(n),n},zi=(e,t,r,i)=>{if(typeof e=="object"&&e!==null){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.entries(e).forEach(([n,a])=>{let s=t?t+n:n;if(typeof a=="object")zi(a,s+".",r,i);else if(typeof a=="string"||typeof a=="number")i(s,a.toString());else if(typeof a=="boolean")i(s,a?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof a}`)})},ye=e=>{let t=be(),r=t.stackSave();try{let i=t.PTR_SIZE,n=t.stackAlloc(2*i);t._OrtGetLastError(n,n+i);let a=Number(t.getValue(n,i===4?"i32":"i64")),s=t.getValue(n+i,"*"),o=s?t.UTF8ToString(s):"";throw new Error(`${e} ERROR_CODE: ${a}, ERROR_MESSAGE: ${o}`)}finally{t.stackRestore(r)}}}),eh,Q_=L(()=>{Yt(),Za(),eh=e=>{let t=be(),r=0,i=[],n=e||{};try{if((e==null?void 0:e.logSeverityLevel)===void 0)n.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log severity level is not valid: ${e.logSeverityLevel}`);if((e==null?void 0:e.logVerbosityLevel)===void 0)n.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);(e==null?void 0:e.terminate)===void 0&&(n.terminate=!1);let a=0;return(e==null?void 0:e.tag)!==void 0&&(a=Je(e.tag,i)),r=t._OrtCreateRunOptions(n.logSeverityLevel,n.logVerbosityLevel,!!n.terminate,a),r===0&&ye("Can't create run options."),(e==null?void 0:e.extra)!==void 0&&zi(e.extra,"",new WeakSet,(s,o)=>{let l=Je(s,i),d=Je(o,i);t._OrtAddRunConfigEntry(r,l,d)!==0&&ye(`Can't set a run config entry: ${s} - ${o}.`)}),[r,i]}catch(a){throw r!==0&&t._OrtReleaseRunOptions(r),i.forEach(s=>t._free(s)),a}}}),Vu,Gu,Hu,wr,Fu,th,Z_=L(()=>{Yt(),Za(),Vu=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"layout":return 3;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},Gu=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},Hu=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(r=>(typeof r=="string"?r:r.name)==="webgpu")&&(e.enableMemPattern=!1)},wr=(e,t,r,i)=>{let n=Je(t,i),a=Je(r,i);be()._OrtAddSessionConfigEntry(e,n,a)!==0&&ye(`Can't set a session config entry: ${t} - ${r}.`)},Fu=async(e,t,r)=>{let i=t.executionProviders;for(let n of i){let a=typeof n=="string"?n:n.name,s=[];switch(a){case"webnn":if(a="WEBNN",typeof n!="string"){let h=n==null?void 0:n.deviceType;h&&wr(e,"deviceType",h,r)}break;case"webgpu":if(a="JS",typeof n!="string"){let h=n;if(h!=null&&h.preferredLayout){if(h.preferredLayout!=="NCHW"&&h.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${h.preferredLayout}`);wr(e,"preferredLayout",h.preferredLayout,r)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${a}`)}let o=Je(a,r),l=s.length,d=0,c=0;if(l>0){d=be()._malloc(l*be().PTR_SIZE),r.push(d),c=be()._malloc(l*be().PTR_SIZE),r.push(c);for(let h=0;h<l;h++)be().setValue(d+h*be().PTR_SIZE,s[h][0],"*"),be().setValue(c+h*be().PTR_SIZE,s[h][1],"*")}await be()._OrtAppendExecutionProvider(e,o,d,c,l)!==0&&ye(`Can't append execution provider: ${a}.`)}},th=async e=>{let t=be(),r=0,i=[],n=e||{};Hu(n);try{let a=Vu(n.graphOptimizationLevel??"all"),s=Gu(n.executionMode??"sequential"),o=typeof n.logId=="string"?Je(n.logId,i):0,l=n.logSeverityLevel??2;if(!Number.isInteger(l)||l<0||l>4)throw new Error(`log severity level is not valid: ${l}`);let d=n.logVerbosityLevel??0;if(!Number.isInteger(d)||d<0||d>4)throw new Error(`log verbosity level is not valid: ${d}`);let c=typeof n.optimizedModelFilePath=="string"?Je(n.optimizedModelFilePath,i):0;if(r=t._OrtCreateSessionOptions(a,!!n.enableCpuMemArena,!!n.enableMemPattern,s,!!n.enableProfiling,0,o,l,d,c),r===0&&ye("Can't create session options."),n.executionProviders&&await Fu(r,n,i),n.enableGraphCapture!==void 0){if(typeof n.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${n.enableGraphCapture}`);wr(r,"enableGraphCapture",n.enableGraphCapture.toString(),i)}if(n.freeDimensionOverrides)for(let[h,f]of Object.entries(n.freeDimensionOverrides)){if(typeof h!="string")throw new Error(`free dimension override name must be a string: ${h}`);if(typeof f!="number"||!Number.isInteger(f)||f<0)throw new Error(`free dimension override value must be a non-negative integer: ${f}`);let y=Je(h,i);t._OrtAddFreeDimensionOverride(r,y,f)!==0&&ye(`Can't set a free dimension override: ${h} - ${f}.`)}return n.extra!==void 0&&zi(n.extra,"",new WeakSet,(h,f)=>{wr(r,h,f,i)}),[r,i]}catch(a){throw r!==0&&t._OrtReleaseSessionOptions(r)!==0&&ye("Can't release session options."),i.forEach(s=>t._free(s)),a}}}),Bt,dt,Dt,Ui,Ai,Xa,Ja,$a,te=L(()=>{Bt=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},dt=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},Dt=(e,t)=>{let r=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],i=typeof t=="number"?t:t.reduce((n,a)=>n*a,1);return r>0?Math.ceil(i*r):void 0},Ui=e=>{switch(e){case"float16":return typeof Float16Array<"u"&&Float16Array.from?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},Ai=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},Xa=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",Ja=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",$a=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),es,rh=L(()=>{Ka(),es=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let r=t.headers.get("Content-Length"),i=r?parseInt(r,10):0;if(i<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let n=t.body.getReader(),a;try{a=new ArrayBuffer(i)}catch(o){if(o instanceof RangeError){let l=Math.ceil(i/65536);a=new WebAssembly.Memory({initial:l,maximum:l}).buffer}else throw o}let s=0;for(;;){let{done:o,value:l}=await n.read();if(o)break;let d=l.byteLength;new Uint8Array(a,s,d).set(l),s+=d}return new Uint8Array(a,0,i)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),ju,Ku,Yu,Qu,ts,Zu,de,pt=L(()=>{te(),ju=["V","I","W","E","F"],Ku=(e,t)=>{console.log(`[${ju[e]},${new Date().toISOString()}]${t}`)},ts=(e,t)=>{Yu=e,Qu=t},Zu=(e,t)=>{let r=Ai(e),i=Ai(Yu);r>=i&&Ku(r,typeof t=="function"?t():t)},de=(...e)=>{Qu&&Zu(...e)}}),Xu,sr,M,Oi,ih,nh,ah,ie=L(()=>{Xu=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},sr=class{static calcShape(e,t,r=!1){let i=e.length,n=t.length;if(i===0)return t;if(n===0)return e;let a=Math.max(e.length,t.length),s=new Array(a);if(r){if(i<2||n<2)return;let o=Xu.calcMatMulShape([e[i-2],e[i-1]],[t[n-2],t[n-1]]);if(o===void 0)return;[s[a-2],s[a-1]]=o}for(let o=r?3:1;o<=a;o++){let l=i-o<0?1:e[i-o],d=n-o<0?1:t[n-o];if(l!==d&&l>1&&d>1)return;let c=Math.max(l,d);if(l&&d)s[a-o]=Math.max(l,d);else{if(c>1)return;s[a-o]=0}}return s}static isValidBroadcast(e,t){let r=e.length,i=t.length;if(r>i)return!1;for(let n=1;n<=r;n++)if(e[r-n]!==1&&e[r-n]!==t[i-n])return!1;return!0}},M=class $i{static size(t){return $i.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,r=4){let i=t.length;if(i===0)return[];let n=new Array(i),a=i-1;for(;a>=0;){if(t[a]%r===0){n[a]=t[a]/r;break}if(r%t[a]!==0)throw new Error("cannot convert shape");n[a]=1,r/=t[a],a--}for(a--;a>=0;a--)n[a]=t[a];return n}static sizeFromDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return $i.getSizeFromDimensionRange(t,r,t.length)}static sizeToDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeToDimension as Tensor has ${t.length} dimensions.`);return $i.getSizeFromDimensionRange(t,0,r)}static getSizeFromDimensionRange(t,r,i){let n=1;for(let a=r;a<i;a++){if(t[a]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");n*=Number(t[a])}return n}static computeStrides(t){let r=t.length;if(r===0)return[];if(r===1)return[1];let i=new Array(r);i[r-1]=1,i[r-2]=t[r-1];for(let n=r-3;n>=0;--n)i[n]=i[n+1]*t[n+1];return i}static normalizeAxis(t,r){if(t<-r&&t>=r)throw new Error("unsupported axis for this operation.");return t<0?t+r:t}static normalizeAxes(t,r){return t.map(i=>this.normalizeAxis(i,r??t.length))}static sortBasedOnPerm(t,r){return r?r.map(i=>t[i]):t.slice().reverse()}static padShape(t,r){let i=t.length;return t.map((n,a)=>n+r[a]+r[a+i])}static areEqual(t,r){return t.length!==r.length?!1:t.every((i,n)=>i===r[n])}},Oi=class Cr{static adjustPoolAttributes(t,r,i,n,a,s){if(!t&&i.length!==r.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let o=0;o<r.length-2;o++)o>=i.length?i.push(r[o+2]):i[o]=r[o+2];for(let o=0;o<i.length;o++)if(o<n.length){if(n[o]<0)throw new Error("strides should be greater than or equal to 1")}else n.push(1);for(let o=0;o<i.length;o++)if(o<a.length){if(a[o]<0)throw new Error("dilations should be greater than or equal to 1")}else a.push(1);for(let o=0;o<i.length*2;o++)if(o<s.length){if(s[o]<0)throw new Error("pad should be greater than or equal to 1")}else s.push(0);for(let o=0;o<i.length;o++){if(i[o]<=0)throw new Error("kernel shapes need to be greater than 0");if(s[o]>=i[o]||s[o+i.length]>=i[o])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,r,i,n,a,s,o){if(o){if(a.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(r.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(n.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let l=0;l<t.length-2;l++)Cr.adjustPadAndReturnShape(t[l+(s?1:2)],r[l],i[l],n[l],a,l,l+t.length-2,o)}}static computePoolOutputShape(t,r,i,n,a,s,o){if(r.length<=0)throw new Error("input shape must be of size greater than 0");let l=[r[0],r[1]];return Cr.computeShapeHelper(t,r,l,i,n,a,s,o),l}static computeConvOutputShape(t,r,i,n,a,s,o){if(t.length<=0||r.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let l=[t[0],r[0]];return Cr.computeShapeHelper(!1,t,l,i,n,a,s,o),l}static computeShapeHelper(t,r,i,n,a,s,o,l){if(t)for(let d=0;d<r.length-2;d++)i.push(1);else for(let d=0;d<r.length-2;d++)i.push(Cr.adjustPadAndReturnShape(r[d+2],n[d],a[d],s[d],o,d,d+r.length-2,l))}static adjustPadAndReturnShape(t,r,i,n,a,s,o,l){let d=i*(n-1)+1;if(l&&l!=="NOTSET")switch(l){case"VALID":return a[s]=0,a[o]=0,Math.floor((t-d)/r+1);case"SAME_LOWER":case"SAME_UPPER":if(i!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let c=((t+r-1)/r-1)*r+n-t;return a[s]=Math.floor(l==="SAME_LOWER"?(c+1)/2:c/2),a[o]=c-a[s],Math.floor((t+c-n)/r+1)}default:throw new Error("Unsupported AutoPad type")}else return Math.floor((t+a[s]+a[o]-d)/r+1)}},ih=class{static getShapeOfGemmResult(e,t,r,i,n){if(e.length!==2||r.length!==2)throw new Error("shape need to be of size 2");let a,s,o;t?(a=e[1],s=e[0]):(a=e[0],s=e[1]);let l=-1;if(i?(o=r[0],l=1):(o=r[1],l=0),r[l]!==s)throw new Error("dimension mismatch");if(a<=0||o<=0||s<=0)throw new Error("invalid shape specified");if(n&&!sr.isValidBroadcast(n,[a,o]))throw new Error("gemm: invalid bias shape for broadcast");return[a,o,s]}},nh=-34028234663852886e22,ah=34028234663852886e22}),rs,sh=L(()=>{te(),rs=(e,t)=>new(Ui(t))(e)}),En,va,Cn,Ju,zn,el,An,On,Rn,tl,oh,X_=L(()=>{te(),pt(),En=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),va=(e,t)=>{if(t==="int32")return e;let r=En.get(t);if(!r)throw new Error(`WebNN backend does not support data type: ${t}`);let i=r/8;if(e.byteLength%i!==0)throw new Error(`Invalid Uint8Array length - must be a multiple of ${i}.`);let n=e.byteLength/i,a=new(Ui(t))(e.buffer,e.byteOffset,n);switch(t){case"int64":case"uint64":{let s=new Int32Array(n);for(let o=0;o<n;o++){let l=a[o];if(l>2147483647n||l<-2147483648n)throw new Error("Can not convert int64 data to int32 - value out of range.");s[o]=Number(l)}return new Uint8Array(s.buffer)}case"int8":case"uint8":case"uint32":{if(t==="uint32"&&a.some(o=>o>2147483647))throw new Error("Can not convert uint32 data to int32 - value out of range.");let s=Int32Array.from(a,Number);return new Uint8Array(s.buffer)}default:throw new Error(`Unsupported data conversion from ${t} to 'int32'`)}},Cn=(e,t)=>{if(t==="int32")return e;if(e.byteLength%4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");let r=e.byteLength/4,i=new Int32Array(e.buffer,e.byteOffset,r);switch(t){case"int64":{let n=BigInt64Array.from(i,BigInt);return new Uint8Array(n.buffer)}case"uint64":{if(i.some(a=>a<0))throw new Error("Can not convert int32 data to uin64 - negative value found.");let n=BigUint64Array.from(i,BigInt);return new Uint8Array(n.buffer)}case"int8":{if(i.some(a=>a<-128||a>127))throw new Error("Can not convert int32 data to int8 - value out of range.");let n=Int8Array.from(i,Number);return new Uint8Array(n.buffer)}case"uint8":{if(i.some(n=>n<0||n>255))throw new Error("Can not convert int32 data to uint8 - value out of range.");return Uint8Array.from(i,Number)}case"uint32":{if(i.some(a=>a<0))throw new Error("Can not convert int32 data to uint32 - negative value found.");let n=Uint32Array.from(i,Number);return new Uint8Array(n.buffer)}default:throw new Error(`Unsupported data conversion from 'int32' to ${t}`)}},Ju=1,zn=()=>Ju++,el=new Map([["int8","int32"],["uint8","int32"],["uint32","int32"],["int64","int32"]]),An=(e,t)=>{let r=En.get(e);if(!r)throw new Error(`WebNN backend does not support data type: ${e}`);return t.length>0?Math.ceil(t.reduce((i,n)=>i*n)*r/8):0},On=class{constructor(e){this.isDataConverted=!1;let{sessionId:t,context:r,tensor:i,dataType:n,shape:a,fallbackDataType:s}=e;this.sessionId=t,this.mlContext=r,this.mlTensor=i,this.dataType=n,this.tensorShape=a,this.fallbackDataType=s}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return An(this.dataType,this.tensorShape)}destroy(){de("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){if(this.fallbackDataType){let t=await this.mlContext.readTensor(this.mlTensor),r=Cn(new Uint8Array(t),this.dataType);if(e){(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(r);return}else return r.buffer}else return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,r){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===r.length&&this.tensorShape.every((i,n)=>i===r[n])}setIsDataConverted(e){this.isDataConverted=e}},Rn=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,r,i){let n=this.tensorManager.getMLContext(e),a=this.tensorManager.getMLOpSupportLimits(e),s;if(!(a!=null&&a.input.dataTypes.includes(t))){if(s=el.get(t),!s||(a==null?void 0:a.input.dataTypes.includes(s)))throw new Error(`WebNN backend does not support data type: ${t}`);de("verbose",()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${t} to ${s}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(n,t,r))return this.wrapper.tensor;if(i){if(this.wrapper.byteLength!==An(t,r))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let o=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,r,o,!0,!0,s),i&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper){if(this.wrapper.fallbackType)if(this.wrapper.fallbackType==="int32")t=va(e,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(t);return}else de("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor()}this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){var t,r;if(this.activeUpload){let i=(t=this.wrapper)!=null&&t.isDataConverted?Cn(this.activeUpload,(r=this.wrapper)==null?void 0:r.type):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(i):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(i);return}else return i.buffer}if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},tl=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}getMLOpSupportLimits(e){return this.backend.getMLOpSupportLimits(e)}reserveTensorId(){let e=zn();return this.tensorTrackersById.set(e,new Rn(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,r,i,n){de("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${r}, shape: ${i}, copyOld: ${n}}`);let a=this.tensorTrackersById.get(t);if(!a)throw new Error("Tensor not found.");return a.ensureTensor(e,r,i,n)}upload(e,t){let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");r.upload(t)}async download(e,t){de("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t==null?void 0:t.byteLength}}`);let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");return r.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,r,i){let n=this.getMLContext(e),a=zn(),s=new On({sessionId:e,context:n,tensor:t,dataType:r,shape:i});return this.tensorTrackersById.set(a,new Rn(this,s)),this.externalTensors.add(s),a}async getCachedTensor(e,t,r,i,n,a,s){let o=this.getMLContext(e);for(let[d,c]of this.freeTensors.entries())if(c.canReuseTensor(o,t,r)){de("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}`);let h=this.freeTensors.splice(d,1)[0];return h.sessionId=e,h}de("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}}`);let l=await o.createTensor({dataType:s??t,shape:r,dimensions:r,usage:i,writable:n,readable:a});return new On({sessionId:e,context:o,tensor:l,dataType:t,shape:r,fallbackDataType:s})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},oh=(...e)=>new tl(...e)}),br,rl,uh,J_=L(()=>{te(),Yt(),sh(),X_(),pt(),br=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),rl=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let r=Object.keys(e).sort(),i=Object.keys(t).sort();return r.length===i.length&&r.every((n,a)=>n===i[a]&&e[n]===t[n])},uh=class{constructor(e){this.tensorManager=oh(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=[],this.temporarySessionTensorIds=new Map,this.mlOpSupportLimitsBySessionId=new Map,ts(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){de("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){de("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let r of t)de("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${r}}`),this.tensorManager.releaseTensorId(r);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let r=this.mlContextCache.findIndex(i=>i.gpuDevice===e);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:i}),i}}else if(e===void 0){let r=this.mlContextCache.findIndex(i=>i.options===void 0&&i.gpuDevice===void 0);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:i}),i}}let t=this.mlContextCache.findIndex(r=>rl(r.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let r=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:r}),r}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let r=this.sessionIdsByMLContext.get(t);r||(r=new Set,this.sessionIdsByMLContext.set(t,r)),r.add(e),this.mlOpSupportLimitsBySessionId.has(e)||this.mlOpSupportLimitsBySessionId.set(e,t.opSupportLimits()),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e),this.mlOpSupportLimitsBySessionId.delete(e);let r=this.sessionIdsByMLContext.get(t);if(r.delete(e),r.size===0){this.sessionIdsByMLContext.delete(t);let i=this.mlContextCache.findIndex(n=>n.mlContext===t);i!==-1&&this.mlContextCache.splice(i,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}getMLOpSupportLimits(e){return this.mlOpSupportLimitsBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){de("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,r,i,n){let a=br.get(r);if(!a)throw new Error(`Unsupported ONNX data type: ${r}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,a,i,n)}async createTemporaryTensor(e,t,r){de("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${r}}`);let i=br.get(t);if(!i)throw new Error(`Unsupported ONNX data type: ${t}`);let n=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,n,i,r,!1);let a=this.temporarySessionTensorIds.get(e);return a?a.push(n):this.temporarySessionTensorIds.set(e,[n]),n}uploadTensor(e,t){if(!be().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");de("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let r=await this.tensorManager.download(e);return rs(r,t)}}registerMLTensor(e,t,r,i){let n=br.get(r);if(!n)throw new Error(`Unsupported ONNX data type: ${r}`);let a=this.tensorManager.registerTensor(e,t,n,i);return de("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${n}, dimensions: ${i}} -> {tensorId: ${a}}`),a}registerMLConstant(e,t,r,i,n,a,s=!1){if(!a)throw new Error("External mounted files are not available.");let o=e;e.startsWith("./")&&(o=e.substring(2));let l=a.get(o);if(!l)throw new Error(`File with name ${o} not found in preloaded files.`);if(t+r>l.byteLength)throw new Error("Out of bounds: data offset and length exceed the external file data size.");let d=l.slice(t,t+r).buffer,c;switch(n.dataType){case"float32":c=new Float32Array(d);break;case"float16":c=typeof Float16Array<"u"&&Float16Array.from?new Float16Array(d):new Uint16Array(d);break;case"int32":c=new Int32Array(d);break;case"uint32":c=new Uint32Array(d);break;case"int64":if(s){let h=va(new Uint8Array(d),"int64");c=new Int32Array(h.buffer),n.dataType="int32"}else c=new BigInt64Array(d);break;case"uint64":c=new BigUint64Array(d);break;case"int8":c=new Int8Array(d);break;case"int4":case"uint4":case"uint8":c=new Uint8Array(d);break;default:throw new Error(`Unsupported data type: ${n.dataType} in creating WebNN Constant from external data.`)}return de("verbose",()=>`[WebNN] registerMLConstant {dataType: ${n.dataType}, shape: ${n.shape}}} ${s?"(Note: it was int64 data type and registered to int32 as workaround)":""}`),i.constant(n,c)}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.push(e)}isGraphInput(e,t){let r=this.sessionGraphInputs.get(e);return r?r.includes(t):!1}isGraphOutput(e,t){let r=this.sessionGraphOutputs.get(e);return r?r.includes(t):!1}isGraphInputOutputTypeSupported(e,t,r=!0){let i=br.get(Bt(t)),n=this.mlOpSupportLimitsBySessionId.get(e);return typeof i>"u"?!1:r?!!(n!=null&&n.input.dataTypes.includes(i)):!!(n!=null&&n.output.dataTypes.includes(i))}flush(){}}}),is=L(()=>{}),Mn,ui,li,il,nl,Bn,xa,al,lh,ew=L(()=>{pt(),is(),Mn=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),ui=[],li=e=>Math.ceil(Number(e)/16)*16,il=e=>{for(let t=0;t<ui.length;t++){let r=ui[t];if(e<=r)return r}return Math.ceil(e/16)*16},nl=1,Bn=()=>nl++,xa=async(e,t,r,i)=>{let n=li(r),a=e.device.createBuffer({size:n,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let s=e.getCommandEncoder();e.endComputePass(),s.copyBufferToBuffer(t,0,a,0,n),e.flush(),await a.mapAsync(GPUMapMode.READ);let o=a.getMappedRange();if(i){let l=i();return l.set(new Uint8Array(o,0,r)),l}else return new Uint8Array(o.slice(0,r))}finally{a.destroy()}},al=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[t]of Mn)ui.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let r=t.buffer,i=t.byteOffset,n=t.byteLength,a=li(n),s=this.storageCache.get(e);if(!s)throw new Error("gpu data for uploading does not exist");if(Number(s.originalSize)!==n)throw new Error(`inconsistent data size. gpu data size=${s.originalSize}, data size=${n}`);let o=this.backend.device.createBuffer({mappedAtCreation:!0,size:a,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC}),l=o.getMappedRange();new Uint8Array(l).set(new Uint8Array(r,i,n)),o.unmap();let d=this.backend.device.createCommandEncoder();d.copyBufferToBuffer(o,0,s.gpuData.buffer,0,a),this.backend.device.queue.submit([d.finish()]),o.destroy(),de("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let r=this.storageCache.get(e);if(!r)throw new Error("source gpu data for memcpy does not exist");let i=this.storageCache.get(t);if(!i)throw new Error("destination gpu data for memcpy does not exist");if(r.originalSize!==i.originalSize)throw new Error("inconsistent source and destination gpu data size");let n=li(r.originalSize),a=this.backend.getCommandEncoder();this.backend.endComputePass(),a.copyBufferToBuffer(r.gpuData.buffer,0,i.gpuData.buffer,0,n)}registerExternalBuffer(e,t,r){let i;if(r){if(i=r[0],e===r[1])return de("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, buffer is the same, skip.`),i;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else i=Bn();return this.storageCache.set(i,{gpuData:{id:i,type:0,buffer:e},originalSize:t}),de("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, registered.`),i}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),de("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let r=il(e),i,n=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,a=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(n||a){let o=(n?this.freeBuffers:this.freeUniformBuffers).get(r);o?o.length>0?i=o.pop():i=this.backend.device.createBuffer({size:r,usage:t}):i=this.backend.device.createBuffer({size:r,usage:t})}else i=this.backend.device.createBuffer({size:r,usage:t});let s={id:Bn(),type:0,buffer:i};return this.storageCache.set(s.id,{gpuData:s,originalSize:Number(e)}),de("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${s.id}`),s}get(e){var t;return(t=this.storageCache.get(e))==null?void 0:t.gpuData}release(e){let t=typeof e=="bigint"?Number(e):e,r=this.storageCache.get(t);if(!r){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return de("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${r.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(r.gpuData.buffer),r.originalSize}async download(e,t){let r=this.storageCache.get(Number(e));if(!r)throw new Error("data does not exist");await xa(this.backend,r.gpuData.buffer,r.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=Mn.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let r=this.freeBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let r=this.freeUniformBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(r=>{r.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&(de("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(r=>{r.gpuData.buffer.destroy()}),this.storageCache=new Map)}},lh=(...e)=>new al(...e)}),sl,ge,Ie=L(()=>{sl=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},ge=e=>new sl(e)}),or,di,ke,ze,Z,Se,Sa,rr,xt,Q,$r,D,Y,dh,ns,ol,ph,ne=L(()=>{te(),ie(),or=64,di=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},ke=(e,t=1)=>{let r=di(e,t);return typeof r=="string"?r:r[0]},ze=(e,t=1)=>{let r=di(e,t);return typeof r=="string"?r:r[1]},Z=(...e)=>{let t=[];return e.forEach(r=>{r.length!==0&&t.push({type:12,data:r},{type:12,data:M.computeStrides(r)})}),t},Se=e=>e%4===0?4:e%2===0?2:1,Sa=(e="f32",t,r="0")=>!t||t===1?`${e}(${r})`:`vec${t}<${e}>(${r})`,rr=(e,t,r)=>e==="f32"?r:t===1?`f32(${r})`:`vec${t}<f32>(${r})`,xt=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,Q=(e,t,r,i)=>e.startsWith("uniforms.")&&r>4?typeof t=="string"?i==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:i==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:r>1?`${e}[${t}]`:e,$r=(e,t,r,i,n)=>{let a=typeof r=="number",s=a?r:r.length,o=[...new Array(s).keys()],l=s<2?"u32":s<=4?`vec${s}<u32>`:`array<u32, ${s}>`,d=di(t,n),c=typeof d=="string"?d:d[1],h=typeof d=="string"?d:d[0],f={indices:l,value:c,storage:h,tensor:t},y=P=>typeof P=="string"?P:`${P}u`,_={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},w=a?"uniforms.":"",S=`${w}${e}_shape`,$=`${w}${e}_strides`,b="";for(let P=0;P<s-1;P++)b+=`
    let dim${P} = current / ${Q($,P,s)};
    let rest${P} = current % ${Q($,P,s)};
    indices[${P}] = dim${P};
    current = rest${P};
    `;b+=`indices[${s-1}] = current;`;let T=s<2?"":`
  fn o2i_${e}(offset: u32) -> ${f.indices} {
    var indices: ${f.indices};
    var current = offset;
    ${b}
    return indices;
  }`,I=P=>(_.offsetToIndices=!0,s<2?P:`o2i_${e}(${P})`),E=[];if(s>=2)for(let P=s-1;P>=0;P--)E.push(`${Q($,P,s)} * (indices[${P}])`);let A=s<2?"":`
  fn i2o_${e}(indices: ${f.indices}) -> u32 {
    return ${E.join("+")};
  }`,O=P=>(_.indicesToOffset=!0,s<2?P:`i2o_${e}(${P})`),x=(...P)=>s===0?"0u":`${f.indices}(${P.map(y).join(",")})`,z=(P,U)=>s<2?`${P}`:`${Q(P,U,s)}`,N=(P,U,J)=>s<2?`${P}=${J};`:`${Q(P,U,s)}=${J};`,q={},G=(P,U)=>{_.broadcastedIndicesToOffset=!0;let J=`${U.name}broadcastedIndicesTo${e}Offset`;if(J in q)return`${J}(${P})`;let ee=[];for(let _e=s-1;_e>=0;_e--){let He=U.indicesGet("outputIndices",_e+U.rank-s);ee.push(`${z($,_e)} * (${He} % ${z(S,_e)})`)}return q[J]=`fn ${J}(outputIndices: ${U.type.indices}) -> u32 {
             return ${ee.length>0?ee.join("+"):"0u"};
           }`,`${J}(${P})`},H=(P,U)=>(()=>{if(f.storage===f.value)return`${e}[${P}]=${U};`;if(f.storage==="vec2<u32>"&&f.value==="i32")return`${e}[${P}]=vec2<u32>(u32(${U}), select(0u, 0xFFFFFFFFu, ${U} < 0));`;if(f.storage==="vec2<u32>"&&f.value==="u32")return`${e}[${P}]=vec2<u32>(u32(${U}), 0u);`;if(f.storage==="u32"&&f.value==="vec4<bool>")return`${e}[${P}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${U}));`;throw new Error(`not supported combination of storage type ${f.storage} and value type ${f.value} yet`)})(),R=P=>(()=>{if(f.storage===f.value)return`${e}[${P}]`;if(f.storage==="vec2<u32>"&&f.value==="i32")return`i32(${e}[${P}].x)`;if(f.storage==="vec2<u32>"&&f.value==="u32")return`u32(${e}[${P}].x)`;if(f.storage==="u32"&&f.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${P}] & 0xFFu), bool(${e}[${P}] & 0xFF00u), bool(${e}[${P}] & 0xFF0000u), bool(${e}[${P}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${f.storage} and value type ${f.value} yet`)})(),F=s<2?"":`
  fn get_${e}ByIndices(indices: ${f.indices}) -> ${c} {
    return ${R(`i2o_${e}(indices)`)};
  }`,K=s<2?"":(()=>{let P=o.map(J=>`d${J}: u32`).join(", "),U=o.map(J=>`d${J}`).join(", ");return`
  fn get_${e}(${P}) -> ${c} {
    return get_${e}ByIndices(${x(U)});
  }`})(),X=(...P)=>{if(P.length!==s)throw new Error(`indices length must be ${s}`);let U=P.map(y).join(",");return s===0?R("0u"):s===1?R(U[0]):(_.get=!0,_.getByIndices=!0,_.indicesToOffset=!0,`get_${e}(${U})`)},ue=P=>s<2?R(P):(_.getByIndices=!0,_.indicesToOffset=!0,`get_${e}ByIndices(${P})`),W=s<2?"":`
  fn set_${e}ByIndices(indices: ${f.indices}, value: ${c}) {
    ${H(`i2o_${e}(indices)`,"value")}
  }`,fe=s<2?"":(()=>{let P=o.map(J=>`d${J}: u32`).join(", "),U=o.map(J=>`d${J}`).join(", ");return`
  fn set_${e}(${P}, value: ${c}) {
    set_${e}ByIndices(${x(U)}, value);
  }`})();return{impl:()=>{let P=[],U=!1;return _.offsetToIndices&&(P.push(T),U=!0),_.indicesToOffset&&(P.push(A),U=!0),_.broadcastedIndicesToOffset&&(Object.values(q).forEach(J=>P.push(J)),U=!0),_.set&&(P.push(fe),U=!0),_.setByIndices&&(P.push(W),U=!0),_.get&&(P.push(K),U=!0),_.getByIndices&&(P.push(F),U=!0),!a&&U&&P.unshift(`const ${S} = ${f.indices}(${r.join(",")});`,`const ${$} = ${f.indices}(${M.computeStrides(r).join(",")});`),P.join(`
`)},type:f,offsetToIndices:I,indicesToOffset:O,broadcastedIndicesToOffset:G,indices:x,indicesGet:z,indicesSet:N,set:(...P)=>{if(P.length!==s+1)throw new Error(`indices length must be ${s}`);let U=P[s];if(typeof U!="string")throw new Error("value must be string");let J=P.slice(0,s).map(y).join(",");return s===0?H("0u",U):s===1?H(J[0],U):(_.set=!0,_.setByIndices=!0,_.indicesToOffset=!0,`set_${e}(${J}, ${U})`)},setByOffset:H,setByIndices:(P,U)=>s<2?H(P,U):(_.setByIndices=!0,_.indicesToOffset=!0,`set_${e}ByIndices(${P}, ${U});`),get:X,getByOffset:R,getByIndices:ue,usage:i,name:e,strides:$,shape:S,rank:s}},D=(e,t,r,i=1)=>$r(e,t,r,"input",i),Y=(e,t,r,i=1)=>$r(e,t,r,"output",i),dh=(e,t,r)=>$r(e,t,r,"atomicOutput",1),ns=(e,t,r,i=1)=>$r(e,t,r,"internal",i),ol=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=or){let t=typeof e=="number"?e:e[0],r=typeof e=="number"?1:e[1],i=typeof e=="number"?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||r>this.limits.maxComputeWorkgroupSizeY||i>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*r*i>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let n=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,a=n?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,s=n?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${t*r*i}u + local_idx;`;return`@compute @workgroup_size(${t}, ${r}, ${i})
  fn main(${a}) {
    ${s}
  `}appendVariableUniforms(e){e.rank!==0&&(e.shape.startsWith("uniforms.")&&this.uniforms.push({name:e.shape.replace("uniforms.",""),type:"u32",length:e.rank}),e.strides.startsWith("uniforms.")&&this.uniforms.push({name:e.strides.replace("uniforms.",""),type:"u32",length:e.rank}))}declareVariable(e,t){if(e.usage==="internal")throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(e),this.appendVariableUniforms(e);let r=e.usage==="input"?"read":"read_write",i=e.usage==="atomicOutput"?"atomic<i32>":e.type.storage;return`@group(0) @binding(${t}) var<storage, ${r}> ${e.name}: array<${i}>;`}declareVariables(...e){return e.map(t=>this.declareVariable(t,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if(e.usage!=="internal")throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(t=>this.registerInternalVariable(t)),this}registerUniform(e,t,r=1){return this.uniforms.push({name:e,type:t,length:r}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(this.uniforms.length===0)return"";let e=[];for(let{name:t,type:r,length:i}of this.uniforms)if(i&&i>4)r==="f16"?e.push(`@align(16) ${t}:array<mat2x4<${r}>, ${Math.ceil(i/8)}>`):e.push(`${t}:array<vec4<${r}>, ${Math.ceil(i/4)}>`);else{let n=i==null||i===1?r:`vec${i}<${r}>`;e.push(`${t}:${n}`)}return`
      struct Uniforms { ${e.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=t=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(t)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},ph=(e,t)=>new ol(e,t)}),ul,Dn,ll,dl,pl,cl,We,ch,hh,St=L(()=>{te(),ie(),Ie(),ne(),ul=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},Dn=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),ll=(e,t)=>M.sortBasedOnPerm(e,Dn(e.length,t)),dl=(e,t,r,i)=>{let n=`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`;for(let a=0;a<t;++a)n+=`a[${e[a]}]=i[${a}];`;return n+="return a;}"},pl=(e,t)=>{let r=[],i=[];for(let n=0;n<e.length;++n)e[n]!==1&&r.push(e[n]),e[t[n]]!==1&&i.push(t[n]);return{newShape:r,newPerm:i}},cl=(e,t)=>{let r=0;for(let i=0;i<e.length;++i)if(t[e[i]]!==1){if(e[i]<r)return!1;r=e[i]}return!0},We=(e,t)=>{let r=e.dataType,i=e.dims.length,n=Dn(i,t),a=ll(e.dims,n),s=e.dims,o=a,l=i<2||cl(n,e.dims),d;if(l)return d=_=>{let w=D("input",r,s,4),S=Y("output",r,o,4);return`
  ${_.registerUniform("output_size","u32").declareVariables(w,S)}
  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let _=M.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(_/64/4)},programUniforms:[{type:12,data:Math.ceil(_/4)}]}},getShaderSource:d};let{newShape:c,newPerm:h}=pl(e.dims,n),f=M.areEqual(h,[2,3,1]),y=M.areEqual(h,[3,1,2]);if(c.length===2||f||y){s=f?[c[0],c[1]*c[2]]:y?[c[0]*c[1],c[2]]:c,o=[s[1],s[0]];let _=16;return d=w=>{let S=D("a",r,s.length),$=Y("output",r,o.length);return`
  ${w.registerUniform("output_size","u32").declareVariables(S,$)}
  var<workgroup> tile : array<array<${$.type.value}, ${_+1}>, ${_}>;
  ${w.mainStart([_,_,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${_} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${_}u + local_id.x;
    let input_row = workgroup_id_x * ${_}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${S.getByIndices(`${S.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${_}u + local_id.x;
    let output_row = workgroup_id_y * ${_}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${$.setByIndices(`${$.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let w=M.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(o[1]/_),y:Math.ceil(o[0]/_)},programUniforms:[{type:12,data:w},...Z(s,o)]}},getShaderSource:d}}return d=_=>{let w=D("a",r,s.length),S=Y("output",r,o.length);return`
  ${_.registerUniform("output_size","u32").declareVariables(w,S)}

  ${dl(n,i,w,S)}

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${S.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${S.setByOffset("global_idx",w.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let _=M.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(_/64)},programUniforms:[{type:12,data:_},...Z(s,o)]}},getShaderSource:d}},ch=(e,t)=>{ul(e.inputs,t.perm),e.compute(We(e.inputs[0],t.perm))},hh=e=>ge({perm:e.perm})}),hl,fl,ml,gl,yl,_l,wl,bl,$l,vl,Ke,fh,mh,gh,yh,_h,wh,bh,$h,vh,xh,tw=L(()=>{te(),ie(),ne(),as(),St(),hl={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},fl={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},ml={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},gl={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},yl=(e,t)=>{let r=[];for(let i=t-e;i<t;++i)r.push(i);return r},_l=(e,t)=>{let r=[],i=e.length;for(let a=0;a<i;a++)t.indexOf(a)===-1&&r.push(e[a]);let n=t.map(a=>e[a]);return[r,n]},wl=(e,t)=>{let r=e.length+t.length,i=[],n=0;for(let a=0;a<r;a++)t.indexOf(a)===-1?i.push(e[n++]):i.push(1);return i},bl=(e,t)=>{for(let r=0;r<e.length;++r)if(e[e.length-r-1]!==t-1-r)return!1;return!0},$l=(e,t)=>{let r=[];if(!bl(e,t)){for(let i=0;i<t;++i)e.indexOf(i)===-1&&r.push(i);e.forEach(i=>r.push(i))}return r},vl=(e,t,r,i,n,a,s)=>{let o=r[0].dims,l=M.size(a),d=M.size(s),c=D("_A",r[0].dataType,o),h=Y("output",n,a),f=64;l===1&&(f=256);let y=`
          var<workgroup> aBestValues : array<f32, ${f}>;
       `,_=w=>`
        ${w.registerUniform("reduceSize","u32").declareVariables(c,h)}
        ${y}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${w.mainStart(f)}

          let outputIndex = global_idx / ${f};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${ml[i]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${f}) {
           let candidate = f32(${c.getByOffset("offset + k")});
           bestValue = ${hl[i]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${f}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${fl[i]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${h.setByOffset("outputIndex",`${i==="mean"?`${h.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${h.type.storage}(${gl[i]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${f}`,inputDependencies:["type"]},getShaderSource:_,getRunData:()=>({outputs:[{dims:a,dataType:n}],dispatchGroup:{x:l},programUniforms:[{type:12,data:d}]})}},Ke=(e,t,r,i)=>{let n=e.inputs.length===1?r:Ia(e.inputs,r),a=n.axes;a.length===0&&!n.noopWithEmptyAxes&&(a=e.inputs[0].dims.map((y,_)=>_));let s=M.normalizeAxes(a,e.inputs[0].dims.length),o=s,l=e.inputs[0],d=$l(o,e.inputs[0].dims.length);d.length>0&&(l=e.compute(We(e.inputs[0],d),{inputs:[0],outputs:[-1]})[0],o=yl(o.length,l.dims.length));let[c,h]=_l(l.dims,o),f=c;n.keepDims&&(f=wl(c,s)),e.compute(vl(t,n.cacheKey,[l],i,e.inputs[0].dataType,f,h),{inputs:[l]})},fh=(e,t)=>{Ke(e,"ReduceMeanShared",t,"mean")},mh=(e,t)=>{Ke(e,"ReduceL1Shared",t,"l1")},gh=(e,t)=>{Ke(e,"ReduceL2Shared",t,"l2")},yh=(e,t)=>{Ke(e,"ReduceLogSumExpShared",t,"logSumExp")},_h=(e,t)=>{Ke(e,"ReduceMaxShared",t,"max")},wh=(e,t)=>{Ke(e,"ReduceMinShared",t,"min")},bh=(e,t)=>{Ke(e,"ReduceProdShared",t,"prod")},$h=(e,t)=>{Ke(e,"ReduceSumShared",t,"sum")},vh=(e,t)=>{Ke(e,"ReduceSumSquareShared",t,"sumSquare")},xh=(e,t)=>{Ke(e,"ReduceLogSumShared",t,"logSum")}}),Ye,xl,Ri,Ia,Qe,Sl,Il,Tl,kl,El,Cl,zl,Al,Ol,Rl,Ze,Sh,Ih,Th,kh,Eh,Ch,zh,Ah,Oh,Rh,as=L(()=>{te(),ie(),Ie(),ne(),tw(),Ye=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},xl=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],Ri=(e,t,r,i,n,a,s=!1,o=!1)=>{let l=[],d=r[0].dims,c=d.length,h=M.normalizeAxes(n,c),f=!o&&h.length===0;d.forEach((w,S)=>{f||h.indexOf(S)>=0?s&&l.push(1):l.push(w)});let y=l.length,_=M.size(l);return{name:e,shaderCache:t,getShaderSource:w=>{let S=[],$=D("_A",r[0].dataType,c),b=Y("output",a,y),T=i($,b,h),I=T[2];for(let E=0,A=0;E<c;E++)f||h.indexOf(E)>=0?(s&&A++,I=`for(var j${E}: u32 = 0; j${E} < ${d[E]}; j${E}++) {
                  ${T[2].includes("last_index")?`let last_index = j${E};`:""}
                  ${$.indicesSet("input_indices",E,`j${E}`)}
                  ${I}
                }`):(S.push(`${$.indicesSet("input_indices",E,b.indicesGet("output_indices",A))};`),A++);return`

        ${w.registerUniform("output_size","u32").declareVariables($,b)}

        ${w.mainStart()}
          ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${$.type.indices};
          let output_indices = ${b.offsetToIndices("global_idx")};

          ${S.join(`
`)}
          ${T[0]}       // init ops for reduce max/min
          ${T[1]}
          ${I}
          ${T[3]}
          ${T.length===4?b.setByOffset("global_idx","value"):T.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:l,dataType:a}],dispatchGroup:{x:Math.ceil(_/64)},programUniforms:[{type:12,data:_},...Z(d,l)]})}},Ia=(e,t)=>{let r=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(i=>r.push(Number(i))),ge({axes:r,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},Qe=(e,t,r,i)=>{let n=e.inputs,a=n.length===1?r:Ia(n,r);e.compute(Ri(t,{hint:a.cacheKey,inputDependencies:["rank"]},[n[0]],a.noopWithEmptyAxes&&a.axes.length===0?xl:i,a.axes,n[0].dataType,a.keepDims,a.noopWithEmptyAxes),{inputs:[0]})},Sl=(e,t)=>{Ye(e.inputs),Qe(e,"ReduceLogSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,"value = log(value);"])},Il=(e,t)=>{Ye(e.inputs),Qe(e,"ReduceL1",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += abs(${r.getByIndices("input_indices")});`,""])},Tl=(e,t)=>{Ye(e.inputs),Qe(e,"ReduceL2",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},kl=(e,t)=>{Ye(e.inputs),Qe(e,"ReduceLogSumExp",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += exp(${r.getByIndices("input_indices")});`,"value = log(value);"])},El=(e,t)=>{Ye(e.inputs),Qe(e,"ReduceMax",t,(r,i,n)=>{let a=[];for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&a.push(r.indicesSet("input_indices",s,0));return[`${a.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = max(value, ${r.getByIndices("input_indices")});`,""]})},Cl=(e,t)=>{Ye(e.inputs),Qe(e,"ReduceMean",t,(r,i,n)=>{let a=1;for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&(a*=e.inputs[0].dims[s]);return["var sum = f32(0);","",`sum += f32(${r.getByIndices("input_indices")});`,`let value = ${i.type.value}(sum / ${a});`]})},zl=(e,t)=>{Ye(e.inputs),Qe(e,"ReduceMin",t,(r,i,n)=>{let a=[];for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&a.push(`input_indices[${s}] = 0;`);return[`${a.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = min(value, ${r.getByIndices("input_indices")});`,""]})},Al=(e,t)=>{Ye(e.inputs),Qe(e,"ReduceProd",t,(r,i)=>[`var value = ${i.type.storage}(1);`,"",`value *= ${r.getByIndices("input_indices")};`,""])},Ol=(e,t)=>{Ye(e.inputs),Qe(e,"ReduceSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,""])},Rl=(e,t)=>{Ye(e.inputs),Qe(e,"ReduceSumSquare",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += t * t;`,""])},Ze=(e,t,r)=>{if(t.length===0)return r;let i=1,n=1;for(let a=0;a<t.length;a++)t.indexOf(a)===-1?i*=e[a]:n*=e[a];return n<32&&i>1024},Sh=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Cl(e,t):fh(e,t)},Ih=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Il(e,t):mh(e,t)},Th=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Tl(e,t):gh(e,t)},kh=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?kl(e,t):yh(e,t)},Eh=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?El(e,t):_h(e,t)},Ch=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?zl(e,t):wh(e,t)},zh=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Al(e,t):bh(e,t)},Ah=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Ol(e,t):$h(e,t)},Oh=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Rl(e,t):vh(e,t)},Rh=(e,t)=>{Ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Sl(e,t):xh(e,t)}}),Nn,Mh,Bh,Ta,rw=L(()=>{te(),Ie(),as(),Nn=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},Mh=(e,t)=>{Nn(e.inputs);let r=(i,n,a)=>{let s=[];for(let o=0;o<i.rank;o++)(a.indexOf(o)>=0||a.length===0)&&s.push(`input_indices[${o}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",n.setByOffset("global_idx","best_index")]};e.compute(Ri("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},Bh=(e,t)=>{Nn(e.inputs);let r=(i,n,a)=>{let s=[];for(let o=0;o<i.rank;o++)(a.indexOf(o)>=0||a.length===0)&&s.push(`input_indices[${o}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",n.setByOffset("global_idx","best_index")]};e.compute(Ri("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},Ta=e=>ge(e)}),Ml,pi,Bl,Dl,Nl,Ur,Pl,Dh,ss=L(()=>{te(),ie(),is(),ne(),Ml=(e,t)=>{let r=e[0],i=e[1],n=e[2],a=e[3],s=e[4],o=e[5];if(s&&o)throw new Error("Attention cannot have both past and attention_bias");if(r.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let l=r.dims[0],d=r.dims[1],c=r.dims[2];if(n.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(i.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(i.dims[0]!==c)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(n.dims[0]!==i.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let h=n.dims[0]/3,f=h,y=f;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let T of t.qkvHiddenSizes)if(T%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");h=t.qkvHiddenSizes[0],f=t.qkvHiddenSizes[1],y=t.qkvHiddenSizes[2]}let _=d;if(h!==f)throw new Error("qkv_hidden_sizes first element should be same as the second");if(n.dims[0]!==h+f+y)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let w=0;if(s){if(f!==y)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(s.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(s.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(s.dims[1]!==l)throw new Error('Input "past" second dimension must be batch_size');if(s.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(s.dims[4]!==f/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||(w=s.dims[3])}let S=_+w,$=-1,b=0;if(a)throw new Error("Mask not supported");if(s)throw new Error("past is not supported");if(o){if(o.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(o.dims[0]!==l||o.dims[1]!==t.numHeads||o.dims[2]!==d||o.dims[3]!==S)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:l,sequenceLength:d,pastSequenceLength:w,kvSequenceLength:_,totalSequenceLength:S,maxSequenceLength:$,inputHiddenSize:c,hiddenSize:h,vHiddenSize:y,headSize:Math.floor(h/t.numHeads),vHeadSize:Math.floor(y/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:b,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},pi=(e,t,r)=>t&&e?`
      let total_sequence_length_input = u32(${t.getByOffset("0")});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${e==null?void 0:e.getByOffset("batchIdx")}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       `:`
    ${r?"let past_sequence_length = uniforms.past_sequence_length":""};
    let present_sequence_length = total_sequence_length;
    `,Bl=(e,t,r,i,n,a,s,o)=>{let l=Se(s?1:a),d=64,c=a/l;c<d&&(d=32);let h=Math.ceil(a/l/d),f=[{type:12,data:t},{type:12,data:r},{type:12,data:i},{type:12,data:n},{type:12,data:c},{type:12,data:h}],y=ke(e.dataType,l),_=ze(1,l),w=["type"];s&&w.push("type"),o&&w.push("type");let S=$=>{let b=Y("x",e.dataType,e.dims,l),T=[b],I=s?D("seq_lens",s.dataType,s.dims):void 0;I&&T.push(I);let E=o?D("total_sequence_length_input",o.dataType,o.dims):void 0;E&&T.push(E);let A=ze(e.dataType),O=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${d}>;
  var<workgroup> thread_sum: array<f32, ${d}>;
  ${$.registerUniforms(O).declareVariables(...T)}
  ${$.mainStart([d,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${pi(I,E,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${d}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${s?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${_}(-3.4028234663852886e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${_}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(l){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.4028234663852886e+38f);
    for (var i = 0u; i < ${d}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${_}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${_}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(l){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${d}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${b.type.value}(${A}(1.0) / ${A}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${_}(x[offset + i]);
        x[offset + i] = ${b.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${s?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${b.type.value}(${A}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${d};${y};${l}`,inputDependencies:w},getShaderSource:S,getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:n,z:t*r},programUniforms:f})}},Dl=(e,t,r,i,n,a,s,o,l)=>{let d=s+a.kvSequenceLength,c=[a.batchSize,a.numHeads,a.sequenceLength,d],h=e>1&&i,f=a.kvNumHeads?a.kvNumHeads:a.numHeads,y=h?[a.batchSize,f,d,a.headSize]:void 0,_=a.nReps?a.nReps:1,w=a.scale===0?1/Math.sqrt(a.headSize):a.scale,S=Se(a.headSize),$=a.headSize/S,b=12,T={x:Math.ceil(d/b),y:Math.ceil(a.sequenceLength/b),z:a.batchSize*a.numHeads},I=[{type:12,data:a.sequenceLength},{type:12,data:$},{type:12,data:d},{type:12,data:a.numHeads},{type:12,data:a.headSize},{type:1,data:w},{type:12,data:s},{type:12,data:a.kvSequenceLength},{type:12,data:_}],E=h&&i&&M.size(i.dims)>0,A=["type","type"];E&&A.push("type"),n&&A.push("type"),o&&A.push("type"),l&&A.push("type");let O=[{dims:c,dataType:t.dataType,gpuDataType:0}];h&&O.push({dims:y,dataType:t.dataType,gpuDataType:0});let x=z=>{let N=D("q",t.dataType,t.dims,S),q=D("key",r.dataType,r.dims,S),G=[N,q];if(E){let W=D("past_key",i.dataType,i.dims,S);G.push(W)}n&&G.push(D("attention_bias",n.dataType,n.dims));let H=o?D("seq_lens",o.dataType,o.dims):void 0;H&&G.push(H);let R=l?D("total_sequence_length_input",l.dataType,l.dims):void 0;R&&G.push(R);let F=Y("output",t.dataType,c),K=[F];h&&K.push(Y("present_key",t.dataType,y,S));let X=ze(1,S),ue=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${b}u;

  var<workgroup> tileQ: array<${N.type.storage}, ${b*b}>;
  var<workgroup> tileK: array<${N.type.storage}, ${b*b}>;
  ${z.registerUniforms(ue).declareVariables(...G,...K)}
  ${z.mainStart([b,b,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${_===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${_===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${pi(H,R,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${E&&h?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${h?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${X}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${E&&h?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${h?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${X}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(S){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${S}`)}})()};
        output[outputIdx] = ${F.type.value} (sum * uniforms.alpha) + ${n?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${S};${n!==void 0};${i!==void 0};${e}`,inputDependencies:A},getRunData:()=>({outputs:O,dispatchGroup:T,programUniforms:I}),getShaderSource:x}},Nl=(e,t,r,i,n,a,s=void 0,o=void 0)=>{let l=a+n.kvSequenceLength,d=n.nReps?n.nReps:1,c=n.vHiddenSize*d,h=e>1&&i,f=n.kvNumHeads?n.kvNumHeads:n.numHeads,y=h?[n.batchSize,f,l,n.headSize]:void 0,_=[n.batchSize,n.sequenceLength,c],w=12,S={x:Math.ceil(n.vHeadSize/w),y:Math.ceil(n.sequenceLength/w),z:n.batchSize*n.numHeads},$=[{type:12,data:n.sequenceLength},{type:12,data:l},{type:12,data:n.vHeadSize},{type:12,data:n.numHeads},{type:12,data:n.headSize},{type:12,data:c},{type:12,data:a},{type:12,data:n.kvSequenceLength},{type:12,data:d}],b=h&&i&&M.size(i.dims)>0,T=["type","type"];b&&T.push("type"),s&&T.push("type"),o&&T.push("type");let I=[{dims:_,dataType:t.dataType,gpuDataType:0}];h&&I.push({dims:y,dataType:t.dataType,gpuDataType:0});let E=A=>{let O=D("probs",t.dataType,t.dims),x=D("v",r.dataType,r.dims),z=[O,x];b&&z.push(D("past_value",i.dataType,i.dims));let N=s?D("seq_lens",s.dataType,s.dims):void 0;s&&z.push(N);let q=o?D("total_sequence_length_input",o.dataType,o.dims):void 0;o&&z.push(q);let G=[Y("output",t.dataType,_)];h&&G.push(Y("present_value",t.dataType,y));let H=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${w}u;
  var<workgroup> tileQ: array<${O.type.value}, ${w*w}>;
  var<workgroup> tileV: array<${O.type.value}, ${w*w}>;
  ${A.registerUniforms(H).declareVariables(...z,...G)}
  ${A.mainStart([w,w,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${d===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${d===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${pi(N,q,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${b&&h?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${h?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${O.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${b&&h?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${h?`
            if (w + local_id.y < present_sequence_length) {
          present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileV[idx];
        }`:""}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < total_sequence_length; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileV[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + headIdx * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`};return{name:"AttentionScore",shaderCache:{hint:`${i!==void 0};${e}`,inputDependencies:T},getRunData:()=>({outputs:I,dispatchGroup:S,programUniforms:$}),getShaderSource:E}},Ur=(e,t,r,i,n,a,s,o,l,d,c=void 0,h=void 0)=>{let f=Math.min(e.outputCount,1+(s?1:0)+(o?1:0)),y=f>1?d.pastSequenceLength:0,_=y+d.kvSequenceLength,w=l&&M.size(l.dims)>0?l:void 0,S=[t,r];f>1&&s&&M.size(s.dims)>0&&S.push(s),w&&S.push(w),c&&S.push(c),h&&S.push(h);let $=e.compute(Dl(f,t,r,s,w,d,y,c,h),{inputs:S,outputs:f>1?[-1,1]:[-1]})[0];e.compute(Bl($,d.batchSize,d.numHeads,y,d.sequenceLength,_,c,h),{inputs:c&&h?[$,c,h]:[$],outputs:[]});let b=[$,i];f>1&&o&&M.size(o.dims)>0&&b.push(o),c&&b.push(c),h&&b.push(h),e.compute(Nl(f,$,i,o,d,y,c,h),{inputs:b,outputs:f>1?[0,2]:[0]})},Pl=(e,t)=>{let r=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],i=t.sequenceLength,n=t.inputHiddenSize,a=t.headSize,s=12,o={x:Math.ceil(t.headSize/s),y:Math.ceil(t.sequenceLength/s),z:t.batchSize*t.numHeads},l=[e.inputs[0],e.inputs[1],e.inputs[2]],d=[{type:12,data:i},{type:12,data:n},{type:12,data:a},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],c=h=>{let f=Y("output_q",l[0].dataType,r),y=Y("output_k",l[0].dataType,r),_=Y("output_v",l[0].dataType,r),w=D("input",l[0].dataType,l[0].dims),S=D("weight",l[1].dataType,l[1].dims),$=D("bias",l[2].dataType,l[2].dims),b=w.type.storage,T=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${s}u;
  var<workgroup> tileInput: array<${b}, ${s*s}>;
  var<workgroup> tileWeightQ: array<${b}, ${s*s}>;
  var<workgroup> tileWeightK: array<${b}, ${s*s}>;
  var<workgroup> tileWeightV: array<${b}, ${s*s}>;
  ${h.registerUniforms(T).declareVariables(w,S,$,f,y,_)}
  ${h.mainStart([s,s,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${b}(0);
    var valueK = ${b}(0);
    var valueV = ${b}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:o,programUniforms:d}),getShaderSource:c},{inputs:l,outputs:[-1,-1,-1]})},Dh=(e,t)=>{let r=Ml(e.inputs,t),[i,n,a]=Pl(e,r);return Ur(e,i,n,a,e.inputs[4],void 0,void 0,void 0,e.inputs[5],r)}}),Ul,Ll,Wl,Nh,iw=L(()=>{Ve(),te(),ie(),Ie(),ne(),Ul=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let r=(i,n,a)=>{let s=n.length;if(s!==i.length)throw new Error(`${a}: num dimensions != ${s}`);n.forEach((o,l)=>{if(o!==i[l])throw new Error(`${a}: dim[${l}] do not match`)})};if(e[0].dims.length>1){let i=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);r(e[1].dims,i,"Invalid input scale"),r(e[2].dims,i,"Invalid input B"),r(e[3].dims,i,"Invalid input mean"),r(e[4].dims,i,"Invalid input var")}else r(e[1].dims,[1],"Invalid input scale"),r(e[2].dims,[1],"Invalid input B"),r(e[3].dims,[1],"Invalid input mean"),r(e[4].dims,[1],"Invalid input var")},Ll=(e,t)=>{let{epsilon:r,spatial:i,format:n}=t,a=e[0].dims,s=i?Se(a[a.length-1]):1,o=n==="NHWC"&&a.length>1?s:1,l=M.size(a)/s,d=i,c=d?a.length:a,h=D("x",e[0].dataType,e[0].dims,s),f=D("scale",e[1].dataType,e[1].dims,o),y=D("bias",e[2].dataType,e[2].dims,o),_=D("inputMean",e[3].dataType,e[3].dims,o),w=D("inputVar",e[4].dataType,e[4].dims,o),S=Y("y",e[0].dataType,c,s),$=()=>{let T="";if(i)T=`let cOffset = ${a.length===1?"0u":n==="NHWC"?`outputIndices[${a.length-1}] / ${s}`:"outputIndices[1]"};`;else if(n==="NCHW")T=`
            ${S.indicesSet("outputIndices","0","0")}
            let cOffset = ${S.indicesToOffset("outputIndices")};`;else{T=`var cIndices = ${f.type.indices}(0);
                       cIndices[0] = outputIndices[${a.length-1}];`;for(let I=1;I<f.rank;I++)T+=`cIndices[${I}] = outputIndices[${I}];`;T+=`let cOffset = ${f.indicesToOffset("cIndices")};`}return T},b=T=>`
  const epsilon = ${r};
  ${T.registerUniform("outputSize","u32").declareVariables(h,f,y,_,w,S)}
  ${T.mainStart()}
  ${T.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${S.offsetToIndices(`global_idx * ${s}`)};
    ${$()}
    let scale = ${f.getByOffset("cOffset")};
    let bias = ${y.getByOffset("cOffset")};
    let inputMean = ${_.getByOffset("cOffset")};
    let inputVar = ${w.getByOffset("cOffset")};
    let x = ${h.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${S.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${i}_${s}`,inputDependencies:d?["rank","type","type","type","type"]:void 0},getShaderSource:b,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:d?[{type:12,data:l},...Z(a)]:[{type:12,data:l}]})}},Wl=e=>ge(e),Nh=(e,t)=>{let{inputs:r,outputCount:i}=e,n=Wl({...t,outputCount:i});if(xe.webgpu.validateInputContent&&Ul(r,n),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(Ll(r,n))}}),ql,Vl,Ph,nw=L(()=>{ie(),ne(),ql=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},Vl=e=>{let t=e[0].dims,r=e[0].dims[2],i=M.size(t)/4,n=e[0].dataType,a=D("input",n,t,4),s=D("bias",n,[r],4),o=D("residual",n,t,4),l=Y("output",n,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)}}),getShaderSource:d=>`
  const channels = ${r}u / 4;
  ${d.declareVariables(a,s,o,l)}

  ${d.mainStart()}
    ${d.guardAgainstOutOfBoundsWorkgroupSizes(i)}
    let value = ${a.getByOffset("global_idx")}
      + ${s.getByOffset("global_idx % channels")} + ${o.getByOffset("global_idx")};
    ${l.setByOffset("global_idx","value")}
  }`}},Ph=e=>{ql(e.inputs),e.compute(Vl(e.inputs))}}),Gl,ce,Uh,Lh,Wh,qh,Vh,Gh,Hh,Fh,jh,Hl,Kh,Yh,Qh,Zh,zr,Xh,vi,Jh,ef,tf,rf,nf,af,sf,of,uf,lf,df,pf,cf,hf,ff,mf,Pn,gf,ka,Ea,yf,_f,wf,Fl,jl,bf,os=L(()=>{te(),ie(),Ie(),ne(),Gl=(e,t,r,i,n,a,s)=>{let o=Math.ceil(t/4),l="";typeof n=="string"?l=`${n}(a)`:l=n("a");let d=D("inputData",r,[o],4),c=Y("outputData",i,[o],4),h=[{name:"vec_size",type:"u32"}];return s&&h.push(...s),`
      ${e.registerUniforms(h).declareVariables(d,c)}

  ${a??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${d.getByOffset("global_idx")};
    ${c.setByOffset("global_idx",l)}
  }`},ce=(e,t,r,i,n,a=e.dataType,s,o)=>{let l=[{type:12,data:Math.ceil(M.size(e.dims)/4)}];return s&&l.push(...s),{name:t,shaderCache:{hint:n,inputDependencies:["type"]},getShaderSource:d=>Gl(d,M.size(e.dims),e.dataType,a,r,i,o),getRunData:d=>({outputs:[{dims:e.dims,dataType:a}],dispatchGroup:{x:Math.ceil(M.size(d[0].dims)/64/4)},programUniforms:l})}},Uh=e=>{e.compute(ce(e.inputs[0],"Abs","abs"))},Lh=e=>{e.compute(ce(e.inputs[0],"Acos","acos"))},Wh=e=>{e.compute(ce(e.inputs[0],"Acosh","acosh"))},qh=e=>{e.compute(ce(e.inputs[0],"Asin","asin"))},Vh=e=>{e.compute(ce(e.inputs[0],"Asinh","asinh"))},Gh=e=>{e.compute(ce(e.inputs[0],"Atan","atan"))},Hh=e=>{e.compute(ce(e.inputs[0],"Atanh","atanh"))},Fh=e=>ge(e),jh=(e,t)=>{let r;switch(t.to){case 10:r="vec4<f16>";break;case 1:r="vec4<f32>";break;case 12:r="vec4<u32>";break;case 6:r="vec4<i32>";break;case 9:r="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(ce(e.inputs[0],"Cast",r,void 0,t.cacheKey,t.to))},Hl=e=>{let t,r,i=e.length>=2&&e[1].data!==0,n=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=i?e[1].getFloat32Array()[0]:-34028234663852886e22,r=n?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=i?e[1].getUint16Array()[0]:64511,r=n?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return ge({min:t,max:r})},Kh=(e,t)=>{let r=t||Hl(e.inputs),i=ze(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Clip",n=>`clamp(${n}, vec4<${i}>(uniforms.min), vec4<${i}>(uniforms.max))`,void 0,r.cacheKey,void 0,[{type:e.inputs[0].dataType,data:r.min},{type:e.inputs[0].dataType,data:r.max}],[{name:"min",type:i},{name:"max",type:i}]),{inputs:[0]})},Yh=e=>{e.compute(ce(e.inputs[0],"Ceil","ceil"))},Qh=e=>{e.compute(ce(e.inputs[0],"Cos","cos"))},Zh=e=>{e.compute(ce(e.inputs[0],"Cosh","cosh"))},zr=e=>ge(e),Xh=(e,t)=>{let r=ze(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Elu",i=>`elu_vf32(${i})`,`
  const elu_alpha_ = ${r}(${t.alpha});

  fn elu_f32(a: ${r}) -> ${r} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${r}>) -> vec4<${r}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},vi=(e="f32")=>`
const r0: ${e} = 0.3275911;
const r1: ${e} = 0.254829592;
const r2: ${e} = -0.284496736;
const r3: ${e} = 1.421413741;
const r4: ${e} = -1.453152027;
const r5: ${e} = 1.061405429;

fn erf_vf32(v: vec4<${e}>) -> vec4<${e}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,Jh=e=>{let t=ze(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Erf",r=>`erf_vf32(${r})`,vi(t)))},ef=e=>{e.compute(ce(e.inputs[0],"Exp","exp"))},tf=e=>{e.compute(ce(e.inputs[0],"Floor","floor"))},rf=e=>{let t=ze(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Gelu",r=>`0.5 * ${r} * (1.0 + erf_vf32(${r} * 0.7071067811865475))`,vi(t)))},nf=(e,t)=>{let r=ze(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"LeakyRelu",i=>`select(leaky_relu_alpha_ * ${i}, ${i}, ${i} >= vec4<${r}>(0.0))`,`const leaky_relu_alpha_ = ${r}(${t.alpha});`,t.cacheKey))},af=e=>{e.compute(ce(e.inputs[0],"Not",t=>`!${t}`))},sf=e=>{e.compute(ce(e.inputs[0],"Neg",t=>`-${t}`))},of=e=>{e.compute(ce(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},uf=e=>{let t=ze(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Relu",r=>`select(vec4<${t}>(0.0), ${r}, ${r} > vec4<${t}>(0.0))`))},lf=e=>{e.compute(ce(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},df=e=>ge(e),pf=(e,t)=>{let r=ze(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"HardSigmoid",i=>`max(vec4<${r}>(0.0), min(vec4<${r}>(1.0), ${t.alpha} * ${i} + vec4<${r}>(${t.beta})))`,void 0,t.cacheKey))},cf=e=>{e.compute(ce(e.inputs[0],"Sin","sin"))},hf=e=>{e.compute(ce(e.inputs[0],"Sinh","sinh"))},ff=e=>{e.compute(ce(e.inputs[0],"Sqrt","sqrt"))},mf=e=>{e.compute(ce(e.inputs[0],"Tan","tan"))},Pn=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,gf=e=>{e.compute(ce(e.inputs[0],"Tanh",Pn))},ka=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${Pn("v")};
}
`,Ea=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,yf=e=>{let t=ze(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"FastGelu",Ea,ka(t),void 0,e.inputs[0].dataType))},_f=(e,t)=>{let r=ze(e.inputs[0].dataType);return e.compute(ce(e.inputs[0],"ThresholdedRelu",i=>`select(vec4<${r}>(0.0), ${i}, ${i} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${r}>(${t.alpha});`,t.cacheKey)),0},wf=e=>{e.compute(ce(e.inputs[0],"Log","log"))},Fl=(e,t)=>`
const alpha = vec4<${e}>(${t});
const one = ${e}(1.0);
const zero = ${e}(0.0);

fn quick_gelu_impl(x: vec4<${e}>) -> vec4<${e}> {
  let v = x *alpha;
  var x1 : vec4<${e}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`,jl=e=>`quick_gelu_impl(${e})`,bf=(e,t)=>{let r=ze(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"QuickGelu",jl,Fl(r,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),Kl,Yl,$f,aw=L(()=>{ie(),ne(),os(),Kl=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},Yl=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let r=D("input",e[0].dataType,e[0].dims,4),i=D("bias",e[0].dataType,[e[0].dims[2]],4),n=Y("output",e[0].dataType,t,4),a=M.size(t)/4,s=ke(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)}}),getShaderSource:o=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${o.declareVariables(r,i,n)}

  ${vi(s)}

  ${o.mainStart()}
    ${o.guardAgainstOutOfBoundsWorkgroupSizes(a)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${n.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},$f=e=>{Kl(e.inputs),e.compute(Yl(e.inputs))}}),Ql,Zl,Xe,vf,xf,Sf,If,Tf,kf,Ef,Cf,zf,Af,sw=L(()=>{te(),ie(),ne(),Ql=(e,t,r,i,n,a,s,o,l,d,c,h)=>{let f,y;typeof o=="string"?f=y=(b,T)=>`${o}((${b}),(${T}))`:typeof o=="function"?f=y=o:(f=o.scalar,y=o.vector);let _=Y("outputData",c,i.length,4),w=D("aData",l,t.length,4),S=D("bData",d,r.length,4),$;if(n)if(a){let b=M.size(t)===1,T=M.size(r)===1,I=t.length>0&&t[t.length-1]%4===0,E=r.length>0&&r[r.length-1]%4===0;b||T?$=_.setByOffset("global_idx",y(b?`${w.type.value}(${w.getByOffset("0")}.x)`:w.getByOffset("global_idx"),T?`${S.type.value}(${S.getByOffset("0")}.x)`:S.getByOffset("global_idx"))):$=`
            let outputIndices = ${_.offsetToIndices("global_idx * 4u")};
            let offsetA = ${w.broadcastedIndicesToOffset("outputIndices",_)};
            let offsetB = ${S.broadcastedIndicesToOffset("outputIndices",_)};
            ${_.setByOffset("global_idx",y(s||I?w.getByOffset("offsetA / 4u"):`${w.type.value}(${w.getByOffset("offsetA / 4u")}[offsetA % 4u])`,s||E?S.getByOffset("offsetB / 4u"):`${S.type.value}(${S.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else $=_.setByOffset("global_idx",y(w.getByOffset("global_idx"),S.getByOffset("global_idx")));else{if(!a)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let b=(T,I,E="")=>{let A=`aData[indexA${I}][componentA${I}]`,O=`bData[indexB${I}][componentB${I}]`;return`
            let outputIndices${I} = ${_.offsetToIndices(`global_idx * 4u + ${I}u`)};
            let offsetA${I} = ${w.broadcastedIndicesToOffset(`outputIndices${I}`,_)};
            let offsetB${I} = ${S.broadcastedIndicesToOffset(`outputIndices${I}`,_)};
            let indexA${I} = offsetA${I} / 4u;
            let indexB${I} = offsetB${I} / 4u;
            let componentA${I} = offsetA${I} % 4u;
            let componentB${I} = offsetB${I} % 4u;
            ${T}[${I}] = ${E}(${f(A,O)});
          `};c===9?$=`
            var data = vec4<u32>(0);
            ${b("data",0,"u32")}
            ${b("data",1,"u32")}
            ${b("data",2,"u32")}
            ${b("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:$=`
            ${b("outputData[global_idx]",0)}
            ${b("outputData[global_idx]",1)}
            ${b("outputData[global_idx]",2)}
            ${b("outputData[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(w,S,_)}

        ${h??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${$}
      }`},Zl=(e,t,r,i,n,a,s=r.dataType)=>{let o=r.dims.map(Number),l=i.dims.map(Number),d=!M.areEqual(o,l),c=o,h=M.size(o),f=!1,y=!1,_=[d];if(d){let w=sr.calcShape(o,l,!1);if(!w)throw new Error("Can't perform binary op on the given tensors");c=w.slice(),h=M.size(c);let S=M.size(o)===1,$=M.size(l)===1,b=o.length>0&&o[o.length-1]%4===0,T=l.length>0&&l[l.length-1]%4===0;_.push(S),_.push($),_.push(b),_.push(T);let I=1;for(let E=1;E<c.length;E++){let A=o[o.length-E],O=l[l.length-E];if(A===O)I*=A;else break}I%4===0?(y=!0,f=!0):(S||$||b||T)&&(f=!0)}else f=!0;return _.push(f),{name:e,shaderCache:{hint:t+_.map(w=>w.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:w=>Ql(w,o,l,c,f,d,y,n,r.dataType,i.dataType,s,a),getRunData:()=>({outputs:[{dims:c,dataType:s}],dispatchGroup:{x:Math.ceil(h/64/4)},programUniforms:[{type:12,data:Math.ceil(M.size(c)/4)},...Z(o,l,c)]})}},Xe=(e,t,r,i,n,a)=>{e.compute(Zl(t,n??"",e.inputs[0],e.inputs[1],r,i,a))},vf=e=>{Xe(e,"Add",(t,r)=>`${t}+${r}`)},xf=e=>{Xe(e,"Div",(t,r)=>`${t}/${r}`)},Sf=e=>{Xe(e,"Equal",{scalar:(t,r)=>`u32(${t}==${r})`,vector:(t,r)=>`vec4<u32>(${t}==${r})`},void 0,void 0,9)},If=e=>{Xe(e,"Mul",(t,r)=>`${t}*${r}`)},Tf=e=>{let t=D("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;Xe(e,"Pow",{scalar:(r,i)=>`pow_custom(${r},${i})`,vector:(r,i)=>`pow_vector_custom(${r},${i})`},`
    fn pow_custom(a : ${t}, b : ${t}) -> ${t} {
      if (b == ${t}(0.0)) {
        return ${t}(1.0);
      } else if (a < ${t}(0.0) && f32(b) != floor(f32(b))) {
        return ${t}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${t}(1.0), round(f32(abs(b) % ${t}(2.0))) != 1.0) * ${t}(${t==="i32"?"round":""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${t}>, b : vec4<${t}>) -> vec4<${t}> {
      // TODO: implement vectorized pow
      return vec4<${t}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},kf=e=>{Xe(e,"Sub",(t,r)=>`${t}-${r}`)},Ef=e=>{Xe(e,"Greater",{scalar:(t,r)=>`u32(${t}>${r})`,vector:(t,r)=>`vec4<u32>(${t}>${r})`},void 0,void 0,9)},Cf=e=>{Xe(e,"Less",{scalar:(t,r)=>`u32(${t}<${r})`,vector:(t,r)=>`vec4<u32>(${t}<${r})`},void 0,void 0,9)},zf=e=>{Xe(e,"GreaterOrEqual",{scalar:(t,r)=>`u32(${t}>=${r})`,vector:(t,r)=>`vec4<u32>(${t}>=${r})`},void 0,void 0,9)},Af=e=>{Xe(e,"LessOrEqual",{scalar:(t,r)=>`u32(${t}<=${r})`,vector:(t,r)=>`vec4<u32>(${t}<=${r})`},void 0,void 0,9)}}),Xl,Jl,ed,td,Of,Rf,ow=L(()=>{te(),ie(),Ie(),ne(),Xl=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let r=0,i=e[r],n=i.dataType,a=i.dims.length;e.forEach((s,o)=>{if(o!==r){if(s.dataType!==n)throw new Error("input tensors should be one type");if(s.dims.length!==a)throw new Error("input tensors should have the same shape");s.dims.forEach((l,d)=>{if(d!==t&&l!==i.dims[d])throw new Error("non concat dimensions must match")})}})},Jl=(e,t)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${e}u>(${t});
    for (var i: u32 = 0u; i < ${e}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${e}u;
  }`,ed=(e,t)=>{let r=e.length,i=[];for(let n=0;n<r;++n){let a=t.setByOffset("global_idx",e[n].getByIndices("indices"));r===1?i.push(a):n===0?i.push(`if (inputIndex == ${n}u) { ${a} }`):n===r-1?i.push(`else { ${a} }`):i.push(`else if (inputIndex == ${n}) { ${a} }`)}return i.join(`
`)},td=(e,t,r,i)=>{let n=M.size(r),a=new Array(e.length),s=new Array(e.length),o=0,l=[],d=[],c=[{type:12,data:n}];for(let w=0;w<e.length;++w)o+=e[w].dims[t],a[w]=o,d.push(e[w].dims.length),s[w]=D(`input${w}`,i,d[w]),l.push("rank"),c.push({type:12,data:a[w]});for(let w=0;w<e.length;++w)c.push(...Z(e[w].dims));c.push(...Z(r));let h=Y("output",i,r.length),f=h.indicesGet("indices",t),y=Array.from(Array(a.length).keys()).map(w=>`uniforms.sizeInConcatAxis${w}`).join(","),_=w=>`

  ${(()=>{w.registerUniform("outputSize","u32");for(let S=0;S<e.length;S++)w.registerUniform(`sizeInConcatAxis${S}`,"u32");return w.declareVariables(...s,h)})()}

  ${Jl(a.length,y)}

  ${w.mainStart()}
    ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${h.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${f});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${a.length}u>(${y});
      ${f} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${ed(s,h)}
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:l},getRunData:()=>({outputs:[{dims:r,dataType:i}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:c}),getShaderSource:_}},Of=(e,t)=>{let r=e.inputs,i=r[0].dims,n=M.normalizeAxis(t.axis,i.length);Xl(r,n);let a=i.slice();a[n]=r.reduce((o,l)=>o+(l.dims.length>n?l.dims[n]:0),0);let s=r.filter(o=>M.size(o.dims)>0);e.compute(td(s,n,a,r[0].dataType),{inputs:s})},Rf=e=>ge({axis:e.axis})}),Ft,jt,Kt,us,Qt=L(()=>{te(),ie(),Ft=(e,t,r="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${r}(uniforms.clip_min)), ${t}(${r}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${r}(uniforms.alpha) * value + ${r}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${r}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},jt=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},Kt=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},us=e=>{let t=(e==null?void 0:e.activation)||"";if(t==="HardSigmoid"){let[r,i]=(e==null?void 0:e.activation_params)||[.2,.5];return{activation:t,alpha:r,beta:i}}else if(t==="Clip"){let[r,i]=(e==null?void 0:e.activation_params)||[nh,ah];return{activation:t,clipMax:i,clipMin:r}}else if(t==="LeakyRelu"){let[r]=(e==null?void 0:e.activation_params)||[.01];return{activation:t,alpha:r}}return{activation:t}}}),Ce,Mf,ls=L(()=>{Ce=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},Mf=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),Bf,uw=L(()=>{Bf=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),Mr,ds,ps=L(()=>{te(),ie(),ne(),Qt(),Mr=(e,t,r,i,n)=>{let a=i-r;return`
      ${Array.from({length:r}).map((s,o)=>`
      if (${Q(t.shape,o,t.rank)} != 1) {
        ${t.indicesSet(e,o,Q(n,o+a,i))}
      } else {
        ${t.indicesSet(e,o,0)}
      }`).join("")}
`},ds=(e,t,r,i,n=!1,a)=>{let s=e[0].dims,o=e[1].dims,l=s[s.length-2],d=o[o.length-1],c=s[s.length-1],h=Se(d),f=Se(c),y=Se(l),_=M.size(r)/h/y,w=e.length>2,S=i?i.slice(0,-2):r.slice(0,-2),$=[M.size(S),l,d],b=[{type:12,data:_},{type:12,data:l},{type:12,data:d},{type:12,data:c}];jt(t,b),b.push(...Z(S,s,o)),w&&b.push(...Z(e[2].dims)),b.push(...Z($));let T=I=>{let E=ns("batch_dims",e[0].dataType,S.length),A=D("a",e[0].dataType,s.length,f),O=D("b",e[1].dataType,o.length,h),x=Y("output",e[0].dataType,$.length,h),z=ke(x.type.tensor),N=Ft(t,x.type.value,z),q=[A,O],G="";if(w){let F=n?h:1;q.push(D("bias",e[2].dataType,e[2].dims.length,F)),G=`${n?`value += bias[col / ${F}];`:`value += ${x.type.value}(bias[row + i]);`}`}let H=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];Kt(t,H);let R=()=>{let F=`var a_data: ${A.type.value};`;for(let K=0;K<f;K++)F+=`
              let b_data${K} = b[(b_offset + (k + ${K}) * uniforms.N + col) / ${h}];`;for(let K=0;K<y;K++){F+=`a_data = a[(a_offset + (row + ${K}) * uniforms.K + k) / ${f}];`;for(let X=0;X<f;X++)F+=`
            values[${K}] = fma(${O.type.value}(a_data${f===1?"":`[${X}]`}), b_data${X}, values[${K}]);
`}return F};return`
  ${I.registerUniforms(H).registerInternalVariables(E).declareVariables(...q,x)}
  ${I.mainStart()}
    ${I.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${h})) * ${h};
    var index1 = global_idx / (uniforms.N / ${h});
    let stride1 = uniforms.M / ${y};
    let row = (index1 % stride1) * ${y};
    let batch = index1 / stride1;

    ${r.length===2?"":`let batch_indices = ${E.offsetToIndices("batch")};`}

    var a_indices: ${A.type.indices};
    ${Mr("a_indices",A,A.rank-2,E.rank,"batch_indices")}
    ${A.indicesSet("a_indices",A.rank-2,0)}
    ${A.indicesSet("a_indices",A.rank-1,0)}
    let a_offset = ${A.indicesToOffset("a_indices")};

    var b_indices: ${O.type.indices};
    ${Mr("b_indices",O,O.rank-2,E.rank,"batch_indices")}
    ${O.indicesSet("b_indices",O.rank-2,0)}
    ${O.indicesSet("b_indices",O.rank-1,0)}
    let b_offset = ${O.indicesToOffset("b_indices")};
    var values: array<${x.type.value}, ${y}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${f}) {
      ${R()}
    }
    for (var i = 0u; i < ${y}u; i++) {
      var value = values[i];
      ${G}
      ${N}
      let cur_indices = ${x.type.indices}(batch, row + i, col);
      let offset = ${x.indicesToOffset("cur_indices")};
      ${x.setByOffset(`offset / ${h}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${h};${f};${y};${n}`,inputDependencies:w?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:a?a(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(_/64)},programUniforms:b}),getShaderSource:T}}}),rd,id,Ca,Un,nd,za,ad,Mi,cs=L(()=>{te(),ie(),ne(),Qt(),ps(),ls(),rd=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,id=(e,t)=>e?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${t===3?"":"let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached.w + acc[i];"}
        }`,Ca=(e,t,r="f32",i,n=!1,a=32,s=!1,o=32)=>{let l=t[1]*e[1],d=t[0]*e[0],c=n?l:a,h=n?a:l,f=c/t[0],y=a/t[1];if(!((n&&f===4&&e[1]===4||!n&&(f===3||f===4))&&c%t[0]===0&&a%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${n} is true, innerElementSize ${f} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${f} must be 3 or 4.
  tileAWidth ${c} must be divisible by workgroupSize[0]${t[0]}. tileInner ${a} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${f}<${r}>, ${c/f}>, ${h}>;
var<workgroup> mm_Bsub: array<array<vec4<${r}>, ${d/e[0]}>, ${a}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${f};
const tileInner = ${a};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${s?"0":"i32(globalId.z)"};
  ${i?`let batchIndices = ${i.offsetToIndices("u32(batch)")};`:""}
  let globalRowStart = i32(workgroupId.y) * ${l};

  let num_tiles = ${s?`${Math.ceil(o/a)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${s?`i32(globalId.z) * ${o}`:"0"};

  var acc: array<vec4<${r}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${y};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${rd(n,i)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${y}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${i?", batchIndices":""});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${f===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${id(n,f)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},Un=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,nd=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",za=(e,t,r="f32",i,n=!1,a=32,s=!1,o=32,l=!1)=>{let d=e[1]*t[1],c=e[0]*t[0],h=n?d:a,f=n?a:d;if(!(f%t[1]===0&&h%t[0]===0&&a%t[1]===0))throw new Error(`tileAHight ${f} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${h} must be divisible by workgroupSize[0]${t[0]}, tileInner ${a} must be divisible by workgroupSize[1]${t[1]}`);let y=f/t[1],_=h/t[0],w=a/t[1],S=l?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${d};
    let globalColStart = i32(workgroupId.x) * ${c};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${f}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${h}; inputCol = inputCol + ${t[0]}) {
          ${Un(n,i)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${a}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${c}; inputCol = inputCol + ${t[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${i?", batchIndices":""});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${r}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${n?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${t[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${t[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    `:`
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${d};

let tileRowA = i32(localId.y) * ${y};
let tileColA = i32(localId.x) * ${_};
let tileRowB = i32(localId.y) * ${w};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${y}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${_}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${Un(n,i)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${w}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${i?", batchIndices":""});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${r}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${nd(n)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;return`
  var<workgroup> mm_Asub : array<array<${r}, ${h}>, ${f}>;
  var<workgroup> mm_Bsub : array<array<${r}, ${c}>, ${a}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${a};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${s?"0":"i32(globalId.z)"};
    ${i?`let batchIndices = ${i.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${s?`${Math.ceil(o/a)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${s?`i32(globalId.z) * ${o}`:"0"};

    var acc : array<array<${r}, colPerThread>, rowPerThread>;
    ${S}
  }
`},ad=(e,t,r,i,n=!1)=>{let[a,s,o,l]=i,d=ke(i[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${a.type.indices}) -> ${Ce(e,d)} {
      var value = ${Ce(e,d)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${s.type.indices};
        ${Mr("aIndices",s,s.rank-2,a.rank,"batchIndices")}
        ${s.indicesSet("aIndices",s.rank-2,"u32(row)")}
        ${s.indicesSet("aIndices",s.rank-1,"u32(colIn)")}
        value = ${s.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${a.type.indices}) -> ${Ce(e,d)} {
      var value = ${Ce(e,d)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${o.type.indices};
        ${Mr("bIndices",o,o.rank-2,a.rank,"batchIndices")}
        ${o.indicesSet("bIndices",o.rank-2,"u32(row)")}
        ${o.indicesSet("bIndices",o.rank-1,"u32(colIn)")}
        value = ${o.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${Ce(e,d)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${n?"bias[colIn]":`${Ce(e,d)}(bias[row])`};`:""}
        ${r}
        ${l.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},Mi=(e,t,r,i,n=!1,a)=>{let s=e[0].dims,o=e[1].dims,l=s.slice(0,-2),d=o.slice(0,-2),c=i?i.slice(0,-2):r.slice(0,-2),h=M.size(c),f=s[s.length-2],y=s[s.length-1],_=o[o.length-1],w=y%4===0&&_%4===0,S=f<=8?[4,1,1]:[4,4,1],$=[8,8,1],b=[Math.ceil(_/$[0]/S[0]),Math.ceil(f/$[1]/S[1]),Math.ceil(h/$[2]/S[2])],T=w?4:1,I=[...l,f,y/T],E=I.length,A=[...d,y,_/T],O=A.length,x=[h,f,_/T],z=[{type:6,data:f},{type:6,data:_},{type:6,data:y}];jt(t,z),z.push(...Z(c,I,A));let N=["rank","rank"],q=e.length>2;q&&(z.push(...Z(e[2].dims)),N.push("rank")),z.push(...Z(x));let G=H=>{let R=c.length,F=ns("batchDims",e[0].dataType,R,1),K=ke(e[0].dataType),X=D("a",e[0].dataType,E,T),ue=D("b",e[1].dataType,O,T),W=Y("result",e[0].dataType,x.length,T),fe=[X,ue];if(q){let _e=n?T:1;fe.push(D("bias",e[2].dataType,e[2].dims.length,_e))}let P=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];Kt(t,P);let U=ke(W.type.tensor),J=Ft(t,W.type.value,U),ee=ad(T,q,J,[F,X,ue,W],n);return`
  ${H.registerUniforms(P).registerInternalVariables(F).declareVariables(...fe,W)}
  ${ee}
  ${w?Ca(S,$,K,F):za(S,$,K,F)}
                   `};return{name:"MatMul",shaderCache:{hint:`${S};${t.activation};${w};${n}`,inputDependencies:N},getRunData:()=>({outputs:[{dims:a?a(r):r,dataType:e[0].dataType}],dispatchGroup:{x:b[0],y:b[1],z:b[2]},programUniforms:z}),getShaderSource:G}}}),sd,Df,lw=L(()=>{te(),pt(),ne(),Qt(),ls(),uw(),cs(),sd=(e,t,r,i,n=!1,a,s=4,o=4,l=4,d="f32")=>{let c=z=>{switch(z){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${d}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${z} is not supported.`)}},h=z=>{switch(z){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${z} is not supported.`)}},f=e?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,y=e?`
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    `:`
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `,_=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",w=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",S=e?"row":"col",$=e?"col":"row",b=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${S} / outWidth;
    let outCol = ${S} % outWidth;

    let WRow = ${$} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${$} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${$} % inChannels;
    var resData = ${Ce(s,d)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${_} && xCol >= 0 && xCol < ${w}) {
      ${f}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${c(s)}
    }
    return resData;`,T=e?t&&i?`
    let col = colIn * ${s};
    ${b}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${b}
    }
    return ${Ce(s,d)}(0.0);`:i&&r?`
    let col = colIn * ${s};
    ${b}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${b}
    }
    return ${Ce(s,d)}(0.0);`,I=e?i&&r?h(o):`
    let col = colIn * ${o};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${h(o)}
    }
    return ${Ce(o,d)}(0.0);`:`
    let col = colIn * ${o};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${h(o)}
    }
    return ${Ce(o,d)}(0.0);`,E=Ce(l,d),A=Ce(e?s:o,d),O=Ce(e?o:s,d),x=Ft(a,E,d);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${A} {
      ${e?T:I}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${O} {
      ${e?I:T}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${E}) {
      let col = colIn * ${l};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${y}
      ${Mf(n)}
      ${x}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},Df=(e,t,r,i,n,a,s,o,l)=>{let d=t.format==="NHWC",c=d?e[0].dims[3]:e[0].dims[1],h=r[0],f=d?r[2]:r[3],y=d?r[1]:r[2],_=d?r[3]:r[1],w=d&&(c%4===0||c%3===0)&&_%4===0,S=d?_:f*y,$=d?f*y:_,b=[8,8,1],T=i<=8?[4,1,1]:[4,4,1],I=[Math.ceil(S/b[0]/T[0]),Math.ceil($/b[1]/T[1]),Math.ceil(h/b[2]/T[2])];de("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${I}`);let E=w?d&&c%4!==0?3:4:1,A=b[1]*T[1],O=b[0]*T[0],x=Math.max(b[0]*E,b[1]),z=i%A===0,N=n%O===0,q=a%x===0,G=w?[E,4,4]:[1,1,1],H=[{type:6,data:i},{type:6,data:n},{type:6,data:a},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];jt(t,H),H.push(...Z(e[0].dims,e[1].dims));let R=["rank","rank"];s&&(H.push(...Z(e[2].dims)),R.push("rank")),H.push(...Z(r));let F=K=>{let X=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];Kt(t,X);let ue=w?4:1,W=ke(e[0].dataType),fe=`
      fn setOutputAtIndex(flatIndex : i32, value : ${w?`vec4<${W}>`:W}) {
        result[flatIndex] = ${w?`vec4<${W}>`:W}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${w?`vec4<${W}>`:W}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${w?"/ 4":""}, value);
      }`,P=D("x",e[0].dataType,e[0].dims.length,E===3?1:E),U=D("w",e[1].dataType,e[1].dims.length,ue),J=[P,U],ee=Y("result",e[0].dataType,r.length,ue);if(s){let _e=D("bias",e[2].dataType,e[2].dims.length,ue);J.push(_e),fe+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${w?`vec4<${W}>`:W} {
          return bias[coords.${d?"w":"y"}${w?"/ 4":""}];
        }`}return`
        ${Bf("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${K.registerUniforms(X).declareVariables(...J,ee)}
        ${fe}
        ${sd(d,z,N,q,s,t,G[0],G[1],G[2],W)}
        ${w?Ca(T,b,W,void 0,!d,x):za(T,b,W,void 0,!d,x,!1,void 0,o)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${E};${w};${z};${N};${q};${A};${O};${x}`,inputDependencies:R},getRunData:()=>({outputs:[{dims:l?l(r):r,dataType:e[0].dataType}],dispatchGroup:{x:I[0],y:I[1],z:I[2]},programUniforms:H}),getShaderSource:F}}}),od,Ln,vr,ud,Wn,ld,Nf,Pf,dw=L(()=>{te(),pt(),ie(),ne(),Qt(),ls(),od=e=>{let t=1;for(let r=0;r<e.length;r++)t*=e[r];return t},Ln=e=>typeof e=="number"?[e,e,e]:e,vr=(e,t)=>t<=1?e:e+(e-1)*(t-1),ud=(e,t,r,i=1)=>{let n=vr(t,i);return Math.floor((e[0]*(r-1)-r+n)/2)},Wn=(e,t,r,i,n)=>{n==null&&(n=ud(e,t[0],i[0]));let a=[0,0,0,r];for(let s=0;s<3;s++)e[s]+2*n>=t[s]&&(a[s]=Math.trunc((e[s]-t[s]+2*n)/i[s]+1));return a},ld=(e,t,r,i,n,a,s,o,l,d)=>{let c,h,f,y;if(e==="VALID"&&(e=0),typeof e=="number"){c={top:e,bottom:e,left:e,right:e,front:e,back:e};let _=Wn([t,r,i,1],[o,l,d],1,[n,a,s],e);h=_[0],f=_[1],y=_[2]}else if(Array.isArray(e)){if(!e.every((w,S,$)=>w===$[0]))throw Error(`Unsupported padding parameter: ${e}`);c={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let _=Wn([t,r,i,1],[o,l,d],1,[n,a,s],e[0]);h=_[0],f=_[1],y=_[2]}else if(e==="SAME_UPPER"){h=Math.ceil(t/n),f=Math.ceil(r/a),y=Math.ceil(i/s);let _=(h-1)*n+o-t,w=(f-1)*a+l-r,S=(y-1)*s+d-i,$=Math.floor(_/2),b=_-$,T=Math.floor(w/2),I=w-T,E=Math.floor(S/2),A=S-E;c={top:T,bottom:I,left:E,right:A,front:$,back:b}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:c,outDepth:h,outHeight:f,outWidth:y}},Nf=(e,t,r,i,n,a=!1,s="channelsLast")=>{let o,l,d,c,h;if(s==="channelsLast")[o,l,d,c,h]=e;else if(s==="channelsFirst")[o,h,l,d,c]=e;else throw new Error(`Unknown dataFormat ${s}`);let[f,,y,_,w]=t,[S,$,b]=Ln(r),[T,I,E]=Ln(i),A=vr(y,T),O=vr(_,I),x=vr(w,E),{padInfo:z,outDepth:N,outHeight:q,outWidth:G}=ld(n,l,d,c,S,$,b,A,O,x),H=a?f*h:f,R=[0,0,0,0,0];return s==="channelsFirst"?R=[o,H,N,q,G]:s==="channelsLast"&&(R=[o,N,q,G,H]),{batchSize:o,dataFormat:s,inDepth:l,inHeight:d,inWidth:c,inChannels:h,outDepth:N,outHeight:q,outWidth:G,outChannels:H,padInfo:z,strideDepth:S,strideHeight:$,strideWidth:b,filterDepth:y,filterHeight:_,filterWidth:w,effectiveFilterDepth:A,effectiveFilterHeight:O,effectiveFilterWidth:x,dilationDepth:T,dilationHeight:I,dilationWidth:E,inShape:e,outShape:R,filterShape:t}},Pf=(e,t,r,i,n,a)=>{let s=a==="channelsLast";s?e[0].dims[3]:e[0].dims[1];let o=[64,1,1],l={x:r.map((S,$)=>$)},d=[Math.ceil(od(l.x.map(S=>r[S]))/o[0]),1,1];de("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${d}`);let c=1,h=M.size(r),f=[{type:12,data:h},{type:12,data:i},{type:12,data:n},{type:12,data:t.strides},{type:12,data:t.dilations}];jt(t,f),f.push(...Z(e[0].dims,e[1].dims));let y=["rank","rank"],_=e.length===3;_&&(f.push(...Z(e[2].dims)),y.push("rank")),f.push(...Z(r));let w=S=>{let $=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:i.length},{name:"pads",type:"u32",length:n.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];Kt(t,$);let b=1,T=ke(e[0].dataType),I=D("x",e[0].dataType,e[0].dims.length,c),E=D("W",e[1].dataType,e[1].dims.length,b),A=[I,E],O=Y("result",e[0].dataType,r.length,b),x="";if(_){let q=D("bias",e[2].dataType,e[2].dims.length,b);A.push(q),x+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${T} {
          return bias[${s?Q("coords",4,5):Q("coords",1,5)}];
        }`}let z=Ce(c,T),N=Ft(t,z,T);return`
            ${x}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${I.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${E.getByIndices("aIndices")};
            }
          ${S.registerUniforms($).declareVariables(...A,O)}
          ${S.mainStart()}
          ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${O.offsetToIndices("global_idx")};
              let batch = ${Q("coords",0,I.rank)};
              let d2 = ${s?Q("coords",I.rank-1,I.rank):Q("coords",1,I.rank)};
              let xFRCCorner = vec3<u32>(${s?Q("coords",1,I.rank):Q("coords",2,I.rank)},
              ${s?Q("coords",2,I.rank):Q("coords",3,I.rank)},
              ${s?Q("coords",3,I.rank):Q("coords",4,I.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${s?Q("uniforms.x_shape",1,I.rank):Q("uniforms.x_shape",2,I.rank)};
              let xShapeZ = ${s?Q("uniforms.x_shape",2,I.rank):Q("uniforms.x_shape",3,I.rank)};
              let xShapeW = ${s?Q("uniforms.x_shape",3,I.rank):Q("uniforms.x_shape",4,I.rank)};
              let xShapeU = ${s?Q("uniforms.x_shape",4,I.rank):Q("uniforms.x_shape",1,I.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = 0.0;
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${s?`let xValues = vec4<f32>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<f32>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<f32>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${s?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${s?`let xValues = vec2<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${s?`let xValues = vec3<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${_?"value = value + getBiasByOutputCoords(coords)":""};
              ${N}
              result[global_idx] = f32(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${s};${c};${_}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:d[0],y:d[1],z:d[2]},programUniforms:f}),getShaderSource:w}}}),Uf,Lf,pw=L(()=>{te(),ie(),ne(),Qt(),Uf=(e,t,r,i)=>{let n=e.length>2,a=n?"value += b[output_channel];":"",s=e[0].dims,o=e[1].dims,l=t.format==="NHWC",d=l?r[3]:r[1],c=d/t.group,h=l&&c>=4?Se(d):1,f=M.size(r)/h,y=[{type:12,data:f},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:c}];jt(t,y),y.push(...Z(s,[o[0],o[1],o[2],o[3]/h]));let _=n?["rank","rank","rank"]:["rank","rank"];y.push(...Z([r[0],r[1],r[2],r[3]/h]));let w=S=>{let $=Y("output",e[0].dataType,r.length,h),b=ke($.type.tensor),T=Ft(t,$.type.value,b),I=D("x",e[0].dataType,s.length),E=D("w",e[1].dataType,o.length,h),A=[I,E];n&&A.push(D("b",e[2].dataType,e[2].dims,h));let O=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];Kt(t,O);let x=l?`
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[0]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[1]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[1]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[2]; wInChannel++) {
            let input_channel = in_channel_offset + wInChannel;
            let xVal = ${I.get("batch","xHeight","xWidth","input_channel")};
            let wVal = ${E.get("wHeight","wWidth","wInChannel","output_channel")};
            value += xVal * wVal;
          }
        }
      }
      `:`
      for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
        let input_channel = in_channel_offset + wInChannel;
        for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
          let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

          if (xHeight < 0u || xHeight >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
            let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
            if (xWidth < 0u || xWidth >= uniforms.x_shape[3]) {
              continue;
            }

            let xVal = ${I.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${E.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${S.registerUniforms(O).declareVariables(...A,$)}

  ${S.mainStart()}
    ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${$.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${l?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${l?1:2}], outputIndices[${l?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${h} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${l?2:1}];

    var value: ${$.type.value} = ${$.type.value}(0);
    ${x}
    ${a}
    ${T}
    ${$.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${h}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:y}),getShaderSource:w}},Lf=(e,t,r,i)=>{let n=e.length>2,a=Se(r[3]),s=Se(r[2]),o=M.size(r)/a/s,l=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/a],d=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/a],c=[r[0],r[1],r[2],r[3]/a],h=[{type:12,data:o},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];jt(t,h),h.push(...Z(l,d,c));let f=(s-1)*t.strides[1]+d[1],y=_=>{let w=Y("output",e[0].dataType,c.length,a),S=ke(w.type.tensor),$=Ft(t,w.type.value,S),b=D("x",e[0].dataType,l.length,a),T=D("w",e[1].dataType,d.length,a),I=[b,T];n&&I.push(D("b",e[2].dataType,e[2].dims,a));let E=n?"value += b[output_channel];":"",A=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return Kt(t,A),`
  ${_.registerUniforms(A).declareVariables(...I,w)}
  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${s}u;
    let col = (index1 % width1) * ${s}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${b.type.value}, ${f}>;
    var values: array<${w.type.value}, ${s}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${d[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${f}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${b.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${b.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${d[1]}; w_width++) {
          let w_val = ${T.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${s}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${s}u; i++) {
      var value = values[i];
      ${E}
      ${$}
      ${w.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${a};${s};${f};${d[0]};${d[1]}`,inputDependencies:n?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:h}),getShaderSource:y}}}),dd,ci,pd,hi,Aa,qn,cd,hd,Oa,cw=L(()=>{ie(),lw(),dw(),cs(),pw(),Qt(),ps(),St(),dd=(e,t,r,i,n,a)=>{let s=e[0],o=e.slice(a?1:2,a?3:4),l=o.length,d=t[0],c=t.slice(2).map((f,y)=>f+(f-1)*(r[y]-1)),h=o.map((f,y)=>f+i[y]+i[y+l]).map((f,y)=>Math.floor((f-c[y]+n[y])/n[y]));return h.splice(0,0,s),h.splice(a?3:1,0,d),h},ci=[2,3,1,0],pd=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[1]*t.group;if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let n=e[0].dims.length-2;if(t.dilations.length!==n)throw new Error(`dilations should be ${n}D`);if(t.strides.length!==n)throw new Error(`strides should be ${n}D`);if(t.pads.length!==n*2)throw new Error(`pads should be ${n*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},hi=(e,t)=>{let r=e.kernelShape.slice();r.length<t[1].dims.length-2&&r.push(...Array(t[1].dims.length-2-r.length).fill(0));for(let a=2;a<t[1].dims.length;++a)r[a-2]===0&&(r[a-2]=t[1].dims[a]);let i=e.pads.slice();Oi.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,r,i,e.format==="NHWC",e.autoPad);let n=Object.assign({},e);return Object.assign(n,{kernelShape:r,pads:i}),n},Aa=e=>{let t=us(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],n=e.dilations,a=e.group,s=e.kernel_shape,o=e.pads,l=e.strides,d=e.w_is_const();return{autoPad:i,format:r,dilations:n,group:a,kernelShape:s,pads:o,strides:l,wIsConst:d,...t,cacheKey:`${e.format};${t.activation};`}},qn=(e,t,r,i)=>{let n=r.format==="NHWC",a=dd(t[0].dims,t[1].dims,r.dilations,r.pads,r.strides,n);if(r.group!==1){let A=[t[0]];if(n){let O=e.kernelCustomData.wT??e.compute(We(t[1],ci),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=O),A.push(O)}else A.push(t[1]);t.length===3&&A.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&n&&t[1].dims[0]===r.group&&t[1].dims[1]===1&&r.dilations[0]===1&&r.dilations[1]===1?e.compute(Lf(A,r,a,i),{inputs:A}):e.compute(Uf(A,r,a,i),{inputs:A});return}let s=t.length===3,o=t[0].dims[n?1:2],l=t[0].dims[n?2:3],d=t[0].dims[n?3:1],c=t[1].dims[2],h=t[1].dims[3],f=a[n?1:2],y=a[n?2:3],_=a[n?3:1],w=n&&c===o&&h===l&&r.pads[0]===0&&r.pads[1]===0;if(w||c===1&&h===1&&r.dilations[0]===1&&r.dilations[1]===1&&r.strides[0]===1&&r.strides[1]===1&&r.pads[0]===0&&r.pads[1]===0){let A=a[0],O,x,z,N=[];if(n){let H=e.kernelCustomData.wT??e.compute(We(t[1],ci),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];if(r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=H),w){let R=o*l*d;O=t[0].reshape([1,A,R]),x=H.reshape([1,R,_]),z=[1,A,_]}else O=t[0].reshape([A,o*l,d]),x=H.reshape([1,d,_]),z=[A,f*y,_];N.push(O),N.push(x)}else O=t[0].reshape([A,d,o*l]),x=t[1].reshape([1,_,d]),z=[A,_,f*y],N.push(x),N.push(O);s&&N.push(t[2]);let q=z[2],G=N[0].dims[N[0].dims.length-1];q<8&&G<8?e.compute(ds(N,r,a,z,n,i),{inputs:N}):e.compute(Mi(N,r,a,z,n,i),{inputs:N});return}let S=!0,$=e.kernelCustomData.wT??e.compute(We(t[1],ci),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=$);let b=[t[0],$];s&&b.push(t[2]);let T=n?f*y:_,I=n?_:f*y,E=c*h*d;e.compute(Df(b,r,a,T,I,E,s,S,i),{inputs:b})},cd=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let n=[0,t.pads[0],0,t.pads[1]],a=[1].concat(t.strides),s=[1].concat(t.dilations),o=[1].concat(t.kernelShape),l=hi({...t,pads:n,strides:a,dilations:s,kernelShape:o},i);qn(e,i,l,d=>r?[d[0],d[2],d[3]]:[d[0],d[1],d[3]])},hd=(e,t,r)=>{let i=r.format==="NHWC"?"channelsLast":"channelsFirst",n=hi(r,t),a=r.autoPad==="NOTSET"?r.pads:r.autoPad,s=Nf(t[0].dims,t[1].dims,r.strides,r.dilations,a,!1,i);e.compute(Pf(t,n,s.outShape,[s.filterDepth,s.filterHeight,s.filterWidth],[s.padInfo.front,s.padInfo.top,s.padInfo.left],i))},Oa=(e,t)=>{if(pd(e.inputs,t),e.inputs[0].dims.length===3)cd(e,t);else if(e.inputs[0].dims.length===5)hd(e,e.inputs,t);else{let r=hi(t,e.inputs);qn(e,e.inputs,r)}}}),Wf,hw=L(()=>{te(),pt(),ie(),ne(),Wf=(e,t,r)=>{let i=e.length>2,n=t.outputShape,a=t.format==="NHWC",s=t.group,o=e[1].dims,l=o[2]/s,d=o[3],c=a?Se(l):1,h=a&&d===1&&l>=4,f=h?Math.floor(l/4)*4:Math.floor(l/c)*c,y=l-f,_=a?Se(d):1,w=a?d===1?c:_:1,S=M.size(n)/_,$=[Math.ceil(S/64),1,1];de("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${$}`);let b=["rank","rank"],T=[t.strides[0],t.strides[1]],I=[t.kernelShape[a?1:2],t.kernelShape[a?2:3]],E=[t.dilations[0],t.dilations[1]],A=[I[0]+(t.dilations[0]<=1?0:(t.kernelShape[a?1:2]-1)*(t.dilations[0]-1)),I[1]+(t.dilations[1]<=1?0:(t.kernelShape[a?2:3]-1)*(t.dilations[1]-1))],O=[A[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),A[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],x=[{type:12,data:S},{type:12,data:T},{type:12,data:I},{type:12,data:E},{type:12,data:A},{type:6,data:O},{type:12,data:f},{type:12,data:l},{type:12,data:d},...Z(e[0].dims,e[1].dims)];i&&(x.push(...Z(e[2].dims)),b.push("rank")),x.push(...Z(n));let z=N=>{let q=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:T.length},{name:"filter_dims",type:"u32",length:I.length},{name:"dilations",type:"u32",length:I.length},{name:"effective_filter_dims",type:"u32",length:A.length},{name:"pads",type:"i32",length:O.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],G=ke(e[0].dataType),H=a?1:2,R=a?2:3,F=a?3:1,K=D("W",e[1].dataType,e[1].dims.length,w),X=D("Dy",e[0].dataType,e[0].dims.length,c),ue=[X,K];i&&ue.push(D("bias",e[2].dataType,[n[F]].length,_));let W=Y("result",e[0].dataType,n.length,_),fe=()=>{let J="";if(h)c===4?J+=`
        let xValue = ${X.getByOffset("x_offset")};
        let wValue = ${K.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:c===2?J+=`
          dotProd = dotProd + dot(vec4<${G}>(${X.getByOffset("x_offset")}, ${X.getByOffset("x_offset + 1u")}), vec4<${G}>(${K.getByOffset("w_offset")}, ${K.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:c===1&&(J+=`
          dotProd = dotProd + dot(vec4<${G}>(${X.getByOffset("x_offset")}, ${X.getByOffset("x_offset + 1u")}, ${X.getByOffset("x_offset + 2u")}, ${X.getByOffset("x_offset + 3u")}), vec4<${G}>(${K.getByOffset("w_offset")}, ${K.getByOffset("w_offset + 1u")}, ${K.getByOffset("w_offset + 2u")}, ${K.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(J+=`
                  let xValue = ${a?X.getByOffset(`${X.indicesToOffset(`${X.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${c}`):X.get("batch","inputChannel","idyR","idyC")};
        `,c===1)J+=`
          let w_offset = ${K.indicesToOffset(`${K.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${K.getByOffset(`w_offset / ${w}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let ee=0;ee<c;ee++)J+=`
            let wValue${ee} = ${K.getByOffset(`${K.indicesToOffset(`${K.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${ee}, wOutChannel)`)} / ${w}`)};
            dotProd = dotProd + xValue[${ee}] * wValue${ee};`;return J},P=()=>{if(y===0)return"";if(!h)throw new Error(`packInputAs4 ${h} is not true.`);let J="";if(c===1){J+="dotProd = dotProd";for(let ee=0;ee<y;ee++)J+=`
            + ${X.getByOffset(`x_offset + ${ee}`)} * ${K.getByOffset(`w_offset + ${ee}`)}`;J+=";"}else if(c===2){if(y!==2)throw new Error(`Invalid inputChannelsRemainder ${y}.`);J+=`
          let xValue = ${X.getByOffset("x_offset")};
          let wValue = ${K.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return J},U=`
            let outputIndices = ${W.offsetToIndices(`global_idx * ${_}`)};
            let batch = ${W.indicesGet("outputIndices",0)};
            let d1 = ${W.indicesGet("outputIndices",F)};
            let r = ${W.indicesGet("outputIndices",H)};
            let c = ${W.indicesGet("outputIndices",R)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${W.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${G}(dyRCorner) + ${G}(wR)) / ${G}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${G}(uniforms.Dy_shape[${H}]) || fract(dyR) > 0.0 ||
                  wRPerm < 0) {
                continue;
              }
              let idyR: u32 = u32(dyR);
              var wC: u32 = 0;
              if (uniforms.dilations.y == 1) {
                // Minimum wC >= 0 that satisfies (dyCCorner + wC) % (uniforms.strides.y) == 0
                wC = u32(((dyCCorner + i32(uniforms.strides.y) - 1) / i32(uniforms.strides.y)) * i32(uniforms.strides.y) - dyCCorner);
              }
              for (; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
                if (wC % uniforms.dilations.y != 0) {
                  continue;
                }
                let dyC = (${G}(dyCCorner) + ${G}(wC)) / ${G}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${G}(uniforms.Dy_shape[${R}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${h?`
                var x_offset = ${X.indicesToOffset(`${X.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${c};
                var w_offset = ${K.indicesToOffset(`${K.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${w};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${h?4:c}) {
                  ${fe()}
                  inputChannel = inputChannel + ${h?4:c};
                }
                ${P()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${i?` + bias[d1 / ${_}]`:""};
            ${W.setByOffset("global_idx","value")};
          `;return`
    ${N.registerUniforms(q).declareVariables(...ue,W)}
      ${N.mainStart()}
      ${N.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${U}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${c}${w}${_}${h}${y}`,inputDependencies:b},getRunData:()=>({dispatchGroup:{x:$[0],y:$[1],z:$[2]},outputs:[{dims:r?r(n):n,dataType:e[0].dataType}],programUniforms:x}),getShaderSource:z}}}),fd,md,gd,Vn,qf,yd,Gn,_d,Vf,fw=L(()=>{hw(),Qt(),St(),fd=(e,t,r,i,n,a)=>(e-1)*t+r+(i-1)*n+1-a,md=(e,t,r,i,n)=>{let a=Math.floor(e/2);t==="SAME_UPPER"?(r[i]=a,r[n]=e-a):t==="SAME_LOWER"&&(r[i]=e-a,r[n]=a)},gd=(e,t,r,i,n,a,s,o,l,d)=>{let c=e.length-2,h=d.length===0;l.length<c&&l.push(...Array(c-l.length).fill(0));let f=e[0],y=t[o?3:1]*n;for(let _=0,w=e.length-c-(o?1:0);_<c;++_,++w){let S=e[w],$=h?S*s[_]:d[_],b=fd(S,s[_],a[_],t[w],r[_],$);md(b,i,a,_,_+c),h&&d.push(s[_]*(S-1)+l[_]+(t[w]-1)*r[_]+1-a[_]-a[_+c])}d.splice(0,0,f),d.splice(o?3:1,0,y)},Vn=(e,t)=>{let r=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((h,f)=>h*f,1)===0){r.length=0;for(let h=2;h<t[1].dims.length;++h)r.push(t[1].dims[h])}let i=e.format==="NHWC";r.splice(0,0,t[1].dims[0]),r.splice(i?3:1,0,t[1].dims[1]);let n=e.pads.slice(),a=e.outputShape.slice(),s=e.outputPadding.slice(),o=t[0].dims,l=e.dilations.slice();if(l.reduce((h,f)=>h+f,0)===0){let h=t[0].dims.length-2;l=new Array(h).fill(1)}let d=e.strides.slice();if(d.reduce((h,f)=>h+f,0)===0){let h=t[0].dims.length-2;d=new Array(h).fill(1)}gd(o,r,l,e.autoPad,e.group,n,d,i,s,a);let c=Object.assign({},e);return Object.assign(c,{kernelShape:r,pads:n,outputPadding:s,outputShape:a,dilations:l,strides:d}),c},qf=e=>{let t=us(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],n=e.dilations,a=e.group??1,s=e.kernelShape,o=e.pads,l=e.strides,d=e.wIsConst(),c=e.outputPadding,h=e.outputShape;return{autoPad:i,format:r,dilations:n,group:a,kernelShape:s,outputPadding:c,outputShape:h,pads:o,strides:l,wIsConst:d,...t,cacheKey:`${e.format};${t.activation};`}},yd=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[0];if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let n=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==n))throw new Error("invalid bias");let a=e[0].dims.length-2;if(t.dilations.reduce((s,o)=>s+o,0)>0&&t.dilations.length!==a)throw new Error(`dilations should be ${a}D`);if(t.strides.reduce((s,o)=>s+o,0)>0&&t.strides.length!==a)throw new Error(`strides should be ${a}D`);if(t.pads.reduce((s,o)=>s+o,0)>0&&t.pads.length!==a*2)throw new Error(`pads should be ${a*2}D`);if(t.outputPadding.length!==a&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${a}D`);if(t.kernelShape.reduce((s,o)=>s+o,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},Gn=(e,t,r,i)=>{let n=e.kernelCustomData.wT??e.compute(We(t[1],[2,3,0,1]),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=n);let a=[t[0],n];t.length===3&&a.push(t[2]),e.compute(Wf(a,r,i),{inputs:a})},_d=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let n=t.kernelShape;(n.length===0||n[0]===0)&&(n=[e.inputs[1].dims[2]]);let a=t.dilations;(a.length===0||a[0]===0)&&(a=[1]);let s=t.strides;(s.length===0||s[0]===0)&&(s=[1]);let o=t.pads;o.length===0&&(o=[0,0]),o=[0,o[0],0,o[1]],s=[1].concat(s),a=[1].concat(a),n=[1].concat(n);let l=t.outputPadding;l=[0].concat(l);let d=Vn({...t,pads:o,strides:s,dilations:a,kernelShape:n,outputPadding:l},i);Gn(e,i,d,c=>r?[c[0],c[2],c[3]]:[c[0],c[1],c[3]])},Vf=(e,t)=>{if(yd(e.inputs,t),e.inputs[0].dims.length===3)_d(e,t);else{let r=Vn(t,e.inputs);Gn(e,e.inputs,r)}}}),wd,Gf,Hf,mw=L(()=>{te(),ie(),Ie(),ne(),wd=(e,t,r,i)=>{let n=M.size(t),a=t.length,s=D("input",e,a),o=Y("output",e,a),l=r.dataType===6?r.getInt32Array()[0]:Number(r.getBigInt64Array()[0]),d=M.normalizeAxis(l,a),c=h=>{let f=` i32(${s.indicesGet("inputIndices","uniforms.axis")}) `,y=Q("uniforms.input_shape","uniforms.axis",a),_=i.reverse?f+(i.exclusive?" + 1":""):"0",w=i.reverse?y:f+(i.exclusive?"":" + 1");return`
                ${h.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(s,o)}
                ${h.mainStart()}
                  ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${o.offsetToIndices("global_idx")};
                  var sum = ${o.type.value}(0);
                  let first : i32 = ${_};
                  let last : i32 = ${w};
                  for (var i : i32 = first; i < last; i++) {
                    ${s.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${s.getByIndices("inputIndices")};
                  }
                  ${o.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:i.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:[{type:12,data:n},{type:12,data:d},...Z(t,t)]}),getShaderSource:c}},Gf=(e,t)=>{let r=e.inputs[0].dims,i=e.inputs[0].dataType,n=e.inputs[1];e.compute(wd(i,r,n,t),{inputs:[0]})},Hf=e=>{let t=e.exclusive===1,r=e.reverse===1;return ge({exclusive:t,reverse:r})}}),bd,$d,vd,Ff,jf,gw=L(()=>{te(),ie(),Ie(),ne(),bd=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},$d=(e,t,r,i)=>{let n=[];n.push(`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`);for(let a=0;a<t;++a)n.push(r.indicesSet("a",e[a],`i[${a}]`));return n.push("return a;}"),n.join(`
`)},vd=(e,t)=>{let r,i,n,a,s,o,l=t.format==="NHWC",d=t.blocksize,c=t.mode==="DCR";l?([r,i,n,a]=e.dims,s=c?[r,i,n,d,d,a/d**2]:[r,i,n,a/d**2,d,d],o=c?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([r,i,n,a]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],s=c?[r,d,d,a/d**2,i,n]:[r,a/d**2,d,d,i,n],o=c?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let h=e.reshape(s),f=h.dims.length,y=e.dataType,_=D("a",y,f),w=Y("output",y,f),S=$=>`
  ${$.registerUniform("output_size","u32").declareVariables(_,w)}

  ${$d(o,f,_,w)}

  ${$.mainStart()}
    ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${w.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${w.setByOffset("global_idx",_.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:$=>{let b=l?[r,i*d,n*d,a/d**2]:[r,a/d**2,i*d,n*d],T=M.size(b),I=h.dims,E=M.sortBasedOnPerm(I,o);return{outputs:[{dims:b,dataType:$[0].dataType}],dispatchGroup:{x:Math.ceil(T/64)},programUniforms:[{type:12,data:T},...Z(I,E)]}},getShaderSource:S}},Ff=(e,t)=>{bd(e.inputs),e.compute(vd(e.inputs[0],t))},jf=e=>ge({blocksize:e.blocksize,mode:e.mode,format:e.format})}),fi,xr,Hn,xd,Sd,Id,Td,Fn,kd,Kf,Yf,yw=L(()=>{te(),ie(),Ie(),ne(),fi="[a-zA-Z]|\\.\\.\\.",xr="("+fi+")+",Hn="^"+xr+"$",xd="("+xr+",)*"+xr,Sd="^"+xd+"$",Id=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let r=this.symbolToIndices.get(e);r===void 0?r=[t]:r.push(t),this.symbolToIndices.set(e,r)}},Td=class{constructor(e,t){var n;this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[r,i]=t.includes("->")?t.split("->",2):[t,""];if(!r.match(RegExp(Sd)))throw new Error("Invalid LHS term");if(r.split(",").forEach((a,s)=>{let o=e[s].dims.slice();if(!a.match(RegExp(Hn)))throw new Error("Invalid LHS term");let l=this.processTerm(a,!0,o,s);this.lhs.push(l)}),i==="")i+=[...this.symbolToInfo.entries()].filter(([a,s])=>s.count===1||a==="...").map(([a])=>a).join("");else if(!i.match(RegExp(xr)))throw new Error("Invalid RHS");(n=i.match(RegExp(fi,"g")))==null||n.forEach(a=>{if(a==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let s=this.symbolToInfo.get(a);if(s===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(s.dimValue)}}),this.rhs=this.processTerm(i,!1,this.outputDims)}addSymbol(e,t,r){let i=this.symbolToInfo.get(e);if(i!==void 0){if(i.dimValue!==t&&i.count!==1)throw new Error("Dimension mismatch");i.count++,i.inputIndices.push(r)}else i={count:1,dimValue:t,inputIndices:[r]};this.symbolToInfo.set(e,i)}processTerm(e,t,r,i=-1){let n=r.length,a=!1,s=[],o=0;if(!e.match(RegExp(Hn))&&!t&&e!=="")throw new Error("Invalid LHS term");let l=e.match(RegExp(fi,"g")),d=new Id(i);return l==null||l.forEach((c,h)=>{if(c==="..."){if(a)throw new Error("Only one ellipsis is allowed per input term");a=!0;let f=n-l.length+1;if(f<0)throw new Error("Ellipsis out of bounds");if(s=r.slice(o,o+f),this.hasEllipsis){if(this.ellipsisDims.length!==s.length||this.ellipsisDims.toString()!==s.toString())throw new Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=s;else throw new Error("Ellipsis must be specified in the LHS");for(let y=0;y<s.length;y++){let _=String.fromCharCode(48+y);d.addSymbol(_,h+y),this.addSymbol(_,r[o++],i)}}else d.addSymbol(c,h+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(c,r[o++],i)}),d}},Fn=e=>e+"_max",kd=(e,t,r,i)=>{let n=e.map(d=>d.length).map((d,c)=>D(`input${c}`,t,d)),a=M.size(i),s=Y("output",t,i.length),o=[...r.symbolToInfo.keys()].filter(d=>!r.rhs.symbolToIndices.has(d)),l=d=>{let c=[],h="var prod = 1.0;",f="var sum = 0.0;",y="sum += prod;",_=[],w=[],S=[],$=[],b=r.symbolToInfo.size===r.rhs.symbolToIndices.size;r.symbolToInfo.forEach((I,E)=>{var A;if(r.rhs.symbolToIndices.has(E)){let O=(A=r.rhs.symbolToIndices.get(E))==null?void 0:A[0];O!==void 0&&r.lhs.forEach((x,z)=>{if(I.inputIndices.includes(z)){let N=x.symbolToIndices.get(E);if(N===void 0)throw new Error("Invalid symbol error");N.forEach(q=>{c.push(`${n[z].indicesSet(`input${z}Indices`,q,s.indicesGet("outputIndices",O))}`)})}})}else r.lhs.forEach((O,x)=>{if(I.inputIndices.includes(x)){let z=O.symbolToIndices.get(E);if(z===void 0)throw new Error("Invalid symbol error");z.forEach(N=>{_.push(`${n[x].indicesSet(`input${x}Indices`,N,`${E}`)}`)}),$.push(`prod *= ${n[x].getByIndices(`input${x}Indices`)};`)}}),w.push(`for(var ${E}: u32 = 0; ${E} < uniforms.${Fn(E)}; ${E}++) {`),S.push("}")});let T=b?[...c,`let sum = ${n.map((I,E)=>I.getByIndices(`input${E}Indices`)).join(" * ")};`]:[...c,f,...w,..._,h,...$,y,...S];return`
            ${d.registerUniforms(o.map(I=>({name:`${Fn(I)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...n,s)}

            ${d.mainStart()}
            ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${s.offsetToIndices("global_idx")};
            ${n.map((I,E)=>`var input${E}Indices: ${n[E].type.indices};`).join(`
`)}
            ${T.join(`
`)};
            ${s.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:r.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let d=o.filter(h=>r.symbolToInfo.has(h)).map(h=>{var f;return{type:12,data:((f=r.symbolToInfo.get(h))==null?void 0:f.dimValue)||0}});d.push({type:12,data:a});let c=e.map((h,f)=>[...Z(h)]).reduce((h,f)=>h.concat(f),d);return c.push(...Z(i)),{outputs:[{dims:i,dataType:t}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:c}},getShaderSource:l}},Kf=(e,t)=>{let r=new Td(e.inputs,t.equation),i=r.outputDims,n=e.inputs.map((a,s)=>a.dims);e.compute(kd(n,e.inputs[0].dataType,r,i))},Yf=e=>{let t=e.equation.replace(/\s+/g,"");return ge({equation:t})}}),Ed,jn,Cd,zd,Qf,_w=L(()=>{te(),ie(),ne(),Ed=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=r.length<t.length?0:r.length-t.length,n=t.length<r.length?0:t.length-r.length;for(;i<r.length&&n<t.length;++i,++n)if(r[i]!==t[n]&&r[i]!==1&&t[n]!==1)throw new Error("Expand requires shape to be broadcastable to input")},jn=(e,t)=>{let r=e.length-t.length,i=[];for(let n=0;n<r;++n)i.push(e[n]);for(let n=0;n<t.length;++n)i.push(t[n]===1?e[n+r]:t[n]);return i},Cd=(e,t)=>e.length>t.length?jn(e,t):jn(t,e),zd=e=>{let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=Cd(t,r),n=e[0].dataType,a=n===9||M.size(t)===1,s=n===9||t.length>0&&t[t.length-1]%4===0?4:1,o=a||i.length>0&&i[i.length-1]%4===0?4:1,l=Math.ceil(M.size(i)/o),d=h=>{let f=D("input",n,t.length,s),y=Y("output",n,i.length,o),_;if(n===9){let w=(S,$,b="")=>`
          let outputIndices${$} = ${y.offsetToIndices(`outputOffset + ${$}u`)};
          let offset${$} = ${f.broadcastedIndicesToOffset(`outputIndices${$}`,y)};
          let index${$} = offset${$} / 4u;
          let component${$} = offset${$} % 4u;
          ${S}[${$}] = ${b}(${f.getByOffset(`index${$}`)}[component${$}]);
        `;_=`
        let outputOffset = global_idx * ${o};
        var data = vec4<u32>(0);
        ${w("data",0,"u32")}
        ${w("data",1,"u32")}
        ${w("data",2,"u32")}
        ${w("data",3,"u32")}
        ${y.setByOffset("global_idx","data")}
      }`}else _=`
        let outputIndices = ${y.offsetToIndices(`global_idx * ${o}`)};
        let inputOffset = ${f.broadcastedIndicesToOffset("outputIndices",y)};
        let data = ${y.type.value}(${f.getByOffset(`inputOffset / ${s}`)});
        ${y.setByOffset("global_idx","data")}
      }`;return`
    ${h.registerUniform("vec_size","u32").declareVariables(f,y)}
    ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${_}`},c=[{type:12,data:l},...Z(t,i)];return{name:"Expand",shaderCache:{hint:`${i.length};${s}${o}`,inputDependencies:["rank"]},getShaderSource:d,getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:c})}},Qf=e=>{Ed(e.inputs),e.compute(zd(e.inputs),{inputs:[0]})}}),Ad,Zf,ww=L(()=>{te(),ie(),ne(),os(),Ad=e=>{let t=e[0].dataType,r=M.size(e[0].dims),i=M.size(e[1].dims),n=i%4===0,a=s=>{let o=D("x",t,[1],4),l=D("bias",t,[1],4),d=Y("y",t,[1],4),c=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],h=y=>`
      let bias${y}_offset: u32 = (global_idx * 4 + ${y}) % uniforms.bias_size;
      let bias${y} = ${l.getByOffset(`bias${y}_offset / 4`)}[bias${y}_offset % 4];`,f=n?`
      let bias = ${l.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${h(0)}${h(1)}${h(2)}${h(3)}
      let bias = ${o.type.value}(bias0, bias1, bias2, bias3);`;return`${s.registerUniforms(c).declareVariables(o,l,d)}

    ${ka(ze(t))}

    ${s.mainStart(or)}
      ${s.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${o.getByOffset("global_idx")};
      ${f}
      let x_in = x + bias;
      ${d.setByOffset("global_idx",Ea("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${n}`,inputDependencies:["type","type"]},getShaderSource:a,getRunData:s=>({outputs:[{dims:s[0].dims,dataType:s[0].dataType}],programUniforms:[{type:12,data:Math.ceil(r/4)},{type:12,data:i}],dispatchGroup:{x:Math.ceil(r/or/4)}})}},Zf=e=>{e.inputs.length<2||M.size(e.inputs[1].dims)===0?yf(e):e.compute(Ad(e.inputs))}}),Od,Rd,Xf,Jf,bw=L(()=>{te(),ie(),Ie(),ne(),Od=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},Rd=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r.length,a=M.normalizeAxis(t.axis,n),s=r.slice(0);s.splice(a,1,...i);let o=r[a],l=e[0].dataType===9?4:1,d=Math.ceil(M.size(s)/l),c=[{type:12,data:d},{type:6,data:o},{type:12,data:a},...Z(e[0].dims,e[1].dims,s)],h=f=>{let y=D("data",e[0].dataType,e[0].dims.length,l),_=D("inputIndices",e[1].dataType,e[1].dims.length),w=Y("output",e[0].dataType,s.length,l),S=b=>{let T=i.length,I=`var indicesIndices${b}  = ${_.type.indices}(0);`;for(let E=0;E<T;E++)I+=`${T>1?`indicesIndices${b}[${E}]`:`indicesIndices${b}`} = ${s.length>1?`outputIndices${b}[uniforms.axis + ${E}]`:`outputIndices${b}`};`;I+=`
          var idx${b} = ${_.getByIndices(`indicesIndices${b}`)};
          if (idx${b} < 0) {
            idx${b} = idx${b} + uniforms.axisDimLimit;
          }
          var dataIndices${b} : ${y.type.indices};
        `;for(let E=0,A=0;E<n;E++)E===a?(I+=`${n>1?`dataIndices${b}[${E}]`:`dataIndices${b}`} = u32(idx${b});`,A+=T):(I+=`${n>1?`dataIndices${b}[${E}]`:`dataIndices${b}`} = ${s.length>1?`outputIndices${b}[${A}]`:`outputIndices${b}`};`,A++);return I},$;if(e[0].dataType===9){let b=(T,I,E="")=>`
          let outputIndices${I} = ${w.offsetToIndices(`outputOffset + ${I}u`)};
          ${S(I)};
          let offset${I} = ${y.indicesToOffset(`dataIndices${I}`)};
          let index${I} = offset${I} / 4u;
          let component${I} = offset${I} % 4u;
          ${T}[${I}] = ${E}(${y.getByOffset(`index${I}`)}[component${I}]);
        `;$=`
        let outputOffset = global_idx * ${l};
        var value = vec4<u32>(0);
        ${b("value",0,"u32")}
        ${b("value",1,"u32")}
        ${b("value",2,"u32")}
        ${b("value",3,"u32")}
        ${w.setByOffset("global_idx","value")}
      `}else $=`
      let outputIndices = ${w.offsetToIndices("global_idx")};
      ${S("")};
      let value = ${y.getByIndices("dataIndices")};
      ${w.setByOffset("global_idx","value")};
      `;return`
      ${f.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(y,_,w)}
      ${f.mainStart()}
        ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${$}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:s,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:c}),getShaderSource:h}},Xf=e=>ge({axis:e.axis}),Jf=(e,t)=>{let r=e.inputs;Od(r),e.compute(Rd(e.inputs,t))}}),Md,em,tm,$w=L(()=>{te(),ie(),ne(),Md=(e,t,r,i,n,a,s,o,l)=>{let d=[{type:12,data:a},{type:12,data:i},{type:12,data:n},{type:12,data:r},{type:12,data:s},{type:12,data:o},{type:12,data:l}],c=[a];d.push(...Z(t.dims,c));let h=f=>{let y=D("indices_data",t.dataType,t.dims.length),_=Y("input_slice_offsets_data",12,1,1),w=[y,_],S=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:n.length},{name:"sizes_from_slice_dims_data",type:"u32",length:r.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${f.registerUniforms(S).declareVariables(...w)}
  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${n.length===1?"index += i32(uniforms.input_dims);":"index += i32(uniforms.input_dims[input_dim_idx]);"}
      }
      ${r.length===1?"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);":"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${n.length}_${r.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:c,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:d}),getShaderSource:h},{inputs:[t],outputs:[-1]})[0]},em=(e,t)=>{let r=e.inputs,i=r[0].dims,n=r[0].dataType,a=r[1].dims,s=a[a.length-1],o=M.sizeToDimension(a,a.length-1),l=M.sizeFromDimension(i,t.batchDims+s),d=M.sizeToDimension(i,t.batchDims),c=M.sizeFromDimension(i,t.batchDims),h=o/d,f=new Array(s),y=l;for(let I=0;I<s;++I)f[s-1-I]=y,y*=i[t.batchDims+s-1-I];let _=Md(e,r[1],f,t.batchDims,i,o,h,c,s),w=t.batchDims+s;if(w>i.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let S=a.slice(0,-1).concat(i.slice(w)),$=M.size(S),b=[{type:12,data:$},{type:12,data:l},...Z(r[0].dims,_.dims,S)],T=I=>{let E=D("data",r[0].dataType,r[0].dims.length),A=D("slice_offsets",12,_.dims.length),O=Y("output",r[0].dataType,S.length);return`
          ${I.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(E,A,O)}
            ${I.mainStart()}
            ${I.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:S,dataType:n}],dispatchGroup:{x:Math.ceil($/64)},programUniforms:b}),getShaderSource:T},{inputs:[r[0],_]})},tm=e=>({batchDims:e.batch_dims,cacheKey:""})}),Bd,Dd,rm,im,vw=L(()=>{te(),ie(),Ie(),ne(),Bd=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let r=M.normalizeAxis(t.quantizeAxis,e[0].dims.length),i=t.blockSize,n=e[0],a=e[2],s=e.length===4?e[3]:void 0;if(a.dims.length!==n.dims.length||!n.dims.map((o,l)=>l===r?Math.ceil(o/i)===a.dims[l]:o===a.dims[l]).reduce((o,l)=>o&&l,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(s){if(s.dataType!==n.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(s.dims.length!==a.dims.length||!s.dims.map((o,l)=>o===a.dims[l]).reduce((o,l)=>o&&l,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},Dd=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r.length,a=M.normalizeAxis(t.gatherAxis,n),s=M.normalizeAxis(t.quantizeAxis,n),o=r.slice(0);o.splice(a,1,...i);let l=M.size(o),d=e[2].dataType,c=e[0].dataType===22,h=[{type:12,data:l},{type:12,data:s},{type:12,data:a},{type:12,data:t.blockSize},...Z(...e.map((y,_)=>y.dims),o)],f=y=>{let _=D("data",e[0].dataType,e[0].dims.length),w=D("inputIndices",e[1].dataType,e[1].dims.length),S=D("scales",e[2].dataType,e[2].dims.length),$=e.length>3?D("zeroPoint",e[3].dataType,e[3].dims.length):void 0,b=Y("output",d,o.length),T=[_,w,S];$&&T.push($);let I=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${y.registerUniforms(I).declareVariables(...T,b)}
        ${y.mainStart()}
        let output_indices = ${b.offsetToIndices("global_idx")};
        var indices_indices = ${w.type.indices}(0);
        ${i.length>1?`
          for (var i: u32 = 0; i < ${i.length}; i++) {
            let index = ${b.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${w.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${b.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${_.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${b.indicesGet("output_indices","i")};
          ${_.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${w.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${r[a]};
        }
        ${_.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${o.length}; i++) {
          let index = ${b.indicesGet("output_indices",`i + ${i.length} - 1`)};
          ${_.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${_.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${_.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${c?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${S.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${S.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${S.getByIndices("scale_indices")};
        ${$?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${$.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${$.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${c?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${ze(d)}(quantized_data - zero_point) * scale;
        ${b.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((y,_)=>_!==1).map(y=>y.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(y,_)=>"rank")},getRunData:()=>({outputs:[{dims:o,dataType:d}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:h}),getShaderSource:f}},rm=(e,t)=>{let r=e.inputs;Bd(r,t),e.compute(Dd(e.inputs,t))},im=e=>ge({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),Nd,Pd,nm,am,xw=L(()=>{te(),ie(),Ie(),ne(),Nd=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},Pd=(e,t)=>{let r=e[0].dims,i=e[0].dataType,n=r.length,a=e[1].dims,s=e[1].dataType,o=M.normalizeAxis(t.axis,n),l=r[o],d=a.slice(0),c=M.size(d),h=D("input",i,n),f=D("indicesInput",s,a.length),y=Y("output",i,d.length),_=[{type:12,data:c},{type:6,data:l},{type:12,data:o}];return _.push(...Z(r,a,d)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:d,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:_}),getShaderSource:w=>`
      ${w.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(h,f,y)}
      ${w.mainStart()}
      ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${y.offsetToIndices("global_idx")};

      var idx = ${f.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${h.type.indices}(outputIndices);
      ${h.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${h.getByIndices("inputIndices")};

      ${y.setByOffset("global_idx","value")};
  }`}},nm=e=>ge({axis:e.axis}),am=(e,t)=>{let r=e.inputs;Nd(r),e.compute(Pd(e.inputs,t))}}),Ud,Ld,sm,om,Sw=L(()=>{te(),ie(),ne(),Ud=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},Ld=(e,t)=>{let r=e[0].dims.slice(),i=e[1].dims.slice(),[n,a,s]=ih.getShapeOfGemmResult(r,t.transA,i,t.transB,e.length===3?e[2].dims:void 0),o=[n,a];if(!o)throw new Error("Can't use gemm on the given tensors");let l=16,d=Math.ceil(a/l),c=Math.ceil(n/l),h=!0,f=M.size(o),y=[{type:12,data:h?d:f},{type:12,data:n},{type:12,data:a},{type:12,data:s},{type:1,data:t.alpha},{type:1,data:t.beta}],_=["type","type"];e.length===3&&(y.push(...Z(e[2].dims)),_.push("rank")),y.push(...Z(o));let w=$=>{let b="";t.transA&&t.transB?b="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?b="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?b="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&(b="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let T=t.alpha===1?"":"value *= uniforms.alpha;",I=D("a",e[0].dataType,e[0].dims),E=D("b",e[1].dataType,e[1].dims),A=I.type.value,O=null,x=[I,E];e.length===3&&(O=D("c",e[2].dataType,e[2].dims.length),x.push(O));let z=Y("output",e[0].dataType,o.length);x.push(z);let N=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${$.registerUniforms(N).declareVariables(...x)}

  ${$.mainStart()}
    ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${A}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${b}
    }

    ${T}
    ${O!=null?`let cOffset = ${O.broadcastedIndicesToOffset("vec2(m, n)",z)}; value += ${A}(uniforms.beta) * ${O.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},S=$=>{let b=D("a",e[0].dataType,e[0].dims),T=D("b",e[1].dataType,e[1].dims),I=null,E=[b,T];e.length===3&&(I=D("c",e[2].dataType,e[2].dims.length),E.push(I));let A=Y("output",e[0].dataType,o.length);E.push(A);let O=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],x="",z="";t.transA&&t.transB?(z=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${T.type.value}(0);
      }
      `,x="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):t.transA&&!t.transB?(z=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${T.type.value}(0);
      }
      `,x="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!t.transA&&t.transB?(z=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${T.type.value}(0);
      }
      `,x="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):!t.transA&&!t.transB&&(z=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${T.type.value}(0);
      }
      `,x="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let N=t.alpha===1?"":"value *= uniforms.alpha;";return`
  ${$.registerUniforms(O).declareVariables(...E)}
  var<workgroup> tile_a: array<array<${b.type.storage}, ${l}>, ${l}>;
  var<workgroup> tile_b: array<array<${T.type.storage}, ${l}>, ${l}>;
  ${$.mainStart([l,l,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${l};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${l};
    let num_tiles = (uniforms.K - 1) / ${l} + 1;
    var k_start = 0u;
    var value = ${A.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${z}
      k_start = k_start + ${l};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${l}; k++) {
        ${x}
      }
      workgroupBarrier();
    }

    ${N}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${I!=null?`let cOffset = ${I.broadcastedIndicesToOffset("vec2(m, n)",A)}; value += ${A.type.value}(uniforms.beta) * ${I.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return h?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:d*c},programUniforms:y}),getShaderSource:S}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:y}),getShaderSource:w}},sm=e=>{let t=e.transA,r=e.transB,i=e.alpha,n=e.beta;return{transA:t,transB:r,alpha:i,beta:n,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},om=(e,t)=>{Ud(e.inputs),e.compute(Ld(e.inputs,t))}}),at,lt,zt,At,Wd,qd,Vd,Gd,Hd,Fd,jd,Kd,um,lm,Iw=L(()=>{te(),ie(),Ie(),ne(),[at,lt,zt,At]=[0,1,2,3],Wd=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},qd=`
  fn gs_get_cubic_coeffs(x: f32) -> vec4<f32> {
    let cubic_alpha = -0.75f;
    let x_abs = abs(x);
    var coeffs: vec4<f32>;
    coeffs[0] = (((cubic_alpha * (x_abs + 1) - 5 * cubic_alpha) * (x_abs + 1) + 8 * cubic_alpha) * (x_abs + 1) - 4 * cubic_alpha);
    coeffs[1] = (((cubic_alpha + 2) * x_abs - (cubic_alpha + 3)) * x_abs * x_abs + 1);
    coeffs[2] = (((cubic_alpha + 2) * (1 - x_abs) - (cubic_alpha + 3)) * (1 - x_abs) * (1 - x_abs) + 1);
    coeffs[3] = (((cubic_alpha * (2 - x_abs) - 5 * cubic_alpha) * (2 - x_abs) + 8 * cubic_alpha) * (2 - x_abs) - 4 * cubic_alpha);
    return coeffs;
  }
`,Vd=e=>`
  fn gs_bicubic_interpolate(p: mat4x4<${e}>, x: f32, y: f32) -> ${e} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${e}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`,Gd=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,Hd=e=>`
  ${e.paddingMode==="reflection"?`
      fn gs_reflect(x: i32, x_min: f32, x_max: f32) -> u32 {
        var dx = 0.0;
        var fx = f32(x);
        let range = x_max - x_min;
        if (fx < x_min) {
          dx = x_min - fx;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_min + r;
          } else {
            fx = x_max - r;
          }
        } else if (fx > x_max) {
          dx = fx - x_max;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_max - r;
          } else {
            fx = x_min + r;
          }
        }
        return u32(fx);
      }`:""}
`,Fd=(e,t,r)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${at}] = batch;
     indices[${lt}] = channel;`+(()=>{switch(r.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${zt}] = u32(r);
            indices[${At}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;case"border":return`
          indices[${zt}] = u32(clamp(r, 0, H - 1));
          indices[${At}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${zt}] = gs_reflect(r, border[1], border[3]);
          indices[${At}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${r.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,jd=(e,t,r)=>(()=>{switch(r.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${at}], indices[${lt}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${at}], indices[${lt}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${at}], indices[${lt}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${at}], indices[${lt}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${at}], indices[${lt}], border);

          let dx2 = ${t}(f32(x2) - x);
          let dx1 = ${t}(x - f32(x1));
          let dy2 = ${t}(f32(y2) - y);
          let dy1 = ${t}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;case"bicubic":return`
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${t}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${at}], indices[${lt}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${r.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,Kd=(e,t)=>{let r=D("x",e[0].dataType,e[0].dims.length),i=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],n=D("grid",e[1].dataType,i.length,2),a=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(a=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[at,lt,zt,At]=[0,3,1,2]);let s=Y("output",e[0].dataType,a.length),o=r.type.value,l=M.size(a),d=[{type:12,data:l},...Z(e[0].dims,i,a)],c=h=>`
  ${h.registerUniform("output_size","u32").declareVariables(r,n,s)}
  ${qd}
  ${Vd(o)}
  ${Gd(t)}
  ${Hd(t)}
  ${Fd(r,o,t)}

  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${zt}]);
      let W_in = i32(uniforms.x_shape[${At}]);

      ${t.alignCorners===0?`
      let x_min = -0.5;
      let x_max = f32(W_in) - 0.5;
      let y_min = -0.5;
      let y_max = f32(H_in) - 0.5;
      `:`
      let x_min = 0.0;
      let x_max = f32(W_in) - 1.0;
      let y_min = 0.0;
      let y_max = f32(H_in) - 1.0;
      `};
      let border = vec4<f32>(x_min, y_min, x_max, y_max);

      let indices = ${s.offsetToIndices("global_idx")};
      var grid_indices = vec3<u32>(indices[${at}], indices[${zt}], indices[${At}]);
      let nxy = ${n.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${jd(s,o,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:h=>{let f=M.size(a);return{outputs:[{dims:a,dataType:h[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:d}},getShaderSource:c}},um=(e,t)=>{Wd(e.inputs),e.compute(Kd(e.inputs,t))},lm=e=>ge({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),Oe,Yd,dm,Kn,Qd,Ar,pm,cm=L(()=>{te(),ie(),Ie(),is(),ss(),ne(),St(),Oe=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,Yd=(e,t)=>{let r=e[0],i=Oe(e,1),n=Oe(e,2),a=Oe(e,3),s=Oe(e,4),o=Oe(e,5),l=Oe(e,6),d=Oe(e,7);if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let c=r.dims[0],h=r.dims[1],f=r.dims.length===3?r.dims[2]:t.numHeads*r.dims[4],y=h,_=0,w=0,S=Math.floor(f/t.numHeads);if(l&&d&&M.size(l.dims)&&M.size(d.dims)){if(l.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(l.dims[0]!==c||l.dims[1]!==t.numHeads||l.dims[3]!==S)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(d.dims[0]!==c||d.dims[1]!==t.numHeads||d.dims[3]!==S)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(l.dims[2]!==d.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(d.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');_=l.dims[2],w=l.dims[2]}else if(l&&M.size(l.dims)||d&&M.size(d.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let $;if(i&&M.size(i.dims)>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(i.dims[2]!==r.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');$=2,y=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==S)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(n)throw new Error('Expect "value" be none when "key" has packed kv format.');$=5,y=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==S)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');$=0,y=i.dims[2]}}else{if(r.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(r.dims[2]!==t.numHeads||r.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');$=3}if(a&&M.size(a.dims)>0){if(a.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(i&&i.dims.length===5&&i.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let b=_+y,T=0;if(s&&M.size(s.dims)>0){T=8;let O=s.dims;throw O.length===1?O[0]===c?T=1:O[0]===3*c+2&&(T=3):O.length===2&&O[0]===c&&O[1]===b&&(T=5),T===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let I=!1,E=f;if(n&&M.size(n.dims)>0){if(n.dims.length!==3&&n.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(n.dims.length===3){if(y!==n.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');E=n.dims[2]}else{if(y!==n.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');E=n.dims[1]*n.dims[3],I=!0}}let A=!1;if(s&&M.size(s.dims)>0)throw new Error("Key padding mask is not supported");if(o&&M.size(o.dims)>0){if(o.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(o.dims[0]!==c||o.dims[1]!==t.numHeads||o.dims[2]!==h||o.dims[3]!==b)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:c,sequenceLength:h,pastSequenceLength:_,kvSequenceLength:y,totalSequenceLength:b,maxSequenceLength:w,inputHiddenSize:0,hiddenSize:f,vHiddenSize:E,headSize:S,vHeadSize:Math.floor(E/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:T,scale:t.scale,broadcastResPosBias:A,passPastInKv:I,qkvFormat:$}},dm=e=>ge({...e}),Kn=ge({perm:[0,2,1,3]}),Qd=(e,t,r,i,n,a,s)=>{let o=[i,n,a],l=M.size(o),d=[{type:12,data:l},{type:12,data:s},{type:12,data:a}],c=h=>{let f=Y("qkv_with_bias",t.dataType,o),y=D("qkv",t.dataType,o),_=D("bias",r.dataType,o),w=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${h.registerUniforms(w).declareVariables(y,_,f)}
  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:o,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:d}),getShaderSource:c},{inputs:[t,r],outputs:[-1]})[0]},Ar=(e,t,r,i,n,a,s,o)=>{let l=a;if(s&&M.size(s.dims)>0){if(i===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return l=Qd(e,a,s,t,i,r*n,o),l=l.reshape([t,i,r,n]),r===1||i===1?l:e.compute(We(l,Kn.perm),{inputs:[l],outputs:[-1]})[0]}else return a.dims.length===3&&(l=a.reshape([t,i,r,n])),r===1||i===1?l:e.compute(We(l,Kn.perm),{inputs:[l],outputs:[-1]})[0]},pm=(e,t)=>{let r=Yd(e.inputs,t),i=e.inputs[0],n=Oe(e.inputs,1),a=Oe(e.inputs,2),s=Oe(e.inputs,3),o=Oe(e.inputs,4),l=Oe(e.inputs,5),d=Oe(e.inputs,6),c=Oe(e.inputs,7);if(i.dims.length===5)throw new Error("Packed QKV is not implemented");if((n==null?void 0:n.dims.length)===5)throw new Error("Packed KV is not implemented");let h=n&&a&&n.dims.length===4&&a.dims.length===4,f=Ar(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,i,s,0);if(h)return Ur(e,f,n,a,o,void 0,d,c,l,r);if(!n||!a)throw new Error("key and value must be provided");let y=Ar(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.headSize,n,s,r.hiddenSize),_=Ar(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.vHeadSize,a,s,2*r.hiddenSize);Ur(e,f,y,_,o,void 0,d,c,l,r)}}),Zd,Xd,Jd,ep,Ra,hm,fm,mm=L(()=>{te(),ie(),Ie(),ne(),Zd=e=>{if(!e||e.length<1)throw new Error("too few inputs")},Xd=(e,t)=>{let r=[],i=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(n=>r.push(Number(n))),i=r.length),ge({numOutputs:i,axis:t.axis,splitSizes:r})},Jd=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${Q("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,ep=e=>{let t=e.length,r=[];for(let i=0;i<t;++i){let n=e[i].setByIndices("indices","input[global_idx]");t===1?r.push(n):i===0?r.push(`if (output_number == ${i}u) { ${n} }`):i===t-1?r.push(`else { ${n} }`):r.push(`else if (output_number == ${i}) { ${n} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${r.join(`
`)}
      }`},Ra=(e,t)=>{let r=e[0].dims,i=M.size(r),n=e[0].dataType,a=M.normalizeAxis(t.axis,r.length),s=new Array(t.numOutputs),o=D("input",n,r.length),l=new Array(t.numOutputs),d=[],c=[],h=0,f=[{type:12,data:i}];for(let _=0;_<t.numOutputs;_++){h+=t.splitSizes[_],l[_]=h;let w=r.slice();w[a]=t.splitSizes[_],c.push(w),s[_]=Y(`output${_}`,n,w.length),d.push({dims:c[_],dataType:e[0].dataType})}f.push({type:12,data:l},...Z(r,...c));let y=_=>`
  ${_.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",l.length).declareVariables(o,...s)}
  ${Jd(l.length)}
  ${ep(s)}

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${o.offsetToIndices("global_idx")};
    var index = ${o.indicesGet("indices",a)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${Q("uniforms.size_in_split_axis","output_number - 1u",l.length)};
      ${o.indicesSet("indices",a,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:y,getRunData:()=>({outputs:d,dispatchGroup:{x:Math.ceil(i/64)},programUniforms:f})}},hm=(e,t)=>{Zd(e.inputs);let r=e.inputs.length===1?t:Xd(e.inputs,t);e.compute(Ra(e.inputs,r),{inputs:[0]})},fm=e=>{let t=e.axis,r=e.splitSizes,i=e.numOutputs<0?r.length:e.numOutputs;if(i!==r.length)throw new Error("numOutputs and splitSizes length must be equal");return ge({axis:t,numOutputs:i,splitSizes:r})}}),tp,Bi,gm,ym=L(()=>{te(),ie(),Ie(),ne(),tp=(e,t)=>{let[r,i,n,a]=e,{numHeads:s,rotaryEmbeddingDim:o}=t;if(r.dims.length!==3&&r.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${r.dims.length}`);if(!M.areEqual(i.dims,[])&&!M.areEqual(i.dims,[1])&&i.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${i.dims.length}`);if(n.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${n.dims.length}`);if(a.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${a.dims.length}`);if(!M.areEqual(n.dims,a.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(o>0&&s===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let l=r.dims[0],d=r.dims[r.dims.length-2],c=n.dims[0],h=M.sizeFromDimension(r.dims,1)/d,f=o===0?n.dims[1]*2:h/s;if(o>f)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(i.dims.length===2){if(l!==i.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${i.dims[0]}`);if(d!==i.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${i.dims[1]}`)}if(f/2!==n.dims[1]&&o/2!==n.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${n.dims[1]}`);if(d>c)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported")},Bi=(e,t)=>{let{interleaved:r,numHeads:i,rotaryEmbeddingDim:n,scale:a}=t,s=e[0].dims[0],o=M.sizeFromDimension(e[0].dims,1),l=e[0].dims[e[0].dims.length-2],d=o/l,c=e[2].dims[1],h=n===0?c*2:d/i,f=new Array(s,l,d/h,h-c),y=M.computeStrides(f),_=[{type:1,data:a},{type:12,data:f},{type:12,data:y},...e[0].dims.length===3?new Array({type:12,data:[o,d,h,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[o,h,l*h,1]}):[],...Z(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],w=S=>{let $=D("input",e[0].dataType,e[0].dims.length),b=D("position_ids",e[1].dataType,e[1].dims.length),T=D("cos_cache",e[2].dataType,e[2].dims.length),I=D("sin_cache",e[3].dataType,e[3].dims.length),E=Y("output",e[0].dataType,e[0].dims.length);return S.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:f.length},{name:"global_strides",type:"u32",length:y.length},{name:"input_output_strides",type:"u32",length:y.length}]),`
        ${S.declareVariables($,b,T,I,E)}

        ${S.mainStart(or)}
          let half_rotary_emb_dim = uniforms.${T.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${S.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${b.broadcastedIndicesToOffset("bsnh.xy",Y("",b.type.tensor,2))};
            let position_id =
                u32(${b.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${r});
            let j = i + select(half_rotary_emb_dim, 1, ${r});
            let re = ${$.getByOffset("i")} * ${T.get("position_id","bsnh[3]")} -
                ${$.getByOffset("j")} * ${I.get("position_id","bsnh[3]")};
            ${E.setByOffset("i","re")}
            let im = ${$.getByOffset("i")} * ${I.get("position_id","bsnh[3]")} +
                ${$.getByOffset("j")} * ${T.get("position_id","bsnh[3]")};
            ${E.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${E.setByOffset("k",$.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:ge({interleaved:r}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:w,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(M.size(f)/or)},programUniforms:_})}},gm=(e,t)=>{tp(e.inputs,t),e.compute(Bi(e.inputs,t))}}),rp,ip,Yn,np,_m,Tw=L(()=>{Ie(),te(),ss(),cm(),mm(),St(),ym(),ne(),rp=(e,t)=>{if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let r=e[0],i=e[1],n=e[2],a=e[3],s=e[4];if(t.doRotary!==0&&e.length<=7)throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let o=!1,l=r.dims[0],d=r.dims[1],c=r.dims.length===3?o?r.dims[2]/3:r.dims[2]:t.numHeads*r.dims[4],h=d,f=0,y=!i||i.dims.length===0,_=Math.floor(y?c/(t.numHeads+2*t.kvNumHeads):c/t.numHeads);y&&(c=_*t.numHeads);let w=a&&a.dims.length!==0,S=s&&s.dims.length!==0;if(w&&a.dims.length===4&&a.dims[0]===l&&a.dims[1]!==t.kvNumHeads&&a.dims[2]===t.kvNumHeads&&a.dims[3]===_)throw new Error("BSNH pastKey/pastValue is not supported");if(w&&S){if(a.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(s.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');f=a.dims[2]}else if(w||S)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let $=1;if(i&&i.dims.length>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(r.dims[2]%i.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');h=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==_)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(n)throw new Error('Expect "value" be none when "key" has packed kv format.');h=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==_)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');h=i.dims[2]}}else{if(r.dims.length!==3&&r.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(r.dims.length===5&&(r.dims[2]!==t.numHeads||r.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');$=3}let b=0,T=!1,I=t.kvNumHeads?_*t.kvNumHeads:c;if(n&&n.dims.length>0){if(n.dims.length!==3&&n.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(n.dims.length===3){if(h!==n.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');I=n.dims[2]}else{if(h!==n.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');I=n.dims[1]*n.dims[3],T=!0}}let E=e.length>4?e[5]:void 0;if(E&&E.dims.length!==1&&E.dims[0]!==l)throw new Error('Input "seqlens" is expected to have 1 dimension and the same dim 0 as batch_size');return{batchSize:l,sequenceLength:d,pastSequenceLength:f,kvSequenceLength:h,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:c,vHiddenSize:I,headSize:_,vHeadSize:Math.floor(I/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:b,scale:t.scale,broadcastResPosBias:!1,passPastInKv:T,qkvFormat:$}},ip=ge({perm:[0,2,1,3]}),Yn=(e,t,r)=>{let i=t,n=r.kvNumHeads;return t.dims.length===3&&r.kvSequenceLength!==0&&(i=t.reshape([r.batchSize,r.kvSequenceLength,n,r.headSize]),i=e.compute(We(i,ip.perm),{inputs:[i],outputs:[-1]})[0]),i},np=(e,t,r,i)=>{let n=7,a=["type","type"],s=[e*t],o=e*t,l=[{type:12,data:o},{type:12,data:t},{type:12,data:e}],d=c=>{let h=D("seq_lens",r.dataType,r.dims),f=D("total_seq_lens",i.dataType,i.dims),y=Y("pos_ids",n,s),_=[{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}];return`
  ${c.registerUniforms(_).declareVariables(h,f,y)}
  ${c.mainStart()}
    ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${f.getByOffset("0")});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${h.getByOffset("batch_idx")};
    let total_seqlen = seqlen + 1;
    if (is_first_prompt) {
      if (sequence_idx < total_seqlen) {
        pos_id = sequence_idx;
      } else {
        pos_id = 1;
      }
      ${y.setByOffset("global_idx","pos_id")}
    } else if (is_subsequent_prompt) {
      let past_seqlen = total_seqlen - i32(uniforms.sequence_length);
      if (past_seqlen + sequence_idx < total_seqlen) {
        pos_id = past_seqlen + sequence_idx;
      } else {
        pos_id = 1;
      }
      ${y.setByOffset("global_idx","pos_id")}
    } else if (global_idx < uniforms.batch_size) {
      ${y.setByOffset("global_idx","seqlen")}
    };
  }
  `};return{name:"GeneratePositionIds",shaderCache:{hint:`${e};${t}`,inputDependencies:a},getRunData:()=>({outputs:[{dims:s,dataType:n}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:l}),getShaderSource:d}},_m=(e,t)=>{var I;let r=rp(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(((I=e.inputs[1])==null?void 0:I.dims.length)===5)throw new Error("Packed KV is not implemented");let i=e.inputs[0],n=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,a=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,s=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,o=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,l=e.inputs.length>4?e.inputs[5]:void 0,d=e.inputs.length>5?e.inputs[6]:void 0,c=r.kvNumHeads?r.kvNumHeads:r.numHeads,h=ge({axis:2,numOutputs:3,splitSizes:[r.numHeads*r.headSize,c*r.headSize,c*r.headSize]}),[f,y,_]=!n&&!a?e.compute(Ra([i],h),{inputs:[i],outputs:[-1,-1,-1]}):[i,n,a],w,S;if(t.doRotary){let E=e.compute(np(r.batchSize,r.sequenceLength,l,d),{inputs:[l,d],outputs:[-1]})[0],A=e.inputs[7],O=e.inputs[8],x=ge({interleaved:t.rotaryInterleaved!==0,numHeads:r.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),z=[f,E,A,O],N=[-1];w=e.compute(Bi(z,x),{inputs:z,outputs:N})[0],z.splice(0,1,y);let q=ge({interleaved:t.rotaryInterleaved!==0,numHeads:r.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});S=e.compute(Bi(z,q),{inputs:z,outputs:N})[0]}let $=Ar(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,t.doRotary?w:f,void 0,0),b=Yn(e,t.doRotary?S:y,r),T=Yn(e,_,r);Ur(e,$,b,T,void 0,void 0,s,o,void 0,r,l,d)}}),Qn,ap,sp,wm,kw=L(()=>{te(),ie(),St(),ne(),Qn=(e,t,r,i,n,a,s,o)=>{let l=Se(a),d=l===1?"f32":`vec${l}f`,c=l===1?"vec2f":`mat2x${l}f`,h=n*s,f=64;h===1&&(f=256);let y=[n,s,a/l],_=[n,s,2],w=["rank","type","type"],S=[];S.push(...Z(y,_));let $=b=>{let T=D("x",t.dataType,3,l),I=D("scale",r.dataType,r.dims),E=D("bias",i.dataType,i.dims),A=Y("output",1,3,2),O=[T,I,E,A];return`
  var<workgroup> workgroup_shared : array<${c}, ${f}>;
  const workgroup_size = ${f}u;
  ${b.declareVariables(...O)}
  ${b.mainStart(f)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${d}(0);
    var squared_sum = ${d}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${d}(${T.get("batch","channel","h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${c}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${xt("workgroup_shared[0][0]",l)} / f32(hight * ${l});
      let squared_sum_final = ${xt("workgroup_shared[0][1]",l)} / f32(hight * ${l});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${o}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${l};${o};${f}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:_,dataType:1}],dispatchGroup:{x:h},programUniforms:S}),getShaderSource:$},{inputs:[t,r,i],outputs:[-1]})[0]},ap=(e,t,r)=>{let i=t[0].dims,n=i,a=2,s=i[0],o=i[1],l=M.sizeFromDimension(i,a),d=Se(l),c=M.size(n)/d,h=Qn(e,t[0],t[1],t[2],s,l,o,r.epsilon),f=[s,o,l/d],y=[s,o],_=["type","none"],w=S=>{let $=D("x",t[0].dataType,f.length,d),b=D("scale_shift",1,y.length,2),T=Y("output",t[0].dataType,f.length,d),I=[$,b,T];return`
  ${S.registerUniform("output_size","u32").declareVariables(...I)}
  ${S.mainStart()}
  ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${T.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${b.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${$.getByOffset("global_idx")} * ${T.type.value}(scale_shift.x) + ${T.type.value}(scale_shift.y);
      ${T.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${d}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:n,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:[{type:12,data:c},...Z(f,y,f)]}),getShaderSource:w},{inputs:[t[0],h]})},sp=(e,t,r)=>{let i=t[0].dims,n=i,a=i[0],s=i[i.length-1],o=M.sizeFromDimension(i,1)/s,l=Se(s),d=M.size(n)/l,c=[{type:12,data:o},{type:12,data:Math.floor(s/l)}],h=["type","type"],f=!1,y=[0,i.length-1];for(let $=0;$<i.length-2;$++)f=f||i[$+1]!==1,y.push($+1);f=f&&i[i.length-1]!==1;let _=f?e.compute(We(e.inputs[0],y),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:i.length},($,b)=>i[y[b]])),w=Qn(e,_,t[1],t[2],a,o,s,r.epsilon),S=$=>{let b=ke(t[0].dataType),T=l===1?"vec2f":`mat${l}x2f`,I=O=>{let x=O===0?"x":"y",z=l===1?"f32":`vec${l}f`;switch(l){case 1:return`${b}(${z}(scale.${x}))`;case 2:return`vec2<${b}>(${z}(scale[0].${x}, scale[1].${x}))`;case 4:return`vec4<${b}>(${z}(scale[0].${x}, scale[1].${x}, scale[2].${x}, scale[3].${x}))`;default:throw new Error(`Not supported compoents ${l}`)}},E=D("input",t[0].dataType,t[0].dims,l),A=Y("output",t[0].dataType,n,l);return`
  @group(0) @binding(0) var<storage, read> input : array<${E.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${T}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${A.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${$.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${I(0)}, ${I(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${l}`,inputDependencies:h},getRunData:()=>({outputs:[{dims:n,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:c}),getShaderSource:S},{inputs:[t[0],w]})},wm=(e,t)=>{t.format==="NHWC"?sp(e,e.inputs,t):ap(e,e.inputs,t)}}),op,up,bm,Ew=L(()=>{te(),ie(),ne(),op=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},up=(e,t,r)=>{let i=t.simplified,n=e[0].dims,a=e[1],s=!i&&e[2],o=n,l=M.normalizeAxis(t.axis,n.length),d=M.sizeToDimension(n,l),c=M.sizeFromDimension(n,l),h=M.size(a.dims),f=s?M.size(s.dims):0;if(h!==c||s&&f!==c)throw new Error(`Size of X.shape()[axis:] == ${c}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${h} and bias size of ${f}`);let y=[];for(let E=0;E<n.length;++E)E<l?y.push(n[E]):y.push(1);let _=Se(c),w=["type","type"],S=[{type:12,data:d},{type:1,data:c},{type:12,data:Math.floor(c/_)},{type:1,data:t.epsilon}];s&&w.push("type");let $=r>1,b=r>2,T=E=>{let A=ke(e[0].dataType),O=[D("x",e[0].dataType,e[0].dims,_),D("scale",a.dataType,a.dims,_)];s&&O.push(D("bias",s.dataType,s.dims,_)),O.push(Y("output",e[0].dataType,o,_)),$&&O.push(Y("mean_data_output",1,y)),b&&O.push(Y("inv_std_output",1,y));let x=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${E.registerUniforms(x).declareVariables(...O)}
  ${E.mainStart()}
    ${E.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${Sa("f32",_)};
    var mean_square_vector = ${Sa("f32",_)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${rr(A,_,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${xt("mean_vector",_)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${xt("mean_square_vector",_)} / uniforms.norm_size ${i?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${rr(A,_,"x[j + offset]")};
      let f32scale = ${rr(A,_,"scale[j]")};
      output[j + offset] = ${O[0].type.value}((f32input ${i?"":"- mean"}) * inv_std_dev * f32scale
        ${s?`+ ${rr(A,_,"bias[j]")}`:""}
      );
    }

    ${$?"mean_data_output[global_idx] = mean":""};
    ${b?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},I=[{dims:o,dataType:e[0].dataType}];return $&&I.push({dims:y,dataType:1}),b&&I.push({dims:y,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${_};${r};${i}`,inputDependencies:w},getRunData:()=>({outputs:I,dispatchGroup:{x:Math.ceil(d/64)},programUniforms:S}),getShaderSource:T}},bm=(e,t)=>{op(e.inputs),e.compute(up(e.inputs,t,e.outputCount))}}),lp,$m,Cw=L(()=>{ie(),ps(),cs(),lp=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},$m=e=>{lp(e.inputs);let t=sr.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let r=t[t.length-1],i=e.inputs[0].dims[e.inputs[0].dims.length-1];if(r<8&&i<8)e.compute(ds(e.inputs,{activation:""},t));else{let n=t[t.length-2],a=M.size(e.inputs[0].dims.slice(0,-2)),s=M.size(e.inputs[1].dims.slice(0,-2));if(a!==1&&n===1&&s===1){let o=e.inputs[0].reshape([1,a,i]),l=e.inputs[1].reshape([1,i,r]),d=[1,a,r],c=[o,l];e.compute(Mi(c,{activation:""},t,d),{inputs:c})}else e.compute(Mi(e.inputs,{activation:""},t))}}}),dp,pp,cp,vm,xm,zw=L(()=>{te(),ie(),Ie(),ne(),dp=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let r=e[0],i=r.dims.length;if(r.dims[i-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let n=Math.floor((t.k+t.blockSize-1)/t.blockSize),a=t.blockSize/8*t.bits,s=e[1];if(!M.areEqual(s.dims,[t.n,n,a]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let o=e[2].dims;if(M.size(o)!==t.n*n)throw new Error("scales input size error.");if(e.length===4){let l=e[3].dims,d=t.n*(t.bits===8?n:Math.floor((n*t.bits+7)/8));if(M.size(l)!==d)throw new Error("zeroPoints input size error.")}},pp=(e,t)=>{let r=e[0].dims,i=r.length,n=r[i-2],a=t.k,s=t.n,o=r.slice(0,i-2),l=M.size(o),d=e[1].dims[2]/4,c=e[0].dataType,h=Se(t.k),f=Se(d),y=Se(s),_=o.concat([n,s]),w=n>1&&s/y%2===0?2:1,S=M.size(_)/y/w,$=64,b=[],T=[l,n,a/h],I=M.convertShape(e[1].dims).slice();I.splice(-1,1,d/f),b.push(...Z(T)),b.push(...Z(I)),b.push(...Z(e[2].dims)),e.length===4&&b.push(...Z(M.convertShape(e[3].dims)));let E=[l,n,s/y];b.push(...Z(E));let A=O=>{let x=T.length,z=D("a",e[0].dataType,x,h),N=D("b",12,I.length,f),q=D("scales",e[2].dataType,e[2].dims.length),G=[z,N,q],H=e.length===4?D("zero_points",12,e[3].dims.length):void 0;H&&G.push(H);let R=E.length,F=Y("output",e[0].dataType,R,y),K=ke(e[0].dataType),X=(()=>{switch(h){case 1:return`array<${K}, 8>`;case 2:return`mat4x2<${K}>`;case 4:return`mat2x4<${K}>`;default:throw new Error(`${h}-component is not supported.`)}})(),ue=()=>{let P=`
          // reuse a data
            var input_offset = ${z.indicesToOffset(`${z.type.indices}(batch, row, word_offset)`)};
            var a_data: ${X};
            for (var j: u32 = 0; j < ${8/h}; j++) {
              a_data[j] = ${z.getByOffset("input_offset")};
              input_offset++;
            }
          `;for(let U=0;U<y*w;U++)P+=`
            b_value = ${f===1?`b${U}_data`:`b${U}_data[i]`};
            b_value_lower = unpack4xU8(b_value & b_mask);
            b_value_upper = unpack4xU8((b_value >> 4) & b_mask);
            b_quantized_values = ${X}(${Array.from({length:4},(J,ee)=>`${K}(b_value_lower[${ee}]), ${K}(b_value_upper[${ee}])`).join(", ")});
            b_dequantized_values = ${h===1?`${X}(${Array.from({length:8},(J,ee)=>`(b_quantized_values[${ee}] - ${H?`zero_point${U}`:"zero_point"}) * scale${U}`).join(", ")});`:`(b_quantized_values - ${X}(${Array(8).fill(`${H?`zero_point${U}`:"zero_point"}`).join(",")})) * scale${U};`};
            workgroup_shared[local_id.x * ${w} + ${Math.floor(U/y)}]${y>1?`[${U%y}]`:""} += ${Array.from({length:8/h},(J,ee)=>`${h===1?`a_data[${ee}] * b_dequantized_values[${ee}]`:`dot(a_data[${ee}], b_dequantized_values[${ee}])`}`).join(" + ")};
          `;return P},W=()=>{let P=`
            var col_index = col * ${y};
            ${H?`
            let zero_point_bytes_per_col = (nBlocksPerCol + 1) / 2;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${K}(8);`}
            `;for(let U=0;U<y*w;U++)P+=`
            let scale${U} = ${q.getByOffset("col_index * nBlocksPerCol + block")};
            ${H?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block >> 0x1u);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            zero_point_word = ${H.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${U} = ${K}((zero_point_word) & 0xFu);`:""}
            col_index += 1;`;return P},fe=()=>{let P=`col_index = col * ${y};`;for(let U=0;U<y*w;U++)P+=`
            let b${U}_data = ${N.getByIndices(`${N.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return P+=`
            var b_value: u32;
            let b_mask: u32 = 0x0F0F0F0Fu;
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${X};
            var b_dequantized_values: ${X};`,P};return`
        var<workgroup> workgroup_shared: array<${F.type.value}, ${w*$}>;
        ${O.declareVariables(...G,F)}
        ${O.mainStart([$,1,1])}
          let output_indices = ${F.offsetToIndices(`(global_idx / ${$}) * ${w}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${$}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/h};
            ${W()}
            for (var word: u32 = 0; word < ${d}; word += ${f}) {
              ${fe()}
              for (var i: u32 = 0; i < ${f}; i++) {
                ${ue()}
                word_offset += ${8/h};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${w}) {
            var output_value: ${F.type.value} = ${F.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${$}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${w};
            }
            ${F.setByIndices(`${F.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${h};${f};${y};${w};${$}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:_,dataType:c}],dispatchGroup:{x:S},programUniforms:b}),getShaderSource:A}},cp=(e,t)=>{let r=e[0].dims,i=r.length,n=r[i-2],a=t.k,s=t.n,o=r.slice(0,i-2),l=M.size(o),d=e[1].dims[2]/4,c=e[0].dataType,h=Se(t.k),f=Se(d),y=o.concat([n,s]),_=128,w=s%8===0?8:s%4===0?4:1,S=_/w,$=S*f*8,b=$/h,T=$/t.blockSize,I=M.size(y)/w,E=[],A=[l,n,a/h],O=M.convertShape(e[1].dims).slice();O.splice(-1,1,d/f),E.push(...Z(A)),E.push(...Z(O)),E.push(...Z(e[2].dims)),e.length===4&&E.push(...Z(M.convertShape(e[3].dims)));let x=[l,n,s];E.push(...Z(x));let z=N=>{let q=A.length,G=D("a",e[0].dataType,q,h),H=D("b",12,O.length,f),R=D("scales",e[2].dataType,e[2].dims.length),F=[G,H,R],K=e.length===4?D("zero_points",12,e[3].dims.length):void 0;K&&F.push(K);let X=x.length,ue=Y("output",e[0].dataType,X),W=ke(e[0].dataType),fe=()=>{switch(h){case 1:return`
          let a_data0 = vec4<${W}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${W}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${W}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${W}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${h}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${G.type.value}, ${b}>;
        var<workgroup> inter_results: array<array<${ue.type.value}, ${S}>, ${w}>;
        ${N.declareVariables(...F,ue)}
        ${N.mainStart([S,w,1])}
          let output_indices = ${ue.offsetToIndices(`workgroup_index * ${w}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${T} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${b};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${b}; a_offset += ${_})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${G.getByIndices(`${G.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${G.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${T} + local_id.x;
            ${K?`
            let zero_point_bytes_per_col = (n_blocks_per_col + 1) / 2;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block >> 0x1u);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            let zero_point_word = ${K.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${W}((zero_point_word) & 0xFu);`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${W}(8);`}
            let scale = ${R.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${H.getByIndices(`${H.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/h};
            for (var i: u32 = 0; i < ${f}; i++) {
              ${fe()}
              let b_value = ${f===1?"b_data":"b_data[i]"};
              let b_value_lower = unpack4xU8(b_value & 0x0F0F0F0Fu);
              let b_value_upper = unpack4xU8((b_value >> 4) & 0x0F0F0F0Fu);
              let b_quantized_values = mat2x4<${W}>(${Array.from({length:4},(P,U)=>`${W}(b_value_lower[${U}]), ${W}(b_value_upper[${U}])`).join(", ")});
              let b_dequantized_values = (b_quantized_values - mat2x4<${W}>(${Array(8).fill("zero_point").join(",")})) * scale;
              inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(P,U)=>`${`dot(a_data${U}, b_dequantized_values[${U}])`}`).join(" + ")};
              word_offset += ${8/h};
            }
            workgroupBarrier();
          }

          if (local_idx < ${w}) {
            var output_value: ${ue.type.value} = ${ue.type.value}(0);
            for (var b = 0u; b < ${S}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${ue.setByIndices(`${ue.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${h};${f};${S};${w}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:y,dataType:c}],dispatchGroup:{x:I},programUniforms:E}),getShaderSource:z}},vm=(e,t)=>{dp(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(cp(e.inputs,t)):e.compute(pp(e.inputs,t))},xm=e=>ge(e)}),hp,fp,mp,gp,yp,_p,wp,bp,Sm,Aw=L(()=>{te(),ie(),ne(),hp=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},fp=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
            k = i32(${e.indicesGet("indices",n)}) - ${Q("uniforms.pads",n,r)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${Q("uniforms.x_shape",n,t)})) {
              break;
            }
            offset += k * i32(${Q("uniforms.x_strides",n,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${i}
            value = x[offset];
          }
      `},mp=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
                k = i32(${e.indicesGet("indices",n)}) - ${Q("uniforms.pads",n,r)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${Q("uniforms.x_shape",n,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${Q("uniforms.x_shape",n,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${Q("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},gp=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
                k = i32(${e.indicesGet("indices",n)}) - ${Q("uniforms.pads",n,r)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${Q("uniforms.x_shape",n,t)})) {
                  k = i32(${Q("uniforms.x_shape",n,t)}) - 1;
                }
                offset += k * i32(${Q("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},yp=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
                k = i32(${e.indicesGet("indices",n)}) - ${Q("uniforms.pads",n,r)};
                if (k < 0)  {
                  k += i32(${Q("uniforms.x_shape",n,t)}]);
                }
                if (k >= i32(${Q("uniforms.x_shape",n,t)})) {
                  k -= i32(${Q("uniforms.x_shape",n,t)});
                }
                offset += k * i32(${Q("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},_p=(e,t,r)=>{switch(r.mode){case 0:return fp(e,t,r.pads.length);case 1:return mp(e,t,r.pads.length);case 2:return gp(e,t,r.pads.length);case 3:return yp(e,t,r.pads.length);default:throw new Error("Invalid mode")}},wp=(e,t)=>{let r=M.padShape(e[0].dims.slice(),t.pads),i=e[0].dims,n=M.size(r),a=[{type:12,data:n},{type:6,data:t.pads}],s=e.length>=3&&e[2].data;t.mode===0&&a.push({type:s?e[2].dataType:1,data:t.value}),a.push(...Z(e[0].dims,r));let o=["rank"],l=d=>{let c=Y("output",e[0].dataType,r.length),h=D("x",e[0].dataType,i.length),f=h.type.value,y=_p(c,i.length,t),_=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&_.push({name:"constant_value",type:s?f:"f32"}),`
            ${d.registerUniforms(_).declareVariables(h,c)}
            ${d.mainStart()}
            ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${c.offsetToIndices("global_idx")};

            var value = ${f}(0);
            ${y}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${s}`,inputDependencies:o},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(M.size(r)/64)},programUniforms:a}),getShaderSource:l}},bp=(e,t)=>{if(e.length>1){let r=e[1].getBigInt64Array(),i=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,n=e[0].dims.length,a=new Int32Array(2*n).fill(0);if(e.length>=4){let o=e[3].getBigInt64Array();for(let l=0;l<o.length;l++)a[Number(o[l])]=Number(r[l]),a[Number(o[l])+n]=Number(r[l+o.length])}else r.forEach((o,l)=>a[Number(l)]=Number(o));let s=[];return a.forEach(o=>s.push(o)),{mode:t.mode,value:i,pads:s}}else return t},Sm=(e,t)=>{hp(e.inputs);let r=bp(e.inputs,t);e.compute(wp(e.inputs,r),{inputs:[0]})}}),Sr,Zn,Xn,Jn,ea,$p,vp,ta,ra,Im,Tm,ia,km,Em,na,Cm,zm,Am,Om,Ow=L(()=>{Ve(),te(),ie(),ne(),Sr=e=>{if(xe.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},Zn=(e,t,r)=>{let i=t.format==="NHWC",n=e.dims.slice();i&&n.splice(1,0,n.pop());let a=Object.hasOwnProperty.call(t,"dilations"),s=t.kernelShape.slice(),o=t.strides.slice(),l=a?t.dilations.slice():[],d=t.pads.slice();Oi.adjustPoolAttributes(r,n,s,o,l,d);let c=Oi.computePoolOutputShape(r,n,o,l,s,d,t.autoPad),h=Object.assign({},t);a?Object.assign(h,{kernelShape:s,strides:o,pads:d,dilations:l,cacheKey:t.cacheKey}):Object.assign(h,{kernelShape:s,strides:o,pads:d,cacheKey:t.cacheKey});let f=c.slice();return f.push(f.splice(1,1)[0]),[h,i?f:c]},Xn=(e,t)=>{let r=t.format==="NHWC",i=M.size(e),n=M.size(t.kernelShape),a=[{type:12,data:i},{type:12,data:n}],s=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let o=t.kernelShape[t.kernelShape.length-1],l=t.strides[t.strides.length-1],d=t.pads[t.pads.length/2-1],c=t.pads[t.pads.length-1],h=!!(d+c);a.push({type:12,data:o},{type:12,data:l},{type:12,data:d},{type:12,data:c}),s.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let f=!1;if(t.kernelShape.length===2){let y=t.kernelShape[t.kernelShape.length-2],_=t.strides[t.strides.length-2],w=t.pads[t.pads.length/2-2],S=t.pads[t.pads.length-2];f=!!(w+S),a.push({type:12,data:y},{type:12,data:_},{type:12,data:w},{type:12,data:S}),s.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[a,s,!0,h,f]}else{if(r)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let o=M.computeStrides(t.kernelShape);a.push({type:12,data:o},{type:12,data:t.pads},{type:12,data:t.strides}),s.push({name:"kernelStrides",type:"u32",length:o.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let l=t.pads.reduce((d,c)=>d+c);return[a,s,!!l,!1,!1]}},Jn=(e,t,r,i,n,a,s,o,l,d,c,h)=>{let f=n.format==="NHWC",y=t.type.value,_=Y("output",t.type.tensor,i);if(n.kernelShape.length<=2){let w="",S="",$="",b=r-(f?2:1);if(c?w=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${b}] = indices[${b}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${b}] < 0 || xIndices[${b}]
                      >= uniforms.x_shape[${b}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${a}
                }`:w=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${b}] = indices[${b}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${a}
                }`,n.kernelShape.length===2){let T=r-(f?3:2);h?S=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${T}] = indices[${T}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${T}] < 0 || xIndices[${T}] >= uniforms.x_shape[${T}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:S=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${T}] = indices[${T}] * uniforms.sh - uniforms.phStart + j;
                `,$=`
              }
            `}return`
            ${e.registerUniforms(l).declareVariables(t,_)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${_.offsetToIndices("global_idx")};
              var xIndices = ${_.offsetToIndices("global_idx")};

              var value = ${y}(${o});
              var pad = 0;
              ${S}
              ${w}
              ${$}
              ${s}

              output[global_idx] = value;
            }`}else{if(f)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let w=n.kernelShape.length,S=n.pads.length,$="";return d?$=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset("xIndices")}];
                ${a}
              }`:$=`
              }
              let x_val = x[${t.indicesToOffset("xIndices")}];
              ${a}
            `,`
            ${e.registerUniforms(l).declareVariables(t,_)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${_.offsetToIndices("global_idx")};
              var xIndices = ${_.offsetToIndices("global_idx")};

              var offsets: array<u32, ${w}>;

              var value = ${y}(${o});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${w-1}u; j++) {
                  offsets[j] = offset / ${Q("uniforms.kernelStrides","j",w)};
                  offset -= offsets[j] * ${Q("uniforms.kernelStrides","j",w)};
                }
                offsets[${w-1}] = offset;

                isPad = false;
                for (var j = ${r-w}u; j < ${r}u; j++) {
                  xIndices[j] = indices[j] * ${Q("uniforms.strides",`j - ${r-w}u`,w)}
                    + offsets[j - ${r-w}u] - ${Q("uniforms.pads","j - 2u",S)};
                  ${$}
              }
              ${s}

              output[global_idx] = value;
            }`}},ea=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,$p=e=>`${ea(e)};${e.countIncludePad}`,vp=e=>`${ea(e)};${e.storageOrder};${e.dilations}`,ta=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),ra=(e,t,r,i)=>{let[n,a]=Zn(t,i,r),s=D("x",t.dataType,t.dims.length),o=s.type.value,l="value += x_val;",d="";n.countIncludePad?d+=`value /= ${o}(uniforms.kernelSize);`:d+=`value /= ${o}(i32(uniforms.kernelSize) - pad);`;let[c,h,f,y,_]=Xn(a,n);c.push(...Z(t.dims,a));let w=["rank"];return{name:e,shaderCache:{hint:`${i.cacheKey};${f};${y};${_}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:a,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(M.size(a)/64)},programUniforms:c}),getShaderSource:S=>Jn(S,s,t.dims.length,a.length,n,l,d,0,h,f,y,_)}},Im=e=>{let t=e.count_include_pad!==0,r=ta(e);if(r.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for AveragePool");let i={countIncludePad:t,...r,cacheKey:""};return{...i,cacheKey:$p(i)}},Tm=(e,t)=>{Sr(e.inputs),e.compute(ra("AveragePool",e.inputs[0],!1,t))},ia={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},km=e=>{let t=e.format;return{format:t,...ia,cacheKey:t}},Em=(e,t)=>{Sr(e.inputs),e.compute(ra("GlobalAveragePool",e.inputs[0],!0,t))},na=(e,t,r,i)=>{let[n,a]=Zn(t,i,r),s=`
      value = max(x_val, value);
    `,o="",l=D("x",t.dataType,t.dims.length),d=["rank"],[c,h,f,y,_]=Xn(a,n);return c.push(...Z(t.dims,a)),{name:e,shaderCache:{hint:`${i.cacheKey};${f};${y};${_}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:a,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(M.size(a)/64)},programUniforms:c}),getShaderSource:w=>Jn(w,l,t.dims.length,a.length,n,s,o,t.dataType===10?-65504:-1e5,h,f,y,_)}},Cm=(e,t)=>{Sr(e.inputs),e.compute(na("MaxPool",e.inputs[0],!1,t))},zm=e=>{let t=e.storage_order,r=e.dilations,i=ta(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(i.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for MaxPool");let n={storageOrder:t,dilations:r,...i,cacheKey:""};return{...n,cacheKey:vp(n)}},Am=e=>{let t=e.format;return{format:t,...ia,cacheKey:t}},Om=(e,t)=>{Sr(e.inputs),e.compute(na("GlobalMaxPool",e.inputs[0],!0,t))}}),xp,Sp,Rm,Mm,Rw=L(()=>{te(),ie(),Ie(),ne(),xp=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[0].dataType===6&&e.length>2)throw new Error("In the case of dequantizing int32 there is no zero point.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((r,i)=>r===e[2].dims[i]).reduce((r,i)=>r&&i,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((n,a)=>a===t.axis||n===e[0].dims[a]).reduce((n,a)=>n&&a,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let r=e[0].dims[t.axis],i=e[1].dims[t.axis];if(t.blockSize<Math.ceil(r/i)||t.blockSize>Math.ceil(r/(i-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},Sp=(e,t)=>{let r=M.normalizeAxis(t.axis,e[0].dims.length),i=e[0].dataType,n=i===3,a=e[0].dims,s=e[1].dataType,o=M.size(a),l=i===3||i===2,d=l?[Math.ceil(M.size(e[0].dims)/4)]:e[0].dims,c=e[1].dims,h=e.length>2?e[2]:void 0,f=h?l?[Math.ceil(M.size(h.dims)/4)]:h.dims:void 0,y=c.length===0||c.length===1&&c[0]===1,_=y===!1&&c.length===1,w=Se(o),S=y&&(!l||w===4),$=S?w:1,b=S&&!l?w:1,T=D("input",l?12:i,d.length,b),I=D("scale",s,c.length),E=h?D("zero_point",l?12:i,f.length):void 0,A=Y("output",s,a.length,$),O=[T,I];E&&O.push(E);let x=[d,c];h&&x.push(f);let z=[{type:12,data:o/$},{type:12,data:r},{type:12,data:t.blockSize},...Z(...x,a)],N=q=>{let G=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${q.registerUniforms(G).declareVariables(...O,A)}
      ${q.mainStart()}
          ${q.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${A.offsetToIndices("global_idx")};

          // Set input x
          ${l?`
            let input = ${T.getByOffset("global_idx / 4")};
            let x_vec = ${n?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${$===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${T.getByOffset("global_idx")};`};

          // Set scale input
          ${y?`let scale_value= ${I.getByOffset("0")}`:_?`
            let scale_index = ${A.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${I.getByOffset("scale_index")};`:`
            var scale_indices: ${I.type.indices} = output_indices;
            let index = ${I.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${I.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${I.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${E?y?l?`
                let zero_point_input = ${E.getByOffset("0")};
                let zero_point_vec =  ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${E.getByOffset("0")}`:_?l?`
                let zero_point_index = ${A.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${E.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${A.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${E.getByOffset("zero_point_index")};`:l?`
                let zero_point_offset = ${I.indicesToOffset("scale_indices")};
                let zero_point_input = ${E.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${E.getByIndices("scale_indices")};`:`let zero_point_value = ${l?n?"i32":"u32":T.type.value}(0);`};
      // Compute and write output
      ${A.setByOffset("global_idx",`${A.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:E?["rank","rank","rank"]:["rank","rank"]},getShaderSource:N,getRunData:()=>({outputs:[{dims:a,dataType:s}],dispatchGroup:{x:Math.ceil(o/$/64),y:1,z:1},programUniforms:z})}},Rm=(e,t)=>{xp(e.inputs,t),e.compute(Sp(e.inputs,t))},Mm=e=>ge({axis:e.axis,blockSize:e.blockSize})}),Ip,Tp,Bm,Mw=L(()=>{Ve(),te(),ne(),Ip=(e,t,r)=>{let i=e===t,n=e<t&&r<0,a=e>t&&r>0;if(i||n||a)throw new Error("Range these inputs' contents are invalid.")},Tp=(e,t,r,i)=>{let n=Math.abs(Math.ceil((t-e)/r)),a=[n],s=n,o=[{type:12,data:s},{type:i,data:e},{type:i,data:r},...Z(a)],l=d=>{let c=Y("output",i,a.length),h=c.type.value,f=[{name:"outputSize",type:"u32"},{name:"start",type:h},{name:"delta",type:h}];return`
        ${d.registerUniforms(f).declareVariables(c)}
        ${d.mainStart()}
        ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${h}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${i}`},getShaderSource:l,getRunData:()=>({outputs:[{dims:a,dataType:i}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:o})}},Bm=e=>{let t=0,r=0,i=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],r=e.inputs[1].getInt32Array()[0],i=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],r=e.inputs[1].getFloat32Array()[0],i=e.inputs[2].getFloat32Array()[0]),xe.webgpu.validateInputContent&&Ip(t,r,i),e.compute(Tp(t,r,i,e.inputs[0].dataType),{inputs:[]})}}),kp,Ep,Dm,Nm,Bw=L(()=>{te(),ie(),Ie(),ne(),kp=(e,t,r,i)=>{if(e!=="none"&&i!=="i32"&&i!=="u32"&&i!=="f32")throw new Error(`Input ${i} is not supported with reduction ${e}.`);let n=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,a=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${t}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(e){case"none":return`${t}=${r};`;case"add":return i==="i32"||i==="u32"?`atomicAdd(&${t}, bitcast<${i}>(${r}));`:`
              ${n}bitcast<${i}>(oldValue) + (${r})${a}`;case"max":return i==="i32"||i==="u32"?`atomicMax(&${t}, bitcast<${i}>(${r}));`:`
                ${n}max(bitcast<f32>(oldValue), (${r}))${a}`;case"min":return i==="i32"||i==="u32"?`atomicMin(&${t}, bitcast<${i}>(${r}));`:`${n}min(bitcast<${i}>(oldValue), (${r}))${a}`;case"mul":return`${n}(bitcast<${i}>(oldValue) * (${r}))${a}`;default:throw new Error(`Reduction ${e} is not supported.`)}},Ep=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r,a=1,s=Math.ceil(M.sizeToDimension(i,i.length-1)/a),o=i[i.length-1],l=M.sizeFromDimension(r,o),d=[{type:12,data:s},{type:12,data:o},{type:12,data:l},...Z(e[1].dims,e[2].dims,n)],c=h=>{let f=D("indices",e[1].dataType,e[1].dims.length),y=D("updates",e[2].dataType,e[2].dims.length,a),_=t.reduction!=="none"&&t.reduction!==""?dh("output",e[0].dataType,n.length):Y("output",e[0].dataType,n.length,a);return`
      ${h.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(f,y,_)}
      ${h.mainStart()}
        ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
  var data_offset = 0u;
  let indices_start = uniforms.last_index_dimension * global_idx;
  let indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${e[0].dims.length===1?`
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;`:`
    let element_count_dim = uniforms.output_strides[i - indices_start];
    let dim_value = uniforms.output_shape[i - indices_start];`}
    if (index >= 0) {
      if (index >= i32(dim_value)) {
        index = i32(dim_value - 1);
      }
    } else {
      if (index < -i32(dim_value)) {
        index = 0;
      } else {
        index += i32(dim_value);
      }
    }
    data_offset += u32((u32(index) * element_count_dim));
  }

  for (var i = 0u; i < uniforms.num_updates_elements; i++) {
    let value = updates[uniforms.num_updates_elements * global_idx + i];
    ${kp(t.reduction,"output[data_offset + i]","value",_.type.value)}
  }

      }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:d}),getShaderSource:c}},Dm=e=>ge({reduction:e.reduction}),Nm=(e,t)=>{e.compute(Ep(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),Cp,zp,Ap,aa,Op,Rp,Mp,Bp,Dp,Np,Pp,Up,sa,Lp,Wp,qp,Vp,Gp,Pm,Um,Dw=L(()=>{te(),ie(),Ie(),ne(),Cp=(e,t)=>{if(e.every(r=>r>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},zp=(e,t,r)=>{t.every(n=>n>=0&&n<r||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let i=new Array(r).fill(1);return t.forEach((n,a)=>i[n]=e[a]),i},Ap=(e,t,r,i,n,a)=>{let[s,o,l]=r>10?[1,2,3]:[-1,e.length>1?1:-1,-1],d=e[0].dims.length;if(s>0&&e.length>s&&e[s].dims.length>0)e[s].getFloat32Array().forEach(c=>a.push(c));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(o>0&&e.length>o&&e[o].dims.length===1&&e[o].dims[0]>0){if(e[o].getFloat32Array().forEach(c=>i.push(c)),i.length!==0&&i.length!==d&&r>=18&&i.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");Cp(i,t),t.axes.length>0&&zp(i,t.axes,d).forEach((c,h)=>i[h]=c)}if(l>0&&e.length>l&&e[l].dims.length===1&&e[l].dims[0]>0&&(e[l].getBigInt64Array().forEach(c=>n.push(Number(c))),n.length!==0&&n.length!==d&&r>=18&&n.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(i.length!==0&&i.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(n.length!==0&&n.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof i<"u"&&typeof n<"u"&&i.length>0&&n.length>d)throw new Error("Resize requires only of scales or sizes to be specified")},aa=(e,t,r,i)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${i}(big / (${r}));
  let fract = ${i}(big % (${r})) / ${i}(${r});
  return whole + fract;
`,Op=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${aa("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${aa("xResized","lengthOriginal - 1","lengthResized - 1",t)}
                  }`;case"tf_crop_and_resize":return`if (lengthResized > 1) {
                    return ${t}(roiStart) * ${t}(lengthOriginal - 1) +
                        (${t}(xResized) * ${t}(roiEnd - roiStart) * ${t}(lengthOriginal - 1)) /
                        ${t}(lengthResized - 1);
                  } else {
                    return 0.5 * ${t}(roiStart + roiEnd) * ${t}(lengthOriginal - 1);
                  }`;case"half_pixel_symmetric":return`const outputWidth = ${t}xScale * ${t}(lengthResized);
                  const adjustment = ${t}(lengthResized) / outputWidth;
                  const center = ${t}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",Rp=(e,t,r)=>`fn getNearestPixelFromOriginal(xOriginal: ${r}, isDownSample: bool) -> ${r} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";case"simple":default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${e} is not supported`)}})()+"}",Mp=(e,t,r)=>{let i=new Array(r).fill(0).concat(new Array(r).fill(1)),n=e.length===0?i:e.slice();return t.length>0?(t.forEach((a,s)=>{i[a]=n[s],i[s+r]=n[t.length+s]}),i):n},Bp=(e,t,r,i)=>{let n=[];if(r.length>0)if(i.length>0){if(e.forEach(a=>n.push(a)),Math.max(...i)>e.length)throw new Error("axes is out of bound");i.forEach((a,s)=>n[a]=r[s])}else r.forEach(a=>n.push(a));else{if(t.length===0)throw new Error("Resize requires either scales or sizes.");n=e.map((a,s)=>Math.round(a*t[s]))}return n},Dp=(e,t,r)=>{let i=(()=>{switch(r.keepAspectRatioPolicy){case"not_larger":return r.axes.length>0?Math.min(...r.axes.map(a=>t[a]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return r.axes.length>0?Math.max(...r.axes.map(a=>t[a]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${r.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let n=e.slice();return r.axes.length>0?(r.axes.forEach(a=>t[a]=i),r.axes.forEach(a=>n[a]=Math.round(e[a]*t[a]))):(t.fill(i,0,t.length),n.forEach((a,s)=>n[s]=Math.round(a*t[s]))),n},Np=(e,t,r,i,n)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${r.length}> {
      var original_indices: array<${e.type.value}, ${r.length}>;
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${Q("uniforms.scales","i",i)};
        var roi_low = ${Q("uniforms.roi","i",n)};
        var roi_hi = ${Q("uniforms.roi",`i + ${t.length}`,n)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${Q("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${Q("uniforms.output_shape","i",r.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,Pp=(e,t,r,i,n,a,s)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${i.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${Q("uniforms.scales","i",n)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${Q("uniforms.roi","i",a)};
          var roi_hi = ${Q("uniforms.roi",`i + ${r.length}`,a)};
          var input_shape_i = ${Q("uniforms.input_shape","i",r.length)};
          var output_shape_i = ${Q("uniforms.output_shape","i",i.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${s} || (original_idx >= 0 && original_idx < ${t.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${t.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${e.indicesSet("input_indices","i","input_index")}
      }
      return input_indices;
    }`,Up=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${Q("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,sa=(e,t,r,i)=>e.rank>i?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",r,"batch")};
`:"",Lp=(e,t,r,i,n)=>{let[a,s,o,l]=r.length===2?[-1,0,1,-1]:[0,2,3,1],d=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${d} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(row, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",o,`max(0, min(col, ${r[o]} - 1))`)};
      ${sa(e,l,a,2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${d} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${d} = originalIndices[${s}];
      var col:${d} = originalIndices[${o}];
      ${i?`if (row < 0 || row > (${r[s]} - 1) || col < 0 || col > (${r[o]} - 1)) {
        return ${n};
      }`:""};
      row = max(0, min(row, ${r[s]} - 1));
      col = max(0, min(col, ${r[o]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${r.length>2?`u32(originalIndices[${l}])`:"0"};
      var batch: u32 =  ${r.length>2?`u32(originalIndices[${a}])`:"0"};
      var x11: ${d} = getInputValue(batch, channel, row1, col1);
      var x12: ${d} = getInputValue(batch, channel, row1, col2);
      var x21: ${d} = getInputValue(batch, channel, row2, col1);
      var x22: ${d} = getInputValue(batch, channel, row2, col2);
      var dx1: ${d} = abs(row - ${d}(row1));
      var dx2: ${d} = abs(${d}(row2) - row);
      var dy1: ${d} = abs(col - ${d}(col1));
      var dy2: ${d} = abs(${d}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},Wp=(e,t,r,i,n,a,s,o,l,d)=>{let c=r.length===2,[h,f]=c?[0,1]:[2,3],y=e.type.value,_=w=>{let S=w===h?"row":"col";return`
      fn ${S}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${y} {
        var output_index = ${t.indicesGet("output_indices",w)};
        var originalIdx: ${y} = getOriginalCoordinateFromResizedCoordinate(output_index, ${n[w]},
        ${i[w]}, ${r[w]}, ${a[w]}, ${a[w]} + ${r.length});
        var fractOriginalIdx: ${y} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${o} && (originalIdx < 0 || originalIdx > (${r[w]} - 1))) {
          return ${l};
        }
        var data: array<${y}, 4> = array<${y}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${S}: ${y} = originalIdx + ${y}(i);
          if (${S} < 0 || ${S} >= ${r[w]}) {
            ${d?`coefs[i + 1] = 0.0;
                        continue;`:o?`return ${l};`:`${S} = max(0, min(${S}, ${r[w]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy",w,`u32(${S})`)};
          data[i + 1] = ${w===h?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${_(h)};
    ${_(f)};
  fn getCubicInterpolationCoefs(s: ${y}) -> array<${y}, 4> {
    var absS = abs(s);
    var coeffs: array<${y}, 4> = array<${y}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${y} = 1.0 - absS;
    var twoMinusAbsS: ${y} = 2.0 - absS;
    var onePlusAbsS: ${y} = 1.0 + absS;
    coeffs[0] = ((${s} * onePlusAbsS - 5 * ${s}) * onePlusAbsS + 8 * ${s}) * onePlusAbsS - 4 * ${s};
    coeffs[1] = ((${s} + 2) * absS - (${s} + 3)) * absS * absS + 1;
    coeffs[2] = ((${s} + 2) * oneMinusAbsS - (${s} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${s} * twoMinusAbsS - 5 * ${s}) * twoMinusAbsS + 8 * ${s}) * twoMinusAbsS - 4 * ${s};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${y}, 4>, coefs: array<${y}, 4>) -> ${y} {
    var coefsSum: ${y} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${y} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},qp=(e,t,r,i,n)=>{let[a,s,o,l,d]=r.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],c=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${c} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(depth, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",o,`max(0, min(height, ${r[o]} - 1))`)};
      ${e.indicesSet("input_indices",l,`max(0, min(width, ${r[l]} - 1))`)};
      ${sa(e,d,a,3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${c} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${c} = originalIndices[${s}];
      var height:${c} = originalIndices[${o}];
      var width:${c} = originalIndices[${l}];
      ${i?`if (depth < 0 || depth > (${r[s]} - 1) || height < 0 || height > (${r[o]} - 1) || width < 0 || (width > ${r[l]} - 1)) {
      return ${n};
        }`:""};

    depth = max(0, min(depth, ${r[s]} - 1));
      height = max(0, min(height, ${r[o]} - 1));
      width = max(0, min(width, ${r[l]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${r.length>3?`u32(originalIndices[${d}])`:"0"};
      var batch: u32 =  ${r.length>3?`u32(originalIndices[${a}])`:"0"};

      var x111: ${c} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${c} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${c} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${c} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${c} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${c} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${c} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${c} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${c} = abs(depth - ${c}(depth1));
      var dx2: ${c} = abs(${c}(depth2) - depth);
      var dy1: ${c} = abs(height - ${c}(height1));
      var dy2: ${c} = abs(${c}(height2) - height);
      var dz1: ${c} = abs(width - ${c}(width1));
      var dz2: ${c} = abs(${c}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`},Vp=(e,t,r,i,n,a)=>{let s=e.dims,o=Mp(a,t.axes,s.length),l=Bp(s,i,n,t.axes),d=i.slice();i.length===0&&(d=s.map((b,T)=>b===0?1:l[T]/b),t.keepAspectRatioPolicy!=="stretch"&&(l=Dp(s,d,t)));let c=Y("output",e.dataType,l.length),h=D("input",e.dataType,s.length),f=M.size(l),y=s.length===l.length&&s.every((b,T)=>b===l[T]),_=t.coordinateTransformMode==="tf_crop_and_resize",w=t.extrapolationValue,S=h.type.value,$=b=>`
      ${y?"":`
      ${Op(t.coordinateTransformMode,S)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${Up(h,s)};
              ${Rp(t.nearestMode,r,S)};
              ${Pp(h,c,s,l,d.length,o.length,_)};
              `;case"linear":return`
              ${Np(c,s,l,d.length,o.length)};
              ${(()=>{if(s.length===2||s.length===4)return`${Lp(h,c,s,_,w)}`;if(s.length===3||s.length===5)return`${qp(h,c,s,_,w)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(s.length===2||s.length===4)return`${Wp(h,c,s,l,d,o,t.cubicCoeffA,_,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${b.registerUniform("output_size","u32").registerUniform("scales","f32",d.length).registerUniform("roi","f32",o.length).declareVariables(h,c)}
      ${b.mainStart()}
        ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${y?"output[global_idx] = input[global_idx];":`
        let output_indices = ${c.offsetToIndices("global_idx")};
        var input_indices: ${h.type.indices};
        ${(()=>{switch(t.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${h.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${s.length===2||s.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${r}|${d.length>0?t.mode==="cubic"?d:d.length:""}|${n.length>0?n:""}|${o.length>0?o:""}|${y}|${t.mode==="nearest"?s.length:s}`,inputDependencies:["rank"]},getShaderSource:$,getRunData:()=>({outputs:[{dims:l,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:[{type:12,data:f},{type:1,data:d},{type:1,data:o},...Z(s,l)]})}},Gp=e=>{let t=e.customDataBuffer;return new Uint32Array(t,t.byteOffset,1)[0]},Pm=(e,t)=>{let r=[],i=[],n=[],a=Gp(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");Ap(e.inputs,t,a,r,i,n),e.compute(Vp(e.inputs[0],t,a,r,i,n),{inputs:[0]})},Um=e=>{let t=e.antialias,r=e.axes,i=e.coordinateTransformMode,n=e.cubicCoeffA,a=e.excludeOutside!==0,s=e.extrapolationValue,o=e.keepAspectRatioPolicy,l=e.mode,d=e.nearestMode===""?"simple":e.nearestMode;return ge({antialias:t,axes:r,coordinateTransformMode:i,cubicCoeffA:n,excludeOutside:a,extrapolationValue:s,keepAspectRatioPolicy:o,mode:l,nearestMode:d})}}),Hp,Fp,Lm,Nw=L(()=>{te(),ie(),ne(),Hp=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],r=e[1],i=e[2];if(t.dataType!==r.dataType||t.dataType!==i.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(r.dims.length!==3&&r.dims.length!==2)throw new Error("Skip must be 2D or 3D");let n=t.dims[t.dims.length-1],a=t.dims[t.dims.length-2];if(r.dims[r.dims.length-1]!==n)throw new Error("Skip must have the same hidden size as input");if(r.dims[r.dims.length-2]!==a)throw new Error("Skip must have the same sequence length as input");if(i.dims.length!==1)throw new Error("Gamma must be 1D");if(i.dims[i.dims.length-1]!==n)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let s=e[3];if(s.dims.length!==1)throw new Error("Beta must be 1D");if(s.dims[s.dims.length-1]!==n)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let s=e[4];if(s.dims.length!==1)throw new Error("Bias must be 1D");if(s.dims[s.dims.length-1]!==n)throw new Error("Bias must have the same hidden size as input")}},Fp=(e,t,r,i)=>{let n=t.simplified,a=e[0].dims,s=M.size(a),o=a,l=s,d=a.slice(-1)[0],c=i?a.slice(0,-1).concat(1):[],h=!n&&e.length>3,f=e.length>4,y=i&&r>1,_=i&&r>2,w=r>3,S=64,$=Se(d),b=[{type:12,data:l},{type:12,data:$},{type:12,data:d},{type:1,data:t.epsilon}],T=E=>{let A=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],O=[D("x",e[0].dataType,e[0].dims,$),D("skip",e[1].dataType,e[1].dims,$),D("gamma",e[2].dataType,e[2].dims,$)];h&&O.push(D("beta",e[3].dataType,e[3].dims,$)),f&&O.push(D("bias",e[4].dataType,e[4].dims,$)),O.push(Y("output",e[0].dataType,o,$)),y&&O.push(Y("mean_output",1,c)),_&&O.push(Y("inv_std_output",1,c)),w&&O.push(Y("input_skip_bias_sum",e[0].dataType,o,$));let x=ke(e[0].dataType),z=ke(1,$);return`

      ${E.registerUniforms(A).declareVariables(...O)}
      var<workgroup> sum_shared : array<${z}, ${S}>;
      var<workgroup> sum_squared_shared : array<${z}, ${S}>;

      ${E.mainStart([S,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${S};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${S};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${S-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${f?"bias[offset1d + i]":x+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${w?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${rr(x,$,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${S};
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${xt("sum",$)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${xt("square_sum",$)} / f32(uniforms.hidden_size) ${n?"":"- mean * mean"} + uniforms.epsilon);
        ${y?"mean_output[global_idx] = mean;":""}
        ${_?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${n?"":`- ${x}(mean)`}) *
            ${x}(inv_std_dev) * gamma[offset1d + i]
            ${h?"+ beta[offset1d + i]":""};
        }
      }`},I=[{dims:o,dataType:e[0].dataType}];return r>1&&I.push({dims:c,dataType:1}),r>2&&I.push({dims:c,dataType:1}),r>3&&I.push({dims:a,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${$};${y};${_};${w}`,inputDependencies:e.map((E,A)=>"type")},getShaderSource:T,getRunData:()=>({outputs:I,dispatchGroup:{x:Math.ceil(l/d)},programUniforms:b})}},Lm=(e,t)=>{Hp(e.inputs);let r=[0];e.outputCount>1&&r.push(-3),e.outputCount>2&&r.push(-3),e.outputCount>3&&r.push(3),e.compute(Fp(e.inputs,t,e.outputCount,!1),{outputs:r})}}),jp,Ir,Kp,oa,Yp,Qp,Wm,qm,Pw=L(()=>{te(),ie(),Ie(),ne(),jp=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((r,i)=>{if(e[i+1].dataType!==6&&e[i+1].dataType!==7)throw new Error(`Input ${i} must be an array of int32 or int64`)})},Ir=(e,t)=>{let r=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(i=>r.push(Number(i)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(i=>r.push(Number(i)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return r},Kp=(e,t)=>{if(e.length>1){let r=Ir(e,1),i=Ir(e,2),n=Ir(e,3);return n.length===0&&(n=[...Array(e[0].dims.length).keys()]),ge({starts:r,ends:i,axes:n})}else return t},oa=(e,t,r,i,n)=>{let a=e;return e<0&&(a+=r[i[t]]),n[t]<0?Math.max(0,Math.min(a,r[i[t]]-1)):Math.max(0,Math.min(a,r[i[t]]))},Yp=(e,t,r)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${r.length-1}; i >= 0; i--) {
            let input_shape_i = ${Q("uniforms.input_shape","i",r.length)};
            let steps_i = ${Q("uniforms.steps","i",r.length)};
            let signs_i = ${Q("uniforms.signs","i",r.length)};
            let starts_i = ${Q("uniforms.starts","i",r.length)};
            var output_index = ${t.indicesGet("output_indices","i")};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${e.indicesSet("input_indices","i","input_index")};
          }
          return input_indices;
      }`,Qp=(e,t)=>{let r=e[0].dims,i=M.size(r),n=t.axes.length>0?M.normalizeAxes(t.axes,r.length):[...Array(r.length).keys()],a=Ir(e,4);a.forEach($=>$!==0||(()=>{throw new Error("step cannot be 0")})),a.length===0&&(a=Array(n.length).fill(1));let s=t.starts.map(($,b)=>oa($,b,r,n,a)),o=t.ends.map(($,b)=>oa($,b,r,n,a));if(n.length!==s.length||n.length!==o.length)throw new Error("start, ends and axes should have the same number of elements");if(n.length!==r.length)for(let $=0;$<r.length;++$)n.includes($)||(s.splice($,0,0),o.splice($,0,r[$]),a.splice($,0,1));let l=a.map($=>Math.sign($));a.forEach(($,b,T)=>{if($<0){let I=(o[b]-s[b])/$,E=s[b],A=E+I*a[b];s[b]=A,o[b]=E,T[b]=-$}});let d=r.slice(0);n.forEach(($,b)=>{d[$]=Math.ceil((o[$]-s[$])/a[$])});let c={dims:d,dataType:e[0].dataType},h=Y("output",e[0].dataType,d.length),f=D("input",e[0].dataType,e[0].dims.length),y=M.size(d),_=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:s.length},{name:"signs",type:"i32",length:l.length},{name:"steps",type:"u32",length:a.length}],w=[{type:12,data:y},{type:12,data:s},{type:6,data:l},{type:12,data:a},...Z(e[0].dims,d)],S=$=>`
      ${$.registerUniforms(_).declareVariables(f,h)}
        ${Yp(f,h,r)}
        ${$.mainStart()}
          ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${h.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${h.setByOffset("global_idx",f.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${l.length}_${s.length}_${a.length}`,inputDependencies:["rank"]},getShaderSource:S,getRunData:()=>({outputs:[c],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:w})}},Wm=(e,t)=>{jp(e.inputs,t);let r=Kp(e.inputs,t);e.compute(Qp(e.inputs,r),{inputs:[0]})},qm=e=>{let t=e.starts,r=e.ends,i=e.axes;return ge({starts:t,ends:r,axes:i})}}),Zp,Xp,Vm,Gm,Uw=L(()=>{te(),ie(),Ie(),St(),ne(),Zp=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},Xp=(e,t)=>{let r=e.inputs[0],i=r.dims,n=M.size(i),a=i.length,s=M.normalizeAxis(t.axis,a),o=s<i.length-1,l,d=[];o?(d=Array.from({length:a},(O,x)=>x),d[s]=a-1,d[a-1]=s,l=e.compute(We(r,d),{inputs:[r],outputs:[-1]})[0]):l=r;let c=l.dims,h=c[a-1],f=n/h,y=Se(h),_=h/y,w=64;f===1&&(w=256);let S=(O,x)=>x===4?`max(max(${O}.x, ${O}.y), max(${O}.z, ${O}.w))`:x===2?`max(${O}.x, ${O}.y)`:x===3?`max(max(${O}.x, ${O}.y), ${O}.z)`:O,$=D("x",l.dataType,l.dims,y),b=Y("result",l.dataType,l.dims,y),T=$.type.value,I=ke(l.dataType)==="f32"?`var threadMax = ${T}(-3.4028234663852886e+38f);`:`var threadMax = ${T}(-65504.0h);`,E=O=>`
      var<workgroup> rowMaxShared : ${T};
      var<workgroup> rowSumShared : ${T};
      var<workgroup> threadShared : array<${T}, ${w}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${T} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${T}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${O.registerUniform("packedCols","i32").declareVariables($,b)}
      ${O.mainStart(w)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${w};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${I}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${T}(${S("threadShared[0]",y)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${T}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${T}(${xt("threadShared[0]",y)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          var value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          // max operation protects against NaN since all values should be >=0
          value = max(value, ${T}(0.0));
          setValue(row, col, row_stride, value);
        }
      }`,A=e.compute({name:"Softmax",shaderCache:{hint:`${y};${w}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:c,dataType:l.dataType}],dispatchGroup:{x:f},programUniforms:[{type:6,data:_}]}),getShaderSource:E},{inputs:[l],outputs:[o?-1:0]})[0];o&&e.compute(We(A,d),{inputs:[A]})},Vm=(e,t)=>{Zp(e.inputs),Xp(e,t)},Gm=e=>ge({axis:e.axis})}),ua,Jp,ec,tc,Hm,Lw=L(()=>{te(),ie(),ne(),ua=e=>Array.from(e.getBigInt64Array(),Number),Jp=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(ua(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},ec=(e,t)=>{let r=[];for(let i=0;i<e.length;++i)r.push(e[i]*t[i]);return r},tc=(e,t)=>{let r=e[0].dims,i=t??ua(e[1]),n=ec(r,i),a=M.size(n),s=e[0].dataType,o=D("input",s,r.length),l=Y("output",s,n.length),d=c=>`
      const inputShape = ${o.indices(...r)};
      ${c.registerUniform("output_size","u32").declareVariables(o,l)}
      ${c.mainStart()}
      ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${l.offsetToIndices("global_idx")};
      var input_indices: ${o.type.indices};
      for (var i = 0; i < ${r.length}; i++) {
        let input_dim_i = ${o.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${l.indicesGet("output_indices","i")}  % input_dim_i;

        ${o.indicesSet("input_indices","i","input_dim_value")}
      }
      ${l.setByOffset("global_idx",o.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${i}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:[{type:12,data:a},...Z(e[0].dims,n)]}),getShaderSource:d}},Hm=e=>{Jp(e.inputs),e.compute(tc(e.inputs),{inputs:[0]})}}),rc,ic,Fm,Ww=L(()=>{te(),ie(),ne(),rc=(e,t,r,i,n)=>{let a=Y("output_data",n,r.length,4),s=D("a_data",t[1].dataType,t[1].dims.length,4),o=D("b_data",t[2].dataType,t[2].dims.length,4),l=D("c_data",t[0].dataType,t[0].dims.length,4),d,c=(h,f,y)=>`select(${f}, ${h}, ${y})`;if(!i)d=a.setByOffset("global_idx",c(s.getByOffset("global_idx"),o.getByOffset("global_idx"),l.getByOffset("global_idx")));else{let h=(f,y,_="")=>{let w=`a_data[index_a${y}][component_a${y}]`,S=`b_data[index_b${y}][component_b${y}]`,$=`bool(c_data[index_c${y}] & (0xffu << (component_c${y} * 8)))`;return`
            let output_indices${y} = ${a.offsetToIndices(`global_idx * 4u + ${y}u`)};
            let offset_a${y} = ${s.broadcastedIndicesToOffset(`output_indices${y}`,a)};
            let offset_b${y} = ${o.broadcastedIndicesToOffset(`output_indices${y}`,a)};
            let offset_c${y} = ${l.broadcastedIndicesToOffset(`output_indices${y}`,a)};
            let index_a${y} = offset_a${y} / 4u;
            let index_b${y} = offset_b${y} / 4u;
            let index_c${y} = offset_c${y} / 4u;
            let component_a${y} = offset_a${y} % 4u;
            let component_b${y} = offset_b${y} % 4u;
            let component_c${y} = offset_c${y} % 4u;
            ${f}[${y}] = ${_}(${c(w,S,$)});
          `};n===9?d=`
            var data = vec4<u32>(0);
            ${h("data",0,"u32")}
            ${h("data",1,"u32")}
            ${h("data",2,"u32")}
            ${h("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:d=`
            ${h("output_data[global_idx]",0)}
            ${h("output_data[global_idx]",1)}
            ${h("output_data[global_idx]",2)}
            ${h("output_data[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(l,s,o,a)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${d}
      }`},ic=e=>{let t=e[1].dims,r=e[2].dims,i=e[0].dims,n=e[1].dataType,a=!(M.areEqual(t,r)&&M.areEqual(r,i)),s=t,o=M.size(t);if(a){let d=sr.calcShape(sr.calcShape(t,r,!1),i,!1);if(!d)throw new Error("Can't perform where op on the given tensors");s=d,o=M.size(s)}let l=Math.ceil(o/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:d=>rc(d,e,s,a,n),getRunData:()=>({outputs:[{dims:s,dataType:n}],dispatchGroup:{x:Math.ceil(o/64/4)},programUniforms:[{type:12,data:l},...Z(i,t,r,s)]})}},Fm=e=>{e.compute(ic(e.inputs))}}),jm,qw=L(()=>{rw(),ss(),iw(),nw(),aw(),sw(),ow(),cw(),fw(),mw(),gw(),yw(),_w(),ww(),bw(),$w(),vw(),xw(),Sw(),Iw(),Tw(),kw(),Ew(),Cw(),zw(),cm(),Aw(),Ow(),Rw(),Mw(),Bw(),as(),Dw(),ym(),Nw(),Pw(),Uw(),mm(),Lw(),St(),os(),Ww(),jm=new Map([["Abs",[Uh]],["Acos",[Lh]],["Acosh",[Wh]],["Add",[vf]],["ArgMax",[Bh,Ta]],["ArgMin",[Mh,Ta]],["Asin",[qh]],["Asinh",[Vh]],["Atan",[Gh]],["Atanh",[Hh]],["Attention",[Dh]],["AveragePool",[Tm,Im]],["BatchNormalization",[Nh]],["BiasAdd",[Ph]],["BiasSplitGelu",[$f]],["Cast",[jh,Fh]],["Ceil",[Yh]],["Clip",[Kh]],["Concat",[Of,Rf]],["Conv",[Oa,Aa]],["ConvTranspose",[Vf,qf]],["Cos",[Qh]],["Cosh",[Zh]],["CumSum",[Gf,Hf]],["DepthToSpace",[Ff,jf]],["DequantizeLinear",[Rm,Mm]],["Div",[xf]],["Einsum",[Kf,Yf]],["Elu",[Xh,zr]],["Equal",[Sf]],["Erf",[Jh]],["Exp",[ef]],["Expand",[Qf]],["FastGelu",[Zf]],["Floor",[tf]],["FusedConv",[Oa,Aa]],["Gather",[Jf,Xf]],["GatherElements",[am,nm]],["GatherBlockQuantized",[rm,im]],["GatherND",[em,tm]],["Gelu",[rf]],["Gemm",[om,sm]],["GlobalAveragePool",[Em,km]],["GlobalMaxPool",[Om,Am]],["Greater",[Ef]],["GreaterOrEqual",[zf]],["GridSample",[um,lm]],["GroupQueryAttention",[_m]],["HardSigmoid",[pf,df]],["InstanceNormalization",[wm]],["LayerNormalization",[bm]],["LeakyRelu",[nf,zr]],["Less",[Cf]],["LessOrEqual",[Af]],["Log",[wf]],["MatMul",[$m]],["MatMulNBits",[vm,xm]],["MaxPool",[Cm,zm]],["Mul",[If]],["MultiHeadAttention",[pm,dm]],["Neg",[sf]],["Not",[af]],["Pad",[Sm]],["Pow",[Tf]],["QuickGelu",[bf,zr]],["Range",[Bm]],["Reciprocal",[of]],["ReduceMin",[Ch]],["ReduceMean",[Sh]],["ReduceMax",[Eh]],["ReduceSum",[Ah]],["ReduceProd",[zh]],["ReduceL1",[Ih]],["ReduceL2",[Th]],["ReduceLogSum",[Rh]],["ReduceLogSumExp",[kh]],["ReduceSumSquare",[Oh]],["Relu",[uf]],["Resize",[Pm,Um]],["RotaryEmbedding",[gm]],["ScatterND",[Nm,Dm]],["Sigmoid",[lf]],["Sin",[cf]],["Sinh",[hf]],["Slice",[Wm,qm]],["SkipLayerNormalization",[Lm]],["Split",[hm,fm]],["Sqrt",[ff]],["Softmax",[Vm,Gm]],["Sub",[kf]],["Tan",[mf]],["Tanh",[gf]],["ThresholdedRelu",[_f,zr]],["Tile",[Hm]],["Transpose",[ch,hh]],["Where",[Fm]]])}),Km,Vw=L(()=>{Ve(),pt(),ne(),Km=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,r,i,n){st(e.programInfo.name);let a=this.backend.device,s=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let o=[];for(let d of t)o.push({binding:o.length,resource:{buffer:d.buffer}});for(let d of r)o.push({binding:o.length,resource:{buffer:d.buffer}});n&&o.push({binding:o.length,resource:n});let l=a.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:o,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let d={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:l,dispatchGroup:i};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(d)}s.setPipeline(e.computePipeline),s.setBindGroup(0,l),s.dispatchWorkgroups(...i),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),tt(e.programInfo.name)}dispose(){}build(e,t){st(e.name);let r=this.backend.device,i=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(d=>{r.features.has(d.feature)&&i.push(`enable ${d.extension};`)});let n=ph(t,this.backend.device.limits),a=e.getShaderSource(n),s=`${i.join(`
`)}
${n.additionalImplementations}
${a}`,o=r.createShaderModule({code:s,label:e.name});de("verbose",()=>`[WebGPU] ${e.name} shader code: ${s}`);let l=r.createComputePipeline({compute:{module:o,entryPoint:"main"},layout:"auto",label:e.name});return tt(e.name),{programInfo:e,computePipeline:l,uniformVariablesInfo:n.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e=="number"?e:e.x,r=typeof e=="number"?1:e.y||1,i=typeof e=="number"?1:e.z||1,n=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=n&&r<=n&&i<=n)return[t,r,i];let a=t*r*i,s=Math.ceil(Math.sqrt(a));if(s>n){if(s=Math.ceil(Math.cbrt(a)),s>n)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[s,s,s]}else return[s,s,1]}}}),Ym={};lr(Ym,{WebGpuBackend:()=>Qm});var nc,ac,sc,Qm,Gw=L(()=>{Ve(),te(),pt(),sh(),ew(),qw(),Vw(),nc=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let r=[];for(let i=0;i<e.length;++i){let n=e[i].dataType;switch(t[i]){case"none":{r.push("");break}case"type":{r.push(`${n}`);break}case"rank":{let a=e[i].dims.length;r.push(`${n};${a}`);break}case"dims":{let a=e[i].dims.join(",");r.push(`${n};${a}`);break}default:throw new Error(`unsupported input dependency: ${t[i]}`)}}return r.join("|")},ac=(e,t,r)=>{var n,a;let i=e.name;return(n=e.shaderCache)!=null&&n.hint&&(i+="["+e.shaderCache.hint+"]"),i+=":"+r+`:${nc(t,((a=e.shaderCache)==null?void 0:a.inputDependencies)??new Array(t.length).fill("dims"))}`,i},sc=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},Qm=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let r=[],i={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:r},n=a=>t.features.has(a)&&r.push(a)&&!0;n("chromium-experimental-timestamp-query-inside-passes")||n("timestamp-query"),n("shader-f16"),n("subgroups"),this.device=await t.requestDevice(i),this.adapterInfo=new sc(t.info||await t.requestAdapterInfo()),this.gpuDataManager=lh(this),this.programManager=new Km(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,ts(e.logLevel,!!e.debug),this.device.onuncapturederror=a=>{a.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${a.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!1}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose()}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType==="at-passes"&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;st(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{var i;let t=new BigUint64Array(e.getMappedRange()),r=this.pendingQueries.get(e);for(let n=0;n<t.length/2;n++){let a=r[n],s=a.kernelId,o=this.kernels.get(s),l=o.kernelType,d=o.kernelName,c=a.programName,h=a.inputTensorViews,f=a.outputTensorViews,y=t[n*2],_=t[n*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=y);let w=Number(y-this.queryTimeBase),S=Number(_-this.queryTimeBase);if(!Number.isSafeInteger(w)||!Number.isSafeInteger(S))throw new RangeError("incorrect timestamp range");if((i=this.env.webgpu.profiling)!=null&&i.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:h.map($=>({dims:$.dims,dataType:dt($.dataType)})),outputsMetadata:f.map($=>({dims:$.dims,dataType:dt($.dataType)})),kernelId:s,kernelType:l,kernelName:d,programName:c,startTime:w,endTime:S});else{let $="";h.forEach((T,I)=>{$+=`input[${I}]: [${T.dims}] | ${dt(T.dataType)}, `});let b="";f.forEach((T,I)=>{b+=`output[${I}]: [${T.dims}] | ${dt(T.dataType)}, `}),console.log(`[profiling] kernel "${s}|${l}|${d}|${c}" ${$}${b}start time: ${w} ns, execution time: ${S-w} ns`)}Ci("GPU",`${c}::${y}::${_}`)}e.unmap(),this.pendingQueries.delete(e)}),tt()}run(e,t,r,i,n,a){st(e.name);let s=[];for(let b=0;b<t.length;++b){let T=t[b].data;if(T===0)continue;let I=this.gpuDataManager.get(T);if(!I)throw new Error(`no GPU data for input: ${T}`);s.push(I)}let{outputs:o,dispatchGroup:l,programUniforms:d}=e.getRunData(t),c=r.length===0?o.map((b,T)=>T):r;if(c.length!==o.length)throw new Error(`Output size ${c.length} must be equal to ${o.length}.`);let h=[],f=[];for(let b=0;b<o.length;++b){if(!Number.isInteger(c[b])||c[b]<-3||c[b]>=a)throw new Error(`Invalid output index: ${c[b]}`);if(c[b]===-3)continue;let T=c[b]===-1,I=c[b]===-2,E=T||I?n(o[b].dataType,o[b].dims):i(c[b],o[b].dataType,o[b].dims);if(h.push(E),E.data===0)continue;let A=this.gpuDataManager.get(E.data);if(!A)throw new Error(`no GPU data for output: ${E.data}`);if(T&&this.temporaryData.push(A),I){let O=this.kernelPersistentData.get(this.currentKernelId);O||(O=[],this.kernelPersistentData.set(this.currentKernelId,O)),O.push(A)}f.push(A)}if(s.length!==t.length||f.length!==h.length){if(f.length===0)return tt(e.name),h;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let y;if(d){let b=0,T=[];d.forEach(O=>{let x=typeof O.data=="number"?[O.data]:O.data;if(x.length===0)return;let z=O.type===10?2:4,N,q;O.type===10?(q=x.length>4?16:x.length>2?8:x.length*z,N=x.length>4?16:z*x.length):(q=x.length<=2?x.length*z:16,N=16),b=Math.ceil(b/q)*q,T.push(b);let G=O.type===10?8:4;b+=x.length>4?Math.ceil(x.length/G)*N:x.length*z});let I=16;b=Math.ceil(b/I)*I;let E=new ArrayBuffer(b);d.forEach((O,x)=>{let z=T[x],N=typeof O.data=="number"?[O.data]:O.data;if(O.type===6)new Int32Array(E,z,N.length).set(N);else if(O.type===12)new Uint32Array(E,z,N.length).set(N);else if(O.type===10)new Uint16Array(E,z,N.length).set(N);else if(O.type===1)new Float32Array(E,z,N.length).set(N);else throw new Error(`Unsupported uniform type: ${dt(O.type)}`)});let A=this.gpuDataManager.create(b,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(A.buffer,0,E,0,b),this.gpuDataManager.release(A.id),y={offset:0,size:b,buffer:A.buffer}}let _=this.programManager.normalizeDispatchGroupSize(l),w=_[1]===1&&_[2]===1,S=ac(e,t,w),$=this.programManager.getArtifact(S);if($||($=this.programManager.build(e,_),this.programManager.setArtifact(S,$),de("info",()=>`[artifact] key: ${S}, programName: ${e.name}`)),d&&$.uniformVariablesInfo){if(d.length!==$.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${$.uniformVariablesInfo.length}, got ${d.length} in program "${$.programInfo.name}".`);for(let b=0;b<d.length;b++){let T=d[b],I=T.type,E=typeof T.data=="number"?1:T.data.length,[A,O]=$.uniformVariablesInfo[b];if(I!==A||E!==O)throw new Error(`Uniform variable ${b} mismatch: expect type ${A} with size ${O}, got type ${I} with size ${E} in program "${$.programInfo.name}".`)}}if(de("info",()=>`[ProgramManager] run "${e.name}" (key=${S}) with ${_[0]}x${_[1]}x${_[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let b={kernelId:this.currentKernelId,programName:$.programInfo.name,inputTensorViews:t,outputTensorViews:h};this.pendingKernels.push(b),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(b)}return this.programManager.run($,s,f,_,y),tt(e.name),h}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,r,i){let n=jm.get(e);if(!n)throw new Error(`kernel not implemented: ${e}`);let a={kernelType:e,kernelName:i,kernelEntry:n[0],attributes:[n[1],r]};this.kernels.set(t,a)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let r of t)this.gpuDataManager.release(r.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,r){let i=this.kernels.get(e);if(!i)throw new Error(`kernel not created: ${e}`);let n=i.kernelType,a=i.kernelName,s=i.kernelEntry,o=i.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${n}] ${a}" is not allowed to be called recursively`);this.currentKernelId=e,o[0]&&(o[1]=o[0](o[1]),o[0]=void 0),de("info",()=>`[WebGPU] Start to run kernel "[${n}] ${a}"...`);let l=this.env.debug;this.temporaryData=[];try{return l&&this.device.pushErrorScope("validation"),s(t,o[1]),0}catch(d){return r.push(Promise.resolve(`[WebGPU] Kernel "[${n}] ${a}" failed. ${d}`)),1}finally{l&&r.push(this.device.popErrorScope().then(d=>d?`GPU validation error for kernel "[${n}] ${a}": ${d.message}`:null));for(let d of this.temporaryData)this.gpuDataManager.release(d.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,r,i){let n=this.sessionExternalDataMapping.get(e);n||(n=new Map,this.sessionExternalDataMapping.set(e,n));let a=n.get(t),s=this.gpuDataManager.registerExternalBuffer(r,i,a);return n.set(t,[s,r]),s}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(r=>this.gpuDataManager.unregisterExternalBuffer(r[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw new Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,r){return async()=>{let i=await xa(this,e,t);return rs(i.buffer,r)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){var e;this.queryType="none",(((e=this.env.webgpu.profiling)==null?void 0:e.mode)==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){de("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){de("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){de("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),r=e.length;this.pendingKernels=[];for(let i=0;i<r;i++){let n=this.getComputePassEncoder(),a=e[i];this.writeTimestamp(this.pendingDispatchNumber*2),n.setPipeline(a.computePipeline),n.setBindGroup(0,a.bindGroup),n.dispatchWorkgroups(...a.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(t[i]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),Zm={};lr(Zm,{init:()=>Xm});var mi,oc,Xm,Hw=L(()=>{te(),pt(),ie(),J_(),mi=class Jm{constructor(t,r,i,n){this.module=t,this.dataType=r,this.data=i,this.dims=n}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=M.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=M.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=M.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=M.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(M.size(t)!==M.size(this.dims))throw new Error("Invalid new shape");return new Jm(this.module,this.dataType,this.data,t)}},oc=class{constructor(e,t,r){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo;let i=e.PTR_SIZE,n=r/e.PTR_SIZE,a=i===4?"i32":"i64";this.opKernelContext=Number(e.getValue(i*n++,a));let s=Number(e.getValue(i*n++,a));this.outputCount=Number(e.getValue(i*n++,a)),this.customDataOffset=Number(e.getValue(i*n++,"*")),this.customDataSize=Number(e.getValue(i*n++,a));let o=[];for(let l=0;l<s;l++){let d=Number(e.getValue(i*n++,a)),c=Number(e.getValue(i*n++,"*")),h=Number(e.getValue(i*n++,a)),f=[];for(let y=0;y<h;y++)f.push(Number(e.getValue(i*n++,a)));o.push(new mi(e,d,c,f))}this.inputs=o}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){var s;let r=((s=t==null?void 0:t.inputs)==null?void 0:s.map(o=>typeof o=="number"?this.inputs[o]:o))??this.inputs,i=(t==null?void 0:t.outputs)??[],n=(o,l,d)=>new mi(this.module,l,this.output(o,d),d),a=(o,l)=>{let d=Dt(o,l);if(!d)throw new Error(`Unsupported data type: ${o}`);let c=d>0?this.backend.gpuDataManager.create(d).id:0;return new mi(this.module,o,c,l)};return this.backend.run(e,r,i,n,a,this.outputCount)}output(e,t){let r=this.module.stackSave();try{let i=this.module.PTR_SIZE,n=i===4?"i32":"i64",a=this.module.stackAlloc((1+t.length)*i);this.module.setValue(a,t.length,n);for(let s=0;s<t.length;s++)this.module.setValue(a+i*(s+1),t[s],n);return this.module._JsepOutput(this.opKernelContext,e,a)}catch(i){throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${i}`)}finally{this.module.stackRestore(r)}}},Xm=async(e,t,r,i)=>{let n=t.jsepInit;if(!n)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let a=(Gw(),Pr(Ym)).WebGpuBackend,s=new a;await s.initialize(r,i),n("webgpu",[s,o=>s.alloc(Number(o)),o=>s.free(o),(o,l,d,c=!1)=>{if(c)de("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(o)}, dst=${Number(l)}, size=${Number(d)}`),s.memcpy(Number(o),Number(l));else{de("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(o)}, gpuDataId=${Number(l)}, size=${Number(d)}`);let h=t.HEAPU8.subarray(Number(o>>>0),Number(o>>>0)+Number(d));s.upload(Number(l),h)}},async(o,l,d)=>{de("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${o}, dataOffset=${l}, size=${d}`),await s.download(Number(o),()=>t.HEAPU8.subarray(Number(l)>>>0,Number(l+d)>>>0))},(o,l,d)=>s.createKernel(o,Number(l),d,t.UTF8ToString(t._JsepGetNodeName(Number(l)))),o=>s.releaseKernel(o),(o,l,d,c)=>{de("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${d}, kernel=${o}, contextDataOffset=${l}`);let h=new oc(t,s,Number(l));return s.computeKernel(Number(o),h,c)},()=>s.captureBegin(),()=>s.captureEnd(),()=>s.replay()])}else{let a=new uh(r);n("webnn",[a,()=>a.reserveTensorId(),s=>a.releaseTensorId(s),async(s,o,l,d,c)=>a.ensureTensor(s,o,l,d,c),(s,o)=>{a.uploadTensor(s,o)},async(s,o)=>a.downloadTensor(s,o),(s,o)=>a.registerMLContext(s,o),!!r.trace])}}}),uc,hs,fs,wt,lc,la,Di,ms,gs,da,ys,_s,ws,eg=L(()=>{Ve(),Q_(),Z_(),te(),Yt(),Za(),rh(),uc=(e,t)=>{be()._OrtInit(e,t)!==0&&ye("Can't initialize onnxruntime.")},hs=async e=>{uc(e.wasm.numThreads,Ai(e.logLevel))},fs=async(e,t)=>{var i,n;(n=(i=be()).asyncInit)==null||n.call(i);let r=e.webgpu.adapter;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");if(r){if(typeof r.limits!="object"||typeof r.features!="object"||typeof r.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let a=e.webgpu.powerPreference;if(a!==void 0&&a!=="low-power"&&a!=="high-performance")throw new Error(`Invalid powerPreference setting: "${a}"`);let s=e.webgpu.forceFallbackAdapter;if(s!==void 0&&typeof s!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${s}"`);if(r=await navigator.gpu.requestAdapter({powerPreference:a,forceFallbackAdapter:s}),!r)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}}if(t==="webnn"&&(typeof navigator>"u"||!navigator.ml))throw new Error("WebNN is not supported in current environment");{let a=(Hw(),Pr(Zm)).init;t==="webgpu"&&await a("webgpu",be(),e,r),t==="webnn"&&await a("webnn",be(),e)}},wt=new Map,lc=e=>{let t=be(),r=t.stackSave();try{let i=t.PTR_SIZE,n=t.stackAlloc(2*i);t._OrtGetInputOutputCount(e,n,n+i)!==0&&ye("Can't get session input/output count.");let a=i===4?"i32":"i64";return[Number(t.getValue(n,a)),Number(t.getValue(n+i,a))]}finally{t.stackRestore(r)}},la=(e,t)=>{let r=be(),i=r.stackSave(),n=0;try{let a=r.PTR_SIZE,s=r.stackAlloc(2*a);r._OrtGetInputOutputMetadata(e,t,s,s+a)!==0&&ye("Can't get session input/output metadata.");let o=Number(r.getValue(s,"*"));n=Number(r.getValue(s+a,"*"));let l=r.HEAP32[n/4];if(l===0)return[o,0];let d=r.HEAPU32[n/4+1],c=[];for(let h=0;h<d;h++){let f=Number(r.getValue(n+8+h*a,"*"));c.push(f!==0?r.UTF8ToString(f):Number(r.getValue(n+8+(h+d)*a,"*")))}return[o,l,c]}finally{r.stackRestore(i),n!==0&&r._OrtFree(n)}},Di=e=>{let t=be(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,r),[r,e.byteLength]},ms=async(e,t)=>{var h,f,y,_;let r,i,n=be();Array.isArray(e)?[r,i]=e:e.buffer===n.HEAPU8.buffer?[r,i]=[e.byteOffset,e.byteLength]:[r,i]=Di(e);let a=0,s=0,o=0,l=[],d=[],c=[];try{if([s,l]=await th(t),(t==null?void 0:t.externalData)&&n.mountExternalData){let x=[];for(let z of t.externalData){let N=typeof z=="string"?z:z.path;x.push(es(typeof z=="string"?z:z.data).then(q=>{n.mountExternalData(N,q)}))}await Promise.all(x)}for(let x of(t==null?void 0:t.executionProviders)??[])if((typeof x=="string"?x:x.name)==="webnn"){if(n.shouldTransferToMLTensor=!1,typeof x!="string"){let z=x,N=z==null?void 0:z.context,q=z==null?void 0:z.gpuDevice,G=z==null?void 0:z.deviceType,H=z==null?void 0:z.powerPreference;N?n.currentContext=N:q?n.currentContext=await n.webnnCreateMLContext(q):n.currentContext=await n.webnnCreateMLContext({deviceType:G,powerPreference:H})}else n.currentContext=await n.webnnCreateMLContext();break}a=await n._OrtCreateSession(r,i,s),(h=n.webgpuOnCreateSession)==null||h.call(n,a),a===0&&ye("Can't create a session."),(f=n.jsepOnCreateSession)==null||f.call(n),n.currentContext&&(n.webnnRegisterMLContext(a,n.currentContext),n.currentContext=void 0,n.shouldTransferToMLTensor=!0);let[w,S]=lc(a),$=!!(t!=null&&t.enableGraphCapture),b=[],T=[],I=[],E=[],A=[];for(let x=0;x<w;x++){let[z,N,q]=la(a,x);z===0&&ye("Can't get an input name."),d.push(z);let G=n.UTF8ToString(z);b.push(G),I.push(N===0?{name:G,isTensor:!1}:{name:G,isTensor:!0,type:dt(N),shape:q})}for(let x=0;x<S;x++){let[z,N,q]=la(a,x+w);z===0&&ye("Can't get an output name."),c.push(z);let G=n.UTF8ToString(z);T.push(G),E.push(N===0?{name:G,isTensor:!1}:{name:G,isTensor:!0,type:dt(N),shape:q});{if($&&(t==null?void 0:t.preferredOutputLocation)===void 0){A.push("gpu-buffer");continue}let H=typeof(t==null?void 0:t.preferredOutputLocation)=="string"?t.preferredOutputLocation:((y=t==null?void 0:t.preferredOutputLocation)==null?void 0:y[G])??"cpu",R=n.webnnIsGraphOutput;if(H==="cpu"&&R&&R(a,G)){A.push("ml-tensor-cpu-output");continue}if(H!=="cpu"&&H!=="cpu-pinned"&&H!=="gpu-buffer"&&H!=="ml-tensor")throw new Error(`Not supported preferred output location: ${H}.`);if($&&H!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${H}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);A.push(H)}}let O=null;return A.some(x=>x==="gpu-buffer"||x==="ml-tensor"||x==="ml-tensor-cpu-output")&&(o=n._OrtCreateBinding(a),o===0&&ye("Can't create IO binding."),O={handle:o,outputPreferredLocations:A,outputPreferredLocationsEncoded:A.map(x=>x==="ml-tensor-cpu-output"?"ml-tensor":x).map(x=>$a(x))}),wt.set(a,[a,d,c,O,$,!1]),[a,b,T,I,E]}catch(w){throw d.forEach(S=>n._OrtFree(S)),c.forEach(S=>n._OrtFree(S)),o!==0&&n._OrtReleaseBinding(o)!==0&&ye("Can't release IO binding."),a!==0&&n._OrtReleaseSession(a)!==0&&ye("Can't release session."),w}finally{n._free(r),s!==0&&n._OrtReleaseSessionOptions(s)!==0&&ye("Can't release session options."),l.forEach(w=>n._free(w)),(_=n.unmountExternalData)==null||_.call(n)}},gs=e=>{var l,d,c;let t=be(),r=wt.get(e);if(!r)throw new Error(`cannot release session. invalid session id: ${e}`);let[i,n,a,s,o]=r;s&&(o&&t._OrtClearBoundOutputs(s.handle)!==0&&ye("Can't clear bound outputs."),t._OrtReleaseBinding(s.handle)!==0&&ye("Can't release IO binding.")),(l=t.jsepOnReleaseSession)==null||l.call(t,e),(d=t.webnnOnReleaseSession)==null||d.call(t,e),(c=t.webgpuOnReleaseSession)==null||c.call(t,e),n.forEach(h=>t._OrtFree(h)),a.forEach(h=>t._OrtFree(h)),t._OrtReleaseSession(i)!==0&&ye("Can't release session."),wt.delete(e)},da=async(e,t,r,i,n,a,s=!1)=>{if(!e){t.push(0);return}let o=be(),l=o.PTR_SIZE,d=e[0],c=e[1],h=e[3],f=h,y,_;if(d==="string"&&(h==="gpu-buffer"||h==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(s&&h!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${a} when enableGraphCapture is true.`);if(h==="gpu-buffer"){let $=e[2].gpuBuffer;_=Dt(Bt(d),c);{let b=o.jsepRegisterBuffer;if(!b)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');y=b(i,a,$,_)}}else if(h==="ml-tensor"){let $=e[2].mlTensor;_=Dt(Bt(d),c);let b=o.webnnRegisterMLTensor;if(!b)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');y=b(i,$,Bt(d),c)}else{let $=e[2];if(Array.isArray($)){_=l*$.length,y=o._malloc(_),r.push(y);for(let b=0;b<$.length;b++){if(typeof $[b]!="string")throw new TypeError(`tensor data at index ${b} is not a string`);o.setValue(y+b*l,Je($[b],r),"*")}}else{let b=o.webnnIsGraphInput,T=o.webnnIsGraphOutput;if(d!=="string"&&b&&T){let I=o.UTF8ToString(n);if(b(i,I)||T(i,I)){let E=Bt(d);_=Dt(E,c),f="ml-tensor";let A=o.webnnCreateTemporaryTensor,O=o.webnnUploadTensor;if(!A||!O)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let x=await A(i,E,c);O(x,new Uint8Array($.buffer,$.byteOffset,$.byteLength)),y=x}else _=$.byteLength,y=o._malloc(_),r.push(y),o.HEAPU8.set(new Uint8Array($.buffer,$.byteOffset,_),y)}else _=$.byteLength,y=o._malloc(_),r.push(y),o.HEAPU8.set(new Uint8Array($.buffer,$.byteOffset,_),y)}}let w=o.stackSave(),S=o.stackAlloc(4*c.length);try{c.forEach((b,T)=>o.setValue(S+T*l,b,l===4?"i32":"i64"));let $=o._OrtCreateTensor(Bt(d),y,_,S,c.length,$a(f));$===0&&ye(`Can't create tensor for input/output. session=${i}, index=${a}.`),t.push($)}finally{o.stackRestore(w)}},ys=async(e,t,r,i,n,a)=>{var G,H,R,F;let s=be(),o=s.PTR_SIZE,l=wt.get(e);if(!l)throw new Error(`cannot run inference. invalid session id: ${e}`);let d=l[0],c=l[1],h=l[2],f=l[3],y=l[4],_=l[5],w=t.length,S=i.length,$=0,b=[],T=[],I=[],E=[],A=[],O=s.stackSave(),x=s.stackAlloc(w*o),z=s.stackAlloc(w*o),N=s.stackAlloc(S*o),q=s.stackAlloc(S*o);try{[$,b]=eh(a),qt("wasm prepareInputOutputTensor");for(let W=0;W<w;W++)await da(r[W],T,E,e,c[t[W]],t[W],y);for(let W=0;W<S;W++)await da(n[W],I,E,e,h[i[W]],w+i[W],y);Vt("wasm prepareInputOutputTensor");for(let W=0;W<w;W++)s.setValue(x+W*o,T[W],"*"),s.setValue(z+W*o,c[t[W]],"*");for(let W=0;W<S;W++)s.setValue(N+W*o,I[W],"*"),s.setValue(q+W*o,h[i[W]],"*");if(f&&!_){let{handle:W,outputPreferredLocations:fe,outputPreferredLocationsEncoded:P}=f;if(c.length!==w)throw new Error(`input count from feeds (${w}) is expected to be always equal to model's input count (${c.length}).`);qt("wasm bindInputsOutputs");for(let U=0;U<w;U++){let J=t[U];await s._OrtBindInput(W,c[J],T[U])!==0&&ye(`Can't bind input[${U}] for session=${e}.`)}for(let U=0;U<S;U++){let J=i[U];(G=n[U])!=null&&G[3]?(A.push(I[U]),s._OrtBindOutput(W,h[J],I[U],0)!==0&&ye(`Can't bind pre-allocated output[${U}] for session=${e}.`)):s._OrtBindOutput(W,h[J],0,P[J])!==0&&ye(`Can't bind output[${U}] to ${fe[U]} for session=${e}.`)}Vt("wasm bindInputsOutputs"),wt.set(e,[d,c,h,f,y,!0])}(H=s.jsepOnRunStart)==null||H.call(s,d),(R=s.webnnOnRunStart)==null||R.call(s,d);let K;f?K=await s._OrtRunWithBinding(d,f.handle,S,N,$):K=await s._OrtRun(d,z,x,w,q,S,N,$),K!==0&&ye("failed to call OrtRun().");let X=[],ue=[];qt("wasm ProcessOutputTensor");for(let W=0;W<S;W++){let fe=Number(s.getValue(N+W*o,"*"));if(fe===I[W]||A.includes(I[W])){X.push(n[W]),fe!==I[W]&&s._OrtReleaseTensor(fe)!==0&&ye("Can't release tensor.");continue}let P=s.stackSave(),U=s.stackAlloc(4*o),J=!1,ee,_e=0;try{s._OrtGetTensorData(fe,U,U+o,U+2*o,U+3*o)!==0&&ye(`Can't access output tensor data on index ${W}.`);let He=o===4?"i32":"i64",Fe=Number(s.getValue(U,He));_e=s.getValue(U+o,"*");let It=s.getValue(U+o*2,"*"),Wr=Number(s.getValue(U+o*3,He)),De=[];for(let $e=0;$e<Wr;$e++)De.push(Number(s.getValue(It+$e*o,He)));s._OrtFree(It)!==0&&ye("Can't free memory for tensor dims.");let Re=De.reduce(($e,re)=>$e*re,1);ee=dt(Fe);let ct=f==null?void 0:f.outputPreferredLocations[i[W]];if(ee==="string"){if(ct==="gpu-buffer"||ct==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let $e=[];for(let re=0;re<Re;re++){let Ne=s.getValue(_e+re*o,"*"),qr=s.getValue(_e+(re+1)*o,"*"),dr=re===Re-1?void 0:qr-Ne;$e.push(s.UTF8ToString(Ne,dr))}X.push([ee,De,$e,"cpu"])}else if(ct==="gpu-buffer"&&Re>0){let $e=s.jsepGetBuffer;if(!$e)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let re=$e(_e),Ne=Dt(Fe,Re);if(Ne===void 0||!Xa(ee))throw new Error(`Unsupported data type: ${ee}`);J=!0,X.push([ee,De,{gpuBuffer:re,download:s.jsepCreateDownloader(re,Ne,ee),dispose:()=>{s._OrtReleaseTensor(fe)!==0&&ye("Can't release tensor.")}},"gpu-buffer"])}else if(ct==="ml-tensor"&&Re>0){let $e=s.webnnEnsureTensor,re=s.webnnIsGraphInputOutputTypeSupported;if(!$e||!re)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(Dt(Fe,Re)===void 0||!Ja(ee))throw new Error(`Unsupported data type: ${ee}`);if(!re(e,ee,!1))throw new Error(`preferredLocation "ml-tensor" for ${ee} output is not supported by current WebNN Context.`);let Ne=await $e(e,_e,Fe,De,!1);J=!0,X.push([ee,De,{mlTensor:Ne,download:s.webnnCreateMLTensorDownloader(_e,ee),dispose:()=>{s.webnnReleaseTensorId(_e),s._OrtReleaseTensor(fe)}},"ml-tensor"])}else if(ct==="ml-tensor-cpu-output"&&Re>0){let $e=s.webnnCreateMLTensorDownloader(_e,ee)(),re=X.length;J=!0,ue.push((async()=>{let Ne=[re,await $e];return s.webnnReleaseTensorId(_e),s._OrtReleaseTensor(fe),Ne})()),X.push([ee,De,[],"cpu"])}else{let $e=Ui(ee),re=new $e(Re);new Uint8Array(re.buffer,re.byteOffset,re.byteLength).set(s.HEAPU8.subarray(_e,_e+re.byteLength)),X.push([ee,De,re,"cpu"])}}finally{s.stackRestore(P),ee==="string"&&_e&&s._free(_e),J||s._OrtReleaseTensor(fe)}}f&&!y&&(s._OrtClearBoundOutputs(f.handle)!==0&&ye("Can't clear bound outputs."),wt.set(e,[d,c,h,f,y,!1]));for(let[W,fe]of await Promise.all(ue))X[W][2]=fe;return Vt("wasm ProcessOutputTensor"),X}finally{(F=s.webnnOnRunEnd)==null||F.call(s,d),s.stackRestore(O),T.forEach(K=>s._OrtReleaseTensor(K)),I.forEach(K=>s._OrtReleaseTensor(K)),E.forEach(K=>s._free(K)),$!==0&&s._OrtReleaseRunOptions($),b.forEach(K=>s._free(K))}},_s=e=>{let t=be(),r=wt.get(e);if(!r)throw new Error("invalid session id");let i=r[0],n=t._OrtEndProfiling(i);n===0&&ye("Can't get an profile file name."),t._OrtFree(n)},ws=e=>{let t=[];for(let r of e){let i=r[2];!Array.isArray(i)&&"buffer"in i&&t.push(i.buffer)}return t}}),bt,Me,Jt,Tr,kr,gi,pa,yi,Ot,Rt,dc,tg,rg,ig,ng,ag,sg,og,ug=L(()=>{Ve(),eg(),Yt(),Ya(),bt=()=>!!xe.wasm.proxy&&typeof document<"u",Jt=!1,Tr=!1,kr=!1,yi=new Map,Ot=(e,t)=>{let r=yi.get(e);r?r.push(t):yi.set(e,[t])},Rt=()=>{if(Jt||!Tr||kr||!Me)throw new Error("worker not ready")},dc=e=>{switch(e.data.type){case"init-wasm":Jt=!1,e.data.err?(kr=!0,pa[1](e.data.err)):(Tr=!0,pa[0]()),gi&&(URL.revokeObjectURL(gi),gi=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=yi.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}}},tg=async()=>{if(!Tr){if(Jt)throw new Error("multiple calls to 'initWasm()' detected.");if(kr)throw new Error("previous call to 'initWasm()' failed.");if(Jt=!0,bt())return new Promise((e,t)=>{Me==null||Me.terminate(),Xc().then(([r,i])=>{try{Me=i,Me.onerror=a=>t(a),Me.onmessage=dc,pa=[e,t];let n={type:"init-wasm",in:xe};!n.in.wasm.wasmPaths&&(r||ba)&&(n.in.wasm.wasmPaths={wasm:new URL("/formVerify/assets/ort-wasm-simd-threaded.jsep-C887KxcQ.wasm",import.meta.url).href}),Me.postMessage(n),gi=r}catch(n){t(n)}},t)});try{await Qa(xe.wasm),await hs(xe),Tr=!0}catch(e){throw kr=!0,e}finally{Jt=!1}}},rg=async e=>{if(bt())return Rt(),new Promise((t,r)=>{Ot("init-ep",[t,r]);let i={type:"init-ep",in:{epName:e,env:xe}};Me.postMessage(i)});await fs(xe,e)},ig=async e=>bt()?(Rt(),new Promise((t,r)=>{Ot("copy-from",[t,r]);let i={type:"copy-from",in:{buffer:e}};Me.postMessage(i,[e.buffer])})):Di(e),ng=async(e,t)=>{if(bt()){if(t!=null&&t.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return Rt(),new Promise((r,i)=>{Ot("create",[r,i]);let n={type:"create",in:{model:e,options:{...t}}},a=[];e instanceof Uint8Array&&a.push(e.buffer),Me.postMessage(n,a)})}else return ms(e,t)},ag=async e=>{if(bt())return Rt(),new Promise((t,r)=>{Ot("release",[t,r]);let i={type:"release",in:e};Me.postMessage(i)});gs(e)},sg=async(e,t,r,i,n,a)=>{if(bt()){if(r.some(s=>s[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(n.some(s=>s))throw new Error("pre-allocated output tensor is not supported for proxy.");return Rt(),new Promise((s,o)=>{Ot("run",[s,o]);let l=r,d={type:"run",in:{sessionId:e,inputIndices:t,inputs:l,outputIndices:i,options:a}};Me.postMessage(d,ws(l))})}else return ys(e,t,r,i,n,a)},og=async e=>{if(bt())return Rt(),new Promise((t,r)=>{Ot("end-profiling",[t,r]);let i={type:"end-profiling",in:e};Me.postMessage(i)});_s(e)}}),ca,pc,lg,Fw=L(()=>{Ve(),ug(),te(),Ka(),rh(),ca=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},pc=e=>{switch(e[3]){case"cpu":return new et(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!Xa(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:r,download:i,dispose:n}=e[2];return et.fromGpuBuffer(r,{dataType:t,dims:e[1],download:i,dispose:n})}case"ml-tensor":{let t=e[0];if(!Ja(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:r,download:i,dispose:n}=e[2];return et.fromMLTensor(r,{dataType:t,dims:e[1],download:i,dispose:n})}default:throw new Error(`invalid data location: ${e[3]}`)}},lg=class{async fetchModelAndCopyToWasmMemory(e){return ig(await es(e))}async loadModel(e,t){st();let r;typeof e=="string"?r=await this.fetchModelAndCopyToWasmMemory(e):r=e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await ng(r,t),tt()}async dispose(){return ag(this.sessionId)}async run(e,t,r){st();let i=[],n=[];Object.entries(e).forEach(h=>{let f=h[0],y=h[1],_=this.inputNames.indexOf(f);if(_===-1)throw new Error(`invalid input '${f}'`);i.push(y),n.push(_)});let a=[],s=[];Object.entries(t).forEach(h=>{let f=h[0],y=h[1],_=this.outputNames.indexOf(f);if(_===-1)throw new Error(`invalid output '${f}'`);a.push(y),s.push(_)});let o=i.map((h,f)=>ca(h,()=>`input "${this.inputNames[n[f]]}"`)),l=a.map((h,f)=>h?ca(h,()=>`output "${this.outputNames[s[f]]}"`):null),d=await sg(this.sessionId,n,o,s,l,r),c={};for(let h=0;h<d.length;h++)c[this.outputNames[s[h]]]=a[h]??pc(d[h]);return tt(),c}startProfiling(){}endProfiling(){og(this.sessionId)}}}),dg={};lr(dg,{OnnxruntimeWebAssemblyBackend:()=>Ba,initializeFlags:()=>Ma,wasmBackend:()=>pg});var Ma,Ba,pg,jw=L(()=>{Ve(),ug(),Fw(),Ma=()=>{(typeof xe.wasm.initTimeout!="number"||xe.wasm.initTimeout<0)&&(xe.wasm.initTimeout=0);let e=xe.wasm.simd;if(typeof e!="boolean"&&e!==void 0&&e!=="fixed"&&e!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),xe.wasm.simd=!1),typeof xe.wasm.proxy!="boolean"&&(xe.wasm.proxy=!1),typeof xe.wasm.trace!="boolean"&&(xe.wasm.trace=!1),typeof xe.wasm.numThreads!="number"||!Number.isInteger(xe.wasm.numThreads)||xe.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)xe.wasm.numThreads=1;else{let t=typeof navigator>"u"?O_("node:os").cpus().length:navigator.hardwareConcurrency;xe.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},Ba=class{async init(e){Ma(),await tg(),await rg(e)}async createInferenceSessionHandler(e,t){let r=new lg;return await r.loadModel(e,t),r}},pg=new Ba});Ve();Ve();Ve();var Kw="1.24.3";{let e=(jw(),Pr(dg)).wasmBackend;tr("webgpu",e,5),tr("webnn",e,5),tr("cpu",e,10),tr("wasm",e,10)}Object.defineProperty(xe.versions,"web",{value:Kw,enumerable:!0});/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*//**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 *//**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Le=32;let _i=null,wi=null;function cg(){return _i?Promise.resolve(_i):wi||(wi=(async()=>(xe.wasm.numThreads=1,_i=await ja.create("/formVerify/models/digit-classifier.onnx",{executionProviders:["wasm"]}),_i))(),wi)}async function Yw(e,t){const r=await cg(),i=Qw(e,t),n=32,a=new Float32Array(n*n);for(let _=0;_<a.length;_++)a[_]=i[_]*2-1;const s=new et("float32",a,[1,1,n,n]),o=await r.run({input:s}),l=Array.from(o.logits.data),d=eb(l),c=d.indexOf(Math.max(...d)),h=d[c]*100,f=new Uint8ClampedArray(n*n*4);for(let _=0;_<n*n;_++){const w=Math.round((1-i[_])*255);f[_*4]=w,f[_*4+1]=w,f[_*4+2]=w,f[_*4+3]=255}const y=new ImageData(f,n,n);return{digit:c,confidence:h,mnistPatch:y}}function Qw(e,t){const r=new e.Mat;t.channels()===4?e.cvtColor(t,r,e.COLOR_RGBA2GRAY):t.channels()===3?e.cvtColor(t,r,e.COLOR_RGB2GRAY):t.copyTo(r);const i=new e.CLAHE(2,new e.Size(4,4)),n=new e.Mat;i.apply(r,n),r.delete(),i.delete();const a=new e.Mat;e.threshold(n,a,0,255,e.THRESH_BINARY_INV|e.THRESH_OTSU),n.delete();const s=a,o=s.cols,l=s.rows;let d=cc(e,s),c=null;if(d.length===0){c=new e.Mat,s.copyTo(c);for(let y=0;y<o;y++)c.ucharPtr(1,y)[0]=0,c.ucharPtr(l-2,y)[0]=0;for(let y=0;y<l;y++)c.ucharPtr(y,1)[0]=0,c.ucharPtr(y,o-2)[0]=0;d=cc(e,c)}const h=c||s;let f;if(d.length>0)f=hc(e,h,d);else{const y=Zw(e,h);y>=0?f=hc(e,h,[y]):f=new Float32Array(Le*Le)}return c&&c.delete(),s.delete(),f}function cc(e,t){const r=new e.Mat,i=new e.Mat,n=new e.Mat,a=e.connectedComponentsWithStats(t,r,i,n,8),s=t.cols,o=t.rows,l=s*o*.02,d=[];for(let c=1;c<a;c++){const h=i.intAt(c,e.CC_STAT_LEFT),f=i.intAt(c,e.CC_STAT_TOP),y=i.intAt(c,e.CC_STAT_WIDTH),_=i.intAt(c,e.CC_STAT_HEIGHT);if(i.intAt(c,e.CC_STAT_AREA)<l)continue;h<=0||f<=0||h+y>=s||f+_>=o||d.push(c)}return r.delete(),i.delete(),n.delete(),d}function Zw(e,t){const r=new e.Mat,i=new e.Mat,n=new e.Mat,a=e.connectedComponentsWithStats(t,r,i,n,8);let s=-1,o=0;for(let l=1;l<a;l++){const d=i.intAt(l,e.CC_STAT_AREA);d>o&&(s=l,o=d)}return r.delete(),i.delete(),n.delete(),s}function hc(e,t,r){const i=new e.Mat,n=new e.Mat,a=new e.Mat;e.connectedComponentsWithStats(t,i,n,a,8);let s=t.cols,o=t.rows,l=0,d=0;for(const w of r){const S=n.intAt(w,e.CC_STAT_LEFT),$=n.intAt(w,e.CC_STAT_TOP),b=n.intAt(w,e.CC_STAT_WIDTH),T=n.intAt(w,e.CC_STAT_HEIGHT);s=Math.min(s,S),o=Math.min(o,$),l=Math.max(l,S+b),d=Math.max(d,$+T)}const c=l-s,h=d-o,f=new Set(r),y=new e.Mat(h,c,e.CV_8UC1,new e.Scalar(0));for(let w=0;w<h;w++)for(let S=0;S<c;S++)f.has(i.intAt(o+w,s+S))&&(y.ucharPtr(w,S)[0]=255);i.delete(),n.delete(),a.delete();let _=fc(y);if(!_){const w=Jw(e,y);_=fc(w),_||(_=Xw(w)),w.delete()}return y.delete(),_}function fc(e){const t=e.rows,r=e.cols,{offX:i,offY:n}=hg(e);if(i<1||n<1||i+r-1>30||n+t-1>30)return null;const a=new Float32Array(Le*Le);for(let s=0;s<t;s++)for(let o=0;o<r;o++){const l=i+o,d=n+s;a[d*Le+l]=e.ucharAt(s,o)/255}return a}function Xw(e){const t=e.rows,r=e.cols,{offX:i,offY:n}=hg(e),a=new Float32Array(Le*Le);for(let s=0;s<t;s++)for(let o=0;o<r;o++){const l=i+o,d=n+s;l>=0&&l<Le&&d>=0&&d<Le&&(a[d*Le+l]=e.ucharAt(s,o)/255)}return a}function hg(e){const t=e.rows,r=e.cols;let i=0,n=0,a=0;for(let o=0;o<t;o++)for(let l=0;l<r;l++){const d=e.ucharAt(o,l);d>0&&(i+=l*d,n+=o*d,a+=d)}const s=Le/2;return a>0?{offX:Math.round(s-i/a),offY:Math.round(s-n/a)}:{offX:Math.round((Le-r)/2),offY:Math.round((Le-t)/2)}}function Jw(e,t){const r=t.rows,i=t.cols,n=Math.floor(r/2),a=Math.floor(i/2),s=new e.Mat(n,a,e.CV_8UC1,new e.Scalar(0));for(let o=0;o<n;o++)for(let l=0;l<a;l++){const d=t.ucharAt(o*2,l*2)+t.ucharAt(o*2+1,l*2)+t.ucharAt(o*2,l*2+1)+t.ucharAt(o*2+1,l*2+1);s.ucharPtr(o,l)[0]=Math.min(255,Math.round(d/4))}return s}function eb(e){const t=Math.max(...e),r=e.map(n=>Math.exp(n-t)),i=r.reduce((n,a)=>n+a,0);return r.map(n=>n/i)}const mc=["90L RUC","7.6L Sharps","20L Sharps","25L Sharps","2.5L Specibin","5L Specibin","10L Specibin","20L Specibin","25L Specibin","Pharma 5L","Pharma 20L","50L Box","142L Box","Other"],gc=["received","gross_kg","nett_kg"],tb=[.0409,.1109,.181,.2511,.3211,.3912,.4613,.5313,.6014,.6714,.7415,.8116,.8816,.9517],rb=[.1485,.1822,.2145],ib=.0143,nb=.0308,ab=.0159,sb=.0085,ob=3,ha=3,ub=1;function lb(e,t){return`${e}_${t.replace(/[\s.]/g,"_")}`}function db(){const e=[];for(let t=0;t<gc.length;t++){const r=gc[t],i=r==="gross_kg"||r==="nett_kg",n=i?ha+ub:ob;for(let a=0;a<mc.length;a++){const s=mc[a],o=lb(r,s),l=tb[a],d=rb[t];let c=0;for(let h=0;h<n;h++){const f=i&&h>=ha;e.push({id:`${o}_d${h}`,row:r,col:s,x:l+c,y:d,w:ib,h:nb,digitIndex:h,isDecimal:f,fieldId:o}),i&&h===ha-1?c+=sb:c+=ab}}}return e}const pb={digitBoxes:db()};function cb(e){const t=new Map;for(const[i,n]of e){const a=i.replace(/_d\d+$/,"");t.has(a)||t.set(a,[]);const s=pb.digitBoxes.find(o=>o.id===i);s&&t.get(a).push({digitIndex:s.digitIndex,isDecimal:s.isDecimal,value:n})}const r=new Map;for(const[i,n]of t){n.sort((l,d)=>l.digitIndex-d.digitIndex);let a="",s=!1;for(const l of n)l.isDecimal&&!s&&(a+=",",s=!0),a+=l.value;const o=a.replace(/^0+(?=\d)/,"");r.set(i,o||a)}return r}var hb=Object.defineProperty,fb=Object.getOwnPropertyDescriptor,Ge=(e,t,r,i)=>{for(var n=i>1?void 0:i?fb(t,r):t,a=e.length-1,s;a>=0;a--)(s=e[a])&&(n=(i?s(t,r,n):s(n))||n);return i&&n&&hb(t,r,n),n};let Be=class extends Ut{constructor(){super(...arguments),this.captureId=0,this._processState="loading-cv",this._error="",this._markers=[],this._resultUrl="",this._classifyProgress="",this._selectedCellId="",this._pipelineDebug=null,this._digitResults=[],this._openDebugStage="",this._debugSelectedCol=0,this._mnistPatches=new Map,this._debugUrls=new Map}connectedCallback(){super.connectedCallback(),this._process()}disconnectedCallback(){super.disconnectedCallback(),this._resultUrl&&URL.revokeObjectURL(this._resultUrl)}_getDebugUrl(e,t){let r=this._debugUrls.get(e);if(!r){const i=document.createElement("canvas");i.width=t.width,i.height=t.height,i.getContext("2d").putImageData(t,0,0),r=i.toDataURL("image/png"),this._debugUrls.set(e,r)}return r}async _process(){try{this._processState="loading-cv";const e=await f_(),t=await kc(this.captureId);if(!t){this._error="Capture not found in database.",this._processState="error";return}const r=await createImageBitmap(t.blob),i=document.createElement("canvas");i.width=r.width,i.height=r.height;const n=i.getContext("2d");n.drawImage(r,0,0);const a=n.getImageData(0,0,i.width,i.height),s=e.matFromImageData(a);try{if(this._processState="detecting",this._markers=m_(e,s),this._markers.length<4){const l=this._markers.map(d=>d.id).join(", ");this._error=`Found ${this._markers.length}/4 markers${l?` (IDs: ${l})`:""}. Need all 4 corner markers.`,this._processState="error";return}this._processState="correcting";const o=y_(e,s,this._markers);if(!o){this._error="Perspective correction failed.",this._processState="error";return}try{const l=await __(e,o.corrected);await Ga(l),await Ec(this.captureId,"processed"),this._resultUrl=URL.createObjectURL(l),this._processState="extracting";const d=S_(e,o.corrected);this._pipelineDebug=d.debug,this._processState="classifying",await cg();const c=[],h=d.digits.length;for(let f=0;f<d.digits.length;f++){const y=d.digits[f],_=e.matFromImageData(y.imageData),w=await Yw(e,_);_.delete(),w.mnistPatch&&this._mnistPatches.set(y.cellId,w.mnistPatch),c.push({cellId:y.cellId,row:y.row,col:y.col,digit:w.digit,confidence:w.confidence}),((f+1)%20===0||f===h-1)&&(this._classifyProgress=`${f+1}/${h}`)}this._digitResults=c,this._processState="done"}finally{o.corrected.delete()}}finally{s.delete()}}catch(e){this._error=e instanceof Error?e.message:"Processing failed.",this._processState="error"}}_done(){this.dispatchEvent(new CustomEvent("processing-complete",{detail:{results:this._digitResults},bubbles:!0,composed:!0}))}_selectCell(e){this._selectedCellId=this._selectedCellId===e?"":e}_toggleDebugStage(e){this._openDebugStage=this._openDebugStage===e?"":e}_getFieldDigitIds(e){const t=e.replace(/_d\d+$/,"");return this._digitResults.filter(r=>r.cellId.startsWith(t+"_d")).map(r=>r.cellId)}_navigateDigit(e){const t=this._getFieldDigitIds(this._selectedCellId),r=t.indexOf(this._selectedCellId),i=Math.max(0,Math.min(t.length-1,r+e));this._selectedCellId=t[i]}render(){switch(this._processState){case"loading-cv":return this._renderSpinner("Loading OpenCV...");case"detecting":return this._renderSpinner("Detecting ArUco markers...");case"correcting":return this._renderSpinner("Correcting perspective...");case"extracting":return this._renderSpinner("Extracting columns and digits...");case"classifying":return this._renderSpinner(`Classifying digits... ${this._classifyProgress}`);case"error":return he`
          <p class="status error">${this._error}</p>
          <div class="controls">
            <button class="done-btn" @click=${this._done}>Back</button>
          </div>
        `;case"done":return this._renderResults()}}_renderSpinner(e){return he`<div class="spinner"></div><p class="status">${e}</p>`}_renderDebugStages(){const e=this._pipelineDebug;return e?he`
      ${this._renderColumnsStage(e)}
      ${this._renderBoxesStage(e)}
      ${this._renderDigitsStage(e)}
    `:me}_renderColumnsStage(e){const t=this._openDebugStage==="columns",r=[e.rowBounds[1]-e.rowBounds[0],e.rowBounds[2]-e.rowBounds[1],e.rowBounds[3]-e.rowBounds[2]];return he`
      <div class="debug-section">
        <div class="debug-header" @click=${()=>this._toggleDebugStage("columns")}>
          <span>Stage 1: Column Detection</span>
          <span>${t?"▲":"▼"}</span>
        </div>
        ${t?he`
          <div class="debug-body">
            <div class="debug-meta">
              Rows: ${e.rowBounds.join(", ")} (heights: ${r.join(", ")}px)
              | Header top: ${e.headerTop}
              | ${e.columnDividers.length} columns, avg width: ${e.avgColumnWidth}px
            </div>
            <img class="debug-img" src=${this._getDebugUrl("tableStrip",e.tableStripImage)}
              alt="Table strip with column dividers" />
            <div class="debug-meta">
              Dividers: ${e.columnDividers.join(", ")}
            </div>
          </div>
        `:me}
      </div>
    `}_renderBoxesStage(e){const t=this._openDebugStage==="boxes",r=["90L RUC","7.6L Sharps","20L Sharps","25L Sharps","2.5L Specibin","5L Specibin","10L Specibin","20L Specibin","25L Specibin","Pharma 5L","Pharma 20L","50L Box","142L Box","Other"],i=e.columnCrops.get(this._debugSelectedCol);return he`
      <div class="debug-section">
        <div class="debug-header" @click=${()=>this._toggleDebugStage("boxes")}>
          <span>Stage 2: Digit Box Extraction</span>
          <span>${t?"▲":"▼"}</span>
        </div>
        ${t?he`
          <div class="debug-body">
            <div class="col-thumbs">
              ${Array.from({length:14},(n,a)=>{const s=e.columnCrops.get(a);return s?he`
                  <div class="col-thumb ${a===this._debugSelectedCol?"active":""}"
                    @click=${()=>{this._debugSelectedCol=a}}>
                    <img src=${this._getDebugUrl(`col_${a}`,s)}
                      alt="${r[a]}" title="${r[a]}" />
                  </div>
                `:me})}
            </div>
            <div class="debug-meta">${r[this._debugSelectedCol]}</div>
            ${i?he`
              <img class="debug-img" src=${this._getDebugUrl(`col_${this._debugSelectedCol}`,i)}
                alt="Column ${this._debugSelectedCol} with digit boxes" />
            `:me}
          </div>
        `:me}
      </div>
    `}_renderDigitsStage(e){const t=this._openDebugStage==="digits",r=["90L RUC","7.6L Sharps","20L Sharps","25L Sharps","2.5L Specibin","5L Specibin","10L Specibin","20L Specibin","25L Specibin","Pharma 5L","Pharma 20L","50L Box","142L Box","Other"],i=["received","gross_kg","nett_kg"],n=r[this._debugSelectedCol],a=n.replace(/[\s.]/g,"_");return he`
      <div class="debug-section">
        <div class="debug-header" @click=${()=>this._toggleDebugStage("digits")}>
          <span>Stage 3: Classification Results</span>
          <span>${t?"▲":"▼"}</span>
        </div>
        ${t?he`
          <div class="debug-body">
            <div class="debug-meta">Column: ${n} (use thumbnails above to change)</div>
            ${i.map(s=>{const o=s==="received"?"Received":s==="gross_kg"?"Gross KG":"Nett KG",d=s!=="received"?4:3,c=`${s}_${a}`;return he`
                <div class="debug-meta" style="margin-top:8px; font-weight:500;">${o}</div>
                <div style="display:flex; gap:4px; flex-wrap:wrap;">
                  ${Array.from({length:d},(h,f)=>{const y=`${c}_d${f}`,_=e.digitCrops.get(y),w=e.digitPreprocessed.get(y),S=this._mnistPatches.get(y),$=this._digitResults.find(T=>T.cellId===y);if(!_)return me;const b=(($==null?void 0:$.confidence)??0)>=50?"#4caf50":"#d93025";return he`
                      <div style="text-align:center; border:1px solid #ddd; border-radius:4px; padding:4px; min-width:60px;">
                        <img src=${this._getDebugUrl(`raw_${y}`,_)}
                          style="width:34px; height:51px; image-rendering:pixelated; display:block; margin:0 auto;" />
                        ${w?he`
                          <img src=${this._getDebugUrl(`pp_${y}`,w)}
                            style="width:34px; height:51px; image-rendering:pixelated; display:block; margin:2px auto 0;" />
                        `:me}
                        ${S?he`
                          <img src=${this._getDebugUrl(`mnist_${y}`,S)}
                            style="width:28px; height:28px; image-rendering:pixelated; display:block; margin:2px auto 0; border:1px solid #aaa;" />
                        `:me}
                        <div style="font-size:0.75rem; font-weight:bold; margin-top:2px;">
                          ${$?$.digit:"?"}
                        </div>
                        <div style="font-size:0.65rem; color:${b};">
                          ${$?`${$.confidence.toFixed(0)}%`:""}
                        </div>
                      </div>
                    `})}
                </div>
              `})}
          </div>
        `:me}
      </div>
    `}_renderCellPreview(){var d;if(!this._selectedCellId)return me;const e=this._pipelineDebug;if(!e)return me;const t=e.digitCrops.get(this._selectedCellId);if(!t)return me;const r=e.digitPreprocessed.get(this._selectedCellId),i=this._digitResults.find(c=>c.cellId===this._selectedCellId),n=this._selectedCellId.includes("_d"),a=n?this._getFieldDigitIds(this._selectedCellId):[],s=a.indexOf(this._selectedCellId),o=(i==null?void 0:i.col)||"",l=(i==null?void 0:i.row)||"";return he`
      <div class="cell-preview">
        <div class="cell-preview-header">
          ${o} ${l?` (${l})`:""}
          ${n?he` — digit ${s+1}/${a.length}`:""}
        </div>

        ${n&&a.length>1?he`
          <div style="display:flex; gap:8px; justify-content:center; margin:4px 0;">
            <button style="padding:4px 12px; font-size:0.85rem;" ?disabled=${s===0}
              @click=${()=>this._navigateDigit(-1)}>&larr; Prev</button>
            <button style="padding:4px 12px; font-size:0.85rem;" ?disabled=${s===a.length-1}
              @click=${()=>this._navigateDigit(1)}>Next &rarr;</button>
          </div>
        `:me}

        <div class="cell-preview-details">
          Result: <strong>"${i?String(i.digit):""}"</strong> |
          Confidence: <strong>${((d=i==null?void 0:i.confidence)==null?void 0:d.toFixed(0))??"?"}%</strong>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px; width:100%;">
          <div style="text-align:center">
            <div style="font-size:0.65rem; color:#999;">Raw crop</div>
            <img class="cell-preview-img" src=${this._getDebugUrl(`raw_${this._selectedCellId}`,t)}
              alt="Raw crop" style="width:100%; height:auto; image-rendering:pixelated;" />
          </div>
          ${r?he`
            <div style="text-align:center">
              <div style="font-size:0.65rem; color:#999;">Preprocessed</div>
              <img class="cell-preview-img" src=${this._getDebugUrl(`pp_${this._selectedCellId}`,r)}
                alt="Preprocessed" style="width:100%; height:auto; image-rendering:pixelated;" />
            </div>
          `:me}
          ${(()=>{const c=this._mnistPatches.get(this._selectedCellId);return c?he`
              <div style="text-align:center">
                <div style="font-size:0.65rem; color:#999;">MNIST input (28x28)</div>
                <img class="cell-preview-img" src=${this._getDebugUrl(`mnist_${this._selectedCellId}`,c)}
                  alt="MNIST patch" style="width:100%; height:auto; image-rendering:pixelated;" />
              </div>
            `:me})()}
        </div>
      </div>
    `}_renderResults(){const e=new Map;for(const s of this._digitResults)e.set(s.cellId,String(s.digit));const t=cb(e),r=new Map,i=new Map;for(const s of this._digitResults){const o=s.cellId.replace(/_d\d+$/,"");i.has(o)||i.set(o,[]),i.get(o).push(s.confidence)}for(const[s,o]of i)r.set(s,o.reduce((l,d)=>l+d,0)/o.length);const n=["received","gross_kg","nett_kg"],a=["90L RUC","7.6L Sharps","20L Sharps","25L Sharps","2.5L Specibin","5L Specibin","10L Specibin","20L Specibin","25L Specibin","Pharma 5L","Pharma 20L","50L Box","142L Box","Other"];return he`
      <div class="results">
        <img class="result-img" src=${this._resultUrl} alt="Corrected form" />

        <div class="info-bar">
          Markers: ${this._markers.length}/4 |
          ${this._digitResults.length} digits classified
        </div>

        ${this._renderDebugStages()}

        ${this._renderCellPreview()}

        <div class="table-wrapper">
          <table class="ocr-table">
            <thead>
              <tr>
                <th></th>
                ${a.map(s=>he`<th>${s}</th>`)}
              </tr>
            </thead>
            <tbody>
              ${n.map(s=>he`
                  <tr>
                    <td class="row-header">${s==="received"?"Received":s==="gross_kg"?"Gross KG":"Nett KG"}</td>
                    ${a.map(l=>{const d=`${s}_${l.replace(/[\s.]/g,"_")}`,c=t.get(d)||"",h=r.get(d)??0,f=this._selectedCellId.startsWith(d),y=`${d}_d0`;let _="clickable";return c&&c!=="000"&&c!=="000,0"&&(_+=h<50?" has-value low-conf":" has-value"),f&&(_+=" selected"),he`<td
                        class=${_}
                        @click=${()=>this._selectCell(y)}
                      >${c||"—"}</td>`})}
                  </tr>
                `)}
            </tbody>
          </table>
        </div>

        <div class="controls">
          <button class="done-btn" @click=${this._done}>Done</button>
        </div>
      </div>
    `}};Be.styles=Pa`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      flex: 1;
      padding: 16px;
      gap: 16px;
      overflow-y: auto;
    }

    .status { text-align: center; color: #666; }
    .status.error { color: #d93025; }

    .spinner {
      width: 40px; height: 40px;
      border: 4px solid #e0e0e0; border-top-color: #1a73e8;
      border-radius: 50%; animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .results {
      display: flex; flex-direction: column; align-items: center;
      gap: 12px; width: 100%; max-width: 600px;
    }

    .result-img {
      width: 100%; max-height: 40vh; object-fit: contain;
      border: 1px solid #ddd; border-radius: 4px;
    }

    .info-bar {
      font-size: 0.85rem; color: #333; background: #f0f0f0;
      padding: 8px 16px; border-radius: 4px; width: 100%;
    }

    .ocr-table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
    .ocr-table th, .ocr-table td { border: 1px solid #ddd; padding: 4px 6px; text-align: center; }
    .ocr-table th { background: #e8e8e8; font-size: 0.7rem; position: sticky; top: 0; }
    .ocr-table .row-header { text-align: left; font-weight: bold; background: #f4f4f4; }
    .ocr-table td.clickable { cursor: pointer; }
    .ocr-table td.has-value { background: #e8f5e9; font-weight: bold; }
    .ocr-table td.low-conf { background: #fff3e0; }
    .ocr-table td.selected { outline: 2px solid #1a73e8; outline-offset: -2px; }

    .table-wrapper { width: 100%; overflow-x: auto; }

    .cell-preview {
      width: 100%; background: #fafafa; border: 1px solid #ddd;
      border-radius: 4px; padding: 12px;
      display: flex; flex-direction: column; align-items: center; gap: 8px;
    }
    .cell-preview-header { font-size: 0.85rem; font-weight: 500; color: #333; }
    .cell-preview-img { image-rendering: pixelated; border: 1px solid #ccc; background: white; }
    .cell-preview-details { font-size: 0.8rem; color: #666; }

    .controls { display: flex; gap: 12px; padding: 8px 0; }
    button { padding: 10px 20px; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; }
    .done-btn { background: #1a73e8; color: white; }

    /* Debug stages */
    .debug-section {
      width: 100%; border: 1px solid #ddd; border-radius: 4px; overflow: hidden;
    }
    .debug-header {
      background: #f5f5f5; padding: 8px 12px; cursor: pointer;
      font-size: 0.85rem; font-weight: 500; display: flex;
      justify-content: space-between; align-items: center;
      user-select: none;
    }
    .debug-header:hover { background: #eee; }
    .debug-body { padding: 8px 12px; }
    .debug-img {
      width: 100%; height: auto; image-rendering: pixelated;
      border: 1px solid #ccc; border-radius: 2px;
    }
    .debug-meta { font-size: 0.75rem; color: #666; margin: 4px 0; }
    .col-thumbs {
      display: flex; gap: 4px; overflow-x: auto; padding: 4px 0;
    }
    .col-thumb {
      cursor: pointer; border: 2px solid transparent; border-radius: 2px;
      flex-shrink: 0;
    }
    .col-thumb.active { border-color: #1a73e8; }
    .col-thumb img { height: 80px; width: auto; image-rendering: pixelated; }
  `;Ge([Sc({type:Number})],Be.prototype,"captureId",2);Ge([Ae()],Be.prototype,"_processState",2);Ge([Ae()],Be.prototype,"_error",2);Ge([Ae()],Be.prototype,"_markers",2);Ge([Ae()],Be.prototype,"_resultUrl",2);Ge([Ae()],Be.prototype,"_classifyProgress",2);Ge([Ae()],Be.prototype,"_selectedCellId",2);Ge([Ae()],Be.prototype,"_pipelineDebug",2);Ge([Ae()],Be.prototype,"_digitResults",2);Ge([Ae()],Be.prototype,"_openDebugStage",2);Ge([Ae()],Be.prototype,"_debugSelectedCol",2);Be=Ge([qa("image-processor")],Be);var mb=Object.defineProperty,gb=Object.getOwnPropertyDescriptor,Li=(e,t,r,i)=>{for(var n=i>1?void 0:i?gb(t,r):t,a=e.length-1,s;a>=0;a--)(s=e[a])&&(n=(i?s(t,r,n):s(n))||n);return i&&n&&mb(t,r,n),n};let ur=class extends Ut{constructor(){super(...arguments),this._view="home",this._toast="",this._captureId=0}_showCamera(){this._view="camera"}_goHome(){this._view="home"}_onCaptureSaved(e){this._captureId=e.detail.id,this._view="processing"}async _onFileUpload(){const e=document.createElement("input");e.type="file",e.accept="image/*",e.onchange=async()=>{var i;const t=(i=e.files)==null?void 0:i[0];if(!t)return;const{saveCapture:r}=await ky(async()=>{const{saveCapture:n}=await Promise.resolve().then(()=>p_);return{saveCapture:n}},[]);this._captureId=await r(t),this._view="processing"},e.click()}_onProcessingComplete(){this._toast="Form processed successfully",this._view="home",setTimeout(()=>{this._toast=""},2500)}render(){return he`
      <header>
        ${this._view!=="home"?he`<button class="back-btn" @click=${this._goHome} aria-label="Back">&larr;</button>`:""}
        formVerify
        <span class="build-tag">${new Date("2026-03-25T13:08:44.771Z").toLocaleString()}</span>
      </header>

      ${this._view==="home"?this._renderHome():""}
      ${this._view==="camera"?this._renderCamera():""}
      ${this._view==="processing"?this._renderProcessing():""}
      ${this._toast?he`<div class="toast">${this._toast}</div>`:""}
    `}_renderHome(){return he`
      <main>
        <button class="capture-btn" @click=${this._showCamera}>
          Capture Form
        </button>
        <button class="capture-btn" style="background:#666" @click=${this._onFileUpload}>
          Upload Image
        </button>
        <p class="info">
          Take a photo of a waste manifest form<br />
          or upload an existing image to begin verification.
        </p>
      </main>
    `}_renderCamera(){return he`
      <camera-capture @capture-saved=${this._onCaptureSaved}></camera-capture>
    `}_renderProcessing(){return he`
      <image-processor
        .captureId=${this._captureId}
        @processing-complete=${this._onProcessingComplete}
      ></image-processor>
    `}};ur.styles=Pa`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    header {
      background: #1a73e8;
      color: white;
      padding: 12px 16px;
      font-size: 1.25rem;
      font-weight: 500;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .build-tag {
      margin-left: auto;
      font-size: 0.65rem;
      opacity: 0.7;
      font-weight: normal;
    }

    .back-btn {
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0 4px;
      line-height: 1;
    }

    main {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      gap: 16px;
    }

    .capture-btn {
      background: #1a73e8;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 16px 32px;
      font-size: 1.1rem;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .capture-btn:active {
      background: #1557b0;
    }

    .info {
      color: #666;
      text-align: center;
      line-height: 1.6;
    }

    camera-capture,
    image-processor {
      flex: 1;
      width: 100%;
    }

    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: #333;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 0.9rem;
      z-index: 100;
      animation: fade-in-out 2.5s ease-in-out forwards;
    }

    @keyframes fade-in-out {
      0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
      15% { opacity: 1; transform: translateX(-50%) translateY(0); }
      75% { opacity: 1; transform: translateX(-50%) translateY(0); }
      100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    }
  `;Li([Ae()],ur.prototype,"_view",2);Li([Ae()],ur.prototype,"_toast",2);Li([Ae()],ur.prototype,"_captureId",2);ur=Li([qa("app-shell")],ur);
