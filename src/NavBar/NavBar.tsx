import React, { Fragment } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const useStyles = makeStyles((theme:Theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    color: "#fafafa"
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    color: "#fafafa"
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#00bfa5"
    },
    secondary: {
      main: "#1de9b6"
    }
  }
});

export default function NavBar() {
  const classes = useStyles();

  return (
    <Fragment>
      <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <AppBar position="static" color="primary" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Anicheck
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
      </ThemeProvider>
    </Fragment>

  );
}
