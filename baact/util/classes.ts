export const clx = (classes: (string | false | null | undefined)[]): string => {
    return classes.filter(Boolean).join(' ');
}