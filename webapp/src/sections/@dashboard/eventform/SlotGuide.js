import { useMemo, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Fab from '@mui/material/Fab';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import Iconify from "../../../components/iconify";
import { iconify } from "../../../data/constants";

import ('./SlotGuide.css')

const Triangle = ({ w = '20', h = '20', direction = 'right', color = '#44a6e8' }) => {
  const points = {
    top: [`${w / 2},0`, `0,${h}`, `${w},${h}`],
    right: [`0,0`, `0,${h}`, `${w},${h / 2}`],
    bottom: [`0,0`, `${w},0`, `${w / 2},${h}`],
    left: [`${w},0`, `${w},${h}`, `0,${h / 2}`],
  }

  return (
    <svg width={w} height={h}>
      <polygon points={points[direction].join(' ')} fill={color} />
      Sorry, your browser does not support inline SVG.
    </svg>
  )
}

const fabStyle = {
    position: 'fixed', top: '50%' , right: 0,
  };

  const fab = {
    color: 'primary',
    sx: fabStyle,
    icon: <FormatListNumberedIcon sx={{ mr: 1 }} />,
    label: 'ไกด์',
  }

export default function SlotGuide(props) {

    const navigate = useNavigate()
  const [state, setState] = useState(false);

  const toggleDrawer = (open, id) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    if (id) navigate(`#${id}`)
    setState(open);
  };

  const jumpToId = (id) => {
    <Navigate to={id} />
    toggleDrawer(false)
  }

  const {  currentMainActivity=[] }  =  props

  const fields = useMemo(() => 


    // const allItems = [...currentActivity, ...currentMainActivity]

     currentMainActivity.map((field, index) => {
      const {
          order,
          numbering,
          timestamp,
          name,
          icon,
          isSectionHeader

        } =  field

      if (isSectionHeader) return  <ListSubheader key={`anchorlink-${[index, order, numbering, timestamp].join("-")}`} >{name}</ListSubheader>
      return (<ListItem key={`anchorlink-${[order, numbering, timestamp].join("-")}`}  >
          <ListItemButton  onClick={toggleDrawer(false, [order, numbering, timestamp].join("-"))} >
            <ListItemIcon>
              <Iconify icon={iconify(icon)} />
            </ListItemIcon>
            <ListItemText primary={name} />
          </ListItemButton>
      </ListItem>

      )

  })

  , [currentMainActivity])

  const list = useMemo(() => {

    if (fields) return (
    <List
        dense
        sx={{
          width: '100%',
          maxWidth: 360,
          bgcolor: 'background.paper',
          position: 'relative',
          overflow: 'auto',
          '& ul': { padding: 0 },
        }}
        subheader={<li />}
      >
        {fields}

      <Divider />
    </List>
    )
    return <></>
}, [currentMainActivity]);

  return (
    <div>
        <div key={'right'}>
          {/* <Button onClick={toggleDrawer(true)}>{'right'}</Button> */}
          <Drawer
            anchor={'right'}
            open={state}
            onClose={toggleDrawer(false)}
          >
            {list}
          </Drawer>
        </div>
        {currentMainActivity && <Fab onClick={toggleDrawer(true)} sx={fab.sx} aria-label={fab.label} color={fab.color}>
        {fab.icon}
        {/* <Box sx={{ right: 0, mt: 1 }} ><Triangle w={120} h={180} direction='left' color='#44a6e890'></Triangle></Box> */}
        </Fab>}
    </div>
  );
}

