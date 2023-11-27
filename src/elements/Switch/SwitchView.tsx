import { baact } from '../../../baact/baact'
import {makeRegisterFunction} from "../../../baact/util/register";
import {BaactComponent} from "../../../baact/BaactComponent";

interface ISwitchViewAccessor {
    name: string
}

export class SwitchView extends BaactComponent<ISwitchViewAccessor> implements ISwitchViewAccessor {
    public static tagName: string = 'baat-switch-view'
    name: string = ""

    static get observedAttributes(): (keyof ISwitchViewAccessor)[] { return [ 'name' ] }

    render() {
        return <div>{this.children}</div>
    }
}

export const register = makeRegisterFunction(SwitchView.tagName, SwitchView)