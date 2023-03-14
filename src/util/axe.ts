import * as axe from 'axe-core'

export const axeExists = (): boolean => (typeof axe !== 'undefined' && axe !== null)

type Key = string
type Name = string
export type ReporterInfos = Array<[Key, Name]>

export const shippedReporters: ReporterInfos = [
    ['v2', 'axe-core v2 (default)'],
    ['v1', 'axe-core v1'],
    ['raw', 'raw'],
    ['no-passes', 'no passes'],
    ['rawEnv', 'raw without environment'],
]