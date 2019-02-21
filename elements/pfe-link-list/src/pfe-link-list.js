import PFElement from "../pfelement/pfelement.js";

class PfeLinkList extends PFElement {
  static get tag() {
    return "pfe-link-list";
  }

  get templateUrl() {
    return "pfe-link-list.html";
  }

  get styleUrl() {
    return "pfe-link-list.scss";
  }

  // static get observedAttributes() {
  //   return [];
  // }

  constructor() {
    super(PfeLinkList);
  }

  // connectedCallback() {
  //   super.connectedCallback();
  // }

  // disconnectedCallback() {}

  // attributeChangedCallback(attr, oldValue, newValue) {}
}

PFElement.create(PfeLinkList);

export default PfeLinkList;
