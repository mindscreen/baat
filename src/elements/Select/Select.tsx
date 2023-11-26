import { baact } from '../../../baact/baact'
import { css } from '../../util/taggedString'
import {BaactComponent} from "../../../baact/BaactComponent";
import {makeRegisterFunction} from "../../../baact/util/register";
import {visuallyHiddenStyles} from "../../styles/visuallyHidden";

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

export class Select extends BaactComponent<ISelectAccessor> implements ISelectAccessor {
    public static tagName: string = 'baat-select'
    label: string = ""
    options = []
    selectedOption = '' as string
    styles = styles
    noOptionsFallback = 'No options available'
    onChange = () => {}

    static get observedAttributes(): (keyof ISelectAccessor)[] { return [ 'label', 'options', 'selectedOption' ] }

    render() {
        return <label class="container">
            <span>{this.label}</span>
            {(this.options.length === 0)
                ? <span>{this.noOptionsFallback}</span>
                : <select onChange={this.onChange}>
                    {this.options.map(option =>
                        <option value={option[0]} selected={option[0] === this.selectedOption}>{option[1]}</option>
                    )}
                </select>
            }
        </label>
    }
}

export const register = makeRegisterFunction(Select.tagName, Select)