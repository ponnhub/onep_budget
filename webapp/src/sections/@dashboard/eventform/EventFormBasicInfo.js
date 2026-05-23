import { useContext, useState } from 'react';
import { Stack } from '@mui/system';
import { Button, TableHead, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import UserPage from '../../../pages/UserPage';
import EventFormDateRange from './EventFormDateRange';
import EventFormInit from './EventFormInit';
import EventFormPersonCount from './EventFormPersonCount';
import EventFormTypeToggle from './EventFormTypeToggle';
import { BudgetContext } from '../../../pages/EventFormPage';
import EventCard from '../eventcard/EventCard';
import EventFormBudgetSelect from './EventFormBudgetSelect';
import EventFormGroupSelect from './EventFormGroupSelect';
// @mui

EventFormBasicInfo.propTypes = {

    basicInfo : PropTypes.object,
    handleBasicInfoChanged: PropTypes.func

}


export default function EventFormBasicInfo() {

    // const { currentActivity, } = props

    const [showUsersUI, setShowUsersUI] = useState(false);

    const { basicInfo, handleBasicInfoChanged} = useContext(BudgetContext);
    const { eventType } = basicInfo

    let timer

    if (!eventType) return (<>โปรดเลือกประเภทงานก่อน<EventFormInit eventType={eventType} /> </>)
    
    return showUsersUI 
        ? <UserPage 
        handleBasicInfoChanged={handleBasicInfoChanged} 
        basicInfo={basicInfo} 
        showUsersUI={showUsersUI} 
        setShowUsersUI={setShowUsersUI} />  
        
        : (
        <>
        {/* <Typography variant='caption'>{JSON.stringify(basicInfo)}</Typography>

        <Typography variant='caption'>{JSON.stringify(activity)}</Typography> */}

        <EventCard />
        <TextField fullWidth label="ชื่องาน" id="fullWidth" 
            defaultValue={basicInfo.title || basicInfo.eventTypeName} 
            onChange={e => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                handleBasicInfoChanged('title', e.target.value || '')
            }, 500);
            
            }} />
        
        <EventFormBudgetSelect handleBasicInfoChanged={handleBasicInfoChanged} />
        <EventFormDateRange />
        <TextField fullWidth label="สถานที่" id="fullWidth" defaultValue={basicInfo.place || ''} 
            onChange={e => {            
                if (timer) clearTimeout(timer);
                timer = setTimeout(() => {
                    handleBasicInfoChanged('place', e.target.value)
                }, 500);
            
            }} />

        <EventFormGroupSelect />
        <UserPage 
            handleBasicInfoChanged={handleBasicInfoChanged} 
            basicInfo={basicInfo} 
            showUsersUI={showUsersUI} 
            setShowUsersUI={setShowUsersUI} 
        />
        <Stack direction={{xs: 'column', sm: 'row'}} sx={{ p:1, m:1}} spacing={2}>
            {/* {types ? <EventFormTypeToggle type={type} types={types} /> : <></>} */}
            <EventFormPersonCount />      
        </Stack>    
    </>)
} 