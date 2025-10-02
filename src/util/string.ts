export const stringAdd = (s: string, n: number): string => String(Number(s) + n)
export const stringSub = (s: string, n: number): string => String(Number(s) - n)

export const capitlizeFirstLetter = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1)