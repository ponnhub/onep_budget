import { Helmet } from 'react-helmet-async';
// import { useLiff } from 'react-liff';
// @mui
import {
  Box,
  Container, Stack,
} from '@mui/material';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';

import { useNavigate } from "react-router-dom";


// line liff
import liff from '@line/liff';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';

import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

import { AppContext } from '../App';
import HTTPService from '../services/httpservice';
import DataService from '../services/dataservice';
// import { isLocalhost } from '..';


const stringSimilarity = require("string-similarity")


const Root = styled('div')(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  '& > :not(style) + :not(style)': {
    marginTop: theme.spacing(2),
  },
}));
export default function Profile(props) {


  const { profile, setProfile } = useContext(AppContext)

  const [person, setPerson] = useState({});

  const {openToEdit} = props

  const [isLoading, setIsLoading] = useState(true);

  const [helperText, setHelperText] = useState("");

  const [userClaimed, setUserClaimed] = useState(false);

  const [eventsCount, setEventsCount] = useState(0);

  const [open, setOpen] = useState(openToEdit);

  const queryName = useRef()

  const [queryNameDone, setQueryNameDone] = useState(true);

  const [editingName, setEditingName] = useState(true);

  const [hideProgressBar, setHideProgressBar] = useState(true);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setHideProgressBar(true)
    setEditingName(false)
    setHelperText("")
    setIsLoading(false)
    setQueryNameDone(true)
    setUserClaimed(false)
    setOpen(false);
  };


  const navigate = useNavigate();

  const liffId = process.env.REACT_APP_LIFF_ID // isLocalhost ? '1657818347-OQA4wE9x' :

  const content = useMemo(() => (
      <Stack spacing={1} direction={'row'}>
        {eventsCount > 0 ? <Chip color='warning' label={`มี ${eventsCount} ร่าง`} onClick={() => navigate("/dashboard/event")} /> : 'ยังไม่เคยสร้างร่างอนุมัติ'}
        {/* {eventsCount > 0 ? <Chip color='success' label={`อนุมัติแล้ว ${eventsCount} ร่าง`} onClick={() => navigate("/dashboard/event")} /> : 'ยังไม่มีร่างที่ผ่านการอนุมัติ'} */}
      </Stack>
    ), [eventsCount]);

  useEffect(() => {

    if (!isLoading || !profile) return undefined

    const httpservice = new HTTPService()

    httpservice.readUserEvents(profile)
    .then( async result => {

      setIsLoading(false)
      setEventsCount(result.count)

      // const context = liff.getContext()

      // if (isLocalhost) {
      //   profile.groupId= "C6766f8fa9ea006a988e7e9f0dc056fc2"
      // } else if ((context && context.type === "group") ) {
      //   profile.groupId = context.groupId
      // }


      //   const groupInfo = await httpservice.readGroupInfo({ groupId: profile.groupId})
      //   if (groupInfo) setContextGroup(groupInfo)

    })

    return undefined
  }, [isLoading, profile]);

  useEffect(() => {

    // console.log('profile', profile);
    if (profile && profile.fullname) {
      queryName.current = {
        value : profile.fullname
      }
      setQueryNameDone(true)
      setEditingName(false)
    }

  }, [profile]);
  const saveProfile = () => {

    const httpservice = new HTTPService()
    httpservice.updateUserProfile({
      ...profile,
      ...person,
      claimed: true
    })
    .then( _ => {

      setProfile(o => ({
        ...o,
        ...profile,
        ...person
      }))
      handleClose()
    })

  }

  const getBestMatchedPerson = () => {
    const ds = new DataService()
    const text = queryName.current.value
    console.log('text', text);
    setEditingName(false)
    setQueryNameDone(false)
    setHideProgressBar(false)

    console.log('profile.unitName', profile.unitName);

    ds.getPersonWithNameQuery({
      text,
      unitName: profile.unitName,
      userId: profile.userId
    })
    .then( data  => {
      console.log(data);
      if (data) {
        if (data.claimed) {
          queryName.current.value = data.personnel.fullname
          setHelperText(data.self ? 'ชื่อนี้เป็นตัวท่านเอง หากต้องการเปลี่ยนให้ค้นหาชื่ออื่น' : `มีผู้ใช้ชื่อ${data.personnel.fullname}แล้ว หากท่านเป็นบุคคลดังกล่าว กรุณาติดต่อผู้ดูแลระบบ`)
          setUserClaimed(true)
        } else {
          queryName.current.value = data.fullname
          setPerson(data)
        }
      }
      setQueryNameDone(true)
    })
    .catch(e => {
      console.log(e);
    })
    .finally(setHideProgressBar(true))
  }


  const profileDialog = useMemo(() => {

    if (!profile) return <>กรุณาเข้าสู่ระบบก่อน</>

    const {groupInfo} = profile

    return ( <Dialog open={open} onClose={handleClose}>
      <DialogTitle>แก้ไขโปรไฟล์</DialogTitle>
      <DialogContent>
        <DialogContentText>
          พิมพ์ชื่อและนามสกุลเพื่อเชื่อมต่อกับบัญชีไลน์นี้ หากต้องการเปลี่ยนกลุ่มงาน ให้กด "สมัครใช้งาน" ในกลุ่มไลน์
        </DialogContentText>
        <Stack direction={'row'}>
          <TextField
            margin="dense"
            id="name"
            label="ชื่อ นามสกุล"
            type="text"
            defaultValue={profile.fullname}
            inputRef={queryName}
            helperText={helperText}
            fullWidth
            error={userClaimed}
            disabled={!editingName}
            variant="standard"
          />
          {editingName
          ? <Button size='small'  onClick={() => {
            getBestMatchedPerson()
          }}>ตรวจสอบ</Button>
          : <Button size='small'  onClick={() => {
            setEditingName(true)
            setQueryNameDone(false)
            setHelperText("")
            setUserClaimed(false)
          }}>แก้ไข</Button>}
        </Stack>
        <Box sx={{ width: '100%' }} style={{ display: (hideProgressBar) ? 'none' : 'block'}} >
          <LinearProgress />
        </Box>
        <TextField
          margin="dense"
          id="name"
          label="กลุ่ม"
          value={groupInfo && [(groupInfo.unitName || groupInfo.groupName), groupInfo.docprefix, groupInfo.unitType].join(" - ") }
          type="text"
          disabled // ={liff.isInClient()}
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button  onClick={handleClose}>ปิด</Button>
        <Button variant='contained' disabled={!hideProgressBar} color='success' onClick={saveProfile}>บันทึก</Button>
      </DialogActions>
    </Dialog>)

  }, [profile, handleClose])



    return isLoading 
    ? <Box width={'100%'} ><LinearProgress color='primary' /></Box>
    : !profile
     ? <>กรุณาเข้าสู่ระบบก่อน</>
     
     : (
        <>
          <Helmet>
            <title> โปรไฟล์ | โปรแกรมอนุมัติค่าใช้จ่าย </title>
          </Helmet>

          <Container>
            <Stack direction={{ xs:'column', sm:'row'}} spacing={3}>
              {/* {JSON.stringify(profile)} */}
              <Card sx={{ maxWidth: '100%' }}>
                  <CardActionArea onClick={handleClickOpen}>
                    <CardMedia
                      component="img"
                      height='360'
                      image={profile.pictureUrl || '/assets/images/bee/onep_bee.png'}
                      alt={profile.displayName}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src="/assets/images/bee/onep_bee_s.png";
                      }}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="p" component="div">
                        {profile.displayName}
                      </Typography>
                      {profile.fullname && <Typography gutterBottom variant="h5" component="div">
                        {profile.fullname}
                      </Typography>}
                      {profile.groupInfo && <Typography gutterBottom variant="h6" component="div">
                        {profile.groupInfo.unitName}
                      </Typography>}
                      {profile.groupInfo && <Typography gutterBottom variant="caption" component="div">
                        สมาชิกกลุ่มไลน์ {profile.groupInfo.groupName}
                      </Typography>}
                      {/* <Typography variant="body2" color="text.secondary">
                        ประวัติงาน
                      </Typography> */}
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button size="small" color="primary" onClick={handleClickOpen}>
                      แก้ไขข้อมูล
                    </Button>
                  </CardActions>
                </Card>


                <Root>
                  <Divider>สถิติทำร่าง</Divider>
                  {content}
                  {/* <Divider textAlign="left">LEFT</Divider>
                  {content}
                  <Divider textAlign="right">RIGHT</Divider>
                  {content}
                  <Divider>
                    <Chip label="CHIP" />
                  </Divider>
                  {content} */}
                </Root>
              </Stack>
              {profileDialog}


            </Container>
        </>)
}