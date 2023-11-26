import {BaseHTMLElement} from "./BaseHTMLElement";
import {baact, realize, render} from "./baact";

export abstract class BaactComponent<T extends Record<string, any>> extends BaseHTMLElement<T> {
    private _shouldRerender: boolean = false
    private _children: Node[] = [];
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    public abstract render(): JSX.Element;

    private _render() {
        //console.log("Rendering", this.tagName)
        if (!this.shadowRoot) return
        for (const child of this._children) {
            super.appendChild(child)
        }
        while (this.shadowRoot.lastElementChild) this.shadowRoot.removeChild(this.shadowRoot.lastElementChild)
        this.shadowRoot.textContent = ''
        if (this.styles !== "") this.shadowRoot?.appendChild(realize(<style>{this.styles}</style>))
        this.shadowRoot?.append(render(this.render(), this)); // TODO: Fix when everything is transfered to Baact
    }

    static get observedAttributes(): (keyof any)[] { return [] }

    public shouldRerender() {
        this._shouldRerender = true
        requestAnimationFrame(() => {
            if (this._shouldRerender) {
                this._shouldRerender = false
                this._render()
            }
        })
    }

    public setAttribute<S extends keyof T>(qualifiedName: S, value: T[S]) {
        super.setAttribute(qualifiedName, value)
        const ctor = this["constructor"] as typeof BaactComponent
        if (ctor.observedAttributes.includes(qualifiedName)) {
            this.shouldRerender()
        }
    }

    public appendChild<T extends Node>(node: T): T {
        this._children.push(node)
        this.shouldRerender()
        return node
    }

    public removeChild<T extends Node>(node: T): T {
        const index = this._children.indexOf(node)
        if (index !== -1) this._children.splice(index, 1)
        this.shouldRerender()
        return node
    }

    public initialize() {
        this.shouldRerender();
    }
}