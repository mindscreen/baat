import { baact } from '../../../baact/baact'
import { BaseHTMLElement } from '../BaseHTMLElement'

interface ISwitchViewAccessor {
    name: string
}

export class SwitchView extends BaseHTMLElement<ISwitchViewAccessor> implements ISwitchViewAccessor {
    public static tagName: string = 'baat-switch-view'
    name: string = ""

    attributeChangedCallback<T extends keyof ISwitchViewAccessor>(name: T, oldValue: ISwitchViewAccessor[T], newValue: ISwitchViewAccessor[T]) {
        this[name] = newValue
    }

    static get observedAttributes(): (keyof ISwitchViewAccessor)[] { return [ 'name' ] }

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    initialize() {
        this.shadowRoot?.appendChild(<slot></slot>)
    }
}

export const register = () => {
    if (!customElements.get(SwitchView.tagName))
        customElements.define(SwitchView.tagName, SwitchView);
}