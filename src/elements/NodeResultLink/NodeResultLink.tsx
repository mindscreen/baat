import { BaseHTMLElement } from '../BaseHTMLElement'
import { css } from '../../util/taggedString'
import { baact, createRef } from '../../../baact/baact'
import { theme } from '../../theme'
import { NodeResult } from 'axe-core'
import { isHidden, ownText, removeAllChildren } from '../../util/dom'
import { baatSymbol } from '../../core/BAAT'
import { BAATEvent, SettingsChanged } from '../../types'
import { blinkHighlight } from '../../core/highlight'
import { Icon } from '..'

const styles = css`
    :host, button {
        width: 100%;
    }
    
    button {
        background-color: transparent;
        border: none;
        text-align: left;
        font-size: ${theme.semanticSizing.font.small};
        color: ${theme.semanticColors.font.link};
        cursor: pointer;
        overflow: hidden;
        white-space: nowrap;
        display: block;
        text-overflow: ellipsis;
        padding: 1px 6px;
    }
  
    button:disabled {
        cursor: default;
        color: ${theme.semanticColors.font.dark};
        padding-left: calc(6px + 12px + ${theme.sizing.relative.smaller});
    }
    
    button:hover {
        color: ${theme.semanticColors.font.linkHover};
    }

    button:disabled {
        color: ${theme.semanticColors.font.dark};
    }
  
    button > * {
        margin-right: ${theme.sizing.relative.smaller};
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
        console.log(this.result?.element);
        let hasLink = !isHidden(this.result?.element)

        removeAllChildren(this.buttonRef.value)

        if (window[baatSymbol].getSetting('developer')) {
            name = this.result?.target.join(', ') ?? this.result?.element?.tagName.toLowerCase() ?? ''
        } else {
            name = this.result?.element ? ownText(this.result?.element).trim() : ""

            if (name === "") name = this.result?.element?.tagName.toLowerCase() ?? this.result?.target.join(', ') ?? ""
        }

        if (hasLink) {
            this.buttonRef.value.appendChild(<Icon width="12" height="12"><path d="m28.8 19.3c3.58 3.58 3.57 9.34 0 12.9l-7.87 7.85c-3.58 3.58-9.34 3.58-12.9 0-3.59-3.6-3.58-9.36 0-12.9" /><path d="m19.2 28.8c-3.59-3.6-3.58-9.36 0-12.9l7.86-7.85c3.59-3.58 9.34-3.57 12.9 0.02 3.57 3.59 3.57 9.34 0 12.9"/></Icon>)
            this.buttonRef.value.removeAttribute('disabled')
        } else {
            this.buttonRef.value.setAttribute('disabled', 'true')
        }
        this.buttonRef.value.appendChild(document.createTextNode(name))
    }

    initialize() {
        const handleClick = (e: Event) => {
            e.stopPropagation()
            if (!this.result) return

            blinkHighlight(this.result)
            if (window[baatSymbol].getSetting('developer'))
                console.log(this.result.element)

            this.result.element?.scrollIntoView({ block: 'start', behavior: 'smooth' })
        }

        window[baatSymbol].addEventListener(BAATEvent.ChangeSettings, ((event: CustomEvent<SettingsChanged>) => {
            if (event.detail.name === 'developer') this.update()
        }) as EventListener)

        this.shadowRoot?.appendChild(<button id='nodeLink' type='button' onClick={handleClick} ref={this.buttonRef}></button>)

        this.update()
    }
}

export const register = () => {
    if (!customElements.get(NodeResultLink.tagName))
        customElements.define(NodeResultLink.tagName, NodeResultLink);
}