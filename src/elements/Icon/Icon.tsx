import { baact, createRef } from '../../../baact/baact'
import { BaseHTMLElement } from '../../../baact/BaseHTMLElement'
import { css } from '../../util/taggedString'
import {BaactComponent} from "../../../baact/BaactComponent";
import {makeRegisterFunction} from "../../../baact/util/register";

interface IIconAccessor {
    width: number
    height: number
}

const styles = css`
    :host {
        display: inline-block;
        line-height: 0;
    }
    svg {
        fill: none;
        stroke: currentColor;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 3;
    }
`;

export class Icon extends BaactComponent<IIconAccessor> implements IIconAccessor {
    public static tagName: string = 'baat-icon'
    public width: number = 48
    public height: number = 48
    styles = styles

    static get observedAttributes(): (keyof IIconAccessor)[] { return [ 'width', 'height' ] }

    render() {
        return <svg
                width={this.width}
                height={this.height}
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
            >
            {this.children}
        </svg>
    }
}

export const register = makeRegisterFunction(Icon.tagName, Icon)