import * as axe from 'axe-core'

export const axeExists = (): boolean => (typeof axe !== 'undefined' && axe !== null)