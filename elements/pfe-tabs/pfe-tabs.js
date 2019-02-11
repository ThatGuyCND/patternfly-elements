import e from"../pfelement/pfelement.js";Array.prototype.find||Object.defineProperty(Array.prototype,"find",{value:function(e){if(null==this)throw new TypeError('"this" is null or not defined');var t=Object(this),r=t.length>>>0;if("function"!=typeof e)throw new TypeError("predicate must be a function");for(var a=arguments[1],n=0;n<r;){var i=t[n];if(e.call(a,i,n,t))return i;n++}},configurable:!0,writable:!0}),Array.prototype.findIndex||Object.defineProperty(Array.prototype,"findIndex",{value:function(e){if(null==this)throw new TypeError('"this" is null or not defined');var t=Object(this),r=t.length>>>0;if("function"!=typeof e)throw new TypeError("predicate must be a function");for(var a=arguments[1],n=0;n<r;){var i=t[n];if(e.call(a,i,n,t))return n;n++}return-1},configurable:!0,writable:!0});const t={DOWN:40,LEFT:37,RIGHT:39,UP:38,HOME:36,END:35};function r(){return Math.random().toString(36).substr(2,9)}class a extends e{get html(){return'<style>:host {\n  display: block; }\n\n.tabs {\n  --pfe-tabs--border-color:          var(--pfe-theme--color--surface--border, #dfdfdf);\n  display: flex;\n  border: 0;\n  border-bottom: var(--pfe-theme--ui--border-width, 1px) var(--pfe-theme--ui--border-style, solid) var(--pfe-tabs--border-color); }\n\n.panels {\n  padding: 0;\n  padding-top: var(--pfe-theme--container-padding, 1rem); }\n\n:host([vertical]) {\n  display: flex; }\n\n:host([vertical]) .tabs {\n  flex-direction: column;\n  width: 25%;\n  border: 0;\n  border-right: var(--pfe-theme--ui--border-width, 1px) var(--pfe-theme--ui--border-style, solid) var(--pfe-tabs--border-color); }\n\n:host([vertical]) .tabs ::slotted(pfe-tab) {\n  margin: 0 -1px 0 0;\n  border: var(--pfe-theme--ui--border-width, 1px) var(--pfe-theme--ui--border-style, solid) transparent;\n  border-right: 0;\n  position: relative; }\n\n:host([vertical]) .tabs ::slotted(pfe-tab[aria-selected="true"]) {\n  border-color: var(--pfe-tabs--border-color);\n  border-right: 0; }\n\n:host([vertical]) .panels {\n  padding: 0;\n  padding-right: var(--pfe-theme--container-padding, 1rem);\n  padding-left: calc(var(--pfe-theme--container-padding, 1rem) * 2); }\n\n:host([pfe-variant="primary"]) .tabs {\n  border-bottom: transparent;\n  border-right: transparent; }\n\n:host([vertical][pfe-variant="primary"]) {\n  align-items: flex-start; }\n\n:host([pfe-variant="secondary"]) .tabs {\n  border-bottom: transparent; }\n\n:host([vertical][pfe-variant="secondary"]) .tabs {\n  justify-content: flex-start; }</style>\n<div class="tabs">\n  <slot name="tab"></slot>\n</div>\n<div class="panels">\n  <slot name="panel"></slot>\n</div>'}static get tag(){return"pfe-tabs"}get styleUrl(){return"pfe-tabs.scss"}get templateUrl(){return"pfe-tabs.html"}static get observedAttributes(){return["vertical","selected-index","pfe-variant"]}get selectedIndex(){return this.getAttribute("selected-index")}set selectedIndex(e){this.setAttribute("selected-index",e)}constructor(){super(a),this._linked=!1,this._onSlotChange=this._onSlotChange.bind(this),this._tabSlot=this.shadowRoot.querySelector('slot[name="tab"]'),this._panelSlot=this.shadowRoot.querySelector('slot[name="panel"]'),this._tabSlot.addEventListener("slotchange",this._onSlotChange),this._panelSlot.addEventListener("slotchange",this._onSlotChange)}connectedCallback(){super.connectedCallback(),this.addEventListener("keydown",this._onKeyDown),this.addEventListener("click",this._onClick),this.hasAttribute("role")||this.setAttribute("role","tablist"),this.hasAttribute("selected-index")||(this.selectedIndex=0),Promise.all([customElements.whenDefined(n.tag),customElements.whenDefined(i.tag)]).then(()=>this._linkPanels())}disconnectedCallback(){this.removeEventListener("keydown",this._onKeyDown),this.removeEventListener("click",this._onClick)}attributeChangedCallback(e,t,r){switch(e){case"pfe-variant":"primary"===this.getAttribute("pfe-variant")?this._allTabs().forEach(e=>e.setAttribute("pfe-variant","primary")):"secondary"===this.getAttribute("pfe-variant")&&this._allTabs().forEach(e=>e.setAttribute("pfe-variant","secondary"));break;case"vertical":this.hasAttribute("vertical")?(this.setAttribute("aria-orientation","vertical"),this._allPanels().forEach(e=>e.setAttribute("vertical","")),this._allTabs().forEach(e=>e.setAttribute("vertical",""))):(this.removeAttribute("aria-orientation"),this._allPanels().forEach(e=>e.removeAttribute("vertical")),this._allTabs().forEach(e=>e.removeAttribute("vertical")));break;case"selected-index":Promise.all([customElements.whenDefined(n.tag),customElements.whenDefined(i.tag)]).then(()=>{this._linkPanels(),this.selectIndex(r)})}}select(e){e&&("pfe-tab"===e.tagName.toLowerCase()?this.selectedIndex=this._getTabIndex(e):console.warn(`${a.tag}: the tab must be a pfe-tab element`))}selectIndex(e){if(void 0===e)return;const t=parseInt(e,10),r=this._allTabs()[t];r?this._selectTab(r):console.warn(`${a.tag}: tab ${e} does not exist`)}_onSlotChange(){this._linked=!1,this._linkPanels()}_linkPanels(){if(this._linked)return;this._allTabs().forEach(e=>{const t=e.nextElementSibling;"pfe-tab-panel"===t.tagName.toLowerCase()?(e.setAttribute("aria-controls",t.id),t.setAttribute("aria-labelledby",e.id)):console.warn(`${a.tag}: tab #${e.id} is not a sibling of a <pfe-tab-panel>`)}),this._linked=!0}_allPanels(){return[...this.querySelectorAll("pfe-tab-panel")]}_allTabs(){return[...this.querySelectorAll("pfe-tab")]}_panelForTab(e){const t=e.getAttribute("aria-controls");return this.querySelector(`#${t}`)}_prevTab(){const e=this._allTabs();let t=e.findIndex(e=>e.selected)-1;return e[(t+e.length)%e.length]}_firstTab(){return this._allTabs()[0]}_lastTab(){const e=this._allTabs();return e[e.length-1]}_nextTab(){const e=this._allTabs();let t=e.findIndex(e=>e.selected)+1;return e[t%e.length]}_getTabIndex(e){return this._allTabs().findIndex(t=>t.id===e.id)}reset(){const e=this._allTabs(),t=this._allPanels();e.forEach(e=>e.selected=!1),t.forEach(e=>e.hidden=!0)}_selectTab(e){this.reset();const t=this._panelForTab(e);let r=!1;if(!t)throw new Error(`No panel with id ${t.id}`);this.selected&&this.selected!==e&&(r=!0,this.dispatchEvent(new CustomEvent(`${a.tag}:hidden-tab`,{bubbles:!0,detail:{tab:this.selected}}))),e.selected=!0,t.hidden=!1,this._setFocus&&(e.focus(),this._setFocus=!1);this._allTabs().findIndex(e=>e.selected);this.selected=e,r&&this.dispatchEvent(new CustomEvent(`${a.tag}:shown-tab`,{bubbles:!0,detail:{tab:this.selected}}))}_onKeyDown(e){if("tab"!==e.target.getAttribute("role"))return;if(e.altKey)return;let r;switch(e.keyCode){case t.LEFT:case t.UP:r=this._prevTab();break;case t.RIGHT:case t.DOWN:r=this._nextTab();break;case t.HOME:r=this._firstTab();break;case t.END:r=this._lastTab();break;default:return}e.preventDefault(),this.selectedIndex=this._getTabIndex(r),this._setFocus=!0}_onClick(e){"tab"===e.target.getAttribute("role")&&(this.selectedIndex=this._getTabIndex(e.target))}}class n extends e{get html(){return'<style>:host {\n  --pfe-tabs--main:         transparent;\n  --pfe-tabs--aux:          var(--pfe-theme--color--surface--lightest--text, #333);\n  --pfe-tabs--link:         var(--pfe-theme--color--surface--lightest--link, #06c);\n  --pfe-tabs--focus:        var(--pfe-theme--color--surface--lightest--link--focus, #003366);\n  position: relative;\n  display: block;\n  margin: 0 0 -1px;\n  padding-top: var(--pfe-theme--container-padding, 1rem);\n  padding-right: calc(var(--pfe-theme--container-padding, 1rem) * 3.375);\n  padding-bottom: calc(var(--pfe-theme--container-padding, 1rem) * 1.5);\n  padding-left: var(--pfe-theme--container-padding, 1rem);\n  border: var(--pfe-theme--ui--border-width, 1px) var(--pfe-theme--ui--border-style, solid) transparent;\n  border-bottom: 0;\n  background-color: var(--pfe-tabs--main);\n  color: var(--pfe-tabs--aux);\n  text-transform: var(--pfe-tabs__tab--TextTransform, none);\n  font-weight: var(--pfe-theme--font-weight--normal, 500);\n  white-space: nowrap;\n  cursor: pointer; }\n\n:host([aria-selected="true"]) {\n  --pfe-tabs--main:         var(--pfe-theme--color--surface--lightest, #fff);\n  border-color: var(--pfe-theme--color--surface--border, #dfdfdf);\n  border-bottom: 0; }\n\n.indicator {\n  position: absolute;\n  bottom: 12px;\n  left: auto;\n  display: var(--pfe-tabs__indicator--Display, block);\n  height: var(--pfe-tabs__indicator--Height, 4px);\n  width: var(--pfe-tabs__indicator--Width, 22px);\n  background-color: var(--pfe-theme--color--surface--border--darkest, #464646); }\n\n:host(:hover) .indicator {\n  background-color: var(--pfe-tabs--link); }\n\n:host([aria-selected="true"]) .indicator,\n:host([aria-selected="true"]:hover) .indicator {\n  background-color: var(--pfe-tabs--link); }\n\n:host(:focus),\n:host(:focus-visible) {\n  outline: var(--pfe-theme--ui--focus-outline-width, 1px) var(--pfe-theme--ui--focus-outline-style, solid) var(--pfe-tabs--focus); }\n\n:host([pfe-variant="primary"]) {\n  text-align: center;\n  padding: 0 calc(var(--pfe-theme--container-padding, 1rem) / 3) var(--pfe-theme--container-padding, 1rem);\n  margin-right: 2%; }\n  :host([pfe-variant="primary"]) .indicator {\n    width: 100%;\n    left: 0; }\n\n:host([pfe-variant="primary"][aria-selected="true"]) {\n  border: transparent; }\n\n:host([pfe-variant="primary"][aria-selected="false"]) {\n  border: transparent; }\n  :host([pfe-variant="primary"][aria-selected="false"]) .indicator {\n    display: none; }\n\n:host([pfe-variant="secondary"]) {\n  text-align: center;\n  padding: calc(var(--pfe-theme--container-padding, 1rem) * .666) calc(var(--pfe-theme--container-padding, 1rem) * 2.75);\n  border: 1px solid #252527;\n  margin-right: 2%; }\n  :host([pfe-variant="secondary"]) .indicator {\n    display: none; }\n\n:host([pfe-variant="secondary"][aria-selected="true"]) {\n  background-color: #252527;\n  color: #ffffff; }\n  :host([pfe-variant="secondary"][aria-selected="true"]) .indicator {\n    display: block;\n    bottom: -33%;\n    width: 0;\n    height: 0;\n    left: 50%;\n    transform: translateX(-50%);\n    border-left: var(--pfe-theme--container-spacer, 1rem) solid transparent;\n    border-right: var(--pfe-theme--container-spacer, 1rem) solid transparent;\n    border-top: var(--pfe-theme--container-spacer, 1rem) solid #252527;\n    background-color: transparent; }\n\n:host([pfe-variant="secondary"][aria-selected="false"]) {\n  color: #0477a4; }\n\n:host([pfe-variant="secondary"]:hover) {\n  background-color: #252527;\n  color: #ffffff; }\n\n:host([vertical][pfe-variant="primary"]) {\n  text-align: right;\n  padding-right: var(--pfe-theme--container-padding, 1rem); }\n  :host([vertical][pfe-variant="primary"]) .indicator {\n    left: auto;\n    right: 0;\n    top: 0;\n    display: var(--pfe-tabs__indicator--Display, block);\n    height: var(--pfe-tabs__indicator--Height, 22px);\n    width: var(--pfe-tabs__indicator--Width, 4px); }\n\n:host([vertical][pfe-variant="primary"][aria-selected="true"]) {\n  border: transparent !important; }\n\n:host([vertical][pfe-variant="secondary"][aria-selected="true"]) .indicator {\n  left: 99%;\n  top: 50%;\n  transform: translateY(-50%);\n  border-top: var(--pfe-theme--container-spacer, 1rem) solid transparent;\n  border-left: var(--pfe-theme--container-spacer, 1rem) solid #252527;\n  border-bottom: var(--pfe-theme--container-spacer, 1rem) solid transparent;\n  background-color: transparent; }\n\n::slotted(h2) {\n  font-size: var(--pfe-theme--font-size);\n  font-weight: var(--pfe-theme--font-weight--normal, 500);\n  margin: 0; }</style>\n<slot></slot>\n<div class="indicator"></div>'}static get tag(){return"pfe-tab"}get styleUrl(){return"pfe-tab.scss"}get templateUrl(){return"pfe-tab.html"}static get observedAttributes(){return["aria-selected"]}constructor(){super(n),this.id||(this.id=`${n.tag}-${r()}`)}connectedCallback(){super.connectedCallback(),this.setAttribute("role","tab"),this.setAttribute("aria-selected","false"),this.setAttribute("tabindex",-1),this.parentNode.hasAttribute("vertical")&&this.setAttribute("vertical","")}attributeChangedCallback(){const e=Boolean(this.selected);this.setAttribute("tabindex",e?0:-1)}set selected(e){e=Boolean(e),this.setAttribute("aria-selected",e)}get selected(){return"true"===this.getAttribute("aria-selected")}}class i extends e{get html(){return"<style>:host {\n  display: block; }\n\n:host([hidden]) {\n  display: none; }</style>\n<slot></slot>"}static get tag(){return"pfe-tab-panel"}get styleUrl(){return"pfe-tab-panel.scss"}get templateUrl(){return"pfe-tab-panel.html"}constructor(){super(i),this.id||(this.id=`${i.tag}-${r()}`)}connectedCallback(){super.connectedCallback(),this.setAttribute("role","tabpanel"),this.setAttribute("tabindex",0)}}e.create(n),e.create(i),e.create(a);export default a;
//# sourceMappingURL=pfe-tabs.js.map
