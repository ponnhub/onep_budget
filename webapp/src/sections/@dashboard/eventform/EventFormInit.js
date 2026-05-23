import { useContext } from 'react';
import { TableHead } from '@mui/material';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// export default function EventFormDropdown() {
//   const handleChange = (event) => {
//     setAge(event.target.value);
//   };

// }


import EVENT_TYPES from '../../../data/event'
import { BudgetContext } from '../../../pages/EventFormPage';

// @mui

EventFormInit.propTypes = {


    eventType: PropTypes.string    

}


export default function EventFormInit({
    eventType
}) {

  const {
    handleBasicInfoChanged,
    handleMainEventChanged,
    setSaveEnabled
  } = useContext(BudgetContext)
    return (
        
    <Box sx={{ minWidth: 120 }}>
    <FormControl fullWidth>
      <InputLabel id="event-type-label">ประเภทค่าใช้จ่าย</InputLabel>
      <Select
        labelId="event-type-label"
        id="event-type"
        value={eventType}
        label="ประเภทค่าใช้จ่าย"
        onChange = {
          e => {
            setSaveEnabled(true)
            Object.entries(e.target.value).map(([key, value]) => handleBasicInfoChanged(key, value))
            handleMainEventChanged('eventType', e.target.value.eventType)
            handleBasicInfoChanged('eventTypeName', e.target.value.name)
            //   ) handleBasicInfoChanged('eventType', e.target.value)
            // handleBasicInfoChanged('requiredbasiccosts', e.target.requiredbasiccosts)
          }
        }
      >
        <MenuItem key='-' >-</MenuItem>
        {EVENT_TYPES.map(t => (<MenuItem key={t.event} value={{
            eventType: t.event,
            name: t.name,
            types: (t.types && t.types.split(" ").map((type, index) => ({
              name: (t.typeNames && t.typeNames.split(" ")[index]) || "",
              type
            }))) || []
          }} >{t.name}</MenuItem>))}
      </Select>
    </FormControl>
  </Box>)
}