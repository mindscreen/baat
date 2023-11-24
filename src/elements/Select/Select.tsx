import { baact } from '../../../baact/baact'
import { css } from '../../util/taggedString'
import { BaseHTMLElement } from '../BaseHTMLElement'
import { createRef } from '../../../baact/baact'
import { removeAllChildren } from '../../util/dom'
import {visuallyHiddenStyles} from "../../util/style";

interface ISelectAccessor {
    label: string
    options: [string, string][]
    selectedOption: string
    noOptionsFallback: string
    onChange: (checked: boolean) => void
}

const styles = css`
    .visually-hidden {
        ${visuallyHiddenStyles}
    }
`;

export class Select extends BaseHTMLElement<ISelectAccessor> implements ISelectAccessor {
    public static tagName: string = 'baat-select'
    label: string = ""
    options = []
    selectedOption = '' as string
    styles = styles
    noOptionsFallback = 'No options available'
    onChange = () => {}
    private labelRef = createRef<HTMLSpanElement>()
    private selectRef = createRef<HTMLSelectElement>()
    private fallbackRef = createRef<HTMLSpanElement>()

    attributeChangedCallback<T extends keyof ISelectAccessor>(name: T, oldValue: ISelectAccessor[T], newValue: ISelectAccessor[T]) {
        switch (name) {
            case 'label':
                this.updateLabel()
                break
            case 'options':
                this.updateOptions()
                break
        }
    }

    static get observedAttributes(): (keyof ISelectAccessor)[] { return [ 'label', 'options', 'selectedOption' ] }

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    initialize() {
        this.shadowRoot?.appendChild(
            <label class="container">
                <span ref={this.labelRef}>{this.label}</span>
                <select ref={this.selectRef} onChange={this.onChange}>
                </select>
                <span ref={this.fallbackRef}>{this.noOptionsFallback}</span>
            </label>
        )

        this.updateOptions()
    }

    private updateLabel(): void {

    }

    private updateOptions(): void {
        if (!this.shadowRoot || !this.selectRef.value) return

        removeAllChildren(this.selectRef.value);

        this.fallbackRef.value?.classList.toggle('visually-hidden', this.options.length > 0)
        this.selectRef.value?.classList.toggle('visually-hidden', this.options.length === 0)

        this.options.forEach(option => {
            this.selectRef.value.appendChild(
                <option value={option[0]} selected={option[0] === this.selectedOption}>{option[1]}</option>
            )
        })
    }

    private updateSelectedOption(): void {

    }
}

export const register = () => {
    if (!customElements.get(Select.tagName))
        customElements.define(Select.tagName, Select);
}