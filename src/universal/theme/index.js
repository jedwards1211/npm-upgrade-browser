import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import red from '@material-ui/core/colors/red'

type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type Breakpoints = {
  between: (start: BreakpointKey, end: BreakpointKey) => string,
  down: (key: BreakpointKey) => string,
  up: (key: BreakpointKey) => string,
  only: (key: BreakpointKey) => string,
  keys: Array<BreakpointKey>,
  width: (key: BreakpointKey) => number,
  values: { [key: BreakpointKey]: number },
}

type TypographyCategory = {
  color: string,
  fontFamily: string,
  fontSize: number | string,
  fontWeight: number,
  letterSpacing?: number | string,
  lineHeight: number | string,
  marginLeft?: number | string,
}

export type Palette = {
  [50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900]: string,
  A100: string,
  A200: string,
  A400: string,
  A700: string,
  constrastDefaultColor: 'light' | 'dark',
  light: string,
  main: string,
  dark: string,
}

export type Theme = {
  direction: 'ltr' | 'rtl',
  breakpoints: Breakpoints,
  palette: {
    type: 'light' | 'dark',
    background: {
      chip: string,
      default: string,
      paper: string,
    },
    action: {
      active: string,
      disabled: string,
      disabledBackground: string,
      hover: string,
      hoverOpacity: number,
      selected: string,
    },
    text: {
      disabled: string,
      hint: string,
      icon: string,
      primary: string,
      secondary: string,
      success: string,
    },
    divider: string,
    grey: Palette,
    primary: Palette,
    secondary: Palette,
    error: Palette,
    success: Palette,
  },
  shadows: Array<string>,
  spacing: {
    unit: number,
  },
  typography: {
    body1: TypographyCategory,
    body2: TypographyCategory,
    button: TypographyCategory,
    caption: TypographyCategory,
    display1: TypographyCategory,
    display2: TypographyCategory,
    display3: TypographyCategory,
    display4: TypographyCategory,
    headline: TypographyCategory,
    subheading: TypographyCategory,
    title: TypographyCategory,
    fontFamily: string,
    fontSize: number | string,
    fontWeightLight: number,
    fontWeightMedium: number,
    fontWeightRegular: number,
    pxToRem: (value: number) => string,
  },
  zIndex: {
    appBar: string,
    dialog: string,
    dialogOverlay: string,
    drawerOverlay: string,
    layer: string,
    menu: string,
    mobileStepper: string,
    navDrawer: string,
    popover: string,
    snackbar: string,
    tooltip: string,
  },
  props: Object,
  overrides: Object,
  mixins: {
    gutters: () => Object,
    toolbar: Object,
    stripedRow: Object,
    clearfix: Object,
  },
}

const theme: Theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
})
theme.palette.error = red
theme.palette.success = {
  main: '#5dba54',
}
export default theme
