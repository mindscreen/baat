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

const styles = css`
    #heading {
        width: 100%;
    }
    #title {
        margin: 0;
        font-size: ${theme.semanticSizing.font.large};
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
    .chip {
        display: inline-block;
        border-radius: 1rem;
        padding: .2rem .5rem;
        outline: 2px solid;
        margin: .1rem 0;
        max-width: 100%;
        font-weight: bold;
        font-size: .75rem;
        white-space: nowrap;
        outline-offset: -1px;
    }
    .critical {
        outline-color: #bc1313;
        background-color: #bc1313;
        color: #fff
    }
    .serious {
        outline-color: #bc1313;
        color: #bc1313
    }
    .moderate {
        outline-color: #D87000;
        color: #B35C00
    }
    .minor {
        outline-color: #E7CD03;
        color: #776A03;
    }
    h3 {
        font-size: 1rem;
        margin-top: 1.25rem;
        margin-bottom: .25rem;
    }
    a {
      color: ${ theme.palette.primaryDark };
    }
    a:hover {
        color: ${theme.palette.primary};
    }
    a:disabled {
        color: #333;
    }

    button {
        display: flex;
        align-items: center;
        font-family: sans-serif;
        gap: ${theme.sizing.relative.tiny};
        background-color: ${theme.palette.white};
        border: 1px solid;
        border-radius: 2px;
        padding: ${theme.sizing.relative.tiny} ${theme.sizing.relative.smaller};
        cursor: pointer;
        font-size: 1rem;
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
    #hideButton {
        margin-top: 1.25rem;
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
    private titleRef = createRef<HTMLHeadingElement>()
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
            this.titleRef.value.innerText = '';
            this.impactRef.value.innerText = '';
            this.descriptionRef.value.innerText = '';
            this.nodeListRef.value.innerHTML = '';
            this.linkRef.value.innerHTML = '';
        } else {
            this.titleRef.value.innerText = this.result.help;
            this.impactRef.value.innerText = String(this.result.impact);
            this.impactRef.value.className = "chip "+this.result.impact;
            this.descriptionRef.value.innerText = this.result.description;

            const nodeList = this.nodeListRef.value
            nodeList.innerHTML = '';

            this.result.nodes.forEach((node, index) => {
                const li = createNodeLink(index + 1, node)
                nodeList.appendChild(li)
            })

            if (this.result.helpUrl && this.result.helpUrl !== "") {
                this.linkRef.value.innerHTML = `<h3>Help for this error</h3><a href="${this.result.helpUrl}" target="_blank" rel="noreferrer">${this.result.id} on Deque University</a>`
            }
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
                    <div>
                        <h2 id='title' ref={this.titleRef}></h2>
                        <div>
                            <label id='impact' ref={this.impactRef}></label>
                        </div>
                    </div>
                </div>
                <div id='description' ref={this.descriptionRef}></div>
                <h3>Errors on page</h3>
                <ol id='nodeList' ref={this.nodeListRef}></ol>
                <div id='link' ref={this.linkRef}></div>
                <button id='hideButton' onClick={handleHide}>
                    <Icon width="16" height="16"><g fill="currentColor" stroke="none"><path d="m46 2.74c0.88 0.882 0.73 2.14 0.3 2.66l-8.27 8.15c3.25 2.04 6.19 4.53 8.79 7.35 1.5 1.68 1.5 4.22 0 5.91-5.23 5.76-13.9 11.8-22.6 11.8h-0.61c-3.03-0.1-6.03-0.7-8.79-1.93l-8.45 8.49c-0.689 0.67-1.76 0.79-2.57 0.24-1.12-0.67-1.19-2.05-0.701-2.51l39.8-39.8c0.68-0.777 2.18-1.28 3.07-0.398zm-14 17.2c-0.3 0-0.34 0-0.46 0.16l-11.4 11.4c-0.12 0-0.18 0.3-0.15 0.46 0 0.3 0.12 0.3 0.27 0.36 1.99 0.92 4.26 1.04 6.34 0.4 2.94-0.95 5.21-3.24 6.13-6.18 0.61-2.07 0.49-4.29-0.43-6.25 0-0.15-0.31-0.24-0.37-0.28z"/><path d="m15.1 26.7c0.13-0.13 0.17-0.31 0.12-0.49-0.22-0.77-0.35-1.56-0.35-2.37 0-5.08 4.1-9.18 9.18-9.18 0.8 0 1.6 0.12 2.37 0.35 0.18 0.1 0.36 0 0.49-0.12l3.96-3.95c0-0.12 0.3-0.31 0-0.49 0-0.18 0-0.31-0.34-0.37-2.01-0.691-4.26-1.03-6.49-1.02-8.79-0.119-17.5 6.03-22.8 11.9-1.53 1.67-1.54 4.22 0 5.91 2.11 2.31 4.47 4.38 7.01 6.19h0.665l6.22-6.22z"/></g></Icon>
                    Hide issue
                </button>
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