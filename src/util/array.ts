export const uniquePredicate = <T,>(value: T, index: number, array: T[]): boolean => array.indexOf(value) === index

export const tally = <T extends string | number>(array: T[]): Record<T, number> => array.reduce(
    (prev, curr) => {
        if (!prev[curr]) { prev[curr] = 0 }
        prev[curr] += 1;
        return prev
    }, {} as Record<T, number>
)

export const zip = <S, T>(a: S[], b: T[]): [S, T][] => Array(Math.max(b.length, a.length)).fill([]).map((_,i) => [a[i], b[i]])

export const partition = <T>(array: T[], predicate: (value: T, index: number, array: T[]) => boolean): [T[], T[]] => array.reduce(
    (prev, curr, index) => {
        if (predicate(curr, index, array)) {
            prev[0].push(curr)
        } else {
            prev[1].push(curr)
        }
        return prev
    }, [[], []] as [T[], T[]]
)