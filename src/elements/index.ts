import { NodeResultLink, register as registerNodeLink } from './NodeResultLink/NodeResultLink'
import { Violation, register as registerViolation } from './Violation/Violation'
import { Checkbox, register as registerCheckbox } from './Checkbox/Checkbox'
import { Results, register as registerResults } from './Results/Results'
import { MiniResults, register as registerMiniResults } from './Results/MiniResults'
import { Window, register as registerWindow } from './Window/Window'
import { LibSelection, register as registerLibSelection } from './LibSelection/LibSelection'
import { Switch, register as registerSwitch } from './Switch/Switch'
import { SwitchView, register as registerSwitchView } from './Switch/SwitchView'
import { Settings, register as registerSettings } from './Settings/Settings'
import { Accordion, register as registerAccordion } from './Accordion/Accordion'
import { FilterSettings, register as registerFilterSettings } from './FilterSettings/FilterSettings'
import { Icon, register as registerIcon } from './Icon/Icon'
import { Overlay, register as registerOverlay } from './Overlay/Overlay'

export { NodeResultLink, Violation, Checkbox, Results, MiniResults, Window, LibSelection, Switch, SwitchView, Settings, Accordion, FilterSettings, Icon, Overlay }

export const register = () => {
    registerNodeLink()
    registerViolation()
    registerCheckbox()
    registerResults()
    registerMiniResults()
    registerWindow()
    registerLibSelection()
    registerSwitch()
    registerSwitchView()
    registerSettings()
    registerAccordion()
    registerFilterSettings()
    registerIcon()
    registerOverlay()
}