export const removeChildIfExists = (element: HTMLElement, child: HTMLElement): void => {
    if (element.contains(child)) element.removeChild(child)
}

export const removeAllChildren = (element: HTMLElement | undefined | null): void => {
    if (!element) return
    while (element.lastElementChild) element.removeChild(element.lastElementChild)
    element.textContent = ''
}

export const createScript = (text: string, id?: string) => {
    if (id) document.getElementById(id)?.remove()
    let script = document.createElement('script')
    script.id = id ?? ''
    script.innerText = text
    document.head.appendChild(script)
}

export const createScriptLink = (url: string, id?: string) => {
    if (id) document.getElementById(id)?.remove()
    let script = document.createElement('script')
    script.id = id ?? ''
    script.src = url
    document.head.appendChild(script)
}

export const deepShadowQuerySelectorAll = (selector: string, rootNode = document.body): Node[] => {
    const nodeArray: Node[] = []

    const go = (element: HTMLElement) => {
        if(element.nodeType !== Node.ELEMENT_NODE) return
        if(element.matches(selector)) nodeArray.push(element)

        const children = Array.from(element.children)
        const shadowRoot = element.shadowRoot

        if (children.length) {
            for(const child of children) {
                go(child as HTMLElement)
            }
        }

        if (shadowRoot) {
            const shadowChildren = Array.from(shadowRoot.children)
            for(const shadowChild of shadowChildren) {
                go(shadowChild as HTMLElement)
            }
        }
    }

    go(rootNode)

    return nodeArray
}

export const slottedContains = (rootNode: HTMLElement | null, containee: Node | null): boolean => {
    if (!rootNode || !containee) return false;
    if (rootNode.contains(containee)) return true;

    return Array.from(rootNode.querySelectorAll('slot')).reduce((prev, curr) => prev || curr, true)
}

export const ownText = (node: Node): string => {
    let result = ""

    node.childNodes.forEach(( child) => {
        result += child.nodeType === Node.TEXT_NODE ? child.nodeValue : ""
    })

    return result
}

export const isHidden = (e?: HTMLElement): boolean => {
    if (!e) return true
    const style = window.getComputedStyle(e)

    if (e.getBoundingClientRect().width === 0 && e.getBoundingClientRect().height === 0) return true
    if (style.opacity === '0') return true
    if (style.position === 'fixed') return style.display === 'none' || style.visibility === 'hidden'
    return (e.offsetParent === null)
}

export const shadowAbles = [ 'ARTICLE', 'ASIDE', 'BLOCKQUOTE', 'BODY', 'DIV', 'FOOTER', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HEADER', 'MAIN', 'NAV', 'P', 'SECTION', 'SPAN' ]
export const nonHighlightable = [ 'HEAD', 'BODY', 'HTML', 'TR', 'TD', 'TH', 'TBODY', 'THEAD', 'LI' ] // TODO better handling for tables