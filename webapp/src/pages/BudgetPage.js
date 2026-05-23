import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useContext, useEffect, useRef, useState } from 'react';
// @mui
import {
  Card,
  Stack,
  Button,
  Popover,
  MenuItem,
  Container,
  Typography,
  Paper,
  Skeleton,
  Chip,
} from '@mui/material';


import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


// components
import Iconify from '../components/iconify';
// sections
import { BudgetListToolbar } from '../sections/@dashboard/budget';
// mock
// import USERLIST from '../_mock/user';
import BUDGETLIST from '../data/budget'
import DataService from '../services/dataservice';
import { ONEP_PLAN_COLORS, ONEP_PLAN_KEYS } from '../data/constants';
import { AppContext, THAINUMBER_NO_SEPARATOR } from '../App';



// ----------------------------------------------------------------------
const BUDGET_HEADERS = {
    projects : 'โครงการ',
    activities : 'กิจกรรมหลัก',
    subactivities : 'กิจกรรมย่อย'
}
// ----------------------------------------------------------------------


// ----------------------------------------------------------------------




export default function BudgetPage() {

  const { profile } = useContext(AppContext)

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [planInfo, setPlanInfo] = useState("");

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [expanded, setExpanded] = useState(false);

  const ds = new DataService()


  const queryName = useRef()

  const [queryNameDone, setQueryNameDone] = useState(true);

  const [editingName, setEditingName] = useState(false);

  const getBestMatchedPlan = () => {

    const text = queryName.current.value
    if (!queryName.current.value || !text) return setEditingName(false)

    // console.log('text', text);
    setQueryNameDone(false)
    // setEditingName(true)

    ds.getPlanWithNameQuery(text)
    .then( planpath  => {
      // console.log(planpath);
      if (planpath) {
        // queryName.current.value = planpath
        setPlanInfo(planpath)
      }
      setQueryNameDone(true)
    })
    .catch(e => {
      console.log(e);
    })
    return undefined
  }
  const handleChange = (panel) => (event, isExpanded) => {
    // console.log(panel);
    setExpanded(isExpanded ? panel : false);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };



//   const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

//   const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

//   const isNotFound = !filteredUsers.length && !!filterName;


if (!profile || (profile && !profile.groupInfo) || (profile && profile.groupInfo && !profile.groupInfo.approved)) {
  return <>กรุณากดสมัครใช้งานจากกลุ่มไลน์ของท่านก่อน</>
}

  return (
    <>
      <Helmet>
        <title> รหัสงบประมาณ | โปรแกรมอนุมัติค่าใช้จ่าย </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
          รหัสงบประมาณ
          </Typography>
        </Stack>

        <Card>
          <BudgetListToolbar numSelected={selected.length} filterName={filterName} onFilterName={getBestMatchedPlan} queryName={queryName} setEditingName={setEditingName} />

            <div>

                {/* ผลผลิต  */}
                {editingName ?
                 <Paper elevation={6} sx={{ p:2, m:2}}>

                  {queryNameDone ? <>
                    {planInfo && planInfo.budgetplancodes && <Typography>รหัส {planInfo.budgetplancodes}</Typography>}
                  {planInfo && planInfo.planresolved && <div>
                    {Object.entries(planInfo.planresolved)
                    .map(([key, value]) => (<Typography key={key} color={ONEP_PLAN_COLORS[key]}>{ONEP_PLAN_KEYS[key]}: {value}</Typography>))}
                </div>}
                </>
                : <Skeleton variant="rectangular" animation='wave' />}



                </Paper>

                : Object.entries(BUDGETLIST).map(([product, details], index) => 

                  // console.log('product', product);
                  // console.log('details', details);

                     (<Accordion key={product + index} expanded >
                    {/* onChange={handleChange(`panel${product}`)} */}

                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel${product}bh-content`}
                            id={`panel${product}bh-header`}
                            >
                            {/* <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                {product}
                            </Typography> */}
                            <Stack spacing={1} direction={'row'}>
                              <Chip label={product} style={{ backgroundColor: ONEP_PLAN_COLORS.products, fontSize: 'x-large'}} />
                              <Typography sx={{ color: 'text.secondary' }}>{details.name}</Typography>
                            </Stack>
                          </AccordionSummary>
                            <AccordionDetails>

                                {/* กิจกรรมหลัก หรือ โครงการ */}
                            {['activities', 'projects']
                            .map(maintype => {

                                const activities =  details[maintype]

                                // console.log('details[type]',maintype, details[maintype]);

                                if (!activities) return <></>

                                return Object.entries(activities)

                                .map(([code, entries], index) => {


                                    Object.keys(BUDGET_HEADERS)
                                        .map(type => {

                                          // console.log('code entries', code, entries);
                                          // console.log('type', type);

                                            const activities =  entries[type]

                                            if (!activities) return <></>

                                            return Object.entries(activities)

                                            .map(([code, entries], index) => 

                                              // console.log('entries', entries);


                                                (

                                                    <Accordion key={code + index}  expanded={expanded === `panel${code}`} onChange={handleChange(`panel${code}`)}>
                                                        <AccordionSummary
                                                            expandIcon={<ExpandMoreIcon />}
                                                            aria-controls={`panel${code}bh-content`}
                                                            id={`panel${code}bh-header`}
                                                            >
                                                            <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                                                {code}
                                                            </Typography>
                                                            <Typography sx={{ color: 'text.secondary' }}>{entries.name}</Typography>
                                                            </AccordionSummary>
                                                        <AccordionDetails>



                                                            {!entries.subactivities
                                                            ? <Typography>เลือก {entries.name}
                                                                </Typography>
                                                                : <Stack key={`${type}${code}`} direction={'column'} sx={{m:1}}>
                                                                  {Object.entries(entries.subactivities).map( ([subcode, details]) => 
                                                                  // console.log('subcode', subcode);
                                                                  // console.log('details', details);
                                                                     (<Stack key={subcode} spacing={1} direction={'row'}>
                                                                              <Chip label={subcode} sx={{ bgcolor : code === THAINUMBER_NO_SEPARATOR(entries.code)  ? 'primary.light' : ONEP_PLAN_COLORS.subactivities, color : expanded === `panel${code}` ? 'text.primary' : 'text.secondary'  }} style={{ fontSize : 'medium'}} />
                                                                              <Typography sx={{ color: 'text.secondary' }}>{details.name}</Typography>
                                                                          </Stack>
                                                                    ))}
                                                                  </Stack>
                                                                  

                                                            }

                                                        </AccordionDetails>
                                                    </Accordion>

                                                )
                                            )

                                        })

                                    return(

                                        <Accordion key={code + index}  expanded={expanded === `panel${code}`} onChange={handleChange(`panel${code}`)}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls={`panel${code}bh-content`}
                                                id={`panel${code}bh-header`}
                                                >

                                                <Stack spacing={1} direction={'row'}>
                                                  <Chip label={code} sx={{ bgcolor : expanded === `panel${code}` ? 'primary.main' : ONEP_PLAN_COLORS[maintype], color : expanded === `panel${code}` ? 'text.primary' : 'text.secondary'  }} style={{ fontSize : maintype === 'subactivities' ? 'small' : 'large' }}  />
                                                  <Typography sx={{ color:  expanded === `panel${code}` ? 'text.primary'  : 'text.secondary' }}>{entries.name}</Typography>
                                                </Stack>
                                                </AccordionSummary>
                                            <AccordionDetails>

                                                {!entries.subactivities
                                                ? entries.activities  && Object.entries(entries.activities).map( ([subcode, details]) => 
                                                  // console.log('subcode', subcode);
                                                  // console.log('details', details);

                                                     (

                                                      <Stack key={subcode} direction={'row'} spacing={1} sx={{m:1}}>

                                                        <Chip label={subcode} sx={{ bgcolor : code === THAINUMBER_NO_SEPARATOR(entries.code)  ? 'primary.light' : ONEP_PLAN_COLORS.activities, color : expanded === `panel${code}` ? 'text.primary' : 'text.secondary'   }} style={{ fontSize : 'medium'}} />                                                        <Typography variant='p'>{details.name}</Typography>

                                                    {entries.subactivities && 
                                                    <Stack key={subcode} direction={'column'} sx={{m:1}}>
                                                    {Object.entries(entries.subactivities).map( ([subcode, details]) => 
                                                      // console.log('subcode', subcode);
                                                      // console.log('details', details);

                                                       (<Stack key={subcode} direction={'row'} spacing={1} sx={{m:1}}>
                                                        <Chip label={subcode} sx={{ bgcolor : code === THAINUMBER_NO_SEPARATOR(entries.code)  ? 'primary.light' : ONEP_PLAN_COLORS.subactivities, color : expanded === `panel${code}` ? 'text.primary' : 'text.secondary'  }} />
                                                        <Typography variant='p'>{details.name}</Typography>
                                                      </Stack>                                                     
                                                      
                                                      )
                                                        )}</Stack>}
                                                      </Stack>
                                                    )
                                                  )
                                                    : <Stack direction={'column'} sx={{m:1}}>

                                                    {Object.entries(entries.subactivities).map( ([subcode, details]) => 
                                                        // console.log('subcode, details', subcode, details);
                                                         (<Stack key={`subactivities${subcode}`} spacing={1} direction={'row'} sx={{m:1}}>
                                                          <Chip label={subcode} sx={{ bgcolor : code === THAINUMBER_NO_SEPARATOR(entries.code)  ? 'primary.light' : ONEP_PLAN_COLORS.subactivities, color : expanded === `panel${code}` ? 'text.primary' : 'text.secondary'  }} />
                                                          <Typography variant='p'>{details.name}</Typography>

                                                        </Stack>)
                                                )}

                                                    </Stack>

                                                }

                                            </AccordionDetails>
                                        </Accordion>

                                    )
                                })

                            })}

                        </AccordionDetails>
                    </Accordion>)
                )}

            </div>
        </Card>
      </Container>

      <Popover
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
      </Popover>
    </>
  );
}
