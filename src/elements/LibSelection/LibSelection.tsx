import { axeExists } from '../../util/axe'
import * as axe from 'axe-core'
import { BaseHTMLElement } from '../../../baact/BaseHTMLElement'
import { css } from '../../util/taggedString'
import { baatSymbol } from '../../core/BAAT'
import { baact, createRef } from '../../../baact/baact'
import { theme } from '../../theme'
import { BAATEvent, ChangeCore } from '../../types'
import {button} from "../../styles/button";
import {BaactComponent} from "../../../baact/BaactComponent";
import {makeRegisterFunction} from "../../../baact/util/register";
import {clx} from "../../../baact/util/classes";
import {visuallyHiddenStyles} from "../../styles/visuallyHidden";

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
`;

interface ILibSelectionAccessor {
}

export class LibSelection extends BaactComponent<ILibSelectionAccessor> implements ILibSelectionAccessor {
    loaded: boolean = false
    static tagName: string = 'baat-lib-selection'
    private fileRef = createRef<HTMLInputElement>()
    private source: string = ''
    styles = styles

    static get observedAttributes(): (keyof ILibSelectionAccessor)[] { return [] }

    initialize() {
        super.initialize();

        window[baatSymbol].addEventListener(BAATEvent.ChangeCore, ((e: CustomEvent<ChangeCore>) => {
            this.source = e.detail.source
            this.shouldRerender();
        }) as EventListener)
    }

    handleFileChange(this: HTMLInputElement) {
        var file = this.files ? this.files[0] : null
        if (file) {
            var reader = new FileReader()
            reader.readAsText(file, 'UTF-8')
            reader.onload = function (evt) {
                window[baatSymbol].createScript((evt?.target?.result as string) ?? '')
            }
        }
    }

    render() {
        let axeVersion = (axeExists() && typeof axe === 'object') ? '(' + axe.version + ')' : ''

        return <div id='container'>
            <div id='unloadedContainer' class={clx([axeExists() && 'visuallyHidden'])}>
                <input
                    type='file'
                    accept='.js, text/javascript'
                    id='fileInput'
                    onChange={this.handleFileChange}
                    ref={this.fileRef}
                />
                <button
                    type='button'
                    id='fileButton'
                    onClick={() => this.fileRef.value.click()}
                >
                    Select File
                </button>
            </div>
            <div id='loadedContainer' class={clx([!axeExists() && 'visuallyHidden'])}>
                <div id='loadedText'>
                    {'axe-core ' + axeVersion + ' loaded' + (this.source ? ' from ' + this.source : '')}
                </div>
                <button type='button' id='reloadButton' onClick={() => window[baatSymbol].unloadAxe()}>Change</button>
            </div>
        </div>
    }
}

export const register = makeRegisterFunction(LibSelection.tagName, LibSelection)