import { visuallyHiddenStyles } from '../../util/style'
import { axeExists } from '../../util/axe'
import * as axe from 'axe-core'
import { BaseHTMLElement } from '../BaseHTMLElement'
import { css } from '../../util/taggedString'
import { baatSymbol } from '../../core/BAAT'
import { baact, createRef } from '../../../baact/baact'
import { theme } from '../../theme'
import { BAATEvent, ChangeCore } from '../../types'
import {button} from "../../styles/button";
import { link } from '../../styles/link';

const styles = css`
    .visuallyHidden { ${visuallyHiddenStyles} }
    
    #fileInput {
        display: none;
    }

    #fileButton {
        margin: 0.5em 0;
    }

    ${button}
    
    input {
        font-size: ${theme.semanticSizing.font.normal};
    }
    ${link}
`;

interface ILibSelectionAccessor {
}

export class LibSelection extends BaseHTMLElement<ILibSelectionAccessor> implements ILibSelectionAccessor {
    loaded: boolean = false
    static tagName: string = 'baat-lib-selection'
    private loadedContainerRef = createRef<HTMLDivElement>()
    private loadedTextRef = createRef<HTMLDivElement>()
    private unloadedContainerRef = createRef<HTMLDivElement>()
    private unloadedTextRef = createRef<HTMLDivElement>()
    private fileRef = createRef<HTMLInputElement>()
    private source: string = ''

    attributeChangedCallback<T extends keyof ILibSelectionAccessor>(name: T, oldValue: ILibSelectionAccessor[T], newValue: ILibSelectionAccessor[T]) {
        this.update()
    }

    static get observedAttributes(): (keyof ILibSelectionAccessor)[] { return [] }

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    update() {
        if (!this.shadowRoot) return

        this.unloadedContainerRef.value.classList.toggle('visuallyHidden', axeExists());
        this.loadedContainerRef.value.classList.toggle('visuallyHidden', !axeExists());

        if (!axeExists()) return

        let axeVersion = ''
        if(typeof axe === 'object') {
            axeVersion = '(' + axe.version + ')'
        }
        this.loadedTextRef.value.textContent = "i18n('baat.libSelection.loaded') " + axeVersion + " i18n('baat.libSelection.loadedSuffix')" + (this.source ? " i18n('baat.libSelection.from') " + this.source : '')
    }

    initialize() {
        this.shadowRoot?.appendChild(<style>{styles}</style>)

        const handleFileChange = function (this: HTMLInputElement) {
            var file = this.files ? this.files[0] : null
            if (file) {
                var reader = new FileReader()
                reader.readAsText(file, 'UTF-8')
                reader.onload = function (evt) {
                    window[baatSymbol].createScript((evt?.target?.result as string) ?? '')
                }
            }
        }

        this.shadowRoot?.appendChild(
            <div id='container'>
                <div id='unloadedContainer' ref={this.unloadedContainerRef}>
                    <p id='unloadedText' ref={this.unloadedTextRef}>
                        i18n('baat.libSelection.notLoaded')<br/>i18n('baat.libSelection.downloadFrom') <a href="https://tools.caat.report/axe.min.js">https://tools.caat.report/axe.min.js</a>
                    </p>
                    <input type='file' accept='.js, text/javascript' id='fileInput' onChange={handleFileChange} ref={this.fileRef}/>
                    <button type='button' id='fileButton' onClick={() => this.fileRef.value.click()}>i18n('baat.libSelection.selectFile')</button>
                </div>
                <div id='loadedContainer' ref={this.loadedContainerRef}>
                    <p id='loadedText' ref={this.loadedTextRef}></p>
                    <button type='button' id='reloadButton' onClick={() => window[baatSymbol].unloadAxe()}>i18n('baat.libSelection.change')</button>
                </div>
            </div>
        )
        window[baatSymbol].addEventListener(BAATEvent.ChangeCore, ((e: CustomEvent<ChangeCore>) => {
            this.source = e.detail.source
            this.update()
        }) as EventListener)

        this.initialized = true;
    }

    connectedCallback(): void {
        super.connectedCallback()
        this.update()
    }
}

export const register = () => {
    if (!customElements.get(LibSelection.tagName))
        customElements.define(LibSelection.tagName, LibSelection);
}