import * as axe from 'axe-core'
import { NodeResultLink } from '../NodeResultLink/NodeResultLink'
import { css } from '../../util/taggedString'
import { theme } from '../../theme'
import { baact, createRef } from '../../../baact/baact'
import { Accordion } from '../Accordion/Accordion'
import { NodeResult, Result } from '../../types'
import { hideHighlight, showHighlight } from '../../core/highlight'
import { Icon } from '../Icon/Icon'
import { baatSymbol } from "../../core/BAAT"
import { settingNames } from "../../config"
import { makeRegisterFunction } from "../../../baact/util/register"
import { BaactComponent } from "../../../baact/BaactComponent"
import { visuallyHiddenStyles } from "../../styles/visuallyHidden"

const impactColors = {
    'critical': 'impactCritical',
    'serious': 'impactSerious',
    'moderate': 'impactModerate',
    'minor': 'impactMinor',
}
const getImpactClass = (impact: axe.ImpactValue | undefined): string => {
    return (impact && impact in impactColors ? impactColors[impact] : 'impactNone')
}

const styles = css`
    #container {
    }
    #heading {
        width: 100%;
    }
    #title {
        margin: 0;
        font-size: ${theme.semanticSizing.font.large};
        margin-right: 0.25em;
    }
    .shrink {
        width: calc(100% - 3em)
    }
    ol {
        list-style-type: none;
        padding-left: 0;
        margin-bottom: 0;
    }
    li {
        margin: 0.3em 0;
    }
    .visuallyHidden { ${visuallyHiddenStyles} }
    #indicator {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        top: 0;
        right: 0;
        height: ${theme.sizing.relative.larger};
        width: ${theme.sizing.relative.larger};
        font-size: ${theme.sizing.relative.huge};
        box-sizing: border-box;
    }
    .impactCritical {
        background-color: ${theme.palette.critical};
    }
    .impactSerious {
        background-color: ${theme.palette.serious};
    }
    .impactModerate {
        background-color: ${theme.palette.moderate};
    }
    .impactMinor {
        background-color: ${theme.palette.minor};
    }
    .impactNone {
        background-color: gray;
    }

    a {
      color: ${ theme.semanticColors.font.link };
    }
    a:hover {
        color: ${theme.semanticColors.font.linkHover};
    }
    a:disabled {
        color: ${theme.semanticColors.font.dark};
    }

    button {
        display: flex;
        align-items: center;
        font-family: sans-serif;
        gap: ${theme.sizing.relative.tiny};
        background-color: ${theme.palette.white};
        border: none;
        padding: ${theme.sizing.relative.tiny} ${theme.sizing.relative.smaller};
        cursor: pointer;
        font-size: 1rem;
    }
  
    button:hover {
        background-color: ${theme.palette.gray};
    }
`;

interface IViolationAccessor {
    result?: Result
}

function createNodeLink(index: number, result: NodeResult, alternativeText?: string): HTMLLIElement {
    return <li>
        <NodeResultLink number={index} result={result} alternativeText={alternativeText}/>
    </li> as unknown as HTMLLIElement;
}

export class Violation extends BaactComponent<IViolationAccessor> implements IViolationAccessor {
    public static tagName: string = 'baat-violation'
    result?: Result
    folded: boolean = true
    styles = styles
    private nodeListRef = createRef<HTMLOListElement>()


    static get observedAttributes(): (keyof IViolationAccessor)[] { return [ 'result' ] }

    render() {
        const handleFoldChange = (folded: boolean) => {
            this.result?.nodes.forEach(folded ? hideHighlight : showHighlight)
        }

        const handleHide = () => {
            if (!this.result) return;

            window[baatSymbol].setSetting(settingNames.hiddenResults, [ ...window[baatSymbol].getSetting<string[]>(settingNames.hiddenResults), this.result.id ])
        }

        return <Accordion id='container' onChange={handleFoldChange}>
            <div id='heading' slot={Accordion.slots.heading}>
                <div class='shrink'>
                    <h2 id='title'>{this.result?.help ?? ''}</h2>
                    <div>
                        <span id='subtitle'>{this.result?.id ?? ''}</span> - <label>{this.result?.impact ?? ''}</label>
                    </div>
                </div>
                <div id="indicator" class={getImpactClass(this.result?.impact)}>
                    {(this.result?.impact === 'minor') && <Icon width="24" height="24"><path d="m3 3h42l-21 42z"/></Icon>}
                    {(this.result?.impact === 'moderate') && <Icon width="24" height="24"><path d="m3 45h42l-21-42z" /><path d="m24 20v13" /><path d="m24 40v0"/></Icon>}
                    {(this.result?.impact === 'serious') && <Icon width="24" height="24"><path d="m3 45h42l-21-42z"/><path d="m17.5 27 13 13"/><path d="m30.5 27-13 13"/></Icon>}
                    {(this.result?.impact === 'critical') && <Icon width="24" height="24"><path d="m3 16 13-13h16l13 13v16l-13 13h-16l-13-13z"/></Icon>}
                </div>
            </div>
            <div id='description'>{this.result?.description ?? ''}</div>
            <div id='link'>
                {(this.result?.helpUrl && this.result.helpUrl !== "") &&
                    <a href={this.result.helpUrl} target="_blank" rel="noreferrer">Learn more about {this.result?.id} at Deque University</a>
                }
            </div>
            <button onClick={handleHide}>
                <Icon width="16" height="16">
                    <path d="M2.38 23.79C2.38 23.79 12.18 31.45 24.38 31.45S46.38 23.79 46.38 23.79" stroke="currentColor" stroke-width="4"/>
                </Icon>
                Hide
            </button>
            <ol id='nodeList'>
                {this.result?.nodes.map((node, index) =>
                    <li>
                        <NodeResultLink number={index + 1} result={node} />
                    </li>
                )}
            </ol>
        </Accordion>
    }
}

export const register = makeRegisterFunction(Violation.tagName, Violation)