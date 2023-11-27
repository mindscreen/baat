import { css } from '../../util/taggedString'
import { baatSymbol } from '../../core/BAAT'
import { BAATEvent, HighlightElement } from '../../types'
import { theme } from '../../theme'
import { getBoundingBox } from '../../util/dom'
import { baact } from "../../../baact/baact";
import {BaactComponent} from "../../../baact/BaactComponent";
import {makeRegisterFunction} from "../../../baact/util/register";

const outline = `0px solid ${ theme.palette.primaryLight}77`;
const background = `${ theme.palette.primaryLight }77`;
const outlineBlink = `50px solid ${ theme.palette.primary}dd;`
const styles = css`
    :host {
        z-index: 999999;
        inset: 0;
        pointer-events: none;
        position: absolute;
    }
  
    .highlight {
        margin: -2px;
        padding: 2px;
        background-color: transparent;
        border-radius: 2px;
        pointer-events: none;
        transition: all 0.5s ease-out;
        outline: ${ outline };
    }
  
    .blink {
        background-color: ${ background };
        outline: ${ outlineBlink };
    }
`;

interface IRunnerOverlayAccessor {
}

export class Overlay extends BaactComponent<IRunnerOverlayAccessor> implements IRunnerOverlayAccessor {
    public static tagName: string = 'baat-overlay'
    styles = styles

    static get observedAttributes(): (keyof IRunnerOverlayAccessor)[] { return [] }

    initialize() {
        window[baatSymbol].addEventListener(BAATEvent.HighlightElement, ((e: CustomEvent<HighlightElement>) => {
            const bb = getBoundingBox(e.detail.element);

            const highlight = (<div
                class="highlight"
                style={{
                    position: "absolute",
                    left: `${bb.x}px`,
                    top: `${bb.y}px`,
                    width: `${bb.w}px`,
                    height: `${bb.h}px`,
                }}
            ></div>) as unknown as HTMLDivElement;

            this.shadowRoot?.appendChild(highlight);
            window.setTimeout(() => {
                highlight.classList.add('blink');
            }, 0);
            window.setTimeout(() => {
                highlight.classList.remove('blink');
            }, 750);
            window.setTimeout(() => {
                highlight.remove();
            }, 1500);
        }) as EventListener)
    }

    render() {
        return <>{...Array.from(this.children)}</>
    }
}

export const register = makeRegisterFunction(Overlay.tagName, Overlay)