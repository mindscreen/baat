import { baact, createRef } from '../../../baact/baact'
import { css } from '../../util/taggedString'
import { BaseHTMLElement } from '../BaseHTMLElement'
import { theme } from '../../theme'
import { Select } from '../Select/Select'
import { baatSymbol } from '../../core/BAAT'
import { BAATEvent } from '../../types'

interface IReporterSettingsAccessor {
}

const styles = css`
`;

export class ReporterSettings extends BaseHTMLElement<IReporterSettingsAccessor> implements IReporterSettingsAccessor {
    public static tagName: string = 'baat-reportersettings'
    private selectRef = createRef<Select>()

    attributeChangedCallback<T extends keyof IReporterSettingsAccessor>(name: T, oldValue: IReporterSettingsAccessor[T], newValue: IReporterSettingsAccessor[T]) {
        switch (name) {
        }
    }

    static get observedAttributes(): (keyof IReporterSettingsAccessor)[] { return [ ] }

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    initialize() {
        const onChange = (e: Event) => {
            window[baatSymbol].setSetting('reporter', (e.target as any).value)
        }

        window[baatSymbol].addEventListener(BAATEvent.ReporterAdded, (e: Event) => {
            this.selectRef.value?.setAttribute('options', window[baatSymbol].getReporters())
        })

        this.shadowRoot?.appendChild(
            <div>
                <Select
                    label={"Download Reporter: "}
                    options={window[baatSymbol].getReporters()}
                    selectedOption={window[baatSymbol].getSetting<boolean>('reporter')}
                    onChange={onChange}
                    ref={this.selectRef}
                />
            </div>
        )
    }
}

export const register = () => {
    if (!customElements.get(ReporterSettings.tagName))
        customElements.define(ReporterSettings.tagName, ReporterSettings);
}