
import { useContext, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { redirect, useLocation, useNavigate } from 'react-router-dom';

// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Stack, Button, Paper, Box, LinearProgress } from '@mui/material';
import { faker } from '@faker-js/faker';

// line liff
import liff from '@line/liff';

import HTTPService from '../services/httpservice';

// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
import Iconify from '../components/iconify';
// sections
import { LoginForm } from '../sections/auth/login';
import { AppContext } from '../App';
import { isLocalhost } from '..';

// ----------------------------------------------------------------------

  // const liff = window.liff
  const liffId = process.env.REACT_APP_LIFF_ID // isLocalhost ? '1657818347-OQA4wE9x'  //

  function logOut() {
    liff.logout()
    // setSignedIn(false)
    window.location.reload()
  }

  // https://access.line.me/oauth2/v2.1/error400?error=Bad+Request&error_description=invalid+url.+channelId%3D1657818347%2C+redirectUriString%3Dhttp%3A%2F%2Flocalhost%3A3000%2Flogin
  function logIn() {
    liff.login({ redirectUri: window.location.href })
  }

  async function getLineProfile() {
    const profile = await liff.getProfile()
    document.getElementById("pictureUrl").style.display = "block"
    document.getElementById("pictureUrl").src = profile.pictureUrl
    return profile
  }

  async function getLiffContext() {
    const context = liff.getContext()
    return context
  }

  async function getGroupInfo(groupId) {
    const httpservice = new HTTPService()
    const groupInfo = await httpservice.readGroupInfo({ groupId})
    if (groupInfo) {
      // const { onepgroup, groupName, unitName, pictureUrl} = groupInfo
      return groupInfo // { onepgroup, groupName, unitName, pictureUrl}
    }
    return {}
  }

  async function getUser(userId) {
    const httpservice = new HTTPService()
    const user = await httpservice.readUserProfile({ userId})
    return user
  }


const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

const firstTimeInfo = () => {
  return (<>เข้าใช้งานครั้งแรก กรุณากดสมัครใช้งานจากกลุ่มไลน์ของท่าน</>)
}
// ----------------------------------------------------------------------

export default function LoginPage() {

  const mdUp = useResponsive('up', 'md');
  const navigate = useNavigate()
  const { setProfile } = useContext(AppContext)
  const [signedIn, setSignedIn] = useState(false);
  const [UIReady, setUIReady] = useState(false);
  const [notifyNoGroup, setNotifyNoGroup] = useState(false);
  const [log, setLog] = useState("");
  const [hasGroup, setHasGroup] = useState(false);
  const location = useLocation();
  const profile = useRef()

  useEffect(() => {


    let user
    if (isLocalhost) {

      setNotifyNoGroup(true)
      setUIReady(true)
      const groupId = "C6766f8fa9ea006a988e7e9f0dc056fc2"
      getGroupInfo(groupId).then ( async groupInfo => {

        // console.log('groupIwnfo', groupInfo);

        const { users, usersCount, ...others } = groupInfo

        let profile = {
          userId: 'U166610960d54d83cdd3e60c77d9d56b3',
          displayName: 'Chaloemphol',
          statusMessage: 'ev’ry moment new',
          pictureUrl: '/assets/images/bee/onep_bee.png',
          // role: 'superadmin',
          unitName: "แผนงานและงบประมาณ (กผง.)",
          groupId,
          groupInfo: {
            ...others,
            approved: true
          }
        }
        user = await getUser("U166610960d54d83cdd3e60c77d9d56b3")
        if (user) profile = { ...user , ...profile }
        setProfile(profile)
    })
      return undefined
    }

    (async () => {

      if (isLocalhost) return


      await liff.init({ liffId})

      if (liff.isInClient()) {
        getLineProfile()
      .then(async data => {

          // setLog(t => [t, 'got data'].join("\n"))
          // setLog(t => [t, JSON.stringify(data)].join("\n"))
          let profile = data
          const context = liff.getContext()

          // setLog(t => [t, 'got context'].join("\n"))
          // setLog(t => [t, JSON.stringify(context)].join("\n"))

          user = await getUser(data.userId)
          if (user) profile = { ...user , ...profile }
          // setProfile(o => ({ ...o, ...profile }))

          // setLog(t => [t, 'got user'].join("\n"))
          // setLog(t => [t, JSON.stringify(user)].join("\n"))

          const { groupId } = user.groupId 
          ? user
           : context && context.type === "group" 
            ? context
              : ""
          // if ((context && context.type === "group") ) {
          //   groupId = context.groupId

          //   // setProfile(profile)
          // } else if (user.groupId) {
          //     groupId = user.groupId
          // }
          getGroupInfo(groupId).then(groupInfo => {

            const { users, usersCount, ...others } = groupInfo
            profile = { ...profile,
              groupInfo: others
            }

            setUIReady(true)
            setProfile(profile)
            setSignedIn(true)

            // setLog(t => [t, 'got groupInfo'].join("\n"))
            // setLog(t => [t, JSON.stringify(groupInfo)].join("\n"))
            // setLog(t => [t, 'got profile'].join("\n"))
            // setLog(t => [t, JSON.stringify(profile)].join("\n"))

          })

          if (!user.fullname) {
            navigate('/dashboard/profile')
          } else {
            navigate('/dashboard/app')
          }

          // navigate('/dashboard/app')
        })

      } else if (liff.isLoggedIn()) {
        getLineProfile()
        .then(async data => {
          // setLog(t => [t, 'got data'].join("\n"))
          // setLog(t => [t, JSON.stringify(data)].join("\n"))

          setUIReady(true)

          let profile = data

          user = await getUser(data.userId)
          if (user) {
            profile = {
              ...user,
              ...profile
            }
            // setProfile(o => ({ ...o, ...profile }))

          // setLog(t => [t, 'got user'].join("\n"))
          // setLog(t => [t, JSON.stringify(user)].join("\n"))

          const groupId = user.groupId
           if (groupId) {
            getGroupInfo(groupId).then(groupInfo => {
              const { users, usersCount, ...others } = groupInfo
              profile = { ...profile,
                groupInfo: others
              }


            setProfile(profile)

            // setLog(t => [t, 'got profile'].join("\n"))
            // setLog(t => [t, JSON.stringify(profile)].join("\n"))

            setSignedIn(true)


            }

          )} else {

            // TODO:- ddd
            setNotifyNoGroup(true)
            setProfile(profile)
            setSignedIn(true)
            
          }
          if (!user.fullname) {
            navigate('/dashboard/profile')
          } else {
            navigate('/dashboard/app')
          }
        } else {

          setUIReady(true)
          setNotifyNoGroup(true)
        }
        

      })


      } else {
        // document.getElementById("lineloginbutton").style.display = "block"
        setUIReady(true)
        document.getElementById("btnLogOut").style.display = "none"
      }
    })()

    return undefined
  }, []);

  // const { error, isLoggedIn, isReady, liff } = useLiff();
  return (
    <>
      <Helmet>
        <title> Login | โปรแกรมอนุมัติค่าใช้จ่าย </title>
      </Helmet>

      <StyledRoot>
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />

        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 0, mb: 0 }}>
              โปรแกรมอนุมัติค่าใช้จ่าย
            </Typography>
            <Paper style={{ height: 60,}} sx={{ px: 10, mt: 2, mb: 0 }}>
              <img src="/favicon/mstile-150x150.png" alt="login" />
              </Paper>
            <Typography variant="caption" sx={{ px: 10, mt: 20, mb: 0 }}>
              สำนักงานนโยบายและแผนทรัพยากรธรรมชาติและสิ่งแวดล้อม<br/>
              เลขที่ 118/1 ชั้น 8 อาคารทิปโก้ 2 ถนนพระรามที่ 6<br />
              แขวงพญาไท เขตพญาไท <br />
              กรุงเทพมหานคร 10400
            </Typography>

          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h6" gutterBottom>
              ลงชื่อเข้าใช้งานโปรแกรมอนุมัติค่าใช้จ่าย
            </Typography>
            {/* {hasGroup ? <></> : <Typography variant="body2" color={'warning'} sx={{ mb: 5 }}>
              {firstTimeInfo}
              </Typography>} */}
              {(liff.isInClient() || isLocalhost) && <Button onClick={() => {
          window.open(`https://budget.onep.go.th`)
          liff.closeWindow()
        }} variant="contained" startIcon={<Iconify icon="iconoir:open-in-browser" />}>
            เปิดบนเบราเซอร์
          </Button>}
            <Typography variant="body2" sx={{ mb: 5 }}>
              {signedIn || isLocalhost
              ? <>สวัสดีครับ </>
              // <Link variant="h4" sx={{cursor: 'pointer'}} onClick={() => navigate("/dashboard/app")} >เริ่มต้นใช้งาน</Link>
              : <>หากยังไม่มีบัญชี {''} <Link variant="subtitle2" >เข้าสู่ระบบเพื่อสร้างบัญชี</Link></>}
            </Typography>
            <Stack direction={{ sm: "column", md: "row"}} spacing={4}>

            <img
              id="pictureUrl"
              src={"/assets/images/bee/onep_bee_s.png"}
              style={{ maxWidth: 240, borderRadius:10}}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src="/assets/images/bee/onep_bee_s.png";
                }}
              alt='line profile' />
              

            {signedIn || isLocalhost
            ? <Stack direction="column" spacing={2}>

                <Box sx={{ flexGrow: 1 }} />                
                
                <Button id="btnLogOut" color='success' variant='contained' onClick={() => navigate("/dashboard/app")}>เริ่มต้นใช้งาน</Button>

              {liff.isInClient() && liff.isLoggedIn() 
                ? <>เข้าสู่ระบบเรียบร้อย กำลังเปลี่ยนหน้า</> 
                : <Button id="btnLogOut"  color='warning' variant='outlined' size='small' onClick={logOut}>ออกจากระบบ</Button>}
                <Box sx={{ flexGrow: 1 }} />

            </Stack>
            // <Link variant="h4" sx={{cursor: 'pointer'}} onClick={() => navigate("/dashboard/app")} >เริ่มต้นใช้งาน</Link>
            : UIReady
              ? notifyNoGroup 
                ? <Typography variant='caption' color='error' textAlign={'center'} >คุณยังไม่ได้สมัครใช้งานในกลุ่มไลน์กลุ่มงานของท่าน</Typography>
                : <Button color="inherit" onClick={logIn}>
                    <img src={'/assets/images/btn_login_base.png'} alt="line login button" width={"50%"} />
                  </Button>

            :<>
            </>
          }



            {/* <Button fullWidth size="large" color="inherit" variant="outlined">
              <Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />
            </Button>

            <Button fullWidth size="large" color="inherit" variant="outlined">
              <Iconify icon="eva:facebook-fill" color="#1877F2" width={22} height={22} />
            </Button>

            <Button fullWidth size="large" color="inherit" variant="outlined">
              <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={22} height={22} />
            </Button> */}
            <Typography variant='caption'>{log}</Typography>
          </Stack>
          {(!UIReady || isLocalhost) && <Box width={'100%'}><LinearProgress color='primary' /></Box>}



            {/* <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                OR
              </Typography>
            </Divider> */}

            {/* <LoginForm /> */}
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
