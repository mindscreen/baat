type Key = string | number | symbol

export const zip = <S, T>(x: Record<Key, S>, y:  Record<Key, T>): Record<Key, [S | undefined, T | undefined]> => {
    const result: Record<Key, [S | undefined, T | undefined]> = {}

    Object.entries(x).forEach(([key, value]) => {
        result[key] = [value, undefined]
    })

    Object.entries(y).forEach(([key, value]) => {
        if (!result[key]) {
            result[key] = [undefined, value]
        }
        result[key][1] = value
    })

    return result
}