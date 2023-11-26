import { css } from '../../util/taggedString'
import { baact, createRef } from '../../../baact/baact'
import { theme } from '../../theme'
import { NodeResult } from 'axe-core'
import { isHidden, ownText } from '../../util/dom'
import { baatSymbol } from '../../core/BAAT'
import { BAATEvent, HighlightElement, SettingsChanged } from '../../types'
import { Icon } from '../Icon/Icon'
import { settingNames } from "../../config"
import { BaactComponent } from "../../../baact/BaactComponent"
import { makeRegisterFunction } from "../../../baact/util/register"

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
  
    #info {
        padding-left: ${theme.sizing.relative.huge};
        font-size: ${theme.semanticSizing.font.small};
    }
`

interface INodeLinkAccessor {
    result: NodeResult | undefined
    number: number
}

export class NodeResultLink extends BaactComponent<INodeLinkAccessor> implements INodeLinkAccessor {
    result: NodeResult | undefined
    number: number = 0
    styles = styles
    static tagName: string = 'baat-node-link'
    private buttonRef = createRef<HTMLButtonElement>()
    private infoRef = createRef<HTMLDivElement>()

    static get observedAttributes(): (keyof INodeLinkAccessor)[] { return [ 'result', 'number' ] }

    initialize() {
        super.initialize()

        window[baatSymbol].addEventListener(BAATEvent.ChangeSettings, ((event: CustomEvent<SettingsChanged>) => {
            if (event.detail.name === settingNames.developer || event.detail.name === settingNames.showAdditionalInformation) this.shouldRerender()
        }) as EventListener)
    }

    render() {
        const element = this.result?.element ?? document.querySelector(this?.result?.target?.join(', ') ?? '') as HTMLElement | null
        const handleClick = (e: Event) => {
            e.stopPropagation()
            if (!this.result) return

            if (element)
                window[baatSymbol].dispatchEvent(new CustomEvent<HighlightElement>(BAATEvent.HighlightElement,{ detail: { element }}))
            if (window[baatSymbol].getSetting(settingNames.developer))
                console.log(element)

            element?.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' })
        }

        let name = ""
        let hasLink = !isHidden(element ?? undefined)

        const devMode = window[baatSymbol].getSetting(settingNames.developer)

        if (devMode) {
            name = this.result?.target.join(', ') ?? element?.tagName.toLowerCase() ?? ''
        } else {
            name = element ? ownText(element).trim() : ""

            if (name === "") name = element?.tagName.toLowerCase() ?? this.result?.target.join(', ') ?? ""
        }

        return <div>
            <button
                id='nodeLink'
                type='button'
                onClick={handleClick}
                ref={this.buttonRef}
                disabled={!hasLink && !devMode}
            >
                {(hasLink || devMode) && <Icon width="12" height="12">
                    <path d="m28.8 19.3c3.58 3.58 3.57 9.34 0 12.9l-7.87 7.85c-3.58 3.58-9.34 3.58-12.9 0-3.59-3.6-3.58-9.36 0-12.9" />
                    <path d="m19.2 28.8c-3.59-3.6-3.58-9.36 0-12.9l7.86-7.85c3.59-3.58 9.34-3.57 12.9 0.02 3.57 3.59 3.57 9.34 0 12.9"/>
                </Icon>}
                {name}
            </button>
            <div id='info' ref={this.infoRef}>{
                window[baatSymbol].getSetting<boolean>(settingNames.showAdditionalInformation)
                    ? this.result?.failureSummary ?? ''
                    : ''
            }</div>
        </div>
    }
}

export const register = makeRegisterFunction(NodeResultLink.tagName, NodeResultLink)