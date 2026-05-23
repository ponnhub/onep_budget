import { Helmet } from 'react-helmet-async';
import { redirect, useNavigate } from "react-router-dom";
import { filter } from 'lodash';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import 'dayjs/locale/th';

// @mui
import {
  Card,
  Stack,
  Button,
  Container,
  Typography,
  Snackbar,
  Alert,
  Skeleton,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { EventFormBasicInfo, EventFormMainEventSlotFilling, SlotGuide } from '../sections/@dashboard/eventform';

// data

import typeData from '../data/typeData';
import HTTPService from '../services/httpservice';
import { AppContext, THAINUMBER, THAINUMBER_NO_SEPARATOR } from '../App';
import useAsync from '../hooks/useAsync';
import BudgetCalculator from '../services/budgetCalculator';


const buddhistEra = require('dayjs/plugin/buddhistEra')
const LocalizedFormat = require('dayjs/plugin/localizedFormat')

dayjs.extend(LocalizedFormat)
dayjs.extend(buddhistEra)


// mock
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'company', label: 'Company', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'isVerified', label: 'Verified', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export const BudgetContext = createContext(null);

EventFormPage.propTypes = {
  event: PropTypes.object
}

export default function EventFormPage(props) {

  const navigate = useNavigate();

  const { profile, setCardTotal} = useContext(AppContext)

  const [open, setOpen] = useState(false);

  const [showDelete, setShowDelete] = useState(false);

  const [detailedCalculations, setDetailedCalculations] = useState(true);

  const [page, setPage] = useState(0);

  const openSnackbar = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleOpenDelete = () => {
    setShowDelete(true);
  };

  const handleCloseDelete = () => {
    setShowDelete(false);
  };
  

  const [basicInfo, setBasicInfo] = useState({
    startdate: dayjs().startOf('day'),
    enddate: dayjs().startOf('day'),
    daystotal: 1,
    onepusers : [] 
    
    // (profile && profile.fullname) ? [{id:1,
    //   fullname: profile.fullname,
    //   position: profile && profile.position,
    //   positionType: profile && profile.positionType
    // }] : []
  });

  const saveEvent = () => {
    
    setIsLoading(true)
    // console.log('saving event');
    const budgetCalculator = new BudgetCalculator()

    return new Promise((resolve, _) => {
      const httpservice = new HTTPService()      
      
      let total = 0
      
      // if (activity && basicInfo.type) total += budgetCalculator.eventBudget(basicInfo.type, activity[basicInfo.type])
      if (mainActivity && basicInfo.eventType) total += budgetCalculator.eventBudget({
        type: basicInfo.eventType,
        optionValues: basicInfo.optionValues,
        activity: mainActivity[basicInfo.eventType]
      })

      // console.log('old basicInfo', basicInfo);
      const params = {
        basicInfo: {
          ...basicInfo,
          fields: basicInfo.fields
            .filter(f => f && f.name && (f.explicitHeader || (f.calculations && f.calculations.length)))
            .map((f, index) => ({...f, index: THAINUMBER(index + 1)})),
          title: basicInfo.title || [basicInfo.eventTypeName, basicInfo.place].join(" "),
          startdate: basicInfo.startdate.valueOf(),
          enddate: basicInfo.enddate.valueOf()
        },
        mainActivity,
        profile,
        budget: total,
        editedMonthyear: dayjs().locale('th').format('MMMM BBBB'),
        budgetYear: THAINUMBER_NO_SEPARATOR(dayjs().add((dayjs().month() > 8) ? 1 : 0, 'year').locale('th').format('BBBB'))
      }      

      
      // if (mainActivity) params.mainActivity = mainActivity
      // if (activity && activity.length) params.activity = activity

      if (editing && props && props.event && props.event.id) params.id = props.event.id



      httpservice.addActivity(params)
      .then(eventId => {
        // setActivity(null)
        setMainActivity(null)
        // setCurrentActivity(null)
        setCurrentMainActivity(null)

        const { setForceRefresh } = props
        if (setForceRefresh) setForceRefresh(true)


        resolve(eventId)
        setIsLoading(false)


        navigate("/dashboard/event",);

      })
      .catch(e => {
        console.log(e);
        openSnackbar()
      })
    });
  };

  const deleteEvent = () => {

    const params = {}
    if (editing && props && props.event && props.event.id) {
      params.eventId = props.event.id
      params.userId = props.event.profile.userId    
    }

    if (!params) return undefined

    return new Promise((resolve, reject) => {
      const httpservice = new HTTPService()
    

      httpservice.deleteEvent(params)
      .then(_ => {
        
        // setActivity(null)
        setMainActivity(null)
        // setCurrentActivity(null)
        setCurrentMainActivity(null)

        const { setForceRefresh } = props
        if (setForceRefresh) setForceRefresh(true)


        resolve(params.eventId)
        setIsLoading(false)


        navigate("/dashboard/app",);



      })

    })
  }

  const [order, setOrder] = useState('asc');

  // const [activity, setActivity] = useState();

  // const [currentActivity, setCurrentActivity] = useState({});

  const [mainActivity, setMainActivity] = useState();

  const [currentMainActivity, setCurrentMainActivity] = useState({});

  const [selected, setSelected] = useState([]);

  const [isLoading, setIsLoading] = useState(props && props.event);

  const [editing, setEditing] = useState(false);

  const [saveLabel, setSaveLabel] = useState("บันทึก");

  const [saveEnabled, setSaveEnabled] = useState(false);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { execute, status, value, error } = useAsync(saveEvent, false);

  useEffect(() => {    
    if (!profile) redirect('login')
  }, [profile]);

  
  useEffect(() => {

    if (isLoading && props && props.event) {
      
      const { event } = props
      
      if (event.basicInfo) {

        const { basicInfo } = event
        basicInfo.startdate = dayjs(basicInfo.startdate)
        basicInfo.enddate = dayjs(basicInfo.enddate)
        
        setBasicInfo(basicInfo)
        if (basicInfo.eventType && event.mainActivity && event.mainActivity[basicInfo.eventType]) {
          const { eventType } = basicInfo
          const mainActivity = event.mainActivity[eventType]
          setCurrentMainActivity(Array.isArray(mainActivity) ? mainActivity : Object.values(mainActivity))
        }
        // if (basicInfo.type && event.activity ) {

          
        //   // && event.activity[basicInfo.type]
        //   const { type } = basicInfo
        //   // const activity = event.activity[type]
        //   // setCurrentActivity(Array.isArray(activity) ? activity : Object.values(activity))
        //   // setActivity(event.activity)
          
        // }
        
      } 
      setSaveEnabled(true)
      setSaveLabel("อัพเดต")
      setEditing(true)
      setIsLoading(false)
    }
  }, [props]);

  useEffect(() => {
    
    // console.log('basicInfo', basicInfo);
    setSaveEnabled(basicInfo && basicInfo.budget > 0)

  }, [basicInfo]);

  useEffect(() => {
    window.addEventListener("beforeunload", setCardTotal(<></>));

    return () => {

      window.removeEventListener("beforeunload", setCardTotal(<></>));
    };
  }, []);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleBasicInfoChanged = (key, value) => {

    setBasicInfo(o => ({
      ...o,
      [key]: value
    }))

    // if (key === 'type'){
    //   const type = value

    //   // if (activity && activity[type]) {

    //   //   console.log('setActivity in handleBasicInfoChanged key === type');
    //   //   setActivity(o => ({
    //   //     ...o,
    //   //     [type] : activity[type]
    //   //   }))
    //   //   setCurrentActivity(Array.isArray(activity[type]) ? activity[type] : Object.values(activity[type]))
    //   // } else if (typeData(type)) {
    //   //   console.log('====================================');
    //   //   console.log('type in handleBasicInfoChanged', type);
    //   //   console.log('====================================');
    //   //   setActivity(o => ({
    //   //     ...o,
    //   //     [type] : typeData(type)
    //   //   }))
    //   //   setCurrentActivity(typeData(type))
    //   // }

    //   // setActivity(basicInfo[value] || typeData(value))
    // }
    // if (['startdate', 'enddate'].includes(key)) {

    // }
  }

  const handleMainEventChanged = (key, value) => {

    if (mainActivity && mainActivity[value]) {
      setMainActivity(o => ({
        ...o,
        [value] : mainActivity[value]
      }))
      setCurrentMainActivity(Array.isArray(mainActivity[value]) ? mainActivity[value] : Object.values(mainActivity[value]))
    } else {
      setMainActivity(o => ({
        ...o,
        [value] : typeData(value)
      }))
      setCurrentMainActivity(typeData(value))
    }
  }

  // const prependObjectInArray = (type, field, index) => {

  //   console.log('field', field);
  //   console.log('index', index);

  //   setCurrentActivity(o =>
  //     [...o.slice(0, index),
  //     field,
  //     ...o.slice(index)])
  // }

  const prependMainActivitiesObjectInArray = (type, field, index) => {

    // console.log('field', field);
    // console.log('index', index);

    setCurrentMainActivity(o =>
      [...o.slice(0, index),
      field,
      ...o.slice(index)])
  }

  // useEffect(() => {

  //   console.log('basicInfo', basicInfo);
  //   if (basicInfo && basicInfo.type) setActivity(o => ({
  //     ...o,
  //     [basicInfo.type] : currentActivity
  //   }))

  // }, [basicInfo, currentActivity]);


  useEffect(() => {


    if (basicInfo && basicInfo.eventType && currentMainActivity) setMainActivity(o => ({
      ...o,
      [basicInfo.eventType] : currentMainActivity
    }))

  }, [basicInfo, currentMainActivity]);



  // const removeObjectFromArray = (type, index) => {

  //   console.log('type', type);
  //   console.log('index', index);
  //   // console.log('field.multiplicable', field.multiplicable);

  //   setCurrentActivity(o => o.filter((_, i) => (i !== index)))
  //   // if (field.multiplicable) {
  //   //   setCurrentActivity(o => o.filter(e => (e.timestamp ? e.timestamp !== field.timestamp : e.numbering !== field.numbering)))
  //   // } else {
  //   //   setCurrentActivity(o => o.map(e => (e.timestamp ? e.timestamp === field.timestamp : e.numbering === field.numbering) ? {...e, included: false} : e))
  //   // }
  //   // setActivity(o => ({
  //   //   ...o,
  //   //   [type] : currentActivity
  //   // }))

  // }

  const removeMainActivitiesObjectFromArray = (type, index) => {

    // console.log('type', type);
    // console.log('index', index);
    // console.log('field.multiplicable', field.multiplicable);

    setCurrentMainActivity(o => o.filter((_, i) => (i !== index)))
    // if (field.multiplicable) {
    //   setCurrentActivity(o => o.filter(e => (e.timestamp ? e.timestamp !== field.timestamp : e.numbering !== field.numbering)))
    // } else {
    //   setCurrentActivity(o => o.map(e => (e.timestamp ? e.timestamp === field.timestamp : e.numbering === field.numbering) ? {...e, included: false} : e))
    // }
    // setMainActivity(o => ({
    //   ...o,
    //   [type] : currentMainActivity
    // }))

  }

  

  useEffect(() => {
    window.onhashchange = () => {
      // console.log('====================================');
      // console.log('blah blah blah');
      // console.log('====================================');
     }

     window.addEventListener('popstate', (event) => {
      // console.log('====================================');
      // console.log(event);
      // console.log('====================================');
      // window.location.replace(`YOUR URL`);
   });

    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, []);

  const alertUser = (e) => {
    e.preventDefault();

    console.log('ผู้ใช้ต้องการออกจากหน้าแก้ไขร่าง');

    e.returnValue = "";
  };

  // const handleBudgetSlotfilled = (type, field) => {

  //   if (!activity || (activity && !activity[type])) {
  //     console.log('OH IT happends');

  //   } else {
  //     const toUpdateField = Object.values(activity[type]).findIndex(e => (e.timestamp ? e.timestamp === field.timestamp : e.numbering === field.numbering))

  //     console.log('setActivity in handleBudgetSlotfilled');
  //     setActivity(o => ({
  //       ...o,
  //       [type]: {
  //         ...o[type] ? o[type] : {},
  //         // ...o[type] ? Array.isArray(o[type]) ? o[type].filter(e => e.included) : Object.values(o[type]).filter(e => e.included) : {},
  //         [toUpdateField] : field
  //       }
  //     }))
  //     // setCurrentActivity(o => (o.map((a, i) => {
  //     //   return i === toUpdateField ? field : a
  //     // })))
  //   }
  // }
  const handleMainEventSlotfilled = (type, field) => {

    if (!mainActivity || !mainActivity[type]) {
      // console.log('OH IT happends');
      // setActivity(o => ({
      //   ...o[value] ? o[value] : {},
      //   [value] : mainActivity[value]
      // }))

      // setActivity(o => ({
      //   ...o[type] ? o[type] : {},
      //   [type]: field
      // }))

    } else {
      const toUpdateField = Object.values(mainActivity[type]).findIndex(e => (e.timestamp ? e.timestamp === field.timestamp : e.numbering === field.numbering))
      setMainActivity(o => ({
        ...o,
        [type]: {
          ...o[type] ? o[type] : {},
          [toUpdateField] : field
        }
      }))
      // setCurrentMainActivity(o => (o.map((a, i) => i === toUpdateField ? field: a)))
    }
  }

  const fieldsLabelInfo = useMemo(() => {
    // console.log('basicInfo.fields', basicInfo.fields);
    if (basicInfo && basicInfo.fields  && Object.values(basicInfo.fields).length) return (<Stack key="listoffields">
    {(() => {

      let index = 0

      return Object.values(basicInfo.fields).map((f, i) => <div key={i}>
      {f.subtotal 
        ? !f.calculation || f.explicitHeader
          ? (() => {
    
            index += 1
            return (<Typography variant='p'>{THAINUMBER(index) || f.index}. {f.name} {f.calculation} เป็นเงิน {f.subtotal} บาท</Typography>)
    
          })()
          :<Typography variant='p'> - {f.calculation}</Typography>
          // {f.onlyShowSubtotal ? `เป็นเงิน ${f.subtotal} บาท` : ''}
        :<></> }
       {/* เป็นเงิน {f.subtotal} บาท */}

        </div>)

    })()}</Stack>)
    return <>[เพิ่มข้อมูลรายการด้านล่าง]</>
  }, [basicInfo])



  if (!profile || (profile && !profile.groupInfo) || (profile && profile.groupInfo && !profile.groupInfo.approved)) {
    return <>กรุณากดสมัครใช้งานจากกลุ่มไลน์ของท่านก่อน</>
  }

  return (
    <>
      <Helmet>
        <title> รายการอนุมัติ | โปรแกรมอนุมัติค่าใช้จ่าย </title>
      </Helmet>

      {isLoading ? <> 
      {/* <Skeleton animation="wave" /> */}

      <Paper sx={{ height:200, width: '90%', mt: 10}}>
        <Stack spacing={2}>

          <Skeleton variant="rectangular" animation='wave' height={180} />
          <Skeleton variant="rectangular" animation='wave' />
          <Skeleton variant="rectangular" animation='wave' height={180} />
          <Skeleton variant="rectangular" animation='wave' height={100} />
          <Skeleton variant="rectangular" animation='wave' height={100} />
          <Skeleton variant="rectangular" animation='wave' height={100} width={'80%'} />

        </Stack>
      </Paper>
     

      </> 

      : <Container>
        <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            รายการอนุมัติ
          </Typography>
          <Box flexGrow={1} />
          <Button onClick={() => {
              const { setForceRefresh } = props
              if (setForceRefresh) setForceRefresh(true);
              setIsLoading(false)
              navigate("/dashboard/event",);
            }} 
            variant="outlinded">
            ยกเลิก
          </Button>
          {/* {editing && props && props.event && props.event.id} */}
          {editing && props && props.event && props.event.id && <Button onClick={handleOpenDelete}  variant="outlined" color='warning' startIcon={<Iconify icon="material-symbols:delete-outline" color="red" />}>
            ลบ
          </Button>}
          <Button onClick={execute} variant="contained" disabled={!saveEnabled} startIcon={<Iconify icon="eva:save-fill" />}>
            {saveLabel}
          </Button>
        </Stack>

        <Card>
          {/* <EventFormToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}
          {/* {JSON.stringify(profile)} */}
          {/* <div>
            {status === "idle" && <div>Start your journey by clicking a button</div>}
            {status === "success" && <div>{value}</div>}
            {status === "error" && <div>{error}</div>}
            <button onClick={execute} disabled={status === "pending"}>
              {status !== "pending" ? "Click me" : "Loading..."}
            </button>
          </div> */}
          <Scrollbar>
            <BudgetContext.Provider value = {
              {
                mainActivity,
                currentMainActivity,
                basicInfo,
                handleBasicInfoChanged,
                handleMainEventChanged,
                handleMainEventSlotfilled,
                setSaveEnabled,
                prependMainActivitiesObjectInArray,
                removeMainActivitiesObjectFromArray,
                detailedCalculations
              }
            } >
              <Stack spacing={2} sx={{ p: 3 }} >
                <EventFormBasicInfo basicInfo={basicInfo} />
                <SlotGuide currentMainActivity={basicInfo[basicInfo.eventType] || typeData(basicInfo.eventType)} />
                {/* <EventFormBudgetSlotFilling currentActivity={currentActivity} /> */}

                {basicInfo && basicInfo.eventType && <Paper elevation={6} sx={{ p:2, m:1, borderColor: 'grey.500'  }}>
                  <Typography>ตัวอย่างที่จะปรากฏในหน้ารายงาน</Typography>
                  {fieldsLabelInfo}
                </Paper>}
                <EventFormMainEventSlotFilling currentMainActivity={currentMainActivity} />
              </Stack>
            </BudgetContext.Provider>

          </Scrollbar>

          {/* <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
        </Card>

        <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
          <Alert severity="error" sx={{ width: '100%' }}>เกิดข้อผิดพลาดในการบันทึก!</Alert>
        </Snackbar>


      <Dialog
        open={showDelete}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"ลบร่าง"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`ยืนยันการลบร่างนี้?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>ปิด</Button>
          <Button variant='contained' color='warning' onClick={deleteEvent} autoFocus>
            ลบ
          </Button>
        </DialogActions>
      </Dialog>


        {/* <Prompt
          when={true}
          message={location =>
            `Are you sure you want to go to ${location.pathname}`
          }
        /> */}
        

      </Container>}

      {/* <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover> */}
    </>
  );
}
