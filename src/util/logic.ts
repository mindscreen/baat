export const and = <A extends Array<P>, P>(p1: (...args: A) => boolean, p2: (...args: A) => boolean): (...args: A) => boolean =>
    (...args: A) => p1(...args) && p2(...args)

export const notNullish = <T>(x: T | null | undefined): x is T => !!x