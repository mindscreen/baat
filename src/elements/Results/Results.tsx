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
        const differenceMode = window[baatSymbol].getSetting(settingNames.differenceMode);

        let newList: JSX.Element | Element = this.resultsContainerRef.value;
        let unchangedList: JSX.Element | Element = this.resultsContainerRef.value;
        let newEntries: string[] = [];

        if (differenceMode) {
            const history = window[baatSymbol].getHistory();
            const historyDiff = historyEntryDiff(history[history.length - 2] ?? [], convertViolationToHistoryEntry(this.results));
            newEntries = historyDiff.newEntries;

            newList = <Accordion class="list" folded={false} nestedRoot={true} borderColor={theme.palette.green}>
                <h2 class='listheading' slot={Accordion.slots.heading}>New</h2>
            </Accordion>

            this.resultsContainerRef.value.appendChild(newList);


            unchangedList =
                <Accordion class="list" folded={false} nestedRoot={true} borderColor={theme.palette.blue}>
                    <h2 class='listheading' slot={Accordion.slots.heading}>Unchanged</h2>
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

        let hiddenList = <Accordion class="hidden-list" folded={true} nestedRoot={true} ref={this.hiddenContainerRef}><h2 class='listheading' slot={Accordion.slots.heading}>Hidden <span ref={this.hiddenCountRef}></span></h2></Accordion>
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
                            const checked = !window[baatSymbol].getSetting<string[]>(settingNames.hiddenImpacts).includes(impact)
                            function handleChange(this: HTMLInputElement) {
                                if (this.checked) {
                                    window[baatSymbol].setSetting(settingNames.hiddenImpacts, window[baatSymbol].getSetting<string[]>(settingNames.hiddenImpacts).filter(hidden => hidden !== impact))
                                } else {
                                    window[baatSymbol].setSetting(settingNames.hiddenImpacts, [ ...window[baatSymbol].getSetting<string[]>(settingNames.hiddenImpacts), impact ])
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
                <button type='button' onClick={() => window[baatSymbol].getFinalResults().then(result => download('baat-report.json', JSON.stringify(result)))}>
                    <Icon width="16" height="16"><path d="m6 2h33l7 7v33c0 2.26-1.74 4-4 4h-36c-2.26 0-4-1.74-4-4v-36c0-2.26 1.74-3.99 4-4z"/><rect x="9" y="25" width="30" height="19"/><rect x="24" y="6" width="6" height="10"/><rect x="12" y="2" width="24" height="18"/></Icon>
                    Download Report
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
                        .reduce((acc, curr) => acc || curr, false) ?? false
                ) || (
                    hiddenImpacts.includes(violation.getAttribute('data-impact') ?? "")
                ) || (
                    isViolation ? isHidden : !isHidden
                ))
            })

        const numFiltered = this.shadowRoot?.querySelectorAll(`${Violation.tagName}.visuallyHidden`).length;


        this.hiddenCountRef.value.innerText = `(${hiddenCount})`;

        this.filterPlaceholderRef?.value?.classList.toggle('visuallyHidden', !(numFiltered !== 0 && numFiltered === window[baatSymbol].lastResults.length))
    }
}

export const register = () => {
    if (!customElements.get(Results.tagName)) { // @ts-ignore
        customElements.define(Results.tagName, Results)
    }
}