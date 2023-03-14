import * as axe from 'axe-core'

export const axeExists = (): boolean => (typeof axe !== 'undefined' && axe !== null)

type Key = string
type Name = string
export type ReporterInfos = Array<[Key, Name]>

export const shippedReporters: ReporterInfos = [
    ['v2', 'v2'],
    ['v1', 'v1'],
    ['raw', 'raw'],
    ['no-passes', 'no passes'],
    ['rawEnv', 'raw without environment'],
]