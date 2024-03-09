import * as React from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useRecoilValue } from 'recoil'
import { colorModeState } from '../Atoms'
import { getPaperBaseTheme } from '../Themes/PaperBase'

const Theme = (props: any) => {
  const { children } = props
  const colorScheme = localStorage.getItem('colorScheme')
  const prefersDarkMode = useMediaQuery(`(prefers-color-scheme: ${colorScheme})`)
  const colorMode = useRecoilValue(colorModeState)
  const getTheme = (mode: boolean) => {
    const baseTheme = !mode ? getPaperBaseTheme : {}
    const theme = createTheme({
      palette: {
        mode: mode ? 'dark' : 'light',
        background: {
          default: mode ? '#121212' : '#f2efef',
        },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            /** TODO: implement light version */
            body: {
              scrollbarColor: '#6b6b6b #2b2b2b',
              '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                backgroundColor: '#2b2b2b',
              },
              '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                borderRadius: 8,
                backgroundColor: '#6b6b6b',
                minHeight: 24,
                border: '3px solid #2b2b2b',
              },
              '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
                backgroundColor: '#959595',
              },
              '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
                backgroundColor: '#959595',
              },
              '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#959595',
              },
              '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
                backgroundColor: '#2b2b2b',
              },
            },
          },
        },
      },
      ...baseTheme,
    })
    return theme
  }

  const [theme, setTheme] = React.useState(getTheme(prefersDarkMode))

  React.useEffect(() => {
    const t = getTheme(colorMode === 'dark')
    setTheme(t)
  }, [colorMode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        {children}
      </CssBaseline>
    </ThemeProvider>
  )
}

export default Theme
