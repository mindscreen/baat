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
    #indicator {
        position: absolute;
        top: 0;
        right: 0;
        height: ${theme.sizing.relative.larger};
        width: ${theme.sizing.relative.larger};
        box-sizing: border-box;
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
        height: ${theme.sizing.relative.larger};
        width: ${theme.sizing.relative.larger};
        font-size: ${theme.sizing.relative.huge};
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
    private descriptionRef = createRef<HTMLSpanElement>()
    private nodeListRef = createRef<HTMLOListElement>()

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
            this.nodeListRef.value.innerHTML = '';
        } else {
            this.indicatorRef.value.className = getImpactClass(this.result.impact);
            this.titleRef.value.innerText = this.result.help;
            this.subtitleRef.value.innerText = this.result.id;
            this.impactRef.value.innerText = String(this.result.impact);
            this.descriptionRef.value.innerText = this.result.description;
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

        this.shadowRoot?.appendChild(
            <Accordion id='container' onChange={handleFoldChange}>
                <div id='heading' slot='heading'>
                    <div class='shrink'>
                        <h2 id='title' ref={this.titleRef}></h2>
                        <div>
                            <span id='subtitle' ref={this.subtitleRef}></span> - <label id='impact' ref={this.impactRef}></label>
                        </div>
                    </div>
                    <div id="indicator" ref={this.indicatorRef}>
                    </div>
                </div>
                <span id='description' ref={this.descriptionRef}></span>
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