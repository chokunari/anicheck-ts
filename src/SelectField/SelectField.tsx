import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';

interface Props{
  settingYear:(settingYear:number) => void,
  settingSeason:(settingSeason:number) => void,
  maxYear:number,
  selectedYear:number,
  selectedSeason:number
}

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

export default function SelectField(props:Props) {
  const classes = useStyles();

  const yearChange = (event:React.ChangeEvent<HTMLSelectElement>):void => {
    const selected = !Number.isNaN(Number(event.target.value)) ? (
        //万が一数値にキャストできない値が入ってきた場合は以前の値にする。  
          Number(event.target.value)
        ):(
          props.selectedYear
        );
    props.settingYear(selected);
  };
  const seasonChange = (event:React.ChangeEvent<HTMLSelectElement>):void => {
    const selected = !Number.isNaN(Number(event.target.value)) ? (
          Number(event.target.value)
        ):(
          props.selectedSeason
        );
    props.settingSeason(selected);
  }; 

  //年の選択肢を自動で増やす処理。
  const apiStartYear = 2014;
  const yearChoicesComp = [...Array(props.maxYear - apiStartYear + 1)].map(
      (_,index) => index + apiStartYear).map((yearChoice, key) => 
      <option value={yearChoice} key={key}>{yearChoice}</option>
      )

  return (
    <div>
      <FormControl className={classes.margin}>
            <InputLabel shrink htmlFor="year-native-label-placeholder">
                放送年
            </InputLabel>
            <NativeSelect
                value={props.selectedYear}
                onChange={yearChange}
                inputProps={{
                  name: 'year',
                  id: 'year-native-label-placeholder',
                }}
            >
                {yearChoicesComp}
            </NativeSelect>
      </FormControl>
      <FormControl className={classes.margin}>
            <InputLabel shrink htmlFor="season-native-label-placeholder">
                クール
            </InputLabel>
            <NativeSelect
                value={props.selectedSeason}
                onChange={seasonChange}
                inputProps={{
                  name: 'season',
                  id: 'season-native-label-placeholder',
                }}
            >
                <option value={1}>1〜3月</option>
                <option value={2}>4〜6月</option>
                <option value={3}>7〜9月</option>
                <option value={4}>10〜12月</option>
            </NativeSelect>
      </FormControl>
    </div>
  );
}