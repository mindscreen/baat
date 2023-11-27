import { BaseHTMLElement } from '../../../baact/BaseHTMLElement'
import { css } from '../../util/taggedString'
import { baatSymbol } from '../../core/BAAT'
import { Accordion } from '../Accordion/Accordion'
import { LibSelection } from '../LibSelection/LibSelection'
import { baact } from '../../../baact/baact'
import { BAATEvent } from '../../types'
import { theme } from '../../theme'
import { axeExists } from '../../util/axe'
import { Checkbox } from '../Checkbox/Checkbox'
import { ReporterSettings } from '../ReporterSettings/ReporterSettings'
import {button} from "../../styles/button";
import {settingNames} from "../../config";
import {BaactComponent} from "../../../baact/BaactComponent";
import {makeRegisterFunction} from "../../../baact/util/register";

const styles = css`
    #container {
        display: flex;
        flex-direction: column;
        height: 100%;
        margin-bottom: 1em;
    }
    #info {
        margin: ${theme.sizing.relative.smaller};
    }
    #info > h2 {
        margin: 0;
        font-size: ${theme.semanticSizing.font.large};
    }
    ${button}
    .settingsContainer {
      padding-top: ${theme.sizing.relative.tiny};
    }
    [role=doc-subtitle] {
        font-style: italic;
    }
    .actions {
        display: flex;
        flex-direction: row;
        gap: ${theme.sizing.relative.tiny};
    }
`;

interface ISettingsAccessor {
}

export class Settings extends BaactComponent<ISettingsAccessor> implements ISettingsAccessor {
    public static tagName: string = 'baat-settings'
    styles = styles
    static get observedAttributes(): (keyof ISettingsAccessor)[] { return [] }

    render() {

        return <div id='container'>
            <Accordion folded={false} fixed={true}>
                <span slot={Accordion.slots.heading}>Testscript</span>
                <div class="settingsContainer">
                    <Checkbox
                        id='autorun'
                        checked={window[baatSymbol].getSetting<boolean>(settingNames.autorun)}
                        onChange={function (this: HTMLInputElement) { window[baatSymbol].setSetting(settingNames.autorun, this.checked); if(axeExists()) { window[baatSymbol].runAxe() } }}
                        label='auto run when loaded'
                    />
                </div>
                <LibSelection />
            </Accordion>
            {/*<Accordion>
                <span slot={Accordion.slots.heading}>Issue Tag filters</span>
                <FilterSettings
                    setting='hiddenTags'
                    pre='tag-'
                    id='tagsSettings'
                    getFilters={() => axe.getRules().flatMap(rule => rule.tags).filter((x, i, a) => a.indexOf(x) == i).sort()}
                />
            </Accordion>*/}
            <Accordion folded={false} fixed={true}>
                <span slot="heading">Axe Settings</span>
                <ReporterSettings />
            </Accordion>
            <Accordion folded={false} fixed={true}>
                <span slot={Accordion.slots.heading}>BAAT Settings</span>
                <div class="settingsContainer">
                    <Checkbox
                        id='showAdditionalInformation'
                        checked={window[baatSymbol].getSetting<boolean>(settingNames.showAdditionalInformation)}
                        onChange={function (this: HTMLInputElement) { window[baatSymbol].setSetting(settingNames.showAdditionalInformation, this.checked) }}
                        label='Show a short summary for each test result'
                    />
                    <Checkbox
                        id='differenceMode'
                        checked={window[baatSymbol].getSetting<boolean>(settingNames.differenceMode)}
                        onChange={function (this: HTMLInputElement) { window[baatSymbol].setSetting(settingNames.differenceMode, this.checked) }}
                        label='history difference mode'
                    />
                    <Checkbox
                        id='developer'
                        checked={window[baatSymbol].getSetting<boolean>(settingNames.developer)}
                        onChange={function (this: HTMLInputElement) { window[baatSymbol].setSetting(settingNames.developer, this.checked) }}
                        label='developer mode'
                    />
                    <div class="actions">
                        <button
                            onClick={window[baatSymbol].clearHistory}
                        >
                            Clear local history
                        </button>
                        <button
                            onClick={() => { window[baatSymbol].setSetting(settingNames.hiddenResults, []) }}
                        >
                            Reset Hidden Results
                        </button>
                    </div>
                </div>
            </Accordion>
            <div id="info">
                @INFORMATION@
            </div>
        </div>
    }
}

export const register = makeRegisterFunction(Settings.tagName, Settings)