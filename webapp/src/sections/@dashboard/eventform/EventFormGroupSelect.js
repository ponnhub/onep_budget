import { useContext, useState } from 'react';
import { TableHead, Typography} from '@mui/material';
import NativeSelect from '@mui/material/NativeSelect';
import { Stack } from '@mui/system';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


import onepgroups from '../../../data/groupsPrefix.json';
// export default function EventFormDropdown() {
//   const handleChange = (event) => {
//     setAge(event.target.value);
//   };

// }


import EVENT_TYPES from '../../../data/event'
import { BudgetContext } from '../../../pages/EventFormPage';
import { AppContext } from '../../../App';

// @mui


export default function EventFormGroupSelect() {

  const {
    basicInfo,
    handleBasicInfoChanged
  } = useContext(BudgetContext)


  const { profile } = useContext(AppContext);


//   const [groups, setGroups] = useState([]);
  const [groupIndex, setGroupIndex] = useState((basicInfo && basicInfo.selectedGroupInfo && basicInfo.selectedGroupInfo.order) || (profile && profile.groupInfo && profile.groupInfo.onepgroup) || 0);
//   const group = groups[groupIndex]
//   const [onepgroup, setOnepgroup] = useState(onepgroups.find(g => g.order === groupIndex));

    return (
        
<Stack direction={'row'} sx={{ minWidth: 120 }}>
    <FormControl sx={{ m: 2}}>
    <InputLabel variant="standard" htmlFor="uncontrolled-native">
    หากต้องการเปลี่ยนกลุ่มงานให้เลือก
    </InputLabel>
    <NativeSelect
    defaultValue={groupIndex}
    onChange={e => handleBasicInfoChanged('selectedGroupInfo', onepgroups.find(u => u.order === e.target.value))}
    inputProps={{
        name: 'onepgroup',
        id: 'uncontrolled-native',
    }}
    >
        <option value="" />
        {onepgroups.map((g, index) => {
            const { order, unitName, unitType, docprefix } = g

            return <option key={index} value={order}>{[unitName, docprefix, `[${unitType}]`].join(" ")}</option>
            // {unitName ? [unitName, `[${unitType}]`].join(" ") : unitType}
        })}
    </NativeSelect>
    </FormControl>
  </Stack>)
}