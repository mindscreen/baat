import {HistoryEntry, Result} from "../types";

export const convertViolationToHistoryEntry = (violations: Result[]): HistoryEntry => violations.map((violation) => ({
    id: violation.id,
    nodes: violation.nodes.map((nodeResult) => ({
        target: nodeResult.target,
        html: nodeResult.html,
        all: nodeResult.all.map((allResult) => ({
            id: allResult.id,

        })),
        any: nodeResult.any.map((anyResult) => ({
            id: anyResult.id,
        }))
    }))
}));

type HistoryDiff = {
    newEntries: string[]
    removedEntries: string[]
    unchangedEntries: string[]
}

export const historyEntryDiff = (oldHistory: HistoryEntry, newHistory: HistoryEntry): HistoryDiff => {
    const newEntries: string[] = [];
    const removedEntries: string[] = [];
    const unchangedEntries: string[] = [];

    oldHistory.forEach((historyEntry) => {
        if (!newHistory.find((entry) => entry.id === historyEntry.id)) {
            removedEntries.push(historyEntry.id);
        }
    });

    newHistory.forEach((historyEntry) => {
        if (!oldHistory.find((entry) => entry.id === historyEntry.id)) {
            newEntries.push(historyEntry.id);
        }
    });

    if (unchangedEntries.length === 0) {
        unchangedEntries.push(...oldHistory.filter((entry) => newHistory.find((newEntry) => newEntry.id === entry.id)).map((entry) => entry.id));
    }

    return {
        newEntries,
        removedEntries,
        unchangedEntries,
    }
}