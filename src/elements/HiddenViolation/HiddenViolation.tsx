import { NodeResultLink } from '../NodeResultLink/NodeResultLink'
import { BaseHTMLElement } from '../BaseHTMLElement'
import { css } from '../../util/taggedString'
import { theme } from '../../theme'
import { baact, createRef } from '../../../baact/baact'
import { NodeResult, Result } from '../../types'
import { Icon } from '..'
import {baatSymbol} from "../../core/BAAT";
import {settingNames} from "../../config";

const borderBottom = `${theme.sizing.absolute.tiny} solid ${theme.palette.gray}`;

const styles = css`
    .container {
        padding: ${theme.sizing.relative.tiny};
        border-bottom: ${borderBottom};
        display: flex;
        gap: ${theme.sizing.relative.tiny};
        justify-content: space-between;
    }
  
    h2 {
        margin: 0;
        font-size: ${theme.semanticSizing.font.normal};
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-weight: normal;
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
        margin: -${theme.sizing.relative.tiny};
    }
  
    button:hover {
        background-color: ${theme.palette.gray};
    }
`;

interface IHiddenViolationAccessor {
    result?: Result
}

function createNodeLink(index: number, result: NodeResult, alternativeText?: string): HTMLLIElement {
    return <li>
        <NodeResultLink number={index} result={result} alternativeText={alternativeText}/>
    </li> as unknown as HTMLLIElement;
}

export class HiddenViolation extends BaseHTMLElement<IHiddenViolationAccessor> implements IHiddenViolationAccessor {
    public static tagName: string = 'baat-hidden-violation'
    result?: Result
    folded: boolean = true
    styles = styles
    private titleRef = createRef<HTMLHeadingElement>()

    attributeChangedCallback<T extends keyof IHiddenViolationAccessor>(name: T, oldValue: IHiddenViolationAccessor[T], newValue: IHiddenViolationAccessor[T]) {
        switch (name) {
            case 'result':
                this.updateResult()
                break
        }
    }

    static get observedAttributes(): (keyof IHiddenViolationAccessor)[] { return [ 'result' ] }

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    updateResult() {
        if (!this.shadowRoot || !this.isConnected) return

        if (!this.result) {
            this.titleRef.value.innerText = '';
        } else {
            this.titleRef.value.innerText = this.result.help;
        }
    }

    initialize() {
        const handleShow = () => {
            if (!this.result) return;

            window[baatSymbol].setSetting(settingNames.hiddenResults,
                window[baatSymbol].getSetting<string[]>(settingNames.hiddenResults).filter(hidden => hidden !== this.result?.id)
            )
        }

        this.shadowRoot?.appendChild(
            <div class='container'>
                <h2 id='title' ref={this.titleRef}></h2>
                <button onClick={handleShow}>
                    <Icon width="16" height="16"><g fill="none" stroke-width="3" stroke="currentColor"><path d="m2 24c14.4-16.1 30.4-15.9 44 0-13.4 15.7-28 16-44 0z"/><circle cx="24" cy="24" r="7.86"/></g></Icon>
                    Show
                </button>
            </div>
        );

        this.updateResult()
    }
}

export const register = () => {
    if (!customElements.get(HiddenViolation.tagName)) { // @ts-ignore
        customElements.define(HiddenViolation.tagName, HiddenViolation)
    }
}