import {BaactComponent} from "../BaactComponent";
import {BaseHTMLElement} from "../BaseHTMLElement";

interface CustomBaactElementConstructor {
    new (...params: any[]): BaseHTMLElement<any>;
}

export const makeRegisterFunction = (tagName: string, ctor: CustomBaactElementConstructor) => {
    return () => {
        if (!customElements.get(tagName)) {
            customElements.define(tagName, ctor)
        }
    }
}