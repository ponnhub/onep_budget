import { useContext, useState } from 'react';
import { TableHead } from '@mui/material';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

// export default function EventFormDropdown() {
//   const handleChange = (event) => {
//     setAge(event.target.value);
//   };

// }


import EVENT_TYPES from '../../../data/eventtype'
import { BudgetContext } from '../../../pages/EventFormPage';

// @mui

EventFormTypeToggle.propTypes = {


    type: PropTypes.string,
    handleBasicInfoChanged: PropTypes.func
    

}


export default function EventFormTypeToggle({
    type, types
}) {

  const { handleBasicInfoChanged } = useContext(BudgetContext)

    return (<ToggleButtonGroup
        value={type}
        exclusive
        onChange={e => handleBasicInfoChanged('type', e.target.value)}
        aria-label="text alignment"
        // fullWidth
      >
        {types.map((t, i) => (<ToggleButton key={t.type + i} value={t.type} aria-label="left aligned" color='primary'>
          {t.name}
        </ToggleButton>))}
        
      </ToggleButtonGroup>
    )
}

