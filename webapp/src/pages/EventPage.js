import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useMemo, useState } from 'react';

// @mui
import {
  Stack,
  Button,
  Container,
  Typography,
  Box,
} from '@mui/material';


import HTTPService from '../services/httpservice';
import { AppContext, MaxPageEvents } from '../App';

// components
import Iconify from '../components/iconify';

// sections
import EventList from '../sections/@dashboard/event/EventList';

// mock
import useAsync from '../hooks/useAsync';
import EventFormPage from './EventFormPage';


export default function EventPage() {

  const { profile } = useContext(AppContext)

  const [events, setEvents] = useState();

  const [eventsCount, setEventsCount] = useState(0);

  const [page, setPage] = useState(1);

  const [forceRefresh, setForceRefresh] = useState(false);

  const [editingEvent, setEditingEvent] = useState();

  const [lastActivity, setLastActivity] = useState({});

  const handlePageChange = (_, page) => {
    console.log(page);
  }

  const loadEvents = () => new Promise((resolve) => {
      const httpservice = new HTTPService()
      if (!profile) resolve([])
      
      httpservice.readActivity({
        profile, 
        lastActivity
      }).then(results => {
        console.log(results.length);

        
        setEvents(results)
        setLastActivity([...results].pop())
        resolve(results)
      })
    });

  const loadEvent = (eventId)  => new Promise((resolve) => {
      const httpservice = new HTTPService()
      // if (!profile) resolve([])
      httpservice.readEvent({
        eventId
      }).then(result => {

        // console.log('newer basicInfo', result.basicInfo);

        setEvents(o => o.map(a => (a.id === eventId) ? result : a))

        setEditingEvent(null)
        // highlightEdited(editingEvent.id)
        resolve(result)
      })
    })

  const { execute } = useAsync(loadEvents, false);

  useEffect(() => {
    const httpservice = new HTTPService()
    if (!profile) return
    
    httpservice.readUserEvents({
      userId: profile.userId
    }).then( result => setEventsCount(result.count))

  }, [profile]);

  useEffect(() => {
    if (!events) {
      execute()
    }
  }, [events, lastActivity]);


  useEffect(() => {
    if (events && events.length) {
      console.log('setting last activity');
      setLastActivity([...events].pop())
      execute()
    }
  }, [page]);

  useEffect(() => {

    if (editingEvent && forceRefresh) {
      setForceRefresh(false)
      loadEvent(editingEvent.id)
    }

  }, [editingEvent && forceRefresh ]);


  const eventslist = useMemo(() => {
    console.log(events && events.map(e => e.updated));
    return (<EventList events={ events } setEditingEvent={setEditingEvent} />
      )}, [events])
  
  if (!profile || (profile && !profile.groupInfo) || (profile && profile.groupInfo && !profile.groupInfo.approved)) {
    return <>กรุณากดสมัครใช้งานจากกลุ่มไลน์ของท่านก่อน</>
  }

  return (
    <>
      <Helmet>
        <title> รายการอนุมัติ | โปรแกรมอนุมัติค่าใช้จ่าย </title>
      </Helmet>

      <Container>

      {editingEvent

      ? <EventFormPage event={editingEvent} setForceRefresh={setForceRefresh}  />
      :<>


        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            รายการอนุมัติ
          </Typography>
          <Button component={Link} to="/dashboard/eventform"  variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            ร่างรายการอนุมัติใหม่
          </Button>
        </Stack>
        {events && events.length ? <Typography variant="p"  align='right'>แสดง {events.length} จากทั้งหมด {eventsCount} ร่าง</Typography> : <>ยังไม่มีร่าง</>}

        {/* <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack> */}


        {eventslist}
        {/* <Box sx={{ p:2, m:2 }}>{eventsCount / MaxPageEvents > 1 ? <Pagination count={Math.ceil(eventsCount / MaxPageEvents)}  siblingCount={0}  boundaryCount={0}  color="primary" onChange={handlePageChange} /> : <></>}</Box> */}


        <Stack direction={'row'}>

          {page === 1 ? <></> : <Button variant='text' onClick={() => setPage(p => p-1)}>&lt; หน้าที่แล้ว</Button>}
          <Box flexGrow={1} />
          {page === Math.ceil(eventsCount / MaxPageEvents) ? <></> : <Button variant='outlined' onClick={() => setPage(p => p+1)}>หน้าต่อไป &gt;</Button>}
        
        </Stack>
        {/* {page}        {lastActivity.id} */}


        </>}


      </Container>

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
