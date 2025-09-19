import { BaseHTMLElement } from '../BaseHTMLElement'
import { css } from '../../util/taggedString'
import { baact, createRef } from '../../../baact/baact'
import { theme } from '../../theme'
import { NodeResult } from 'axe-core'
import { isHidden, ownText, removeAllChildren } from '../../util/dom'
import { baatSymbol } from '../../core/BAAT'
import { BAATEvent, HighlightElement, SettingsChanged } from '../../types'
import { Icon } from '..'
import {settingNames} from "../../config";

const styles = css`
    :host {
        width: 100%;
    }
    
    button {
        background-color: transparent;
        text-align: left;
        font-size: 1rem;
        color: ${theme.semanticColors.font.link};
        cursor: pointer;
        overflow: hidden;
        white-space: nowrap;
        display: inline-block;
        text-overflow: ellipsis;
        padding: .2rem;
        border: 1px solid;
        border-radius: 2px;
        max-width: 100%;
    }
    button:focus {
        outline: 1px solid;
        outline-offset: 1px;
    }
    button > baat-icon {
        vertical-align: middle;
    }
  
    button:disabled {
        cursor: default;
        color: ${theme.semanticColors.font.dark};
        padding-left: calc(6px + 12px + ${theme.sizing.relative.smaller});
    }
    
    button:hover {
        background-color: ${theme.palette.grayLight};
    }

    button:disabled {
        color: ${theme.semanticColors.font.dark};
    }
  
    button > * {
        margin-right: ${theme.sizing.relative.smaller};
    }
  
    #info {
        padding-left: ${theme.sizing.relative.huge};
        font-size: ${theme.semanticSizing.font.small};
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
    private infoRef = createRef<HTMLDivElement>()
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
        let name = ""
        this.element = this.result?.element ?? document.querySelector(this?.result?.target?.join(', ') ?? '') as HTMLElement | null
        let hasLink = this.element && !isHidden(this.element)
        const devMode = window[baatSymbol].getSetting(settingNames.developer)

        removeAllChildren(this.buttonRef.value)

        if (devMode) {
            name = this.result?.target.join(', ') ?? this.element?.tagName.toLowerCase() ?? ''
        } else {
            name = this.element ? ownText(this.element).trim() : ""

            if (name === "") name = this.element?.tagName.toLowerCase() ?? this.result?.target.join(', ') ?? ""
        }

        if (hasLink || devMode) {
            this.buttonRef.value.appendChild(<Icon width="16" height="16"><g fill="none" stroke="#000" stroke-linecap="round" stroke-width="4.65"><circle cx="24" cy="24" r="16.3"/><path d="m24 2.5v11"/><path d="m24 35v10.5"/><path d="m45.5 24h-10.5"/><path d="m13.5 24h-11"/></g></Icon>)
            this.buttonRef.value.removeAttribute('disabled')
        } else {
            this.buttonRef.value.setAttribute('disabled', 'true')
        }
        this.buttonRef.value.appendChild(document.createTextNode(name))

        this.infoRef.value.innerText = window[baatSymbol].getSetting<boolean>(settingNames.showAdditionalInformation)
            ? this.result?.failureSummary ?? ''
            : ''
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
            if (event.detail.name === settingNames.developer || event.detail.name === settingNames.showAdditionalInformation) this.update()
        }) as EventListener)

        this.shadowRoot?.appendChild(<div>
            <button id='nodeLink' type='button' onClick={handleClick} ref={this.buttonRef}></button>
            <div id='info' ref={this.infoRef}></div>
        </div>)

        this.update()
    }
}

export const register = () => {
    if (!customElements.get(NodeResultLink.tagName))
        customElements.define(NodeResultLink.tagName, NodeResultLink);
}