import PropTypes from 'prop-types';
import { useContext, useEffect, useMemo } from 'react';
import { Navigate, Link as DomLink, useLocation, useNavigate } from 'react-router-dom';
// build datetime
import preval from 'preval.macro'
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack, Divider } from '@mui/material';
// mock
// import profile from '../../../_mock/account';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
//
import navConfig from './config';
import { AppContext } from '../../../App';
import BuildTime from './BuildInfo';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const { pathname } = useLocation();

  const navigate = useNavigate()
  const { profile } = useContext(AppContext);

  const isDesktop = useResponsive('up', 'lg');

  const dateTimeStamp = preval`module.exports = new Date().toLocaleString();`

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = useMemo(() => {

    if (profile) {
      return (<>
      
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
            <Logo />
            <Box flexGrow={1} />
            <Avatar style={{ width: 80, height: 80,display: 'inline-flex' }} src={(profile.groupInfo && profile.groupInfo.pictureUrl) || '/assets/images/bee/onep_bee.png' } alt="group photo URL" />
            <Box flexGrow={1} />
          </Box>

          <Box sx={{ mb: 5, mx: 2.5 }}>
            <Link underline="none" sx={{cursor: 'pointer'}}
              onClick={() => navigate('/dashboard/profile')}
            >
              <StyledAccount>
                <Avatar src={(profile.pictureUrl) || '/assets/images/bee/onep_bee.png'} alt="photoURL" />

                <Box sx={{ ml: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                    {profile.displayName}
                  </Typography>

                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {profile.role}
                  </Typography>
                </Box>
              </StyledAccount>
              {/* <Divider />
              <StyledAccount>
                <Box sx={{ ml: 2 }}>

                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {profile && profile.role}
                  </Typography>
                </Box>
              </StyledAccount> */}

            </Link>
          </Box>

          <NavSection data={navConfig} loggedIn={Boolean(profile)} role={profile.role} />

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
            <Stack alignItems="center" spacing={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>
              <Box
                component="img"
                src="/assets/images/bee/onep_bee.png"
                sx={{ width: 100, position: 'absolute', top: -50 }}
              />

              <Box sx={{ textAlign: 'center' }}>
                <Typography gutterBottom variant="h6">
                  ผมน้องผึ้ง ยินดีให้บริการ
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                กรุณาเริ่มต้นใช้งานจากลิงค์ในกลุ่มไลน์ของกลุ่มงานท่านครับ
                </Typography>
              </Box>
            {/* <Button component={DomLink} to={"/manual"} state={{profile}}  variant="contained">
              คู่มือการใช้งาน
            </Button> */}
            </Stack>
          </Box></>
      )

    }
    return (<>
    
    <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
          <Logo />
          <Avatar src={'/assets/images/bee/onep_bee.png' } alt="group photo URL" />
        </Box>

        <Box sx={{ mb: 5, mx: 2.5 }}>
          <Link underline="none" sx={{cursor: 'pointer'}}
            onClick={() => navigate('/dashboard/profile')}
          />
        </Box>

        <NavSection data={navConfig} loggedIn={false} />

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
          <Stack alignItems="center" spacing={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>
            <Box
              component="img"
              src="/assets/images/bee/onep_bee.png"
              sx={{ width: 100, position: 'absolute', top: -50 }}
            />

            <Box sx={{ textAlign: 'center' }}>
              <Typography gutterBottom variant="h6">
                ผมน้องผึ้ง ยินดีให้บริการ
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              กรุณาเริ่มต้นใช้งานจากลิงค์ในกลุ่มไลน์ของกลุ่มงานท่านครับ
              </Typography>
            </Box>

            {/* <Button variant="contained" href='/manual' target='_blank' >
              คู่มือการใช้งาน
            </Button> */}

          </Stack>
        </Box></>)


  }, [profile]);

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
          <Box sx={{ mb: 5, mx: 5 }}>
          <Typography variant='caption'>Build Version: <BuildTime /></Typography>
          </Box>
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >

        <Scrollbar
          sx={{
            height: 1,
            '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
          }}>
          {renderContent}
          <Box sx={{ mb: 5, mx: 5 }}>
          <Typography variant='caption'>Build Version: <BuildTime /></Typography>
          </Box>
        </Scrollbar> 
          
        </Drawer>
      )}
    </Box>
  );
}
