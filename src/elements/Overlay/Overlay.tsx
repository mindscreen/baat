import { BaseHTMLElement } from '../BaseHTMLElement'
import { css } from '../../util/taggedString'
import { baact } from '../../../baact/baact'

const styles = css`
    :host {
        z-index: 999999;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
        position: fixed;
    }
`;

interface IRunnerOverlayAccessor {
}

export class Overlay extends BaseHTMLElement<IRunnerOverlayAccessor> implements IRunnerOverlayAccessor {
    public static tagName: string = 'baat-overlay'
    styles = styles

    attributeChangedCallback<T extends keyof IRunnerOverlayAccessor>(name: T, oldValue: IRunnerOverlayAccessor[T], newValue: IRunnerOverlayAccessor[T]) {

    }

    static get observedAttributes(): (keyof IRunnerOverlayAccessor)[] { return [] }

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }
    initialize() {
        while (this.childNodes.length > 0) {
            this.shadowRoot?.appendChild(this.childNodes[0]);
        }
    }
}

export const register = () => {
    if (!customElements.get(Overlay.tagName))
        customElements.define(Overlay.tagName, Overlay)
}