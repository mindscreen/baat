import { Violation } from '../Violation/Violation'
import { visuallyHiddenStyles } from '../../util/style'
import { BaseHTMLElement } from '../BaseHTMLElement';
import { css } from '../../util/taggedString'
import { baatSymbol } from '../../core/BAAT'
import { AxeRunCompleted, BAATEvent, Result, StatusChange } from '../../types'
import { baact, createRef } from '../../../baact/baact'
import { theme } from '../../theme'
import { and, notNullish } from '../../util/logic'
import { tally, uniquePredicate } from '../../util/array'
import { zip } from '../../util/object';
import { removeAllChildren } from '../../util/dom'
import { Icon } from '../Icon/Icon'
import { download } from '../../util/file'
import { FilterSettings } from '../FilterSettings/FilterSettings'
import * as axe from 'axe-core'
import { Accordion } from '../Accordion/Accordion'
import { Checkbox } from '../Checkbox/Checkbox'

const styles = css`
    #container {
        display: flex;
        flex-direction: column;
        height: 100%;
        margin-bottom: 1em;
    }
    .visuallyHidden { ${visuallyHiddenStyles} }
    .placeholder {
        margin: ${theme.sizing.relative.normal}
    }
    table {
        width: calc(100% - 2 * ${theme.sizing.relative.tiny});
        margin: ${theme.sizing.relative.tiny} ${theme.sizing.relative.smaller};
        box-sizing: border-box;
        table-layout: fixed;
    }
    th {
        text-align: start;
        font-weight: normal;
    }
    thead th {
        font-weight: bold;
    }
    td:first-child, th:first-child {
        width: 1em;
    }
    caption {
        text-align: left;
        font-size: ${theme.semanticSizing.font.large};
        font-weight: bold;
        margin: ${theme.sizing.relative.smaller} ${theme.sizing.relative.tiny};
    }
    
    #status {
        padding: ${theme.sizing.relative.tiny};
        background-color: ${theme.palette.light};
    }
    button {
        display: flex;
        gap: ${theme.sizing.relative.smaller};
        background-color: ${theme.palette.primary};
        color: ${theme.palette.light};
        font-size: 1em;
        border: none;
        padding: 0.25em 1em;
        transition: background-color 0.2s ease-in-out;
        margin: ${theme.sizing.relative.smaller};
        cursor: pointer;
        align-items: center;
    }

    button:hover {
        background-color: ${theme.palette.primaryDark};
    }
    
    button:active {
        background-color: ${theme.palette.primaryLight};
    }

    #status:empty {
        padding: 0;
    }
`;

interface IResultsAccessor {
    results: Result[]
}

export class Results extends BaseHTMLElement<IResultsAccessor> implements IResultsAccessor {
    public static tagName: string = 'baat-results'
    results: Result[] = []
    folded: boolean = true
    styles = styles
    private resultsContainerRef = createRef<HTMLDivElement>()
    private statisticsContainerRef = createRef<HTMLDivElement>()
    private statusContainerRef = createRef<HTMLDivElement>()
    private filterPlaceholderRef = createRef<HTMLDivElement>()

    attributeChangedCallback<T extends keyof IResultsAccessor>(name: T, oldValue: IResultsAccessor[T], newValue: IResultsAccessor[T]) {
        switch (name) {
            case 'results':
                this.updateResults()
                break
        }
    }

    static get observedAttributes(): (keyof IResultsAccessor)[] { return [ 'results' ] }

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    update() {
        if (!this.shadowRoot || !this.isConnected) return
    }

    initialize() {
        this.shadowRoot?.appendChild(
            <div id='container'>
                <div id='status' ref={this.statusContainerRef}></div>
                <div id='results' ref={this.resultsContainerRef}></div>
                <div id='statistics' ref={this.statisticsContainerRef}></div>
            </div>
        )
        this.setAttribute('results', window[baatSymbol].lastResults)
        window[baatSymbol].addEventListener(BAATEvent.ChangeCore, () => {
            this.setAttribute('results', window[baatSymbol].lastResults)
            this.update()
        })
        window[baatSymbol].addEventListener(BAATEvent.RunCompleted, ((e: CustomEvent<AxeRunCompleted>) => {
            this.setAttribute('results', e.detail.violations)
        }) as EventListener)
        window[baatSymbol].addEventListener(BAATEvent.ChangeSettings, () => this.handleChangeSettings())

        window[baatSymbol].addEventListener(BAATEvent.StatusChange, ((e: CustomEvent<StatusChange>) => {
            this.statusContainerRef.value.textContent = e.detail.message
        }) as EventListener)
        this.updateResults()
    }

    updateResults(): void {
        if (!this.shadowRoot) return

        removeAllChildren(this.resultsContainerRef.value)
        removeAllChildren(this.statisticsContainerRef.value)

        this.results
            .forEach((result) => {
                this.resultsContainerRef.value.appendChild(
                    <Violation result={result} data-tags={result.tags.join(' ')} data-impact={String(result.impact)}/>
                )
            })

        if (this.results.length === 0 && window[baatSymbol].hasRun) {
            this.resultsContainerRef.value.appendChild(
                <div class='placeholder'>
                    <h2>No Violations found</h2>
                    The automatic tool did not find any violations. Since not all problems can be found automatically please consider testing manually.
                </div>
            )
        }

        if (this.results.length === 0 && !window[baatSymbol].hasRun) {
            this.resultsContainerRef.value.appendChild(
                <div class='placeholder'>
                    <h2>Not yet run</h2>
                    Run BAAT in order to see violation results.
                </div>
            )
        }

        this.resultsContainerRef.value.appendChild(
            <div class='placeholder visuallyHidden' ref={this.filterPlaceholderRef}>
                <h2>All violations are hidden</h2>
                There are results but all results are hidden via filter Settings.
            </div>
        )

        if (this.results.length !== 0 && window[baatSymbol].hasRun) {
            const elements = this.results.flatMap(result => result.nodes)
                .flatMap(node => node.element)
                .filter(and(uniquePredicate, (value) => value !== undefined))
            const impactCounts = tally(this.results.map(result => result.impact).filter(notNullish))
            const elementCounts = tally(this.results.flatMap(result => result.nodes.map(() => result.impact)).filter(notNullish))
            const counts = zip(impactCounts, elementCounts)
            const byImpact = (a: [string, any], b: [string, any]) => {
                // @ts-ignore
                const impactOrder = axe.constants.impact
                return impactOrder.indexOf(a[0]) - impactOrder.indexOf(b[0])
            }

            this.statisticsContainerRef.value.appendChild(
                <table>
                    <caption>Run Statistics</caption>
                    <thead>
                        <tr>
                            <th> </th>
                            <th>Impact</th>
                            <th>Violations</th>
                            <th>Elements</th>
                        </tr>
                    </thead>
                    <tbody>
                        { ...Object.entries(counts).sort(byImpact).map(([impact, [violations, elements]]) => {
                            const checked = !window[baatSymbol].getSetting<string[]>('hiddenImpacts').includes(impact)
                            function handleChange(this: HTMLInputElement) {
                                if (this.checked) {
                                    window[baatSymbol].setSetting('hiddenImpacts', window[baatSymbol].getSetting<string[]>('hiddenImpacts').filter(hidden => hidden !== impact))
                                } else {
                                    window[baatSymbol].setSetting('hiddenImpacts', [ ...window[baatSymbol].getSetting<string[]>('hiddenImpacts'), impact ])
                                }
                            }
                            return <tr>
                                <td>
                                    <Checkbox checked={ checked } id={ `impact-${ impact }` } onChange={ handleChange } label={ `show ${ impact }` } labelHidden/>
                                </td>
                                <th>{ impact.charAt(0).toUpperCase() + impact.slice(1) }</th>
                                <td>{ (violations ?? 0).toString() }</td>
                                <td>{ (elements ?? 0).toString() }</td>
                            </tr>
                        })}
                        <tr>
                            <td></td>
                            <th>Total</th>
                            <td>{ this.results.length.toString() }</td>
                            <td>{ elements.length.toString() }</td>
                        </tr>
                    </tbody>
                </table>
            )
            let cache: Array<any> = [];

            this.statisticsContainerRef.value.appendChild(
                <button type='button' onClick={() => download('baat-report.json', JSON.stringify(window[baatSymbol].fullReport, (key, value) => {
                    if (typeof value === 'object' && value !== null) {
                        if (value.hasOwnProperty('element') && value.element instanceof HTMLElement) {
                            const result = { ...value }
                            delete result['element']
                            return result
                        }
                        cache.push(value)
                    }
                    return value;
                }))}>
                    <Icon width="16" height="16"><path d="m6 2h33l7 7v33c0 2.26-1.74 4-4 4h-36c-2.26 0-4-1.74-4-4v-36c0-2.26 1.74-3.99 4-4z"/><rect x="9" y="25" width="30" height="19"/><rect x="24" y="6" width="6" height="10"/><rect x="12" y="2" width="24" height="18"/></Icon>
                    Download Report
                </button>
            );
        }

        this.handleChangeSettings()
    }

    handleChangeSettings(): void {
        const hiddenTags = window[baatSymbol].getSetting<string[]>('hiddenTags')
        const hiddenImpacts = window[baatSymbol].getSetting<string[]>('hiddenImpacts')

        this.shadowRoot?.querySelectorAll(Violation.tagName)
            .forEach((violation) => {
                violation.classList.toggle('visuallyHidden', (
                    !violation
                        .getAttribute('data-tags')
                        ?.split(' ')
                        .map(tag => !hiddenTags.includes(tag))
                        .reduce((acc, curr) => acc || curr, false) ?? false
                ) || (
                    hiddenImpacts.includes(violation.getAttribute('data-impact') ?? "")
                ))
            })

        const numFiltered = this.shadowRoot?.querySelectorAll(`${Violation.tagName}.visuallyHidden`).length;

        this.filterPlaceholderRef?.value?.classList.toggle('visuallyHidden', !(numFiltered !== 0 && numFiltered === window[baatSymbol].lastResults.length))
    }
}

export const register = () => {
    if (!customElements.get(Results.tagName)) { // @ts-ignore
        customElements.define(Results.tagName, Results)
    }
}