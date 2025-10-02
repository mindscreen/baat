import { Baact } from './index'

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
                // @ts-ignore
                el.style[key] = value
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
        if (typeof value === 'undefined') {
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
        el.appendChild(child);
    });

    return el;
}

export const baact = <P extends Baact.DOMAttributes<T, R>, T extends Element, R extends any>(element: string, properties: P | null, ...children: Baact.BaactNode[]): any => {
    if (typeof element === 'function') {
        //@ts-ignore
        return DOMparseNode<P>(element.tagName, properties ?? {}, children, false)
    }
    return DOMparseNode<P>(element, properties ?? {}, children, true);
}

export const createRef = <T>(v?: T): Baact.BaactRef<T> => ({ value: v } as unknown as Baact.BaactRef<T>)