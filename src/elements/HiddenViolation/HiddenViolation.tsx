import { css } from '../../util/taggedString'
import { theme } from '../../theme'
import { baact } from '../../../baact/baact'
import { Result } from '../../types'
import { Icon } from '../Icon/Icon'
import { baatSymbol } from "../../core/BAAT"
import { settingNames } from "../../config"
import { BaactComponent } from "../../../baact/BaactComponent"
import { makeRegisterFunction } from "../../../baact/util/register"

const borderBottom = `${theme.sizing.absolute.tiny} solid ${theme.palette.gray}`

const styles = css`
    .container {
        padding: ${theme.sizing.relative.tiny};
        border-bottom: ${borderBottom};
        display: flex;
        gap: ${theme.sizing.relative.tiny};
        justify-content: space-between;
    }
  
    h2 {
        margin: 0;
        font-size: ${theme.semanticSizing.font.normal};
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-weight: normal;
    }
  
    button {
        display: flex;
        align-items: center;
        font-family: sans-serif;
        gap: ${theme.sizing.relative.tiny};
        background-color: ${theme.palette.white};
        border: none;
        padding: ${theme.sizing.relative.tiny} ${theme.sizing.relative.smaller};
        cursor: pointer;
        font-size: 1rem;
        margin: -${theme.sizing.relative.tiny};
    }
  
    button:hover {
        background-color: ${theme.palette.gray};
    }
`;

interface IHiddenViolationAccessor {
    result?: Result
}

export class HiddenViolation extends BaactComponent<IHiddenViolationAccessor> implements IHiddenViolationAccessor {
    public static tagName: string = 'baat-hidden-violation'
    result?: Result
    folded: boolean = true
    styles = styles

    static get observedAttributes(): (keyof IHiddenViolationAccessor)[] { return [ 'result' ] }

    render() {
        const handleShow = () => {
            if (!this.result) return

            window[baatSymbol].setSetting(settingNames.hiddenResults,
                window[baatSymbol].getSetting<string[]>(settingNames.hiddenResults).filter(hidden => hidden !== this.result?.id)
            )
        }

        return <div class='container'>
            <h2 id='title'>{this.result ? this.result.help : ''}</h2>
            <button onClick={handleShow}>
                <Icon width="16" height="16"><circle cx="24" cy="24" r="7.66" fill="currentColor" /><path d="M24 31.66C11.80 31.66 2 24 2 24C2 24 11.80 16.34 24 16.34C36.20 16.34 46 24 46 24C46 24 36.20 31.66 24 31.66Z" stroke="currentColor" stroke-width="4" /></Icon>
                Show
            </button>
        </div>
    }
}

export const register = makeRegisterFunction(HiddenViolation.tagName, HiddenViolation)