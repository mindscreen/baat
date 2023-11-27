import { Baact } from './index'
import {BaactComponent} from "./BaactComponent";

const svgTags = [ 'animate', 'animateMotion', 'animateTransform', 'circle', 'clipPath', 'defs', 'desc', 'discard', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feDropShadow', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'foreignObject', 'g', 'hatch', 'hatchpath', 'image', 'line', 'linearGradient', 'marker', 'mask', 'metadata', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'set', 'stop', 'svg', 'switch', 'symbol', 'text', 'textPath', 'title', 'tspan', 'use', 'view' ]

function DOMparseChildren(children: Baact.BaactNode[]): any {
    return children.map((child) => {
        if (typeof child === 'string') {
            return document.createTextNode(child);
        }
        return child;
    });
}
function DOMparseNode<P>(element: string, properties: Partial<P>, children: Baact.BaactNode[], isHTML: boolean): any {
    if (element === undefined) {
        return DOMparseChildren(children);
    }
    const el = svgTags.includes(element) ? document.createElementNS('http://www.w3.org/2000/svg', element) : document.createElement(element);

    Object.entries(properties).forEach(([key, value]) => {
        if (key === 'ref') {
            (value as Baact.BaactRef<any>).value = el
            return
        }
        if (key === 'innerHTML') {
            el.innerHTML = value as string
            return
        }
        if (key === 'class') { // TODO: className
            el.classList.value = value as string;
            return
        }
        if (key === 'style') {
            Object.entries(value as  Baact.CSSProperties).forEach(([key, value]) => {
                if (key.startsWith('--')) {
                    el.style.setProperty(key, value)
                } else {
                    // @ts-ignore
                    el.style[key] = value
                }
            })
            return
        }
        if (key.startsWith('on') && isHTML) {
            // @ts-ignore
            el.addEventListener(key.substr(2).toLowerCase(), value)
            return
        }
        if (typeof value === 'boolean' && isHTML) {
            if(value) {
                el.setAttribute(key, 'true')
                // @ts-ignore
                el[key] = 'true'
            }
            return
        }

        value = isHTML ? String(value) : value

        // @ts-ignore
        el.setAttribute(key, value)
        try {
            // @ts-ignore
            el[key] = value
        } catch (e) {}

    });

    DOMparseChildren(children).forEach((child: any) => {
        if (element === 'template') {
            (el as HTMLTemplateElement).content.appendChild(child)
            return
        }

        if (!child) return

        let children: Node[] = []
        if (child instanceof HTMLCollection) {
            children = Array.from(child)
        } else if(Array.isArray(child)) {
            children = child
        } else {
            children = [child]
        }
        children.forEach((c) => {
            if (!c) return
            el.appendChild(c)
        })
    });

    return el;
}

export const baact2 = <P extends Baact.DOMAttributes<T, R>, T extends Element, R extends any>(element: string, properties: P | null, ...children: Baact.BaactNode[]): any => {
    const isHTML = typeof element !== 'function'
    // @ts-ignore
    const name = isHTML ? element : element.tagName;
    const result = DOMparseNode<P>(name, properties ?? {}, children, isHTML);
    return result;
}

export const realize = (vdom: VDOM): Node => {
    const el = svgTags.includes(vdom.name) ? document.createElementNS('http://www.w3.org/2000/svg', vdom.name) : document.createElement(vdom.name);
    if (!vdom.isHTML) {
        // @ts-ignore
        vdom.component = el
    }
    el.vdom = vdom

    Object.entries(vdom.properties).forEach(([key, value]) => {
        el.setAttribute("cryptoId", crypto.randomUUID())
        if (key === 'ref') {
            (value as Baact.BaactRef<any>).value = el
            return
        }
        if (key === 'innerHTML') {
            el.innerHTML = value as string
            return
        }
        if (key === 'class') { // TODO: className
            el.classList.value = value as string;
            return
        }
        if (key === 'style') {
            Object.entries(value as  Baact.CSSProperties).forEach(([key, value]) => {
                if (key.startsWith('--')) {
                    el.style.setProperty(key, value)
                } else {
                    // @ts-ignore
                    el.style[key] = value
                }
            })
            return
        }
        if (key.startsWith('on') && vdom.isHTML) {
            // @ts-ignore
            el.addEventListener(key.substr(2).toLowerCase(), value)
            return
        }
        if (typeof value === 'boolean' && vdom.isHTML) {
            if(value) {
                el.setAttribute(key, 'true')
                // @ts-ignore
                el[key] = 'true'
            }
            return
        }

        value = vdom.isHTML ? String(value) : value

        // @ts-ignore
        el.setAttribute(key, value)
        try {
            // @ts-ignore
            el[key] = value
        } catch (e) {}

    });

    vdom.children.flatMap((child) => {
        if (child.name === 'fragment') {
            return child.children
        }
        return child
    }).forEach((child) => {
        if (child instanceof Node) {
            el.appendChild(child)
            return
        }
        if (child instanceof HTMLCollection) {
            Array.from(child).forEach((c) => {
                el.appendChild(c)
            })

            return
        }
        if (vdom.name === 'template') {
            (el as HTMLTemplateElement).content.appendChild(child)
            return
        }

        if (!child) return
        if (child.name === 'text') {
            el.appendChild(document.createTextNode(child.properties.value))
            return
        }

        el.appendChild(realize(child))
    });

    return el;
}

export const render = (element: JSX.Element, parent?: any): Node => {
    if (parent) {
        if (!parent.vdom.finalChildren) {
            parent.vdom.finalChildren = []
        }
        parent.vdom.finalChildren.push(element)
    } else {
        console.log(element)
    }
    //console.log(element)
    // @ts-ignore
    const realized = realize(element)
    /*if (element.children) {
        console.log(element)
    }*/

    //console.log(realized)
    return realized
}

type VDOM = {
    name: string
    properties: any
    children: VDOM[]
    isHTML: boolean
    key: string | number | undefined
    component?: BaactComponent<any>
}

export const baact = <P extends Baact.DOMAttributes<T, R>, T extends Element, R extends any>(element: string, properties: P | null, ...children: VDOM[]): VDOM => {
    const isHTML = typeof element !== 'function'
    // @ts-ignore
    const name = isHTML ? element : element.tagName;

    const result = {
        name: name ?? 'fragment',
        properties: properties ?? {},
        children: children.map((child, i) => {
            if (typeof child === 'string') {
                return {
                    name: 'text',
                    properties: { value: child },
                    children: [],
                    isHTML: false,
                    key: `k-text-${i}`
                }
            }
            if (child && !child.key) {
                child.key = `k-${name}-${i}`
            }
            return child
        }),
        isHTML: isHTML,
        key: properties?.key
    };

    return result;
}


export const createRef = <T>(v?: T): Baact.BaactRef<T> => ({ value: v } as unknown as Baact.BaactRef<T>)