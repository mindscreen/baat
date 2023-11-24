import {theme} from "../theme";
import {css} from "../util/taggedString";

export const button = css`
    button {
        background-color: ${theme.palette.primary};
        color: ${theme.palette.light};
        font-size: ${theme.semanticSizing.font.normal};
        border: none;
        padding: ${theme.semanticSizing.button.padding};
        transition: background-color 0.2s ease-in-out;
        cursor: pointer;
    }

    button:hover {
        background-color: ${theme.palette.primaryDark};
    }

    button:active {
        background-color: ${theme.palette.primaryLight};
    }
`;