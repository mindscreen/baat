import { baact } from '../../../baact/baact'
import { css } from '../../util/taggedString'
import { BaseHTMLElement } from '../BaseHTMLElement'
import { theme } from '../../theme'
import { Select } from '../Select/Select'
import { shippedReporters } from '../../util/axe'
import { baatSymbol } from '../../core/BAAT'

interface IReporterSettingsAccessor {
}

const styles = css`
`;

export class ReporterSettings extends BaseHTMLElement<IReporterSettingsAccessor> implements IReporterSettingsAccessor {
    public static tagName: string = 'baat-reportersettings'

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

        const reporterOptions = [...shippedReporters]

        this.shadowRoot?.appendChild(
            <div>
                <Select
                    label={"Download Reporter: "}
                    options={reporterOptions}
                    selectedOption={window[baatSymbol].getSetting<boolean>('reporter')}
                    onChange={onChange}
                />
            </div>
        )
    }
}

export const register = () => {
    if (!customElements.get(ReporterSettings.tagName))
        customElements.define(ReporterSettings.tagName, ReporterSettings);
}