import {BaseHTMLElement} from "./BaseHTMLElement";

export class Fragment extends BaseHTMLElement<any> {
    tagName: string = 'fragment';
    constructor() {
        super();
    }
    initialize(): void {
    }
}