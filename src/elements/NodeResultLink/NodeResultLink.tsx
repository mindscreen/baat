import { BaseHTMLElement } from '../BaseHTMLElement'
import { css } from '../../util/taggedString'
import { baact, createRef } from '../../../baact/baact'
import { theme } from '../../theme'
import { NodeResult } from 'axe-core'
import { removeAllChildren } from '../../util/dom'
import { baatSymbol } from '../../core/BAAT'
import { BAATEvent, HighlightElement, SettingsChanged } from '../../types'
import { Icon } from '../Icon/Icon'
import { settingNames } from "../../config";
import { getElementFromNodeResult, getNameFromNodeResult } from '../../util/axe';

const padding = `${theme.sizing.relative.tiny} ${theme.sizing.relative.smaller}`;

const styles = css`
    :host {
        width: 100%;
    }

    button {
        display: flex;
        align-items: center;
        font-family: sans-serif;
        gap: ${theme.sizing.relative.tiny};
        background-color: ${theme.palette.white};
        color: ${theme.palette.black};
        border: 1px solid;
        border-radius: 2px;
        padding: ${padding};
        cursor: pointer;
        max-width: 100%;
        overflow: hidden;
        white-space: nowrap;
    }
    button:focus {
        outline: 1px solid;
        outline-offset: 1px;
    }
    button:hover {
        background-color: ${theme.palette.grayLight};
    }
`

interface INodeLinkAccessor {
    result: NodeResult | undefined
    number: number
}

export class NodeResultLink extends BaseHTMLElement<INodeLinkAccessor> implements INodeLinkAccessor {
    result: NodeResult | undefined
    number: number = 0
    styles = styles
    static tagName: string = 'baat-node-link'
    private buttonRef = createRef<HTMLButtonElement>()
    private element: HTMLElement | null = null;

    attributeChangedCallback<T extends keyof INodeLinkAccessor>(name: T, oldValue: INodeLinkAccessor[T], newValue: INodeLinkAccessor[T]) {
        this.update()
    }

    static get observedAttributes(): (keyof INodeLinkAccessor)[] { return [ 'result', 'number' ] }

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    update() {
        if (!this.shadowRoot || !this.isConnected) return
        let name = getNameFromNodeResult(this.result, window[baatSymbol].getSetting(settingNames.developer));
        this.element = getElementFromNodeResult(this.result);

        removeAllChildren(this.buttonRef.value)

        this.buttonRef.value.appendChild(<Icon width="16" height="16"><g fill="none" stroke="#000" stroke-linecap="round" stroke-width="4.65"><circle cx="24" cy="24" r="16.3"/><path d="m24 2.5v11"/><path d="m24 35v10.5"/><path d="m45.5 24h-10.5"/><path d="m13.5 24h-11"/></g></Icon>)

        this.buttonRef.value.appendChild(document.createTextNode(name))
    }

    initialize() {
        const handleClick = (e: Event) => {
            e.stopPropagation()
            if (!this.result) return

            if (this.element)
                window[baatSymbol].dispatchEvent(new CustomEvent<HighlightElement>(BAATEvent.HighlightElement,{ detail: { element: this.element }}))
            if (window[baatSymbol].getSetting(settingNames.developer))
                console.log(this.element)

            this.element?.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' })
        }

        window[baatSymbol].addEventListener(BAATEvent.ChangeSettings, ((event: CustomEvent<SettingsChanged>) => {
            if (event.detail.name === settingNames.developer) this.update()
        }) as EventListener)

        this.shadowRoot?.appendChild(<div>
            <button id='nodeLink' type='button' onClick={handleClick} ref={this.buttonRef}></button>
        </div>)

        this.update()
    }
}

export const register = () => {
    if (!customElements.get(NodeResultLink.tagName))
        customElements.define(NodeResultLink.tagName, NodeResultLink);
}