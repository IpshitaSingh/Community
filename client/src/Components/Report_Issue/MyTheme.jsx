import React from 'react';
import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import {green, blue} from '@material-ui/core/colors';
import './form.css';

const myTheme = createMuiTheme({
  palette: {
    primary: green,
    secondary: blue,
  },
});

export default myTheme;