import { createScript } from '../util/dom'
import { config } from '../config'
import { axeExists } from '../util/axe'
import * as axe from 'axe-core'
import { AxeRunCompleted, BAATEvent, BAATView, SettingsChanged, ViewChanged, Result, StatusChange } from '../types'
import { baact } from '../../baact/baact'
import { highlightContainer } from './highlight'

export class BAAT extends EventTarget {
    private static instance: BAAT;
    private settings: Record<string, any> = {};
    private running: boolean = false;
    public lastResults: Result[] = []
    public fullReport: axe.AxeResults | null = null;
    private _view: BAATView
    private _hasRun = false
    public version = '@VERSION@'

    private constructor() {
        super();

        const localStorage = window.localStorage
        const possibleScript = localStorage.getItem('baat_core_script')

        try {
            this.settings = JSON.parse(localStorage.getItem('baat_settings') ?? '{}')
        } catch (e) {}

        this.addEventListener(BAATEvent.ChangeCore, () => { if (this.getSetting('autorun') && axeExists()) { window.setTimeout(() => { this.runAxe() }, 100) }})

        if (possibleScript) {
            this.createScript(possibleScript)
        }

        this._view = BAATView[(localStorage.getItem('baat_view') ?? BAATView.Settings.toString()) as keyof typeof BAATView]
        if (!axeExists()) {
            this._view = BAATView.Settings
        }
    }

    createScript(script: string) {
        if (!axeExists()) {
            if (script.includes('axe') && script.endsWith(';')) {
                new Promise((resolve) => {
                    createScript(script, 'axeScript')
                    localStorage.setItem('baat_core_script', script)
                    this.dispatchEvent(new CustomEvent(BAATEvent.ChangeCore))
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
        localStorage.setItem('baat_core_script', "")
        this.dispatchEvent(new CustomEvent(BAATEvent.ChangeCore))
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
            localStorage.setItem('baat_settings', JSON.stringify(this.settings))
            resolve()
        })
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
                    if (this.getSetting('developer'))
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
        localStorage.setItem('baat_view', value.toString())
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