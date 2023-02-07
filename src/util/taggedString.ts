export const html = String.raw
export const css = String.raw

export const open = (tagName: string, attributes: Record<string, string> = {}) =>
    `<${ tagName }${ Object.entries(attributes).map(entry => ` ${ entry[0] }='${ entry[1] }'`) }>`

export const close = (tagName: string) => `</${ tagName }>`

export const selfClosing = (tagName: string, attributes: Record<string, string> = {}) =>
    `<${ tagName }${ Object.entries(attributes).map(entry => ` ${ entry[0] }='${ entry[1] }'`) }></${ tagName }>`