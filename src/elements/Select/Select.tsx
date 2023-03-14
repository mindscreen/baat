import { baact } from '../../../baact/baact'
import { css } from '../../util/taggedString'
import { BaseHTMLElement } from '../BaseHTMLElement'
import { theme } from '../../theme'
import { createRef } from '../../../baact/baact'
import { removeAllChildren } from '../../util/dom'

interface ISelectAccessor {
    label: string
    options: [string, string][]
    selectedOption: string
    onChange: (checked: boolean) => void
}

const styles = css`
`;

export class Select extends BaseHTMLElement<ISelectAccessor> implements ISelectAccessor {
    public static tagName: string = 'baat-select'
    label: string = ""
    options = []
    selectedOption = '' as string
    styles = styles
    onChange = () => {}
    private labelRef = createRef<HTMLSpanElement>()
    private selectRef = createRef<HTMLSelectElement>()

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
            </label>
        )

        this.updateOptions()
    }

    private updateLabel(): void {

    }

    private updateOptions(): void {
        if (!this.shadowRoot || !this.selectRef.value) return

        removeAllChildren(this.selectRef.value);

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