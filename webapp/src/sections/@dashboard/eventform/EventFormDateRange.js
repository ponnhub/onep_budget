import { useContext, useEffect } from 'react';
import { InputAdornment, Stack, TextField } from '@mui/material';
import PropTypes from 'prop-types';

import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { BudgetContext } from '../../../pages/EventFormPage';

// @mui

EventFormDateRange.propTypes = {


    basicInfo: PropTypes.object,
    handleBasicInfoChanged: PropTypes.func


}


export default function EventFormDateRange() {

  const {basicInfo, handleBasicInfoChanged} = useContext(BudgetContext);
  const { eventType, startdate, enddate, daystotal } = basicInfo

  const daysCount = (s, e) => {
    const diffInDays = e.diff(s, 'days');
    return Math.abs(diffInDays) + 1
  }


  useEffect(() => {

    if (dayjs(basicInfo.startdate).isSame(dayjs(basicInfo.enddate) , 'day'))  {
      handleBasicInfoChanged('dateRange', dayjs(basicInfo.startdate).locale('th').format('ในวันที่ D MMMM BBBB'))

      } else {
        const sameMonth = dayjs(basicInfo.startdate).isSame(dayjs(basicInfo.enddate) , 'month')
        const monthAlias = sameMonth ?  "" : " MMMM"
        handleBasicInfoChanged('dateRange', `วันที่ ${[dayjs(basicInfo.startdate).locale('th').format(`D${monthAlias}`), dayjs(basicInfo.enddate).locale('th').format('D MMMM BBBB')].join(" - ")}`)
      }
  }, [startdate, enddate]);


  if (!eventType) return (<></>)
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'th'}>
        <Stack spacing={2} sx={{ p: 3 }} direction={{ sm: "column", md: "row"}} >
          <DatePicker
            label="วันเริ่มต้น"
            value={startdate}
            onChange={(newValue) => {
              handleBasicInfoChanged('startdate', newValue);
              const days = enddate ? daysCount(newValue, enddate) : 1
              handleBasicInfoChanged('daystotal', days) ;
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label="วันสิ้นสุด"
            value={enddate}
            onChange={(newValue) => {
              handleBasicInfoChanged('enddate', newValue);
              const days = startdate ? daysCount(startdate, newValue) : 1
              handleBasicInfoChanged('daystotal', days);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          <TextField
            id={'daystotal'}
            value={daystotal || 1}
            label={"รวม"}
            disabled
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              endAdornment: <InputAdornment position="start">วัน</InputAdornment>
            }}
            placeholder={'จำนวนวัน'}
            // onChange={e => handleBasicInfoChanged('daystotal', e.target.value)}
          />
        </Stack>

    </LocalizationProvider>
    )

}

