import * as axe from 'axe-core'
import { NodeResultLink } from '../NodeResultLink/NodeResultLink'
import { visuallyHiddenStyles } from '../../util/style'
import { BaseHTMLElement } from '../BaseHTMLElement'
import { css } from '../../util/taggedString'
import { theme } from '../../theme'
import { baact, createRef } from '../../../baact/baact'
import { Accordion } from '../Accordion/Accordion'
import { NodeResult, Result } from '../../types'
import { hideHighlight, showHighlight } from '../../core/highlight'
import { Icon } from '..'
import {baatSymbol} from "../../core/BAAT";
import {settingNames} from "../../config";

const impactColors = {
    'critical': 'impactCritical',
    'serious': 'impactSerious',
    'moderate': 'impactModerate',
    'minor': 'impactMinor',
}
const getImpactClass = (impact: axe.ImpactValue | undefined): string => {
    return (impact && impact in impactColors ? impactColors[impact] : 'impactNone')
}

const styles = css`
    #container {
    }
    #heading {
        width: 100%;
    }
    #title {
        margin: 0;
        font-size: ${theme.semanticSizing.font.large};
        margin-right: 0.25em;
    }
    .shrink {
        width: calc(100% - 3em)
    }
    ol {
        list-style-type: none;
        padding-left: 0;
        margin-bottom: 0;
    }
    li {
        margin: 0.3em 0;
    }
    .visuallyHidden { ${visuallyHiddenStyles} }
    #indicator {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        top: 0;
        right: 0;
        height: ${theme.sizing.relative.larger};
        width: ${theme.sizing.relative.larger};
        font-size: ${theme.sizing.relative.huge};
        box-sizing: border-box;
    }
    .impactCritical {
        background-color: ${theme.palette.critical};
    }
    .impactSerious {
        background-color: ${theme.palette.serious};
    }
    .impactModerate {
        background-color: ${theme.palette.moderate};
    }
    .impactMinor {
        background-color: ${theme.palette.minor};
    }
    .impactNone {
        background-color: gray;
    }

    a {
      color: ${ theme.semanticColors.font.link };
    }
    a:hover {
        color: ${theme.semanticColors.font.linkHover};
    }
    a:disabled {
        color: ${theme.semanticColors.font.dark};
    }

    button {
        display: flex;
        align-items: center;
        font-family: sans-serif;
        gap: ${theme.sizing.relative.tiny};
        background-color: ${theme.palette.white};
        border: none;
        padding: ${theme.sizing.relative.tiny} ${theme.sizing.relative.smaller};
        cursor: pointer;
        font-size: 1rem;
    }
  
    button:hover {
        background-color: ${theme.palette.gray};
    }
`;

interface IViolationAccessor {
    result?: Result
}

function createNodeLink(index: number, result: NodeResult, alternativeText?: string): HTMLLIElement {
    return <li>
        <NodeResultLink number={index} result={result} alternativeText={alternativeText}/>
    </li> as unknown as HTMLLIElement;
}

export class Violation extends BaseHTMLElement<IViolationAccessor> implements IViolationAccessor {
    public static tagName: string = 'baat-violation'
    result?: Result
    folded: boolean = true
    styles = styles
    private indicatorRef = createRef<HTMLDivElement>()
    private titleRef = createRef<HTMLHeadingElement>()
    private subtitleRef = createRef<HTMLSpanElement>()
    private impactRef = createRef<HTMLLabelElement>()
    private descriptionRef = createRef<HTMLDivElement>()
    private nodeListRef = createRef<HTMLOListElement>()
    private linkRef = createRef<HTMLDivElement>()

    attributeChangedCallback<T extends keyof IViolationAccessor>(name: T, oldValue: IViolationAccessor[T], newValue: IViolationAccessor[T]) {
        switch (name) {
            case 'result':
                this.updateResult()
                break
        }
    }

    static get observedAttributes(): (keyof IViolationAccessor)[] { return [ 'result' ] }

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    updateResult() {
        if (!this.shadowRoot || !this.isConnected) return

        if (!this.result) {
            this.indicatorRef.value.className = 'impactNone';
            this.titleRef.value.innerText = '';
            this.impactRef.value.innerText = '';
            this.descriptionRef.value.innerText = '';
            this.linkRef.value.innerHTML = '';
            this.nodeListRef.value.innerHTML = '';
        } else {
            this.indicatorRef.value.className = getImpactClass(this.result.impact);
            this.titleRef.value.innerText = this.result.help;
            this.subtitleRef.value.innerText = this.result.id;
            this.impactRef.value.innerText = String(this.result.impact);
            this.descriptionRef.value.innerText = this.result.description;

            if (this.result.helpUrl && this.result.helpUrl !== "") {
                this.linkRef.value.innerHTML = `<a href="${this.result.helpUrl}" target="_blank" rel="noreferrer">Learn more about ${this.result.id} at Deque University</a>`
            }

            const nodeList = this.nodeListRef.value
            nodeList.innerHTML = '';
            !!this.indicatorRef.value.lastElementChild ?? this.indicatorRef.value.removeChild(this.indicatorRef.value.lastElementChild as Node)

            switch (this.result.impact) {
                case 'minor':
                    this.indicatorRef.value.appendChild(<Icon width="24" height="24"><path d="m3 3h42l-21 42z"/></Icon>)
                    break;
                case 'moderate':
                    this.indicatorRef.value.appendChild(<Icon width="24" height="24"><path d="m3 45h42l-21-42z" /><path d="m24 20v13" /><path d="m24 40v0"/></Icon>)
                    break;
                case 'serious':
                    this.indicatorRef.value.appendChild(<Icon width="24" height="24"><path d="m3 45h42l-21-42z"/><path d="m17.5 27 13 13"/><path d="m30.5 27-13 13"/></Icon>)
                    break;
                case 'critical':
                    this.indicatorRef.value.appendChild(<Icon width="24" height="24"><path d="m3 16 13-13h16l13 13v16l-13 13h-16l-13-13z"/></Icon>)
                    break;
            }

            this.result.nodes.forEach((node, index) => {
                const li = createNodeLink(index + 1, node)
                nodeList.appendChild(li)
            })
        }
    }

    initialize() {
        const handleFoldChange = (folded: boolean) => {
            this.result?.nodes.forEach(folded ? hideHighlight : showHighlight)
        }

        const handleHide = () => {
            if (!this.result) return;

            window[baatSymbol].setSetting(settingNames.hiddenResults, [ ...window[baatSymbol].getSetting<string[]>(settingNames.hiddenResults), this.result.id ])
        }

        this.shadowRoot?.appendChild(
            <Accordion id='container' onChange={handleFoldChange}>
                <div id='heading' slot={Accordion.slots.heading}>
                    <div class='shrink'>
                        <h2 id='title' ref={this.titleRef}></h2>
                        <div>
                            <span id='subtitle' ref={this.subtitleRef}></span> - <label id='impact' ref={this.impactRef}></label>
                        </div>
                    </div>
                    <div id="indicator" ref={this.indicatorRef}>
                    </div>
                </div>
                <button onClick={handleHide}>
                    <Icon width="16" height="16"><path d="M34.30 34.81C33.50 35.32 32.72 35.73 32 36L32 36C26.62 37.99 21.33 38.01 16 36C10.67 33.99 2 24 2 24C2 24 8.01 17.07 13.11 13.59" fill="none" stroke="currentColor" stroke-width="3" /><path d="M15.10 12.58C15.60 12.15 15.69 12.11 16 12C21.39 10.14 26.62 10.01 32 12C37.38 13.99 46 24 46 24C46 24 41.50 29.23 36.97 32.88C36.67 33.12 36.60 33.18 36.13 33.61" fill="none" stroke="currentColor" stroke-width="3" /><path d="M29.40 29.90A8 8 0 0 1 24 32A8 8 0 0 1 16 24A8 8 0 0 1 18.10 18.60" fill="none" stroke="currentColor" stroke-width="3" /><path d="M9 10 38 39" fill="none" stroke="currentColor" stroke-width="3" /></Icon>
                    Hide
                </button>
                <div id='description' ref={this.descriptionRef}></div>
                <div id='link' ref={this.linkRef}></div>
                <ol id='nodeList' ref={this.nodeListRef}></ol>
            </Accordion>
        );

        this.updateResult()
    }
}

export const register = () => {
    if (!customElements.get(Violation.tagName)) { // @ts-ignore
        customElements.define(Violation.tagName, Violation)
    }
}