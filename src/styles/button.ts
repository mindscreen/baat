import {theme} from "../theme";
import {css} from "../util/taggedString";

export const button = css`
    button {
        background-color: #000;
        color: ${theme.palette.light};
        font-size: ${theme.semanticSizing.font.normal};
        border:none;
        border-radius: 2px;
        padding: ${theme.semanticSizing.button.padding};
        cursor: pointer;
    }
    button:hover {
        background-color: ${theme.palette.primaryDark};
    }
    button:focus {
        outline: 1px solid #000;
        outline-offset: 1px;
    }
`;