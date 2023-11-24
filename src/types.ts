import * as axe from 'axe-core'

export type ChangeCore = {
    source: string
}

export type AxeRunCompleted = {
    violations: Result[]
}

export type StatusChange = {
    message: string
}

export type ViewChanged = {
    view: BAATView
}

export type SettingsChanged = {
    name: string,
    newValue: any,
    oldValue: any,
}

export type HighlightElement = {
    element: HTMLElement
}

export enum BAATEvent {
    ChangeCore = 'ChangeAxeCore',
    ChangeSettings = 'ChangeSettings',
    RunCompleted = 'RunCompleted',
    StatusChange = 'StatusChange',
    ChangeView = 'ChangeView',
    HighlightElement = 'HighlightElement',
    ReporterAdded = 'ReporterAdded',
}

export enum BAATView {
    Settings = 'Settings',
    Main = 'Main'
}

export interface NodeResult extends axe.NodeResult {
    highlight?: HTMLElement
    original?: HTMLElement
}

export interface Result extends axe.Result {
    nodes: NodeResult[]
}

export type HistoryEntry = {
    id: string
    nodes: {
        html: string
        all: { id: string }[]
        any: { id: string }[]
        target: string[]
    }[]
}[]