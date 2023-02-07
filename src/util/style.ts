import { html } from './taggedString'

export const setStyle = (element: HTMLElement, attrs: { [key: string]: string }): void => {
    if (attrs !== undefined) {
        Object.keys(attrs).forEach((key: string) => {
            element.style.setProperty(key, attrs[key])
        })
    }
}

export const visuallyHiddenStyles = html`
    border: 0;
    clip: rect(0 0 0 0) !important;
    clip-path: inset(50%);
    height: 1px !important;
    margin: 0 -1px -1px 0;
    outline: 0;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px !important;
`