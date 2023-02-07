import { baact, createRef } from '../../../baact/baact'
import { BaseHTMLElement } from '../BaseHTMLElement'
import { css } from '../../util/taggedString'

interface IIconAccessor {
    width: number
    height: number
}

const styles = css`
    :host {
        display: inline-block;
        line-height: 0;
    }
    svg {
        fill: none;
        stroke: currentColor;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 3;
    }
`;

export class Icon extends BaseHTMLElement<IIconAccessor> implements IIconAccessor {
    public static tagName: string = 'baat-icon'
    public width: number = 48
    public height: number = 48
    private svgRef = createRef<SVGSVGElement>()
    styles = styles

    attributeChangedCallback<T extends keyof IIconAccessor>(name: T, oldValue: IIconAccessor[T], newValue: IIconAccessor[T]) {
        this[name] = newValue;
        this.svgRef.value?.setAttribute(name, String(newValue));
    }

    static get observedAttributes(): (keyof IIconAccessor)[] { return [ 'width', 'height' ] }

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    initialize() {
        this.shadowRoot?.appendChild(
            <svg
                width={this.width}
                height={this.height}
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink" ref={this.svgRef}
            ></svg>
        );

        this.svgRef.value?.append(...Array.from(this.children))
    }
}

export const register = () => {
    if (!customElements.get(Icon.tagName))
        customElements.define(Icon.tagName, Icon);
}