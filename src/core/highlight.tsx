import { baact, createRef } from '../../baact/baact'
import { css } from '../util/taggedString'
import { theme } from '../theme'
import { NodeResult, Result } from '../types'
import { stringAdd, stringSub } from '../util/string'
import { nonHighlightable, shadowAbles } from '../util/dom'

const styles = css`
    #container {
        position: relative;
    }

    #highlight {
        position: absolute;
        pointer-events: none;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        border-width: 0;
        border-style: solid;
        border-color: ${ theme.palette.gray };
        border-radius: ${ theme.sizing.absolute.small };
        box-sizing: border-box;
        z-index: 9002;
        outline-color: ${ theme.palette.black };
        outline-style: solid;
        outline-width: 0;
        background-color: rgba(0, 0, 0, 0);
    }

    .visible > #highlight {
        border-width: ${ theme.sizing.absolute.small };
        outline-width: ${ theme.sizing.absolute.tiny };
    }

    .critical > #highlight {
        border-color: ${ theme.palette.critical };
    }

    .serious > #highlight {
        border-color: ${ theme.palette.serious };
    }

    .moderate > #highlight {
        border-color: ${ theme.palette.moderate };
    }

    .minor > #highlight {
        border-color: ${ theme.palette.minor };
    }

    #container.critical.visible:hover > #highlight {
        background-color: ${ theme.palette.criticalTransparent };
    }

    #container.serious.visible:hover > #highlight {
        background-color: ${ theme.palette.seriousTransparent };
    }

    #container.moderate.visible:hover > #highlight {
        background-color: ${ theme.palette.moderateTransparent };
    }

    #container.minor.visible:hover > #highlight {
        background-color: ${ theme.palette.minorTransparent };
    }

    #infoButton {
        all: initial;
        padding: 0;
        position: absolute;
        font-size: ${ theme.semanticSizing.font.normal };
        cursor: pointer;
        display: none;
        z-index: 9005;
        border-radius: 0.75em;
        top: 50%;
        right: -1.75em;
        margin-top: -0.75em;
        height: 1.5em;
        width: 1.5em;
        border: rgba(0, 0, 0, 0.85) 1px solid;
        opacity: 0.7;
        text-align: center;
        vertical-align: middle;
    }

    .critical > #infoButton {
        background-color: ${ theme.palette.critical };
    }

    .serious > #infoButton {
        background-color: ${ theme.palette.serious };
    }

    .moderate > #infoButton {
        background-color: ${ theme.palette.moderate };
    }

    .minor > #infoButton {
        background-color: ${ theme.palette.minor };
    }

    .visible > #infoButton {
        display: inline;
    }

    #infoWindow {
        all: initial;
        position: absolute;
        top: calc(100% + 0.1rem);
        left: 0;
        min-width: 300px;
        max-width: 300px;
        background-color: ${ theme.palette.white };
        border-color: ${ theme.palette.neutral };
        border-width: ${ theme.semanticSizing.border.width };
        border-style: solid;
        border-radius: ${ theme.semanticSizing.border.radius };
        display: none;
        z-index: 9008;
    }

    #infoWindow > h2 {
        background-color: ${ theme.palette.white };
        width: 100%;
        font-size: ${ theme.semanticSizing.font.large };
        color: ${ theme.palette.light };
        background-color: ${ theme.palette.neutral };
        margin: 0;
        padding-left: ${ theme.sizing.relative.tiny };
        box-sizing: border-box;
    }

    #infoWindow h3 {
        font-size: ${ theme.semanticSizing.font.normal };
        margin: 0;
        margin-top: ${ theme.sizing.relative.tiny };
        margin-bottom: ${ theme.sizing.relative.tiny };

    }

    #infoWindow > section {
        padding: 0 ${ theme.sizing.relative.tiny }
    }

    #infoWindow > section:not(:last-child) {
        border-bottom-color: ${ theme.palette.gray };
        border-bottom-style: solid;
        border-bottom-width: ${ theme.semanticSizing.border.width };
    }

    #infoButton:hover + #infoWindow, #infoButton:focus + #infoWindow, #infoWindow:hover, #infoWindow:focus-within {
        display: block;
    }

    @keyframes blink {
        50% {
            background-color: ${ theme.palette.primaryLight } !important;
        }
    }

    .blink {
        animation: blink 0.5s ease-in 0s 2;
    }
`

export const highlightContainer = 'baat-highlight-container'

export const addHighlightTo = (result: NodeResult, violation: Result): HTMLElement | undefined => {
    let element = result.element
    if (!element) return
    const computedStyle = window.getComputedStyle(element)

    if (!shadowAbles.includes(element.tagName) && !nonHighlightable.includes(element.tagName)) {
        if (!element.parentElement?.classList.contains(highlightContainer)) {
            const ref = createRef<HTMLDivElement>()
            const container = <div class={highlightContainer} ref={ref}></div>
            element.after(container)
            container.appendChild(element)
            element = ref.value
        } else {
            element = element.parentElement
        }
    }

    if (!element.shadowRoot) {
        try {
            const clone = element.cloneNode(true);
            element.attachShadow({ mode: 'open' })
            result.original = clone as HTMLElement;
        } catch (e) {}
    }

    if (element.shadowRoot && !element.shadowRoot.querySelector('#container')) {
        // @ts-ignore
        element.shadowRoot.appendChild(<style>{styles}</style>)
        // @ts-ignore
        element.shadowRoot.appendChild(
            <div id='container' style={{ display: computedStyle.display }} data-count="0" class={result.impact ?? undefined}>
                <slot></slot>
                <button id="infoButton">i</button>
                <div id="infoWindow">
                    <h2>Violations</h2>
                </div>
            </div>
        )
    }

    element.shadowRoot?.querySelector('#infoWindow')?.appendChild(
        <section>
            <h3>{violation.help}</h3>
            <p>
                Impact: {violation.impact}<br />
                {violation.description}<br />
                <a href={violation.helpUrl} target="_blank">more information for this violation</a>
            </p>
        </section>
    )

    return (element.shadowRoot?.querySelector('#container') as HTMLElement) ?? undefined
}

export const showHighlight = (result: NodeResult): boolean => {
    if (!result.highlight) return false

    const count = result.highlight.getAttribute('data-count') ?? "0"
    result.highlight.setAttribute('data-count', stringAdd(count, 1))
    result.highlight.classList.add('visible')

    return false
}

export const hideHighlight = (result: NodeResult): boolean => {
    if (!result.highlight) return false

    const count = result.highlight.getAttribute('data-count') ?? "0"
    result.highlight.setAttribute('data-count', stringSub(count, 1))

    if (count === "1") {
        result.highlight.classList.remove('visible')
        return true
    }

    return true
}

export const blinkHighlight = (result: NodeResult) => {
    if (!result.highlight) return false

    const highlight = result.highlight.querySelector('#infoButton') as HTMLElement

    highlight.classList.add('blink')

    window.setTimeout(() => highlight.classList.remove('blink'), 1600)
}