import { Icon } from '../Icon/Icon'
import { theme } from '../../theme'
import { baact } from '../../../baact/baact'
import { css } from '../../util/taggedString'
import { BaactComponent } from "../../../baact/BaactComponent";
import { clx } from "../../../baact/util/classes";
import { makeRegisterFunction } from "../../../baact/util/register";

const border = `${theme.sizing.absolute.tiny} solid ${theme.palette.gray}`

const styles = css`
    #container {
        position: relative;
    }
    #handle {
        display: flex;
        align-items: baseline;
        box-sizing: border-box;
        padding: ${theme.sizing.relative.tiny};
        border: 2px solid transparent;
        text-align: left;
        border-bottom: ${border};
        background-color: ${theme.palette.white};
        width: 100%;
        cursor: pointer;
        color: ${theme.semanticColors.font.dark};
        font-size: ${theme.sizing.relative.normal};
    }
    #handle:focus {
        border-left-color: ${theme.palette.primaryDark};
        outline: none;
    }
    .open #handle {
        border-bottom: ${border};
    }
    .open #caret {
        transform: rotate(-270deg);
    }
    .fixed #handle {
        cursor: revert;
    }
    .nestedRoot #content {
        padding: 0;
    }
    .nestedRoot.open #content {
        border-bottom: none;
    }
    #caret {
        margin: 0 ${theme.sizing.relative.tiny};
    }
    .flex {
        display: flex;
    }
    #content {
        display: none;
        padding: ${theme.sizing.relative.tiny};
        border-left-color: var(--border-color, ${theme.palette.gray});
        border-left-width: ${theme.sizing.absolute.normal};
        border-left-style: solid;
    }
    .open #content {
        display: revert;
        border-bottom: ${border};
    }
`


interface IAccordionAccessor {
    folded: boolean
    fixed: boolean
    nestedRoot?: boolean
    borderColor?: string
    onChange?: (folded: boolean) => void
}

export class Accordion extends BaactComponent<IAccordionAccessor> implements IAccordionAccessor {
    public static tagName: string = 'baat-accordion'
    public static slots = { heading: 'heading' }
    folded: boolean = true
    fixed: boolean = false
    styles = styles
    nestedRoot?: boolean = false
    borderColor?: string
    onChange?: (folded: boolean) => void

    static get observedAttributes(): (keyof IAccordionAccessor)[] { return [ 'folded', 'fixed', 'nestedRoot', 'borderColor' ] }

    render() {
        const classes = clx([!!this.nestedRoot && 'nestedRoot', this.fixed && 'fixed', !this.folded && 'open'])

        const handleMouseUp = (e: Event) => {
            if ((window.getSelection()?.toString().length ?? 0) === 0 && !this.fixed) {
                this.setAttribute('folded', !this.folded)
                e.stopPropagation()
            }
        }

        return <div id='container' class={classes}>
                <button id='handle' onClick={handleMouseUp}>
                    <div id='caret'><Icon width="16" height="16"><path stroke-width="5" d="M 11,43 37,24 11,5"/></Icon></div>
                    <slot name='heading'></slot>
                </button>
                <div
                    id='content'
                    style={{ '--border-color': this.borderColor ?? theme.palette.gray }}
                    inert={this.folded}
                >
                    <slot></slot>
                </div>
            </div>
    }
}

export const register = makeRegisterFunction(Accordion.tagName, Accordion)