import { BaseHTMLElement } from '../../../baact/BaseHTMLElement';
import { css } from '../../util/taggedString'
import { baatSymbol } from '../../core/BAAT'
import { AxeRunCompleted, BAATEvent, Result } from '../../types'
import { baact, createRef } from '../../../baact/baact'
import { uniquePredicate } from '../../util/array'
import { and } from '../../util/logic'
import {makeRegisterFunction} from "../../../baact/util/register";
import {BaactComponent} from "../../../baact/BaactComponent";

const styles = css`
    #container {
      
    }
`;

interface IResultsAccessor {
    results: Result[]
}

export class MiniResults extends BaactComponent<IResultsAccessor> implements IResultsAccessor {
    public static tagName: string = 'baat-mini-results'
    results: Result[] = []
    styles = styles
    private containerRef = createRef<HTMLSpanElement>()

    static get observedAttributes(): (keyof IResultsAccessor)[] { return [ 'results' ] }

    update() {
        if (!this.shadowRoot || !this.isConnected) return
    }

    initialize() {
        this.setAttribute('results', window[baatSymbol].lastResults)

        window[baatSymbol].addEventListener(BAATEvent.ChangeCore, () => {
            this.setAttribute('results', window[baatSymbol].lastResults)
            this.shouldRerender()
        })

        window[baatSymbol].addEventListener(BAATEvent.RunCompleted, ((e: CustomEvent<AxeRunCompleted>) => {
            this.setAttribute('results', e.detail.violations)
            this.shouldRerender()
        }) as EventListener)
    }

    render(): JSX.Element {
        let text = ""

        if (this.results.length !== 0 && window[baatSymbol].hasRun) {
            const elements = this.results.flatMap(result => result.nodes)
                .flatMap(node => node.element)
                .filter(and(uniquePredicate, (value) => value !== undefined))

            text = `Violations: ${this.results.length} Elements: ${elements.length.toString()}`
        } else if (this.results.length !== 0) {
            text = "No Errors"
        }

        return <span id='container' ref={this.containerRef}>{text}</span>
    }
}

export const register = makeRegisterFunction(MiniResults.tagName, MiniResults)