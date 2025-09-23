import {theme} from "../theme";
import {css} from "../util/taggedString";

export const button = css`
    button {
        background-color: #fff;
        color: #000;
        border: 1px solid #000;
        font-size: ${theme.semanticSizing.font.normal};
        border-radius: 2px;
        padding: ${theme.semanticSizing.button.padding};
        cursor: pointer;
    }
    button:hover {
        background-color: ${theme.palette.grayLight};
    }
    button:focus {
        outline: 1px solid #000;
        outline-offset: 1px;
    }
`;