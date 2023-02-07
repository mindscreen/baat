import { visuallyHiddenStyles } from '../../util/style'
import { BaseHTMLElement } from '../BaseHTMLElement'
import { css } from '../../util/taggedString'
import { baact } from '../../../baact/baact'
import { SwitchView } from './SwitchView'

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

export class Switch extends BaseHTMLElement<ISwitchAccessor> implements ISwitchAccessor {
    public static tagName: string = 'baat-switch'
    currentlyVisibleView: string | undefined = undefined
    listenTarget: EventTarget | undefined
    listenEvent: string | undefined
    listenOptic: ((detail: any) => string) | undefined
    styles = styles

    attributeChangedCallback<T extends keyof ISwitchAccessor>(name: T, oldValue: ISwitchAccessor[T], newValue: ISwitchAccessor[T]) {
        if (oldValue !== newValue) this.update()
    }

    static get observedAttributes(): (keyof ISwitchAccessor)[] { return [ 'currentlyVisibleView' ] }

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    update() {
        if (!this.shadowRoot || this.currentlyVisibleView === undefined) return

        const container = (this.shadowRoot?.getElementById('container') as HTMLSlotElement)

        if (!container) return
        container.assignedElements().forEach(element => {
            const currentlyHidden = (element as SwitchView).name !== this.currentlyVisibleView
            element.classList.toggle('visuallyHidden', currentlyHidden)
            element.toggleAttribute('inert', currentlyHidden)
        })
    }

    initialize() {
        this.shadowRoot?.appendChild(<slot id='container'></slot>)

        if (this.listenTarget && this.listenEvent && this.listenOptic !== undefined) {
            this.listenTarget.addEventListener(this.listenEvent, ((event: CustomEvent) => {
                this.setAttribute('currentlyVisibleView', this.listenOptic?.(event.detail))
            }) as EventListener)
        }

        this.update()
    }
}

export const register = () => {
    if (!customElements.get(Switch.tagName))
        customElements.define(Switch.tagName, Switch);
}