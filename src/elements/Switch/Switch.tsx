import { css } from '../../util/taggedString'
import { baact } from '../../../baact/baact'
import { BaactComponent } from "../../../baact/BaactComponent"
import { makeRegisterFunction } from "../../../baact/util/register"
import { visuallyHiddenStyles } from "../../styles/visuallyHidden"

const styles = css`
    ::slotted(.visuallyHidden) { ${visuallyHiddenStyles} }
    .container {
        height: 100%;
        width: 100%;
    }
`;

interface ISwitchAccessor {
    currentlyVisibleView: string | undefined
}

export class Switch extends BaactComponent<ISwitchAccessor> implements ISwitchAccessor {
    public static tagName: string = 'baat-switch'
    currentlyVisibleView: string | undefined = undefined
    listenTarget: EventTarget | undefined
    listenEvent: string | undefined
    listenOptic: ((detail: any) => string) | undefined
    styles = styles

    static get observedAttributes(): (keyof ISwitchAccessor)[] { return [ 'currentlyVisibleView' ] }

    render () {
        return <>
            {...Array.from(this.children).map(child => child.name === this.currentlyVisibleView
                ? <div key={child.name}>{child}</div>
                : <></>
            )}
        </>
    }

    initialize() {
        super.initialize()

        if (this.listenTarget && this.listenEvent && this.listenOptic !== undefined) {
            this.listenTarget.addEventListener(this.listenEvent, ((event: CustomEvent) => {
                this.setAttribute('currentlyVisibleView', this.listenOptic?.(event.detail))
            }) as EventListener)
        }
    }
}

export const register = makeRegisterFunction(Switch.tagName, Switch)