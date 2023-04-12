import { BaseHTMLElement } from '../BaseHTMLElement'
import { css } from '../../util/taggedString'
import { baatSymbol } from '../../core/BAAT'
import { Accordion } from '../Accordion/Accordion'
import { LibSelection } from '../LibSelection/LibSelection'
import { baact } from '../../../baact/baact'
import { BAATEvent } from '../../types'
import { theme } from '../../theme'
import { axeExists } from '../../util/axe'
import { Checkbox } from '../Checkbox/Checkbox'

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
    [role=doc-subtitle] {
        font-style: italic;
    }
`;

interface ISettingsAccessor {
}

export class Settings extends BaseHTMLElement<ISettingsAccessor> implements ISettingsAccessor {
    public static tagName: string = 'baat-settings'
    styles = styles

    attributeChangedCallback<T extends keyof ISettingsAccessor>(name: T, oldValue: ISettingsAccessor[T], newValue: ISettingsAccessor[T]) {}

    static get observedAttributes(): (keyof ISettingsAccessor)[] { return [] }

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    update() {
        if (!this.shadowRoot) return
    }

    initialize() {
        this.shadowRoot?.appendChild(
            <div id='container'>
                <Accordion folded={false} fixed={true}>
                    <span slot="heading">Testscript</span>
                    <div>
                        <Checkbox
                            id='autorun'
                            checked={window[baatSymbol].getSetting<boolean>('autorun')}
                            onChange={function (this: HTMLInputElement) { window[baatSymbol].setSetting('autorun', this.checked); if(axeExists()) { window[baatSymbol].runAxe() } }}
                            label='auto run when loaded'
                        />
                    </div>
                    <LibSelection />
                </Accordion>
                {/*<Accordion>
                    <span slot="heading">Issue Tag filters</span>
                    <FilterSettings
                        setting='hiddenTags'
                        pre='tag-'
                        id='tagsSettings'
                        getFilters={() => axe.getRules().flatMap(rule => rule.tags).filter((x, i, a) => a.indexOf(x) == i).sort()}
                    />
                </Accordion>*/}
                <Accordion folded={false} fixed={true}>
                    <span slot="heading">BAAT Settings</span>
                    <div>
                        <Checkbox
                            id='showAdditionalInformation'
                            checked={window[baatSymbol].getSetting<boolean>('showAdditionalInformation')}
                            onChange={function (this: HTMLInputElement) { window[baatSymbol].setSetting('showAdditionalInformation', this.checked) }}
                            label='Show a short summary for each test result'
                        />
                        <Checkbox
                            id='developer'
                            checked={window[baatSymbol].getSetting<boolean>('developer')}
                            onChange={function (this: HTMLInputElement) { window[baatSymbol].setSetting('developer', this.checked) }}
                            label='developer mode'
                        />
                    </div>
                </Accordion>
                <div id="info">
                    <h2>
                        BAAT
                    </h2>
                    <div role="doc-subtitle">Bookmarklet Accessibility Audit Tool v{window[baatSymbol].version}</div>
                    <p>
                        BAAT is a tool for running automatic accessibility testing scripts directly in the browser and inspecting the results.
                    </p>
                    <p>
                        To be able to run BAAT you have to select a minified axe-core script. A copy can be obtained by compiling the source files available at the <a href='https://github.com/dequelabs/axe-core'>axe-core GitHub Page</a>.
                    </p>
                    <p>
                        A word of caution. Since BAAT modifies the DOM it is generally recommended to reload the page before testing manually.
                    </p>
                </div>
            </div>
        )
        window[baatSymbol].addEventListener(BAATEvent.ChangeCore, () => this.update());
    }
}

export const register = () => {
    if (!customElements.get(Settings.tagName)) { // @ts-ignore
        customElements.define(Settings.tagName, Settings)
    }
}