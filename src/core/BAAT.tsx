import { createScript } from '../util/dom'
import {config, localStorageKeys, settingNames} from '../config'
import { axeExists } from '../util/axe'
import * as axe from 'axe-core'
import {
    AxeRunCompleted,
    BAATEvent,
    BAATView,
    SettingsChanged,
    ViewChanged,
    Result,
    StatusChange,
    HistoryEntry
} from '../types'
import { highlightContainer } from './highlight'
import {convertViolationToHistoryEntry} from "../util/history";

export class BAAT extends EventTarget {
    private static instance: BAAT;
    private settings: Record<string, any> = {};
    private running: boolean = false;
    public lastResults: Result[] = []
    public fullReport: axe.AxeResults | null = null;
    private _view: BAATView
    private _hasRun = false
    public version = '@VERSION@'
    private readonly axeMinUrl: string = '@AXE_MIN_URL@'

    private constructor() {
        super();

        const localStorage = window.localStorage
        const possibleScript = localStorage.getItem(localStorageKeys.coreScript)

        try {
            this.settings = JSON.parse(localStorage.getItem(localStorageKeys.settings) ?? '{}')
        } catch (e) {}

        this.addEventListener(BAATEvent.ChangeCore, () => { if (this.getSetting(settingNames.autorun) && axeExists()) { window.setTimeout(() => { this.runAxe() }, 100) }})

        if (possibleScript) {
            this.createScript(possibleScript)
        } else if(this.axeMinUrl !== '') {
            fetch(this.axeMinUrl).then((response) => {
                response.text().then((text) => {
                    this.createScript(text, false, new URL(this.axeMinUrl).hostname)
                })

            })

        }

        this._view = BAATView[(localStorage.getItem(localStorageKeys.view) ?? BAATView.Settings.toString()) as keyof typeof BAATView]
        if (!axeExists()) {
            this._view = BAATView.Settings
        }
    }

    createScript(script: string, writeToStorage = true, source = '') {
        if (!axeExists()) {
            if (script.includes('axe') && script.endsWith(';')) {
                new Promise((resolve) => {
                    createScript(script, 'axeScript')
                    if (writeToStorage) localStorage.setItem(localStorageKeys.coreScript, script)
                    this.dispatchEvent(new CustomEvent(BAATEvent.ChangeCore, { detail: { source } }))
                    resolve()
                })
            } else {
                console.error('The script does not contain "axe" or does not end with ";", not trying to load it!')
            }
        }
    }

    unloadAxe() {
        // @ts-ignore
        axe = null
        localStorage.setItem(localStorageKeys.coreScript, "")
        this.dispatchEvent(new CustomEvent(BAATEvent.ChangeCore, { detail: { source: '' } }))
    }

    getSetting<S>(name: string): S {
        let result = (this.settings)[name]

        if (result === undefined) {
            // @ts-ignore
            result = config.defaultSettings[name];

            if (result === undefined) {
                throw new Error(`default setting ${name} is missing`)
            }
        }

        return result
    }

    setSetting(name: string, value: any) {
        const oldValue = (this.settings)[name];
        (this.settings)[name] = value

        this.dispatchEvent(new CustomEvent<SettingsChanged>(BAATEvent.ChangeSettings, { detail:
            {
                name: name,
                oldValue,
                newValue: value,
            }
        }))

        new Promise((resolve) => {
            localStorage.setItem(localStorageKeys.settings, JSON.stringify(this.settings))
            resolve()
        })
    }

    addHistory(violations: Result[]) {
        const history = localStorage.getItem(localStorageKeys.history)
        const historyArray = history ? JSON.parse(history) : []
        const newEntry: HistoryEntry = convertViolationToHistoryEntry(violations);
        historyArray.push(newEntry);
        localStorage.setItem(localStorageKeys.history, JSON.stringify(historyArray))
    }

    getHistory(): HistoryEntry[] {
        const history = localStorage.getItem(localStorageKeys.history)
        return history ? JSON.parse(history) : []
    }

    clearHistory() {
        localStorage.setItem(localStorageKeys.history, JSON.stringify([]))
    }

    dispatchStatusEvent(message: string) {
        this.dispatchEvent(new CustomEvent<StatusChange>(BAATEvent.StatusChange, { detail: { message } }))
    }

    runAxe() {
        if (this.running) return

        this.dispatchStatusEvent('running Tests...')
        this.running = true

        document.querySelectorAll(`.${highlightContainer}`).forEach((element) => {
            element.parentElement?.insertBefore(element.children[0], element)
            element.remove()
        })

        this.lastResults.forEach((result) => {
            result.nodes.forEach((node) => {
                if (node.highlight && node.original && node.element) {
                    node.element.parentElement?.insertBefore(node.original, node.element)
                    node.element.remove()
                }
            })
        })

        axe.run(
            { exclude: [ [ `#${config.panelId}` ] ] },
            { elementRef: true }
        )
            .then(results => {
                this.running = false
                let violations = results.violations as Result[]

                if (results.violations.length) {
                    if (this.getSetting(settingNames.developer))
                        console.log('violations', violations)

                    /*violations.forEach((violation) => {
                        violation.nodes.forEach((result) => {
                            result.highlight = addHighlightTo(result, violation)
                        })
                    })*/

                    this.dispatchStatusEvent('Issues found!')
                } else {
                    this.dispatchStatusEvent('No issues found!')
                }

                this.dispatchStatusEvent('')

                this.addHistory(violations);

                this.lastResults = violations
                this.fullReport = results
                this._hasRun = true;
                this.dispatchEvent(new CustomEvent<AxeRunCompleted>(BAATEvent.RunCompleted, { detail: { violations: violations }}));
            })
    }

    get view(): BAATView {
        return this._view
    }

    set view(value: BAATView) {
        this._view = value
        this.dispatchEvent(new CustomEvent<ViewChanged>(BAATEvent.ChangeView,{ detail: { view: value }}))
        localStorage.setItem(localStorageKeys.view, value.toString())
    }

    get hasRun(): boolean {
        return this._hasRun
    }

    public static getInstance(): BAAT {
        if (!BAAT.instance) BAAT.instance = new BAAT()

        return BAAT.instance;
    }
}

export const baatSymbol = Symbol.for('baat-core-script');

declare global {
    interface Window { [baatSymbol]: BAAT; }
}

window[baatSymbol] = BAAT.getInstance();