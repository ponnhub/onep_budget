import { useContext, useState, useEffect, useMemo, useRef } from 'react';

import { Box, Button, Card, Paper, Typography, useTheme } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { BudgetContext } from '../../../pages/EventFormPage';
import BudgetCalculator from '../../../services/budgetCalculator';
import useOnScreen from '../../../InstersectionObserver';
import { AppContext, THB } from '../../../App';

const dayjs = require('dayjs')
const buddhistEra = require('dayjs/plugin/buddhistEra')
const LocalizedFormat = require('dayjs/plugin/localizedFormat')

dayjs.extend(LocalizedFormat)
dayjs.extend(buddhistEra)


export default function EventCard() {

  // const  { currentActivity } = props

    const { currentMainActivity, basicInfo, handleBasicInfoChanged } = useContext(BudgetContext);
    const { setCardTotal} = useContext(AppContext)
    const theme = useTheme();
    
    const cardRef = useRef()
    const cardIsVisible = useOnScreen(cardRef)
  
    // const activityTotal =  useMemo(() => {
    //   const budgetCalculator = new BudgetCalculator()
    //   const total = budgetCalculator.eventBudget(basicInfo.type)
    //   return total
    // }, [basicInfo, currentActivity])


    const mainActivityTotal =  useMemo(() => {

      if (!basicInfo.eventType) return 0
      const budgetCalculator = new BudgetCalculator()
      const total = budgetCalculator.eventBudget({
        type: basicInfo.eventType,
        optionValues: basicInfo.optionValues,
        activity: currentMainActivity
      })
      return total
    }, [basicInfo, currentMainActivity])

    useEffect(() => {
      // const total =  mainActivityTotal            
      setCardTotal(cardIsVisible || mainActivityTotal === 0 ? "" : <Paper elevation={6} sx={{ m : 2, p : 1, bgcolor:'primary.dark'}}>ค่าใช้จ่ายรวม {THB(mainActivityTotal)}</Paper>)
      handleBasicInfoChanged('budget', mainActivityTotal)
    }, [mainActivityTotal, cardIsVisible]);

    
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

  return (
    <>
    <Card ref={cardRef} sx={{ minWidth: 180, bgcolor: 'transparent' }}>
      <CardContent>
        {basicInfo.title ? <></> : <Typography sx={{ fontSize: 14 }} color={theme.palette.text.secondary.contrastText} gutterBottom>
          ภาพรวมค่าใช้จ่ายกิจกรรมจะปรากฎที่นี่
        </Typography>}
        <Typography sx={{  mb: 1.5 }}  variant="h5" component="div">
          { basicInfo.title || '[ชื่องาน]'}
        </Typography>
        <Typography color={theme.palette.text.secondary}>
        {basicInfo.startdate.isSame(basicInfo.enddate , 'day') ? `${basicInfo.startdate.locale('th').format('วันddddที่ D MMMM พ.ศ.BBBB')}` : [basicInfo.startdate.locale('th').format('วันddddที่ D MMMM พ.ศ.BBBB'), basicInfo.enddate.locale('th').format('วันddddที่ D MMMM พ.ศ.BBBB')].join(" ถึง ") || '[ช่วงวัน]'}
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
        
         
        <Paper style={{ display: 'inline-block'}} elevation={6} sx={{ m : 2, p : 1, bgcolor:'primary.dark'}}>ค่าใช้จ่ายรวม {THB(mainActivityTotal)}</Paper>
{/*         
        <Typography variant="body">
        ค่าใช้จ่ายรวม {THB(activityTotal + mainActivityTotal)}
        </Typography> */}
      </CardContent>
      {/* <CardActions>        
        <Button variant="contained" size="small" color='secondary' endIcon={<TextSnippetIcon />} onClick={handleClickOpen}>ส่งออก </Button>
      </CardActions> */}
    </Card>

    {/* <DownloadPage
      open={open}
      onClose={handleClose}
      event={}
    /> */}
</>
  );
}
