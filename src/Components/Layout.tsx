import {
  Button, Typography, AppBar, Toolbar, Box,
} from '@mui/material'
import { Container } from '@mui/system'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import DarkModeSwitch from './DarkModeSwitch'
import { rootPath } from '../Helper/Helper'

export const Layout = (props: any) => {
  const { children } = props
  return (
    <Container maxWidth="lg" sx={{ mt: 10 }}>
      <AppBar position="static" sx={{ mb: 3 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h5"
              component="div"
              sx={{ mr: 3, cursor: 'pointer' }}
              onClick={() => {
                document.location.href = `${rootPath}#`
              }}
            >
              <ShowChartIcon sx={{ verticalAlign: 'middle' }} />
              {' Capital Trading'}
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button
                sx={{ my: 2, color: 'white', display: 'block' }}
                onClick={() => {
                  document.location.href = `${rootPath}#`
                }}
              >
                Home
              </Button>
              <Button
                sx={{ my: 2, color: 'white', display: 'block' }}
                onClick={() => {
                  document.location.href = `${rootPath}#simulator`
                }}
              >
                Simulator
              </Button>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} justifyContent="end">
              <DarkModeSwitch />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {children}
    </Container>
  )
}
