import { baact, createRef } from '../../../baact/baact'
import { BaseHTMLElement } from '../../../baact/BaseHTMLElement'
import { css } from '../../util/taggedString'
import { theme } from '../../theme'
import {BaactComponent} from "../../../baact/BaactComponent";
import {makeRegisterFunction} from "../../../baact/util/register";

interface ICheckboxAccessor {
    label: string
    labelHidden: boolean
    checked: boolean
    onChange: (checked: boolean) => void
}

const styles = css`
    :host {
        min-height: 1rem;
        display: block;
    }
    .container *,
    .container *::before,
    .container *::after {
        box-sizing: content-box !important;
    }

    .container input {
        position: absolute;
        z-index: -1;
        opacity: 0;
    }

    .container span {
        line-height: 1;
        font-size: 1em;
        font-family: inherit;
    }

    .container {
        display: table;
        position: relative;
        padding-left: ${theme.sizing.relative.large};
        cursor: pointer;
        margin-bottom: ${theme.sizing.relative.tiny};
    }

    .container input[type="checkbox"] ~ .input {
        position: absolute;
        top: 0;
        left: 0;
        height: ${theme.sizing.relative.small};
        width: ${theme.sizing.relative.small};
        background: ${theme.palette.white};
        transition: background 250ms;
        border: 1px solid ${theme.palette.primary};
        border-radius: 0.2em;
    }

    .container input[type="checkbox"] ~ .input::after {
        content: "";
        position: absolute;
        display: none;
        left: calc(${theme.sizing.relative.small} / 2 - 0.175rem);
        top: calc(${theme.sizing.relative.small} / 2 - 0.4em);
        width: 0.25em;
        height: 0.5em;
        border: solid #ffffff;
        border-width: 0 2px 2px 0;
        transition: background 250ms;
        transform: rotate(45deg);
    }
    
    .container input[type="checkbox"]:disabled ~ .input::after {
        border-color: #ffffff;
    }

    .container input:checked ~ .input::after {
        display: block;
    }

    .container:hover input[type="checkbox"]:not([disabled]) ~ .input,
    .container input[type="checkbox"]:focus ~ .input {
        background: ${theme.palette.primaryLight};
        border-color: ${theme.palette.primaryLight};
    }

    .container input:focus ~ .input {
        box-shadow: 0 0 0 2px ${theme.palette.black};
    }

    .container input[type="checkbox"]:checked ~ .input {
        background: ${theme.palette.primary};
        border-color: ${theme.palette.primary};
    }

    .container input[type="checkbox"]:disabled ~ .input {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .container:hover input[type="checkbox"]:not([disabled]):checked ~ .input,
    .container input[type="checkbox"]:checked:focus ~ .input {
        background: ${theme.palette.primaryLight};
        border-color: ${theme.palette.primaryLight};
    }
`;

export class Checkbox extends BaactComponent<ICheckboxAccessor> implements ICheckboxAccessor {
    public static tagName: string = 'baat-checkbox'
    label: string = ""
    labelHidden: boolean = false
    checked: boolean = false
    styles = styles
    onChange = () => {}

    static get observedAttributes(): (keyof ICheckboxAccessor)[] { return [ 'label', 'checked', 'labelHidden' ] }

    render() {
        return <label class="container">
            <span>{this.labelHidden ? '' : this.label}</span>
            <input
                checked={this.checked}
                type="checkbox"
                onChange={this.onChange}
                aria-label={this.labelHidden ? this.label : undefined}
            />
            <div class="input"></div>
        </label>
    }
}

export const register = makeRegisterFunction(Checkbox.tagName, Checkbox)