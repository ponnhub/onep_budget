import { useContext, useState, useMemo, useRef } from 'react';

import PropTypes from 'prop-types';
import { Avatar, Box, Button, Card, CardHeader, IconButton, Paper, Stack, Typography, useTheme } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

import { MoreVertOutlined } from '@mui/icons-material';
import { red } from '@mui/material/colors';

import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { BudgetContext } from '../../../pages/EventFormPage';
import BudgetCalculator from '../../../services/budgetCalculator';
import useOnScreen from '../../../InstersectionObserver';
import { AppContext, THB } from '../../../App';
import DownloadPage from '../../../pages/DownloadPage';
import 'dayjs/locale/th';

const dayjs = require('dayjs')
const buddhistEra = require('dayjs/plugin/buddhistEra')
const LocalizedFormat = require('dayjs/plugin/localizedFormat')
const relativeTime = require('dayjs/plugin/relativeTime')

dayjs.extend(LocalizedFormat)
dayjs.extend(buddhistEra)
dayjs.extend(relativeTime)

EventCard.propTypes = { 

  basicInfo : PropTypes.object,
  event: PropTypes.object,
  setEditingEvent : PropTypes.func

}

export default function EventCard(props) {

    const theme = useTheme();

    const ref = useRef()

    const { setEditingEvent,  event} = props
    const { mainActivity, basicInfo } = event;

    const [paperElev, setPaperElev] = useState(1);

    const isVisible = useOnScreen(ref)

    // const activityTotal =  useMemo(() => {

    //   if (!basicInfo.type) return 0
    //   if (!activity) return 0
    //   const budgetCalculator = new BudgetCalculator()
    //   // const currentActivity = activity[basicInfo.type] && Object.values(activity[basicInfo.type])
    //   const total = budgetCalculator.eventBudget(basicInfo.type, currentActivity)
    //   return total
    // }, [basicInfo, activity])


    const mainActivityTotal =  useMemo(() => {

      if (!mainActivity || !basicInfo.eventType) return 0
      if (!mainActivity[basicInfo.eventType]) return 0

      const budgetCalculator = new BudgetCalculator()
      const currentMainActivity = mainActivity[basicInfo.eventType] && Object.values(mainActivity[basicInfo.eventType])
      const total = budgetCalculator.eventBudget({
        type: basicInfo.eventType,
        optionValues: basicInfo.optionValues,
        activity: currentMainActivity
      })
      return total
    }, [basicInfo, mainActivity])

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };



  return (
    <>

    <Paper ref={ref} elevation={paperElev}>
      <Card sx={{ minWidth: 120, minHeight : 320, bgcolor: 'transparent' }}
      onMouseOver={() => setPaperElev(12)}
      onMouseOut={() => setPaperElev(1)}
    >

      <CardHeader
        // avatar={
        //   <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
        //     R
        //   </Avatar>
        // }
        // action={
          // <IconButton aria-label="settings">
          //   <MoreVertOutlined />
          // </IconButton>
        // }
        style={{cursor: 'pointer'}}
        onClick={() => setEditingEvent(event)}
        title={ basicInfo && basicInfo.title || '[ชื่องาน]'}
        subheader={ event.updated && `แก้ไขล่าสุดเมื่อ ${dayjs().locale("th").to(dayjs(event.updated.toDate()))}`}
      />
      <CardContent sx={{ minWidth: 120, minHeight: 280}}
        style={{cursor: 'pointer'}}
        onClick={() => setEditingEvent(event)}  >
        <Stack direction={'column'}>
          {/* {basicInfo.title ? <></> : <Typography sx={{ fontSize: 14 }} color={theme.palette.text.secondary.contrastText} gutterBottom>
          ภาพรวมค่าใช้จ่ายกิจกรรมจะปรากฎที่นี่
        </Typography>} */}
        <Typography color={theme.palette.text.secondary}>
        {dayjs(basicInfo.startdate).isSame(dayjs(basicInfo.enddate) , 'day') ? `${dayjs(basicInfo.startdate).locale('th').format('วันddddที่ D MMMM พ.ศ.BBBB')}` : [dayjs(basicInfo.startdate).locale('th').format('วันddddที่ D MMMM พ.ศ.BBBB'), dayjs(basicInfo.enddate).locale('th').format('วันddddที่ D MMMM พ.ศ.BBBB')].join(" ถึง ") || '[ช่วงวัน]'}
        </Typography>
        <Typography sx={{  mb: 1.5, fontSize: 14 }} color={theme.palette.text.secondary} gutterBottom>
          รวม {basicInfo.daystotal || '-'} วัน
        </Typography>
        <Typography sx={{ mb: 1.5 }}  variant="body2">
        { basicInfo.place || '[สถานที่]'}
        </Typography>
        <Typography variant="body2">
        { `จำนวนผู้เข้าร่วม ${basicInfo.personCount || basicInfo.onepusers.length} คน`}
        </Typography>

        <Box flexGrow={1} />
        <Paper style={{ display: 'inline-block'}}  elevation={6} sx={{ m : 0.1, mt:1, p : 0.5, bgcolor:'primary.dark'}}>ค่าใช้จ่ายรวม {THB(mainActivityTotal)}</Paper>

        {/* <Typography variant="body">
        ค่าใช้จ่ายรวม {THB(activityTotal + mainActivityTotal)}
        </Typography> */}
         {/* */}         
        </Stack>

      </CardContent>
      <CardActions>
        {/* <Button variant="contained" size="small" startIcon={<PictureAsPdfIcon />}>ส่งออก PDF</Button> */}
        <Button variant="outlined" size="small" color='primary' endIcon={<TextSnippetIcon />} onClick={handleClickOpen}>ส่งออก DOCX</Button>

        <Button variant="contained" size="small" color='secondary' onClick={handleClickOpen}>ส่งร่างตรวจ</Button>

      </CardActions>
      {/* <Typography variant="caption" color={'lightgrey'}>

        </Typography> */}
    </Card>
</Paper>

    <DownloadPage
      open={open}
      onClose={handleClose}
      event={props.event}
    />
  </>
  );
}
