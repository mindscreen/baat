import { baact } from '../../baact/baact'

export abstract class BaseHTMLElement<T extends Record<string, any>> extends HTMLElement {
    initialized: boolean = false
    styles: string = ""
    setAttribute<S extends keyof T>(qualifiedName: S, value: T[S]): void;
    setAttribute(qualifiedName: string, value: string): void;
    setAttribute(qualifiedName: string, value: any): void {
        // @ts-ignore
        if (this.constructor.observedAttributes?.includes(qualifiedName)) {
            // @ts-ignore
            const oldValue: any = this[qualifiedName]
            // @ts-ignore
            this[qualifiedName] = value
            // @ts-ignore
            this.attributeChangedCallback?.(qualifiedName, oldValue, value)
        } else {
            super.setAttribute(qualifiedName, value)
        }
    }

    abstract initialize(): void

    connectedCallback(): void {
        if (!this.initialized) {
            if (this.styles !== "") this.shadowRoot?.appendChild(<style>{this.styles}</style>)
            this.initialize()
            this.initialized = true
        }
    }
}