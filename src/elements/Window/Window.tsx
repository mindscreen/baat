import { visuallyHiddenStyles } from '../../util/style'
import { BaseHTMLElement } from '../BaseHTMLElement'
import { css } from '../../util/taggedString'
import { theme } from '../../theme';
import { baact, createRef } from '../../../baact/baact'
import { slottedContains } from '../../util/dom'
import { clamp } from '../../util/math'
import { Icon } from '../Icon/Icon'

const scrollbarBorder = `${theme.semanticSizing.scrollbar.border} solid ${theme.palette.white}`
const windowBorder = `${theme.semanticSizing.border.width} solid ${theme.palette.neutral}`

const styles = css`
    ::slotted(button), button {
        all:initial;
    }
    ::-webkit-scrollbar {
        width: calc(${theme.semanticSizing.scrollbar.width} + 2 * ${theme.semanticSizing.scrollbar.border});
        height: 8px;
    }
    
    ::-webkit-scrollbar-thumb {
        background: ${theme.palette.gray};
        border: ${scrollbarBorder};
        border-radius: 50px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: ${theme.palette.grayLight};
    }
    ::-webkit-scrollbar-thumb:active {
        background: ${theme.palette.grayDark};
    }
    
    ::-webkit-scrollbar-track {
        background: transparent;
    }
    
    ::-webkit-scrollbar-corner {
        background: transparent;
    }
    
    :host {
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
        position: fixed;
        all: initial;
        display: block;
        font-family: sans-serif;
        z-index: 999999;
        font-size: ${theme.semanticSizing.font.base};
        color: #333;
    }
    
    #window {
        pointer-events: auto;
        position: fixed;
        max-width: calc(100% - 2em);
        height: ${theme.semanticSizing.window.height};
        width: ${theme.semanticSizing.window.width};
        max-height: calc(100% - 2em);
        bottom: 1em;
        right: 1em;
        z-index: 100000000;
        background-color: ${theme.palette.white};
        font-size: ${theme.semanticSizing.font.base};
        border: ${windowBorder};
        border-radius: ${theme.semanticSizing.border.radius};
        display: flex;
        flex-direction: column;
        user-select: text;
    }
    
    #window.folded {
        height: 3.5em;
    }
    
    #handle {
        width: 100%;
        display: flex;
        align-items: center;
        cursor: move;
        padding: 0.5em;
        box-sizing: border-box;
        background-color: ${theme.palette.neutral};
        color: ${theme.palette.light};
    }
    
    ::slotted([slot='heading']) {
        margin: 0;
        padding: 0;
        flex-basis: 10px;
        flex-grow: 1;
        font-size: ${theme.semanticSizing.font.huge};
        color: ${theme.palette.light};
        font-weight: bold;
        font-family: sans-serif;
        user-select: none;
        pointer-events: none;
    }

    ::slotted([slot='icon']) {
        margin-right: 0.5em;
    }

    @media (max-width: calc(${theme.semanticSizing.window.width} + 2em)) {
        #window.folded ::slotted([slot='heading']) {
            width: 0;
            height: 0;
            visibility: hidden;
        }
        #window.folded #info {
            flex-grow: 1;
        }
    }

    #info, ::slotted([slot='info']) {
        pointer-events: none;
        padding-right: ${theme.sizing.relative.tiny};
    }
    
    #content {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow-y: auto;
    }
    
    #handle > button, #handle > ::slotted(button) {
        font-family: sans-serif;
        margin-left: calc(0.25 * ${theme.semanticSizing.font.base});;
        aspect-ratio: 1 / 1;
        height: 36px;
        flex-basis: 36px;
        border: 2px solid transparent;
        background-color: ${theme.palette.neutral};
        color: ${theme.palette.light};
        font-size: ${theme.semanticSizing.font.large};
        cursor: pointer;
        transition: background-color 0.2s ease-in-out;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    #handle button:hover, #handle button:focus, #handle ::slotted(button:hover), #handle ::slotted(button:focus) {
        background-color: ${theme.palette.neutralDark};
        border-color:  ${theme.palette.light};
    }
    
    #handle button:active, #handle ::slotted(button:active), #handle ::slotted(button[aria-pressed=true]) {
        background-color: ${theme.palette.neutralLight};
        color: ${theme.palette.light};
    }
    
    #handle button:disabled, #handle ::slotted(button:disabled) {
        border-color: transparent;
        background-color: transparent;
        color: ${theme.palette.grayDark};
        cursor: not-allowed;
    }
    
    .visuallyHidden {
        ${ visuallyHiddenStyles }
    }
`;

interface IRunnerWindowAccessor {
    folded: boolean
}

export const windowSlots = {
    icon: 'icon',
    heading: 'heading',
    info: 'info',
    actions: 'actions',
}

enum Anchoring {
    Near = -1,
    Far = 1,
}

export class Window extends BaseHTMLElement<IRunnerWindowAccessor> implements IRunnerWindowAccessor {
    public static tagName: string = 'baat-window'
    position: [number, number] = [0, 0]
    folded: boolean = false
    dragTarget: Node | null = null
    dragCursorPosition: [number, number] = [-1, -1]
    anchoring: [Anchoring, Anchoring] = [Anchoring.Far, Anchoring.Far]
    lastRatio: number = 0
    styles = styles
    private windowRef = createRef<HTMLDivElement>()
    private handleRef = createRef<HTMLDivElement>()
    private buttonRef = createRef<HTMLButtonElement>()
    private contentRef = createRef<HTMLDivElement>()
    private infoRef = createRef<HTMLDivElement>()

    attributeChangedCallback<T extends keyof IRunnerWindowAccessor>(name: T, oldValue: IRunnerWindowAccessor[T], newValue: IRunnerWindowAccessor[T]) {
        switch (name) {
            case 'folded':
                this.updateFolded()
                break
        }
    }

    static get observedAttributes(): (keyof IRunnerWindowAccessor)[] { return [ 'folded' ] }

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    updateFolded() {
        if (!this.shadowRoot) return

        this.windowRef.value.classList.toggle('folded', this.folded)
        this.contentRef.value.classList.toggle('visuallyHidden', this.folded)
        this.infoRef.value.classList.toggle('visuallyHidden', !this.folded)

        if (this.folded) {
            this.buttonRef.value.setAttribute('aria-label', 'show BAAT')
        } else {
            this.buttonRef.value.setAttribute('aria-label', 'hide BAAT')
        }

        if (this.anchoring[1] === Anchoring.Far && this.windowRef.value.offsetTop < 16) {
            this.windowRef.value.style.setProperty('bottom',
                `${window.innerHeight - this.windowRef.value.offsetHeight - 16}px`
            );
        }
    }

    updatePosition() {
        if (!this.shadowRoot || !this.isConnected) return

        this.windowRef.value.style.setProperty('left',
            this.anchoring[0] === Anchoring.Far ? `initial` : `${this.position[0]}px`
        );
        this.windowRef.value.style.setProperty('right',
            this.anchoring[0] === Anchoring.Near ? `initial` : `${window.innerWidth - this.position[0] - this.windowRef.value.offsetWidth}px`
        );
        this.windowRef.value.style.setProperty('top',
            this.anchoring[1] === Anchoring.Far ? `initial` : `${this.position[1]}px`
        );
        this.windowRef.value.style.setProperty('bottom',
            this.anchoring[1] === Anchoring.Near ? `initial` : `${window.innerHeight - this.position[1] - this.windowRef.value.offsetHeight}px`
        );
    }

    fixPosition() {
        this.position = [
            clamp(this.position[0], 16, window.innerWidth - this.windowRef.value.offsetWidth - 16),
            clamp(this.position[1], 16, window.innerHeight - this.windowRef.value.offsetHeight - 16)
        ]
    }

    initialize() {
        this.lastRatio = window.devicePixelRatio;
        const handleClick = (e: Event) => {
            this.setAttribute('folded', !this.folded)
            e.stopPropagation()
        }

        const that = this

        const handleMouseDown = function (this: HTMLDivElement, e: MouseEvent) {
            that.dragTarget = e.target as Node;
            that.dragCursorPosition = [e.offsetX - this.offsetLeft, e.offsetY - this.offsetTop]
        }

        const handleDragStart = function (this: HTMLDivElement, e: DragEvent) {
            if (slottedContains(that.handleRef.value, that.dragTarget)) {
                e.dataTransfer?.setData('text/plain', 'handle')
                const rect = that.handleRef.value.getBoundingClientRect()

                e.dataTransfer?.setDragImage(that.windowRef.value, e.clientX - rect.left, e.clientY - rect.top)
                this.style.opacity = '0.01'
                if (e.dataTransfer)
                    e.dataTransfer.effectAllowed = 'move'
            } else {
                e.preventDefault()
            }
        }

        const handleDragEnd = function (this: HTMLDivElement, e: DragEvent) {
            e.stopPropagation()
            this.style.opacity = '1'
            const targetPosition: [number, number] = [
                e.offsetX - that.dragCursorPosition[0],
                e.offsetY - that.dragCursorPosition[1],
            ]
            that.position = targetPosition
            that.fixPosition()
            const newAnchoring = [
                Math.sign(targetPosition[0] - that.position[0]),
                Math.sign(targetPosition[1] - that.position[1]),
            ]
            that.anchoring = [
                 newAnchoring[0] === 0 ? that.anchoring[0] : newAnchoring[0],
                 newAnchoring[1] === 0 ? that.anchoring[1] : newAnchoring[1],
            ]

            that.updatePosition()
        }

        window.addEventListener('resize', (ev) => {
            if (window.devicePixelRatio === that.lastRatio) return

            that.fixPosition()
            that.updatePosition()
            that.lastRatio = window.devicePixelRatio
        })

        this.shadowRoot?.appendChild(
            <div id='window' onMouseDown={handleMouseDown} onDragStart={handleDragStart} onDragEnd={handleDragEnd} ref={this.windowRef}>
                <div id='handle' ref={this.handleRef} draggable>
                    <slot name={windowSlots.icon}></slot>
                    <slot name={windowSlots.heading}></slot>
                    <div id='info' ref={this.infoRef}><slot name={windowSlots.info}></slot></div>
                    <slot name={windowSlots.actions}></slot>
                    <button id='foldButton' aria-label='hide window' aria-controls='content' aria-expanded='true' onClick={handleClick} ref={this.buttonRef}>
                        <Icon width="24" height="24"><path d="m5 24h40"/></Icon>
                    </button>
                </div>
                <div id='content' ref={this.contentRef}><slot></slot></div>
            </div>
        );

        this.position = [
            this.handleRef.value.getBoundingClientRect().x,
            this.handleRef.value.getBoundingClientRect().y,
        ]

        this.infoRef.value.classList.toggle('visuallyHidden', !this.folded)
    }
}

export const register = () => {
    if (!customElements.get(Window.tagName))
        customElements.define(Window.tagName, Window)
}