import { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import ClickAwayListener from '@mui/base/ClickAwayListener';

// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';

// line liff
import liff from '@line/liff';


// mocks_
import account from '../../../_mock/account';

// app context
import { AppContext } from "../../../App"
import { isLocalhost } from '../../../index';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'หน้าแรก',
    icon: 'eva:home-fill',
    path:'/'
  },
  {
    label: 'โปรไฟล์',
    icon: 'eva:person-fill',
    path:'/dashboard/profile'

  }
];

// ----------------------------------------------------------------------

export default function AccountPopover() {

  const navigate = useNavigate()

  const [open, setOpen] = useState(null);

  const { profile } = useContext(AppContext)

  const liffId = process.env.REACT_APP_LIFF_ID // isLocalhost ? '1657818347-OQA4wE9x' : 
  
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = (path) => {
    navigate(path)
    setOpen(null);
  };

  useEffect(() => {
    // if (liff.ready) return

    // liff.init({
    //   liffId
    // }).then(async _ => {

    //   // const context = liff.getContext()

    //   // if (isLocalhost) {
    //   //   profile.groupId= "C6766f8fa9ea006a988e7e9f0dc056fc2"
    //   // } else if ((context && context.type === "group") ) {
    //   //   profile.groupId = context.groupId
    //   // }

    // })

  }, []);

  const logOut = () => {


    liff.init({
      liffId
    }).then(async _ => {

      if (liff.isInClient()) {
        liff.logout()
        liff.closeWindow();
      } else {

        liff.logout()
        console.log('singing out and navigating to login');
        setOpen(null);
        window.location.reload()
        // navigate('/login')

      }      
    })


    
  };

  const logIn = () => {

    // if (!liff.isInClient() && !liff.isLoggedIn) liff.login()

    navigate('/login')
    setOpen(null);
  };

  return (
    <>
      <ClickAwayListener onClickAway={handleClose}>
        <IconButton
          onClick={handleOpen}
          sx={{
            p: 0,
            ...(open && {
              '&:before': {
                zIndex: 1,
                content: "''",
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                position: 'absolute',
                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
              },
            }),
          }}
        >
        {<Avatar src={(profile && profile.pictureUrl || '/assets/images/bee/onep_bee.png')} alt="photoURL" />}
      </IconButton>
    </ClickAwayListener>
            <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {profile && profile.displayName || "ผู้ใช้ทั่วไป"}
          </Typography>
          {/* <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {account.email}
          </Typography> */}
        </Box>


        {profile && profile.groupId ? <>
        <Divider sx={{ borderStyle: 'dashed' }} />
          <Box sx={{ my: 1.5, px: 2.5 }}>
            <Typography variant="subtitle2">              
              {profile?.groupInfo?.unitName}
            </Typography>                   
          </Box>

          </> : <></>}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => handleClose(option.path)}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {profile 
        ? <MenuItem onClick={logOut} sx={{ m: 1 }}>
          ออกจากระบบ
        </MenuItem> 
        : <MenuItem onClick={logIn} sx={{ m: 1 }}>
          เข้าสู่ระบบ
        </MenuItem>}
      </Popover>
    </>
  );
}
