import React from 'react';
import NavBar from './NavBar/NavBar';
import Field from './Field/Field';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  field: {
    position: 'relative',
    //top: 10,
    left: 10,
  },
});

export default function App() {
  const classes = useStyles();

  return (
    <div className="App">
      <NavBar/>
      <div className={classes.field}>
          <Field/>
      </div>
    </div>
  );
}
