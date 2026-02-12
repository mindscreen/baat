import * as axe from 'axe-core';

export const translateImpact = (impact: axe.ImpactValue | 'none') : string => {
    switch (impact) {
        case 'critical': return "i18n('baat.impact.critical')";
        case 'serious': return "i18n('baat.impact.serious')";
        case 'moderate': return "i18n('baat.impact.moderate')";
        case 'minor': return "i18n('baat.impact.minor')";
        default: return "i18n('baat.impact.none')";
    }
}