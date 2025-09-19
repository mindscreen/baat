import { config } from './config'

const palette = {
    primaryLight: "@PRIMARY_LIGHT@",
    primary: "@PRIMARY@",
    primaryDark: "@PRIMARY_DARK@",
    neutral: '@THEME_NEUTRAL@',
    neutralLight: '@THEME_NEUTRAL_LIGHT@',
    neutralDark: '@THEME_NEUTRAL_DARK@',
    white: "#FFFFFF",
    black: "#000000",
    grayLight: '#D6D6D6',
    gray: '#BCBCBC',
    grayDark: '#A1A1A1',
    dark: '#333',
    light: '#fafafa',
    critical: '#ffbcaf',
    serious: '#ffd0b0',
    moderate: '#ffe0b2',
    minor: '#ffecb3',
    none: '#b5c7e3',
    criticalTransparent: 'rgba(255,188,175,0.25)',
    seriousTransparent: 'rgba(255,208,176,0.25)',
    moderateTransparent: 'rgba(255,224,178,0.25)',
    minorTransparent: 'rgba(255,236,179,0.25)',
    green: '#77ad5a',
    blue: '#5572bd',
}

const sizing = {
    absolute: {
        tiny: '1px',
        small: '2px',
        normal: '4px',
        large: '8px',
    },
    relative: {
        tiny: '0.25em',
        smaller: '0.5em',
        small: '0.75em',
        normalSmall: '0.875em',
        normal: '1em',
        large: '1.25em',
        larger: '1.5em',
        huge: '2em',
        immense: '3em',
    }
}

export const theme = {
    palette,
    sizing,
    semanticSizing: {
        button: {
            padding: `${sizing.relative.tiny} ${sizing.relative.normal}`,
        },
        window: {
            height: `${config.size.height}px`,
            width: `${config.size.width}px`,
        },
        border: {
            radius: sizing.absolute.normal,
            width: sizing.absolute.tiny,
        },
        scrollbar: {
            width: sizing.absolute.large,
            border: sizing.absolute.small,
        },
        font: {
            base: '16px',
            small: sizing.relative.normalSmall,
            normal: sizing.relative.normal,
            large: sizing.relative.large,
            huge: sizing.relative.huge,
            hugeAbsolute: '32px'
        },
    }
}