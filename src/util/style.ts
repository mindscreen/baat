export const setStyle = (element: HTMLElement, attrs: { [key: string]: string }): void => {
    if (attrs !== undefined) {
        Object.keys(attrs).forEach((key: string) => {
            element.style.setProperty(key, attrs[key])
        })
    }
}

