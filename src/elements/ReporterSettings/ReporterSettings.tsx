import { baact, createRef } from '../../../baact/baact'
import { css } from '../../util/taggedString'
import { BaseHTMLElement } from '../../../baact/BaseHTMLElement'
import { Select } from '../Select/Select'
import { baatSymbol } from '../../core/BAAT'
import { BAATEvent } from '../../types'
import {BaactComponent} from "../../../baact/BaactComponent";
import {makeRegisterFunction} from "../../../baact/util/register";

interface IReporterSettingsAccessor {
}

const styles = css`
`;

export class ReporterSettings extends BaactComponent<IReporterSettingsAccessor> implements IReporterSettingsAccessor {
    public static tagName: string = 'baat-reportersettings'
    private selectRef = createRef<Select>()

    static get observedAttributes(): (keyof IReporterSettingsAccessor)[] { return [ ] }
    initialize() {
        super.initialize()

        window[baatSymbol].addEventListener(BAATEvent.ReporterAdded, (e: Event) => {
            this.selectRef.value?.setAttribute('options', window[baatSymbol].getReporters())
        })

        window[baatSymbol].addEventListener(BAATEvent.ChangeCore, (e: Event) => {
            this.selectRef.value?.setAttribute('options', window[baatSymbol].getReporters())
        });
    }

    render(): JSX.Element {
        const onChange = (e: Event) => {
            window[baatSymbol].setSetting('reporter', (e.target as any).value)
        }

        return <div>
            <Select
                label={"Download Reporter: "}
                options={window[baatSymbol].getReporters()}
                selectedOption={window[baatSymbol].getSetting<boolean>('reporter')}
                onChange={onChange}
                ref={this.selectRef}
                noOptionsFallback={"Axe not loaded"}
            />
        </div>
    }
}

export const register = makeRegisterFunction(ReporterSettings.tagName, ReporterSettings)