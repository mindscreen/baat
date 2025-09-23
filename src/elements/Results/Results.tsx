import { Violation } from '../Violation/Violation'
import { HiddenViolation } from '../HiddenViolation/HiddenViolation'
import { visuallyHiddenStyles } from '../../util/style'
import { BaseHTMLElement } from '../BaseHTMLElement';
import { css } from '../../util/taggedString'
import { baatSymbol } from '../../core/BAAT'
import {AxeRunCompleted, BAATEvent, Result, SettingsChanged, StatusChange} from '../../types'
import { baact, createRef } from '../../../baact/baact'
import { theme } from '../../theme'
import { and, notNullish } from '../../util/logic'
import { tally, uniquePredicate } from '../../util/array'
import { zip } from '../../util/object';
import { removeAllChildren } from '../../util/dom'
import { Icon } from '../Icon/Icon'
import { download } from '../../util/file'
import * as axe from 'axe-core'
import { Checkbox } from '../Checkbox/Checkbox'
import { Accordion } from '../Accordion/Accordion';
import {settingNames} from "../../config";
import {convertViolationToHistoryEntry, historyEntryDiff} from "../../util/history";
import {button} from "../../styles/button";

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
    .accordionheader {
        display: block;
        width: calc( 100% - 3.2rem );
        padding: .5rem 2rem;
        margin: -.5rem -1.3rem -.25rem -2rem !important;
    }
    .unchanged {
        background-color: ${theme.palette.blue};
        color: #fff;
    }
    .new {
        background-color: ${theme.palette.green};
    }
    .hidden {
        background-color: ${theme.palette.grayLight};
    }
    .count {
        position:absolute;
        background-color: #fff;
        padding: .2rem .5rem;
        font-size: 1rem;
        font-weight: normal;
        border-radius: 5px;
        right: 1rem;
    }
    table {
        width: calc(100% - 2rem);
        margin: 1rem 2rem;
        box-sizing: border-box;
        table-layout: fixed;
    }
    th {
        text-align: start;
        font-weight: normal;
    }
    thead th, tfoot th, tfoot td {
        font-weight: 600;
    }
    tfoot th, tfoot td {
        padding-top: .5rem;
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
    
    ${button}
    button {
        margin: 2rem;
    }
    #status:empty {
        padding: 0;
    }
    .listheading {
        margin: 0;
        font-size: ${theme.semanticSizing.font.large};
        margin-left: ${theme.sizing.relative.tiny};
    }
    .list:not(:has(baat-violation:not(.visuallyHidden))) {
        ${visuallyHiddenStyles}
    }
    .hidden-list:not(:has(baat-hidden-violation:not(.visuallyHidden))) {
        ${visuallyHiddenStyles}
    }
`;

interface IResultsAccessor {
    results: Result[]
}

export class Results extends BaseHTMLElement<IResultsAccessor> implements IResultsAccessor {
    public static tagName: string = 'baat-results'
    results: Result[] = []
    styles = styles
    private resultsContainerRef = createRef<HTMLDivElement>()
    private statisticsContainerRef = createRef<HTMLDivElement>()
    private statusContainerRef = createRef<HTMLDivElement>()
    private filterPlaceholderRef = createRef<HTMLDivElement>()
    private hiddenCountRef = createRef<HTMLSpanElement>()
    private hiddenContainerRef = createRef<Accordion>()
    private downloadContainerRef = createRef<HTMLDivElement>()

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
                <div id='statistics' ref={this.statisticsContainerRef}></div>
                <div id='status' ref={this.statusContainerRef}></div>
                <div id='results' ref={this.resultsContainerRef}></div>
                <div id='download' ref={this.downloadContainerRef}></div>
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
        window[baatSymbol].addEventListener(BAATEvent.ChangeSettings, ((e: CustomEvent<SettingsChanged>) =>
            this.handleChangeSettings(e.detail.name)
        ) as EventListener)

        window[baatSymbol].addEventListener(BAATEvent.StatusChange, ((e: CustomEvent<StatusChange>) => {
            this.statusContainerRef.value.textContent = e.detail.message
        }) as EventListener)
        this.updateResults()
    }

    updateResults(): void {
        if (!this.shadowRoot) return

        removeAllChildren(this.resultsContainerRef.value)
        removeAllChildren(this.statisticsContainerRef.value)
        removeAllChildren(this.downloadContainerRef.value)
        const differenceMode = window[baatSymbol].getSetting(settingNames.differenceMode);

        let newList: JSX.Element | Element = this.resultsContainerRef.value;
        let unchangedList: JSX.Element | Element = this.resultsContainerRef.value;
        let newEntries: string[] = [];

        if (differenceMode) {
            const history = window[baatSymbol].getHistory();
            const historyDiff = historyEntryDiff(history[history.length - 2] ?? [], convertViolationToHistoryEntry(this.results));
            newEntries = historyDiff.newEntries;

            newList = <Accordion class="list" folded={false} nestedRoot={true} borderColor={theme.palette.green}>
                <h2 class='listheading accordionheader new' slot={Accordion.slots.heading}>New</h2>
            </Accordion>

            this.resultsContainerRef.value.appendChild(newList);


            unchangedList =
                <Accordion class="list" folded={false} nestedRoot={true} borderColor={theme.palette.blue}textColor={theme.palette.white}>
                    <h2 class='listheading accordionheader unchanged' slot={Accordion.slots.heading}>Unchanged</h2>
                </Accordion>

            this.resultsContainerRef.value.appendChild(unchangedList);
        }

        this.results
            .forEach((result) => {
                const list = newEntries.includes(result.id) ? newList : unchangedList;
                list.appendChild(
                    <Violation result={result} data-tags={result.tags.join(' ')} data-impact={String(result.impact)} data-id={result.id} data-type="violation"/>
                )
            })

        let hiddenList = <Accordion class="hidden-list" folded={true} nestedRoot={true} ref={this.hiddenContainerRef}><h2 class='listheading accordionheader hidden' slot={Accordion.slots.heading}>Hidden <span class="count" ref={this.hiddenCountRef}></span></h2></Accordion>
        this.resultsContainerRef.value.appendChild(hiddenList);

        this.results
            .forEach((result) => {
                hiddenList.appendChild(
                    <HiddenViolation result={result} data-tags={result.tags.join(' ')} data-impact={String(result.impact)} data-id={result.id} data-type="hiddenViolation"/>
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
                return impactOrder.indexOf(b[0]) - impactOrder.indexOf(a[0])
            }
            const countAllElements = new Set(this.results.flatMap(result => result.nodes || []).flatMap(node => node.target || [])).size;
            this.statisticsContainerRef.value.appendChild(
                <table>
                    <caption>Run Statistics</caption>
                    <thead>
                        <tr>
                            <th>Impact</th>
                            <th>Violations</th>
                            <th>Elements</th>
                        </tr>
                    </thead>
                    <tbody>
                        { ...Object.entries(counts).sort(byImpact).map(([impact, [violations, elements]]) => {
                            const checked = !window[baatSymbol].getSetting<string[]>(settingNames.hiddenImpacts).includes(impact)
                            function handleChange(this: HTMLInputElement) {
                                if (this.checked) {
                                    window[baatSymbol].setSetting(settingNames.hiddenImpacts, window[baatSymbol].getSetting<string[]>(settingNames.hiddenImpacts).filter(hidden => hidden !== impact))
                                } else {
                                    window[baatSymbol].setSetting(settingNames.hiddenImpacts, [ ...window[baatSymbol].getSetting<string[]>(settingNames.hiddenImpacts), impact ])
                                }
                            }
                            return <tr>
                                <th>
                                    <Checkbox checked={ checked } id={ `impact-${ impact }` } onChange={ handleChange } label={ impact.charAt(0).toUpperCase() + impact.slice(1) }/>
                                </th>
                                <td>{ (violations ?? 0).toString() }</td>
                                <td>{ (elements ?? 0).toString() }</td>
                            </tr>
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>Total</th>
                            <td>{ this.results.length.toString() }</td>
                            <td>{ countAllElements.toString() }</td>
                        </tr>
                    </tfoot>
                </table>
            )
            let cache: Array<any> = [];

            this.downloadContainerRef.value.appendChild(
                <button type='button' onClick={() => window[baatSymbol].getFinalResults().then(result => download('baat-report.json', JSON.stringify(result)))}>
                    Download axe report as JSON file
                </button>
            );
        }

        this.handleChangeSettings()
    }

    handleChangeSettings(reason?: string): void {
        const hiddenTags = window[baatSymbol].getSetting<string[]>(settingNames.hiddenTags)
        const hiddenImpacts = window[baatSymbol].getSetting<string[]>(settingNames.hiddenImpacts)
        const hiddenResults = window[baatSymbol].getSetting<string[]>(settingNames.hiddenResults)

        if (reason === settingNames.differenceMode) {
            this.updateResults();
        }

        let hiddenCount = 0;

        this.shadowRoot?.querySelectorAll(`${Violation.tagName}, ${HiddenViolation.tagName}`)
            .forEach((violation) => {
                const isHidden = hiddenResults.includes(violation.getAttribute('data-id') ?? "");
                const isViolation = violation.getAttribute('data-type') === 'violation';
                hiddenCount += isHidden && !isViolation ? 1 : 0;

                violation.classList.toggle('visuallyHidden', (
                    !violation
                        .getAttribute('data-tags')
                        ?.split(' ')
                        .map(tag => !hiddenTags.includes(tag))
                        .reduce((acc, curr) => acc || curr, false)
                ) || (
                    hiddenImpacts.includes(violation.getAttribute('data-impact') ?? "")
                ) || (
                    isViolation ? isHidden : !isHidden
                ))
            })

        const numFiltered = this.shadowRoot?.querySelectorAll(`${Violation.tagName}.visuallyHidden`).length;


        this.hiddenCountRef.value.innerText = `${hiddenCount} ×`;

        this.filterPlaceholderRef?.value?.classList.toggle('visuallyHidden', !(numFiltered !== 0 && numFiltered === window[baatSymbol].lastResults.length))
    }
}

export const register = () => {
    if (!customElements.get(Results.tagName)) { // @ts-ignore
        customElements.define(Results.tagName, Results)
    }
}