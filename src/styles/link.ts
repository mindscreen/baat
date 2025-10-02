import { css } from '../util/taggedString';
import { theme } from '../theme';

export const link = css`
    a {
        color: ${ theme.palette.dark };
    }
    a:hover {
        text-decoration: none;
        outline: 1px solid ${ theme.palette.dark };
        outline-offset: 2px;
    }
`;