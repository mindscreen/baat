export const config = {
    panelId: 'baat-panel',
    defaultSettings: {
        hiddenTags: [] as string[],
        hiddenImpacts: [],
        hiddenResults: [] as string[],
        autorun: true,
        differenceMode: false,
        developer: false,
        reporter: 'v2',
        impactMapping: {}
    },
    size: {
        width: 400,
        height: 650,
    }
};

export const settingNames = {
    hiddenTags: 'hiddenTags',
    hiddenImpacts: 'hiddenImpacts',
    hiddenResults: 'hiddenResults',
    autorun: 'autorun',
    differenceMode: 'differenceMode',
    developer: 'developer',
    impactMapping: 'impactMapping',
}

export const localStorageKeys = {
    coreScript: 'baat_core_script',
    settings: 'baat_settings',
    history: 'baat_history',
    view: 'baat_view',
}