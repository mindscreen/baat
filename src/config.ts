export const config = {
    panelId: 'baat-panel',
    defaultSettings: {
        hiddenTags: [] as string[],
        hiddenImpacts: [ 'moderate', 'minor' ],
        hiddenResults: [] as string[],
        autorun: false,
        differenceMode: false,
        developer: false,
        showAdditionalInformation: false,
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
    showAdditionalInformation: 'showAdditionalInformation',
}