'use strict'
import { register, Results, Settings, Switch, SwitchView, Window, Icon, MiniResults, Overlay } from './elements'
import { config } from './config'
import { baat } from './core/BAAT'
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
    const view = baat.view === BAATView.Main ? BAATView.Settings : BAATView.Main
    baat.view = view
    settingsRef.value.setAttribute('aria-pressed', String(view === BAATView.Settings))
}

const handlePlayClick = () => {
    settingsRef.value.setAttribute('aria-pressed', 'false')
    baat.runAxe()
    baat.view = BAATView.Main
}

baat.addEventListener(BAATEvent.ChangeCore, () => {
    runRef.value.disabled = !axeExists()
    if (baat.getSetting('autorun') && axeExists()) {
        settingsRef.value.setAttribute('aria-pressed', 'false')
        baat.view = BAATView.Main
    }
})
document.body.prepend(<Overlay id={config.panelId}>
    <Window>
        <Icon slot={windowSlots.icon} width="24" height="24"><path d="m41.1 20.8c1.1-9.03-6.7-11.8-17.1-11.8s-18.2 2.8-17.1 11.8"/><path d="m43.1 22.7c3.42 5.05 3.99 9.88 3.81 15.2-4.81-1.59-9.33-1.65-12.4 6.58-5.19-4.51-7.94-2.8-10.5 0.98-2.52-3.78-5.27-5.49-10.5-0.98-3.1-8.23-7.62-8.17-12.4-6.58-0.182-5.37 0.39-10.2 3.81-15.2"/><path d="m35.2 19.7c-2.38-6.52-10.1-0.79-8.73 1.82"/><path d="m12.3 9.18c-5.12-6.65-7.32-5.79-10.2-6.95-3.84 18 4.76 27.5 22 27.5 17.2 0 25.8-9.45 22-27.5-2.93 1.16-5.13 0.305-10.2 6.95"/><path d="m12.8 19.7c2.37-6.52 10-0.79 8.72 1.82"/></Icon>
        <h1 class="heading" slot={windowSlots.heading}>BAAT</h1>
        <button class="button" aria-label="Run definitions" slot={windowSlots.actions} onClick={handlePlayClick} disabled={!axeExists()} ref={runRef}>
            <Icon width="24" height="24"><path d="m3 3v42l42-21z"/></Icon>
        </button>
        <button class="button" aria-label="Show settings" slot={windowSlots.actions} onClick={handleSettingsClick} ref={settingsRef} aria-pressed={baat.view === BAATView.Settings}>
            <Icon width="24" height="24"><path d="m21.2 4.88h5.75l1.89-2.08 6.76 2.83-0.2 2.8 4.07 4.11 2.77-0.14 2.8 6.82-2.06 1.88v5.8l2.06 1.88-2.8 6.82-2.77-0.2-4.09 4.12 0.2 2.8-6.74 2.82-1.87-2.08h-5.77l-1.87 2.14-6.75-2.82 0.14-2.8-4.08-4.1-2.78 0.2-2.81-6.88 2.06-1.88v-5.82l-2.06-1.88 2.79-6.82 2.78 0.14 4.08-4.11-0.13-2.8 6.75-2.82z"/><circle cx="24" cy="24" r="9" /></Icon>
        </button>
        <MiniResults slot={windowSlots.info} />
        <Switch
            ref={switchRef}
            listenTarget={baat}
            listenEvent={BAATEvent.ChangeView}
            listenOptic={(detail: any) => detail.view}
            currentlyVisibleView={baat.view}
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