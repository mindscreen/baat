'use strict'
import { register, Results, Settings, Switch, SwitchView, Window, Icon, MiniResults, Overlay } from './elements'
import {config, settingNames} from './config'
import { baatSymbol } from './core/BAAT'
import { baact, createRef } from '../baact/baact'
import { BAATEvent, BAATView } from './types'
import { axeExists } from './util/axe'
import { windowSlots } from './elements/Window/Window'

register();

let potentialPanel = document.getElementById(config.panelId)
if (potentialPanel) potentialPanel.remove()

const switchRef = createRef<Switch>()
const settingsRef = createRef<HTMLButtonElement>()
const runRef = createRef<HTMLButtonElement>()

const handleSettingsClick = () => {
    const view = window[baatSymbol].view === BAATView.Main ? BAATView.Settings : BAATView.Main
    window[baatSymbol].view = view
    settingsRef.value.setAttribute('aria-pressed', String(view === BAATView.Settings))
}

const handlePlayClick = () => {
    settingsRef.value.setAttribute('aria-pressed', 'false')
    window[baatSymbol].runAxe()
    window[baatSymbol].view = BAATView.Main
}

window[baatSymbol].addEventListener(BAATEvent.ChangeCore, () => {
    runRef.value.disabled = !axeExists()
    if (window[baatSymbol].getSetting(settingNames.autorun) && axeExists()) {
        settingsRef.value.setAttribute('aria-pressed', 'false')
        window[baatSymbol].view = BAATView.Main
    }
})

document.body.style.position = 'relative';

document.body.prepend(<Overlay id={config.panelId}>
    <Window>
        <h1 class="heading" slot={windowSlots.heading}><svg version="1.1" viewBox="0 0 89 32" xmlns="http://www.w3.org/2000/svg" height="32" width="89"><title>BAAT</title><g fill="none" stroke="#fff" stroke-linecap="round" stroke-width="1.3"><path d="m23.9 13.1c-1.62-4.46-6.87-0.53-5.93 1.26"/><path d="m8.69 13.1c1.6-4.46 6.8-0.53 5.94 1.26"/><path d="m8.33 5.4c-3.48-4.56-4.95-3.53-6.92-4.32-2.61 12.3 3.24 18.9 15 18.9 11.7 0 17.6-6.47 15-18.9-2 0.795-3.5-0.23-6.95 4.32"/><path d="m27.9 13.8c0.75-6.19-4.56-8.09-11.6-8.09-7.07 0-12.4 1.91-11.6 8.09"/><path d="m29.4 15c2.34 3.47 2.6 6.75 2.49 10.4-3.27-1.09-6.34-1.13-8.44 4.5-3.53-3.1-5.4-1.91-7.14 0.67-1.71-2.58-3.59-3.75-7.14-0.67-2.11-5.64-5.18-5.6-8.44-4.5-0.124-3.68 0.266-7 2.6-10.4"/></g><g fill="#fff"><path d="m53.9 30c-0.45 0-0.692-0.242-0.692-0.692v-13.8c0-9.66 0-13.5 5.19-13.5s5.19 3.81 5.19 13.5v13.8c0 0.45-0.242 0.692-0.692 0.692h-2.08c-0.45 0-0.692-0.242-0.692-0.692v-7.27h-3.46v7.27c0 0.45-0.242 0.692-0.692 0.692h-2.08zm2.77-10.7h3.46v-3.81c0-9 0-10.7-1.73-10.7s-1.73 1.7-1.73 10.7v3.81z"/><path d="m40.7 30c-0.45 0-0.692-0.242-0.692-0.692v-26.3c0-0.45 0.242-0.692 0.692-0.692h4.57c3.56 0 4.74 2.22 4.74 6.2v0.727c0 2.39-0.554 4.26-1.18 5.61v0.138c1.28 1.07 2.08 3.18 2.25 6.85v1.11c-0.277 4.88-1.56 7.06-5.12 7.06h-5.26zm2.77-15.9h1.8c0.969 0 1.66-1.14 1.66-4.85v-0.727c0-2.67-0.623-3.43-1.66-3.43h-1.8v9zm0 12.5h2.49c1.04 0 1.77-0.865 1.9-3.6v-1.11c-0.138-4.12-0.865-4.98-1.9-4.98h-2.49v9.69z"/><path d="m67.4 30c-0.45 0-0.692-0.242-0.692-0.692v-13.8c0-9.66 0-13.5 5.19-13.5s5.19 3.81 5.19 13.5v13.8c0 0.45-0.242 0.692-0.692 0.692h-2.08c-0.45 0-0.692-0.242-0.692-0.692v-7.27h-3.46v7.27c0 0.45-0.242 0.692-0.692 0.692h-2.08zm2.77-10.7h3.46v-3.81c0-9 0-10.7-1.73-10.7s-1.73 1.7-1.73 10.7v3.81z"/><path d="m78.7 5.27c-0.45 0-0.692-0.242-0.692-0.692v-1.73c0-0.45 0.242-0.692 0.692-0.692h9c0.45 0 0.692 0.242 0.692 0.692v1.73c0 0.45-0.242 0.692-0.692 0.692h-2.77v23.9c0 0.45-0.242 0.692-0.692 0.692h-2.08c-0.45 0-0.692-0.242-0.692-0.692v-23.9h-2.77z"/></g></svg></h1>
        <button class="button" aria-label="Run definitions" slot={windowSlots.actions} onClick={handlePlayClick} disabled={!axeExists()} ref={runRef}>
            <Icon width="24" height="24"><path d="m3 3v42l42-21z"/></Icon>
        </button>
        <button class="button" aria-label="Show settings" slot={windowSlots.actions} onClick={handleSettingsClick} ref={settingsRef} aria-pressed={window[baatSymbol].view === BAATView.Settings}>
            <Icon width="24" height="24"><path d="m21.2 4.88h5.75l1.89-2.08 6.76 2.83-0.2 2.8 4.07 4.11 2.77-0.14 2.8 6.82-2.06 1.88v5.8l2.06 1.88-2.8 6.82-2.77-0.2-4.09 4.12 0.2 2.8-6.74 2.82-1.87-2.08h-5.77l-1.87 2.14-6.75-2.82 0.14-2.8-4.08-4.1-2.78 0.2-2.81-6.88 2.06-1.88v-5.82l-2.06-1.88 2.79-6.82 2.78 0.14 4.08-4.11-0.13-2.8 6.75-2.82z"/><circle cx="24" cy="24" r="9" /></Icon>
        </button>
        <MiniResults slot={windowSlots.info} />
        <Switch
            ref={switchRef}
            listenTarget={window[baatSymbol]}
            listenEvent={BAATEvent.ChangeView}
            listenOptic={(detail: any) => detail.view}
            currentlyVisibleView={window[baatSymbol].view}
        >
            <SwitchView name={BAATView.Main}>
                <div>

                </div>
                <Results />
            </SwitchView>
            <SwitchView name={BAATView.Settings}>
                <Settings />
            </SwitchView>
        </Switch>
    </Window>
</Overlay>)