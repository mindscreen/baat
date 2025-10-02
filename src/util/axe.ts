import * as axe from 'axe-core'
import {escapeHtml} from './html';
import { ownText } from './dom';

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

export const transformInfoToHTMLLists = (text: string, ulClass?: string, liClass?: string): string => {
    const lines = text.split('\n');
    const result: string[] = [];
    let inList = false;

    for (const line of lines) {
        if (line.startsWith('  ')) {
            if (!inList) {
                result.push(`<ul${ulClass ? ` class="${ulClass}"` : ''}>`);
                inList = true;
            }
            result.push(`<li${liClass ? ` class="${liClass}"` : ''}>${escapeHtml(line.trim())}</li>`);
        } else {
            if (inList) {
                result.push('</ul>');
                inList = false;
            }
            result.push(line);
        }
    }

    if (inList) {
        result.push('</ul>');
    }

    return result.join('\n');
}

export const getElementFromNodeResult = (nodeResult: axe.NodeResult | undefined): HTMLElement | null =>
    nodeResult?.element ?? document.querySelector(nodeResult?.target?.join(', ') ?? '')

export const getNameFromNodeResult = (nodeResult: axe.NodeResult | undefined, devMode?: boolean): string => {
    const element = getElementFromNodeResult(nodeResult)

    if (devMode) {
        return nodeResult?.target.join(', ') ?? element?.tagName.toLowerCase() ?? ''
    }

    const name = element ? ownText(element).trim() : ""

    if (name === "") {
        return (element?.tagName.toLowerCase() ?? nodeResult?.target.join(', ') ?? "")
    }

    return name;
}