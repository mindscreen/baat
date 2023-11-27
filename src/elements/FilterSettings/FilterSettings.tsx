import { axeExists } from '../../util/axe'
import { BaseHTMLElement } from '../../../baact/BaseHTMLElement'
import { baatSymbol } from '../../core/BAAT'
import { baact, createRef } from '../../../baact/baact'
import { BAATEvent } from '../../types'
import { removeAllChildren } from '../../util/dom'
import { Checkbox } from '../Checkbox/Checkbox'

interface IFilterSettingsAccessor {
    pre: string
    setting: string
    getFilters: () => string[]
}

const createCheckbox = (id: string, prefix: string, checked: boolean, onChange: (ev: Event) => any): Node =>
    <Checkbox checked={ checked } id={ prefix + id } onChange={ onChange } label={id}/>

//
/**
 * @deprecated
 * @todo convert to BaactComponent
 */
export class FilterSettings extends BaseHTMLElement<IFilterSettingsAccessor> implements IFilterSettingsAccessor {
    public static tagName: string = 'baat-filter-settings'
    pre: string = ""
    setting: string = ""
    getFilters: () => string[] = () => []
    private containerRef = createRef<HTMLDivElement>()

    attributeChangedCallback<T extends keyof IFilterSettingsAccessor>(name: T, oldValue: IFilterSettingsAccessor[T], newValue: IFilterSettingsAccessor[T]) {
        // @ts-ignore
        this[name] = newValue
        this.update()
    }

    static get observedAttributes(): (keyof IFilterSettingsAccessor)[] { return [ 'pre', 'setting', 'getFilters' ] }

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    update() {
        if (!this.shadowRoot) return
        this.updateCheckboxes()
    }

    async updateCheckboxes(): Promise<void> {
        if (!this.shadowRoot || this.setting === "" || this.pre === "" || !this.containerRef) return

        removeAllChildren(this.containerRef.value)

        if (!axeExists()) {
            this.containerRef.value?.appendChild(<span>No axe-core loaded</span>)
            return
        }

        const possibleFilters = this.getFilters()
        const that = this;

        (possibleFilters.filter(possibleFilter => possibleFilter) as unknown as string[]).forEach(filter => {
            const checkbox = createCheckbox(filter, this.pre, !window[baatSymbol].getSetting<string[]>(this.setting).includes(filter),
                function (this: HTMLInputElement) {
                    if (this.checked) {
                        window[baatSymbol].setSetting(that.setting, window[baatSymbol].getSetting<string[]>(that.setting).filter(hidden => hidden !== filter))
                    } else {
                        window[baatSymbol].setSetting(that.setting, [...window[baatSymbol].getSetting<string[]>(that.setting), filter])
                    }
                })
            this.containerRef.value?.appendChild(checkbox)
        });
    }

    initialize() {
        this.shadowRoot?.appendChild(<div id='container' ref={this.containerRef}></div>);
        window[baatSymbol].addEventListener(BAATEvent.ChangeCore, () => this.update())
        this.updateCheckboxes()
    }
}

export const register = () => {
    if (!customElements.get(FilterSettings.tagName)) { // @ts-ignore
        customElements.define(FilterSettings.tagName, FilterSettings)
    }
}