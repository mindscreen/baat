import { BaseHTMLElement } from '../BaseHTMLElement'
import { css } from '../../util/taggedString'
import { baatSymbol } from '../../core/BAAT'
import { BAATEvent, HighlightElement } from '../../types'
import { theme } from '../../theme'
import { getBoundingBox } from '../../util/dom'

const outline = `0px solid ${ theme.palette.primaryLight}77`;
const background = `${ theme.palette.primaryLight }77`;
const outlineBlink = `50px solid ${ theme.palette.primary}dd;`
const styles = css`
    :host {
        z-index: 999999;
        inset: 0;
        pointer-events: none;
        position: absolute;
    }
  
    .highlight {
        margin: -2px;
        padding: 2px;
        background-color: transparent;
        border-radius: 2px;
        pointer-events: none;
        transition: all 0.5s ease-out;
        outline: ${ outline };
    }
  
    .blink {
        background-color: ${ background };
        outline: ${ outlineBlink };
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

        window[baatSymbol].addEventListener(BAATEvent.HighlightElement, ((e: CustomEvent<HighlightElement>) => {
            const bb = getBoundingBox(e.detail.element);

            const highlight = document.createElement('div');
            highlight.classList.add('highlight');
            highlight.style.position = 'absolute';
            highlight.style.left = `${bb.x}px`;
            highlight.style.top = `${bb.y}px`;
            highlight.style.width = `${bb.w}px`;
            highlight.style.height = `${bb.h}px`;

            this.shadowRoot?.appendChild(highlight);
            window.setTimeout(() => {
                highlight.classList.add('blink');
            }, 0);
            window.setTimeout(() => {
                highlight.classList.remove('blink');
            }, 750);
            window.setTimeout(() => {
                highlight.remove();
            }, 1500);
        }) as EventListener)
    }
}

export const register = () => {
    if (!customElements.get(Overlay.tagName))
        customElements.define(Overlay.tagName, Overlay)
}