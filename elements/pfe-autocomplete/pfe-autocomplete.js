import PFElement from "../pfelement/pfelement.js";

/*
 * Copyright 2018 Red Hat, Inc.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
*/

const KEYCODE = {
  ENTER: 13,
  DOWN: 40,
  UP: 38,
  ESC: 27
};

// use this variable to debounce api call when user types very fast
let throttle = false;

class PfeAutocomplete extends PFElement {
  get html() {
    return `<style>:host {
  display: block;
  position: relative; }

.input-box-wrapper {
  position: relative;
  display: flex; }

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0; }

#input-box-wrapper ::slotted(input) {
  width: 100%;
  flex: 1;
  box-shadow: inset 0 0px 0px rgba(0, 0, 0, 0.075) !important;
  padding-left: 10px;
  padding-right: 30px;
  border-radius: 0;
  background-color: #fff;
  border: 1px solid var(--pfe-theme--color--surface--border, #dfdfdf);
  font-size: 16px;
  
  height: 40px;
  transition: border-color ease-in-out 0.15s,box-shadow ease-in-out 0.15s;
  opacity: 1;
  outline: 0; }

#input-box-wrapper ::slotted(input:disabled),
button:disabled {
  cursor: not-allowed;
  background-color: transparent;
  color: #ccc;
  opacity: 0.5; }

#input-box-wrapper button:focus,
#input-box-wrapper ::slotted(input:focus) {
  border-color: #66afe9;
  outline: 0; }

#input-box-wrapper ::slotted(input),
button {
  -webkit-appearance: none; }

#input-box-wrapper ::slotted([type="search"]::-ms-clear) {
  display: none; }

#input-box-wrapper ::slotted(input[type="search"]::-webkit-search-cancel-button),
#input-box-wrapper ::slotted(input[type="search"]::-webkit-search-decoration) {
  -webkit-appearance: none; }

button {
  color: #cccccc;
  background-color: transparent;
  border: none;
  position: absolute;
  top: 0px;
  bottom: 0px;
  padding: 0px;
  margin: 0px;
  cursor: pointer; }

button.clear-search {
  right: 30px;
  width: 20px;
  margin: 2px 1px;
  background-color: #fff; }

button.clear-search svg {
  width: 12px;
  stroke: #ccc; }

button.clear-search:hover svg,
button.clear-search:focus svg {
  opacity: 1;
  stroke: #06c; }

button[disabled].clear-search:hover svg,
button[disabled].clear-search:focus svg {
  stroke: #ccc; }

button.search-button {
  right: 1px;
  width: 30px; }

button.search-button svg {
  fill: #06c;
  width: 16px; }

button.search-button:hover svg,
button.search-button:focus svg {
  fill: #004080; }

button.clear-search:hover {
  color: #ccc; }

button.search-button:disabled svg {
  fill: #ccc; }

.loading {
  position: absolute;
  width: 30px;
  right: 52px;
  top: 0px;
  bottom: 0px; }

.loading svg {
  width: 26px;
  padding-top: 7px; }</style>
  <div id="input-box-wrapper">
    <slot></slot>

    <span class="loading" aria-hidden="true" hidden>
        <svg viewBox="0 0 40 40" enable-background="new 0 0 40 40">
          <path opacity="0.2" fill="#000" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
          s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
          c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/>
          <path fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
          C22.32,8.481,24.301,9.057,26.013,10.047z">
          <animateTransform attributeType="xml"
            attributeName="transform"
            type="rotate"
            from="0 20 20"
            to="360 20 20"
            dur="0.5s"
            repeatCount="indefinite"/>
          </path>
        </svg>
    </span>

    <button class="clear-search" type="button" aria-label="clear search query" hidden>
      <svg viewBox="0 0 40 40" enable-background="new 0 0 40 40">
        <line x1="5" y1="5" x2="35" y2="35" stroke-width="10" stroke-linecap="round" stroke-miterlimit="10"></line>
        <line x1="35" y1="5" x2="5" y2="35" stroke-width="10" stroke-linecap="round" stroke-miterlimit="10"></line>
      </svg>
    </button>

    <button class="search-button" type="button" aria-label="Search" disabled>
      <svg viewBox="0 0 512 512">
        <path d="M256.233,5.756c-71.07,15.793-141.44,87.863-155.834,159.233c-11.495,57.076,0.3,111.153,27.688,154.335L6.339,441.172
      c-8.596,8.596-8.596,22.391,0,30.987l33.286,33.286c8.596,8.596,22.391,8.596,30.987,0L192.26,383.796
      c43.282,27.688,97.559,39.683,154.734,28.188c79.167-15.893,142.04-77.067,159.632-155.934
      C540.212,104.314,407.968-27.93,256.233,5.756z M435.857,208.37c0,72.869-59.075,131.944-131.944,131.944
      S171.969,281.239,171.969,208.37S231.043,76.426,303.913,76.426S435.857,135.501,435.857,208.37z"/>
      </svg>
    </button>
</div>
<pfe-search-droplist id="dropdown"></pfe-search-droplist>`;
  }

  static get tag() {
    return "pfe-autocomplete";
  }

  get templateUrl() {
    return "pfe-autocomplete.html";
  }

  get styleUrl() {
    return "pfe-autocomplete.scss";
  }

  constructor() {
    super(PfeAutocomplete);
  }

  connectedCallback() {
    super.connectedCallback();

    this.loading = false;
    this.debounce = this.debounce || 300;

    // input box
    let slotNodes = this.shadowRoot.querySelector("slot").assignedNodes();
    let slotElems = slotNodes.filter(n => n.nodeType === Node.ELEMENT_NODE);
    this._input = slotElems[0];
    this._input.addEventListener("input", this._inputChanged.bind(this));
    this._input.addEventListener("blur", this._closeDroplist.bind(this));
    this._input.setAttribute("role", "combobox");
    this._input.setAttribute("aria-label", "Search");
    this._input.setAttribute("aria-autocomplete", "both");
    this._input.setAttribute("aria-haspopup", "true");
    this._input.setAttribute("type", "search");
    this._input.setAttribute("autocomplete", "off");
    this._input.setAttribute("autocorrect", "off");
    this._input.setAttribute("autocapitalize", "off");
    this._input.setAttribute("spellcheck", "false");

    // clear button
    this._clearBtn = this.shadowRoot.querySelector(".clear-search");
    this._clearBtn.addEventListener("click", this._clear.bind(this));

    // search button
    this._searchBtn = this.shadowRoot.querySelector(".search-button");
    this._searchBtn.addEventListener("click", this._search.bind(this));

    this._dropdown = this.shadowRoot.querySelector("#dropdown");
    this._dropdown.data = [];

    this.activeIndex = null;

    this.addEventListener("keyup", this._inputKeyUp.bind(this));

    // these two events, fire search
    this.addEventListener("pfe-search-event", this._closeDroplist.bind(this));
    this.addEventListener(
      "pfe-option-selected",
      this._optionSelected.bind(this)
    );
  }

  disconnectedCallback() {
    this.removeEventListener("keyup", this._inputKeyUp);
    this.removeEventListener("pfe-search-event", this._closeDroplist);
    this.removeEventListener("pfe-option-selected", this._optionSelected);
    this._input.removeEventListener("input", this._inputChanged);
    this._input.removeEventListener("blur", this._closeDroplist);
    this._clearBtn.removeEventListener("click", this._clear);
    this._searchBtn.removeEventListener("click", this._search);
  }

  static get observedAttributes() {
    return ["init-value", "loading", "is-disabled"];
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    super.attributeChangedCallback();

    let slotNodes = this.shadowRoot.querySelector("slot").assignedNodes();
    let slotElems = slotNodes.filter(n => n.nodeType === Node.ELEMENT_NODE);
    let _input = slotElems[0];

    let _clearBtn = this.shadowRoot.querySelector(".clear-search");
    let _searchBtn = this.shadowRoot.querySelector(".search-button");

    switch (attr) {
      case "loading":
        if (!this.loading || _input.value === "") {
          this.shadowRoot.querySelector(".loading").setAttribute("hidden", "");
        } else {
          this.shadowRoot.querySelector(".loading").removeAttribute("hidden");
        }
        break;

      case "init-value":
        if (this["init-value"] !== newVal) {
          // set inputbox and buttons in the inner component
          _input.value = newVal;
          if (newVal !== "" && !this.isDisabled) {
            _searchBtn.removeAttribute("disabled");
            _clearBtn.removeAttribute("hidden");
          } else {
            _searchBtn.setAttribute("disabled", "");
            _clearBtn.setAttribute("hidden", "");
          }
        }
        break;

      case "is-disabled":
        if (this.isDisabled) {
          _clearBtn.setAttribute("disabled", "");
          _searchBtn.setAttribute("disabled", "");
          _input.setAttribute("disabled", "");
        } else {
          _clearBtn.removeAttribute("disabled");
          _searchBtn.removeAttribute("disabled");
          _input.removeAttribute("disabled");
        }
        break;
    }
  }

  get selectedValue() {
    return this.getAttribute("selected-value");
  }

  set selectedValue(val) {
    this.setAttribute("selected-value", val);
  }

  set isDisabled(value) {
    if (value) {
      this.setAttribute("is-disabled", "");
    } else {
      this.removeAttribute("is-disabled");
    }
  }

  get isDisabled() {
    return this.hasAttribute("is-disabled");
  }

  set loading(value) {
    const loading = Boolean(value);
    if (loading) {
      this.setAttribute("loading", "");
    } else {
      this.removeAttribute("loading");
    }
  }

  get loading() {
    return this.hasAttribute("loading");
  }

  get initValue() {
    return this.getAttribute("init-value");
  }

  set initValue(val) {
    this.setAttribute("init-value", val);
  }

  get debounce() {
    return this.getAttribute("debounce");
  }

  set debounce(val) {
    this.setAttribute("debounce", val);
  }

  _inputChanged() {
    if (this._input.value === "") {
      this._searchBtn.setAttribute("disabled", "");
      this._clearBtn.setAttribute("hidden", "");

      this._reset();
      return;
    } else {
      if (!this._input.hasAttribute("disabled")) {
        this._searchBtn.removeAttribute("disabled");
      }
      this._clearBtn.removeAttribute("hidden");
    }

    if (throttle === false) {
      throttle = true;

      window.setTimeout(() => {
        this._sendAutocompleteRequest(this._input.value);
        throttle = false;
      }, this.debounce);
    }
  }

  _clear() {
    this._input.value = "";
    this._clearBtn.setAttribute("hidden", "");
    this._searchBtn.setAttribute("disabled", "");
    this._input.focus();
  }

  _search() {
    this._doSearch(this._input.value);
  }

  _closeDroplist() {
    this._dropdown.open = null;
    this._dropdown.removeAttribute("active-index");
  }

  _openDroplist() {
    this.activeIndex = null;
    this._dropdown.setAttribute("open", true);
    this._dropdown.setAttribute("active-index", null);
  }

  _optionSelected(e) {
    let selectedValue = e.detail.optionValue;

    // update input box with selected value from options list
    this._input.value = selectedValue;

    // send search request
    this._doSearch(selectedValue);
  }

  _doSearch(searchQuery) {
    this.dispatchEvent(
      new CustomEvent("pfe-search-event", {
        detail: { searchValue: searchQuery },
        bubbles: true,
        composed: true
      })
    );
    this._reset();
    this.selectedValue = searchQuery;
  }

  _sendAutocompleteRequest(input) {
    if (!this.autocompleteRequest) return;

    this.autocompleteRequest(
      { query: input },
      this._autocompleteCallback.bind(this)
    );
  }

  _autocompleteCallback(response) {
    this._dropdown.data = response;
    this._dropdown.reflow = true;
    response.length !== 0 ? this._openDroplist() : this._closeDroplist();
  }

  _reset() {
    debugger;
    this._dropdown.activeIndex = null;
    this._input.setAttribute("aria-activedescendant", "");
    this._dropdown.data = [];
    this._closeDroplist();
  }

  _activeOption(activeIndex) {
    if (activeIndex === null || activeIndex === "null") return;
    return this._dropdown.shadowRoot.querySelector(
      "li:nth-child(" + (parseInt(activeIndex, 10) + 1) + ")"
    ).innerHTML;
  }

  _inputKeyUp(e) {
    let key = e.keyCode;

    if (
      this._dropdown.data.length === 0 &&
      key !== KEYCODE.DOWN &&
      key !== KEYCODE.UP &&
      key !== KEYCODE.ENTER &&
      key !== KEYCODE.ESC
    )
      return;

    let activeIndex = this._dropdown.activeIndex;
    let optionsLength = this._dropdown.data.length;

    if (key == KEYCODE.ESC) {
      this._closeDroplist();
    } else if (key === KEYCODE.UP) {
      if (!this._dropdown.open) {
        return;
      }

      activeIndex =
        activeIndex === null || activeIndex === "null"
          ? optionsLength
          : parseInt(activeIndex, 10);

      activeIndex -= 1;

      if (activeIndex < 0) {
        activeIndex = optionsLength - 1;
      }

      this._input.value = this._activeOption(activeIndex);
    } else if (key === KEYCODE.DOWN) {
      if (!this._dropdown.open) {
        return;
      }

      activeIndex =
        activeIndex === null || activeIndex === "null"
          ? -1
          : parseInt(activeIndex, 10);
      activeIndex += 1;

      if (activeIndex > optionsLength - 1) {
        activeIndex = 0;
      }

      this._input.value = this._activeOption(activeIndex);
    } else if (key === KEYCODE.ENTER) {
      let selectedValue = this._input.value;
      this._doSearch(selectedValue);
      return;
    }

    if (activeIndex !== null && activeIndex !== "null") {
      this._input.setAttribute(
        "aria-activedescendant",
        "option-" + activeIndex
      );
    } else {
      this._input.setAttribute("aria-activedescendant", "");
    }

    this.activeIndex = activeIndex;
    this._dropdown.activeIndex = activeIndex;
  }
}

/*
* - Attributes ------------------------------------
* open               | Set when the combo box dropdown is open
* active-index       | Set selected option
* reflow             | Re-renders the dropdown

* - Events ----------------------------------------
* pfe-option-selected | Fires when an option is selected.
  event.detailes.selectedValue contains the selected value.
*/
class PfeSearchDroplist extends PFElement {
  get html() {
    return `<style>:host {
  position: relative;
  display: none;
  font-family: var(--pfe-theme--font-family);
  font-size: var(--pfe-theme--font-size);
  line-height: var(--pfe-theme--line-height); }

:host([open]) {
  display: block; }

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0; }

.droplist {
  position: absolute;
  top: 100%;
  left: 0px;
  right: 0px;
  max-height: 250px;
  z-index: 9999;
  overflow-y: scroll;
  overflow-x: hidden;
  border: 1px solid #ccc;
  background-color: #fff; }

ul {
  font-family: var(--pfe-theme--font-family);
  font-size: var(--pfe-theme--font-size);
  line-height: var(--pfe-theme--line-height);
  border-top: none;
  margin: 0px;
  padding: 0px;
  list-style: none;
  cursor: pointer; }
  ul li {
    display: list-item;
    cursor: pointer;
    padding: 10px;
    margin: 0px;
     }
    ul li.active {
      background-color: var(--pfe-theme--color--surface--lighter, #ececec); }</style>
  <div class="suggestions-aria-help sr-only" aria-hidden="false" role="status"></div>
<div class="droplist">
  <ul role="listbox" tabindex="-1">
  </ul>
</div>`;
  }

  static get tag() {
    return "pfe-search-droplist";
  }

  get templateUrl() {
    return "pfe-search-droplist.html";
  }

  get styleUrl() {
    return "pfe-search-droplist.scss";
  }

  constructor() {
    super(PfeSearchDroplist);
  }

  connectedCallback() {
    super.connectedCallback();

    this._ariaAnnounce = this.shadowRoot.querySelector(
      ".suggestions-aria-help"
    );

    this.activeIndex = null;
    this._ul = this.shadowRoot.querySelector("ul");
    this._ul.addEventListener("mousedown", this._optionSelected.bind(this));
  }

  disconnectedCallback() {
    this._ul.removeEventListener("mousedown", this._optionSelected);
  }

  _optionSelected(e) {
    if (e.target.tagName === "LI") {
      this.dispatchEvent(
        new CustomEvent("pfe-option-selected", {
          detail: { optionValue: e.target.innerText },
          bubbles: true,
          composed: true
        })
      );
    }
  }

  _renderOptions() {
    this.reflow = "";

    let options = this.data;

    this._ariaAnnounce.innerHTML = `There are ${
      options.length
    } suggestions. Use the up and down arrows to browse.`;
    this._ariaAnnounce.setAttribute("aria-live", "polite");

    this._ul.innerHTML = `${options
      .map((item, index) => {
        return `<li id="option-${index}" role="option" tabindex="-1" value="${item}">${item}</li>`;
      })
      .join("")}`;
  }

  static get observedAttributes() {
    return ["open", "reflow", "active-index"];
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    super.attributeChangedCallback();

    if (this[name] !== newVal) {
      this[name] = newVal;
    }

    if (attr === "active-index" && oldVal !== newVal) {
      this._activeIndexChanged();
    }

    if (attr === "reflow") {
      this._renderOptions();
    }
  }

  _activeIndexChanged() {
    if (
      !this.data ||
      this.data.length === 0 ||
      this.activeIndex === null ||
      this.activeIndex === "null"
    )
      return;

    // remove active class
    if (this._ul.querySelector(".active")) {
      this._ul.querySelector(".active").classList.remove("active");
    }

    // add active class to selected option
    let activeOption = this._ul.querySelector(
      "li:nth-child(" + (parseInt(this.activeIndex, 10) + 1) + ")"
    );

    activeOption.classList.add("active");

    // scroll to selected element when selected item with keyboard is out of view
    let ulWrapper = this.shadowRoot.querySelector(".droplist");
    let activeOptionHeight = activeOption.offsetHeight;
    activeOptionHeight += parseInt(
      window.getComputedStyle(activeOption).getPropertyValue("margin-bottom"),
      10
    );
    ulWrapper.scrollTop =
      activeOption.offsetTop - ulWrapper.offsetHeight + activeOptionHeight;
  }

  get open() {
    return this.hasAttribute("open");
  }

  set open(val) {
    val = Boolean(val);

    if (val) {
      this.setAttribute("open", "");
    } else {
      this.removeAttribute("open");
    }
  }

  get activeIndex() {
    return this.getAttribute("active-index");
  }

  set activeIndex(val) {
    this.setAttribute("active-index", val);
  }

  get reflow() {
    return this.hasAttribute("reflow");
  }

  set reflow(val) {
    val = Boolean(val);

    if (val) {
      this.setAttribute("reflow", "");
    } else {
      this.removeAttribute("reflow");
    }
  }
}

PFElement.create(PfeSearchDroplist);
PFElement.create(PfeAutocomplete);

export default PfeAutocomplete;
//# sourceMappingURL=pfe-autocomplete.js.map
