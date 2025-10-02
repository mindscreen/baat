import { BaseHTMLElement } from '../BaseHTMLElement'
import { Icon } from '../Icon/Icon'
import { theme } from '../../theme'
import { baact, createRef } from '../../../baact/baact'
import { css } from '../../util/taggedString'

const border = `${theme.sizing.absolute.tiny} solid ${theme.palette.gray}`
const padding = `${theme.sizing.relative.smaller} ${theme.sizing.relative.small}`

const styles = css`
    #container {
        position: relative;
    }
    #handle {
        position: relative;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: ${theme.sizing.relative.smaller};
        border: none;
        text-align: left;
        border-bottom: ${border};
        background-color: ${theme.palette.white};
        width: 100%;
        cursor: pointer;
        color: var(--text-color);
        background-color: var(--color, ${theme.palette.white});
    }
    ::slotted([slot='heading']) {
        margin: 0;
        font-size: ${theme.sizing.relative.large};
    }
    #handle baat-icon {
        align-self: baseline;
        color: var(--text-color);
    }
    #handle:focus {
        border-left-color: ${theme.palette.primaryDark};
        outline: none;
    }
    .open #handle {
        border-bottom: none;
    }
    .open #caret {
        transform: rotate(90deg);
    }
    .fixed #handle {
        cursor: revert;
    }
    .nestedRoot #content {
        padding: 0;
    }
    .nestedRoot.open #content {
        border-bottom: none;
    }
    #caret {
        margin: ${theme.sizing.relative.tiny};
        align-self: baseline;
        z-index: 1;
    }
    #content {
        display: none;
        padding: ${padding};
        border-left-color: var(--color, ${theme.palette.white});
        border-left-width: ${theme.sizing.absolute.normal};
        border-left-style: solid;
    }
    .open #content {
        display: revert;
        border-bottom: ${border};
    }
`;


interface IAccordionAccessor {
    folded: boolean
    fixed: boolean
    nestedRoot?: boolean
    color?: string
    textColor?: string
    onChange?: (folded: boolean) => void
}

export class Accordion extends BaseHTMLElement<IAccordionAccessor> implements IAccordionAccessor {
    public static tagName: string = 'baat-accordion'
    public static slots = { heading: 'heading' }
    folded: boolean = true
    fixed: boolean = false
    nestedRoot?: boolean = false
    color?: string
    textColor?: string
    private containerRef = createRef<HTMLDivElement>()
    private contentRef = createRef<HTMLDivElement>()
    onChange?: (folded: boolean) => void

    attributeChangedCallback<T extends keyof IAccordionAccessor>(name: T, oldValue: IAccordionAccessor[T], newValue: IAccordionAccessor[T]) {
        switch (name) {
            case 'folded':
                this.updateFolded()
                this.onChange?.(this.folded)
                break
            case 'fixed':
                this.updateFixed()
                break
            case 'nestedRoot':
                this.updateNestedRoot()
                break
            case 'color':
                this.updateColor()
                break
            case 'textColor':
                this.updateTextColor()
                break
        }
    }

    static get observedAttributes(): (keyof IAccordionAccessor)[] { return [ 'folded', 'fixed', 'nestedRoot', 'textColor' ] }

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    updateFolded() {
        if (!this.shadowRoot) return

        this.containerRef.value?.classList.toggle('open', !this.folded)
        this.contentRef.value?.toggleAttribute('inert', this.folded)
    }

    updateFixed() {
        if (!this.shadowRoot) return

        this.containerRef.value?.classList.toggle('fixed', this.fixed)
    }

    updateNestedRoot() {
        if (!this.shadowRoot) return;

        this.containerRef.value?.classList.toggle('nestedRoot', !!this.nestedRoot)
    }

    updateColor() {
        if (!this.shadowRoot) return;

        this.containerRef.value?.style.setProperty('--color', this.color ?? theme.palette.white)
    }

    updateTextColor() {
        if (!this.shadowRoot) return;

        this.containerRef.value?.style.setProperty('--text-color', this.textColor ?? theme.palette.dark)
    }

    initialize() {
        const handleMouseUp = (e: Event) => {
            if ((window.getSelection()?.toString().length ?? 0) === 0 && !this.fixed) {
                this.setAttribute('folded', !this.folded)
                e.stopPropagation()
            }
        }

        this.shadowRoot?.appendChild(<style>{styles}</style>)
        this.shadowRoot?.appendChild(
            <div id='container' ref={this.containerRef}>
                <button id='handle' onClick={handleMouseUp}>
                    <div id='caret'><Icon width="16" height="16"><path stroke-width="5" stroke="currentColor" d="M12.213 45.213L33.426 24L12.213 2.787"/></Icon></div>
                    <slot name='heading'></slot>
                </button>
                <div id='content' ref={this.contentRef}>
                    <slot></slot>
                </div>
            </div>
        );

        this.updateFixed()
        this.updateFolded()
        this.updateNestedRoot()
        this.updateColor()
        this.updateTextColor()

        this.initialized = true
    }
}

export const register = () => {
    if (!customElements.get(Accordion.tagName)) { // @ts-ignore
        customElements.define(Accordion.tagName, Accordion)
    }
}