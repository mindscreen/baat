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
                <Icon width="16" height="16"><path d="M32 36C26.62 37.99 21.33 38.01 16 36C10.67 33.99 2 24 2 24c0 0 8.67-9.99 14-12 5.33-2.01 10.62-1.99 16 0 5.38 1.99 14 12 14 12 0 0-8.62 10.01-14 12z" fill="none" stroke="currentColor" stroke-width="3" /><circle cx="24" cy="24" r="8" fill="none" stroke="currentColor" stroke-width="3" /></Icon>
                Show
            </button>
        </div>
    }
}

export const register = makeRegisterFunction(HiddenViolation.tagName, HiddenViolation)