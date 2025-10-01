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
    grayLight: '#F3F2F1',
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
        tiny: '0.25rem',
        smaller: '0.5rem',
        small: '0.75rem',
        normalSmall: '0.875rem',
        normal: '1rem',
        large: '1.25rem',
        larger: '1.5rem',
        huge: '2rem',
        immense: '3rem',
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