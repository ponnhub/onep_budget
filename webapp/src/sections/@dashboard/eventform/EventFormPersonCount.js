import { useContext } from 'react';
import PropTypes from 'prop-types';

import { TextField, InputAdornment } from '@mui/material';
import { BudgetContext } from '../../../pages/EventFormPage';

// @mui

EventFormPersonCount.propTypes = {


    basicInfo: PropTypes.object,
    handleBasicInfoChanged: PropTypes.func


}


export default function EventFormPersonCount() {

  const {
    basicInfo,
    handleBasicInfoChanged
  } = useContext(BudgetContext);
  const {
    eventType,
    personCount=0
  } = basicInfo

  if (!eventType) return (<></>)
    return (
      <TextField
        id="outlined-number"
        size='small'
        defaultValue={personCount || basicInfo.onepusers.length}
        color="primary"
        label="จำนวนผู้เข้าร่วม"
        helperText={'ป้อนกรณีมีจำนวนผู้เข้าร่วมที่นำไปคิดยอดค่าใช้จ่ายต่างๆ แตกต่างจากยอดตามรายชื่อด้านบน'}
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          endAdornment: <InputAdornment position="start">คน</InputAdornment>
        }}
        onChange={e => handleBasicInfoChanged('personCount', e.target.value)}
        onKeyUp={(e) => {
          // if (Number.isNaN(event.target.value)) {
          //   event.target.value = 0
          //   return
          // }
          if (e.target.value < 0) e.target.value *= -1
      }}
    />
    )
}

