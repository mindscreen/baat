import { BaseHTMLElement } from '../BaseHTMLElement';
import { css } from '../../util/taggedString'
import { baatSymbol } from '../../core/BAAT'
import { AxeRunCompleted, BAATEvent, Result } from '../../types'
import { baact, createRef } from '../../../baact/baact'
import { uniquePredicate } from '../../util/array'
import { and } from '../../util/logic'

const styles = css`
    #container {
      
    }
`;

interface IResultsAccessor {
    results: Result[]
}

export class MiniResults extends BaseHTMLElement<IResultsAccessor> implements IResultsAccessor {
    public static tagName: string = 'baat-mini-results'
    results: Result[] = []
    styles = styles
    private containerRef = createRef<HTMLSpanElement>()

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
            <span id='container' ref={this.containerRef}></span>
        )
        this.setAttribute('results', window[baatSymbol].lastResults)
        window[baatSymbol].addEventListener(BAATEvent.ChangeCore, () => {
            this.setAttribute('results', window[baatSymbol].lastResults)
            this.update()
        })
        window[baatSymbol].addEventListener(BAATEvent.RunCompleted, ((e: CustomEvent<AxeRunCompleted>) => {
            this.setAttribute('results', e.detail.violations)
        }) as EventListener)

        this.updateResults()
    }

    updateResults(): void {
        if (!this.shadowRoot) return

        if (this.results.length !== 0 && window[baatSymbol].hasRun) {
            const elements = this.results.flatMap(result => result.nodes)
                .flatMap(node => node.element)
                .filter(and(uniquePredicate, (value) => value !== undefined))

            this.containerRef.value.innerText = `Violations: ${this.results.length}\nElements: ${elements.length.toString()}`
        } else if (this.results.length !== 0) {
            this.containerRef.value.innerText = "No Errors"
        } else {
            this.containerRef.value.innerText = ""
        }
    }
}

export const register = () => {
    if (!customElements.get(MiniResults.tagName)) { // @ts-ignore
        customElements.define(MiniResults.tagName, MiniResults)
    }
}