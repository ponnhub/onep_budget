import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { FieldValue } from 'firebase/firestore'
import { alpha, styled } from '@mui/material/styles';
import { Checkbox, FormControlLabel, FormGroup, Grid, IconButton, Paper, Stack, Typography } from "@mui/material";
import { blue } from '@mui/material/colors';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

import HTTPService from "../services/httpservice";
import DataService from "../services/dataservice";

import onepgroups from '../data/groupsPrefix.json';
import Iconify from '../components/iconify';


const BlueSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: blue[400],
    '&:hover': {
      backgroundColor: alpha(blue[400], theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: blue[400],
  },
}));

const label = { inputProps: { 'aria-label': 'Color switch demo' } };

export default function AdminPage({ ...other }) {

    const navigate = useNavigate()

    const [groups, setGroups] = useState([]);

    const [currentSwitchChecked, setcurrentSwitchChecked] = useState(false);

    const [loading, setLoading] = useState(true);

    const [groupIndex, setGroupIndex] = useState();

    const [onepgroup, setOnepgroup] = useState();

    const [notifyGroup, setNotifyGroup] = useState(true);

    const [open, setOpen] = useState(false);

    const handleClickOpen = (e, index) => {
        setcurrentSwitchChecked(e.target.checked)
        setGroupIndex(index)
        setOpen(true);
    };

    const handleClose = () => {
    setOpen(false);
    };

    const approveGroup = (group) => {
        if (!group) return
        if (!onepgroup) return

        const { unitName, unitType, ...others} = onepgroups[onepgroups.findIndex(g => g.order === onepgroup)]

        const httpservice = new HTTPService()
        const { groupId } = group
        const params = {
            groupId,
            updates: {
                onepgroup,
                unitName,
                unitType,
                ...others,
                approved: true
            }
        }
        httpservice.updateGroup(params)
        .then( res => {
            if (notifyGroup) {
                const ds = new DataService()
                ds.initialGroup(groupId)
            }
            handleClose()
            setLoading(true)
        })
    }

    useEffect(() => {

        if (!loading) return undefined;

        (async () => {

            const httpservice = new HTTPService()
            httpservice.getGroups()
            .then( groups => {
                setGroups(groups) // Array(100).fill(groups.shift()))
            })

        })()
        setLoading(false)
        return undefined;


    }, [loading]);



    const ConfirmDialog = useMemo(() => {

        const group = groups[groupIndex]
        if (!group) return <></>

        return currentSwitchChecked ? (<Dialog open={open} onClose={handleClose}>
        <DialogTitle>อนุญาตให้ใช้งาน</DialogTitle>
            <DialogContent>
              <DialogContentText>
                ต้องการอนุญาตกลุ่ม {group.groupName} ให้ใช้งานโปรแกรมอนุมัติค่าใช้จ่าย?
              </DialogContentText>
              <FormControl sx={{ m: 2}}>
                    <InputLabel variant="standard" htmlFor="uncontrolled-native">
                    โปรดเลือกกลุ่ม
                    </InputLabel>
                    <NativeSelect
                    defaultValue={group.onepgroup}
                    onChange={e => setOnepgroup(e.target.value)}
                    inputProps={{
                        name: 'onepgroup',
                        id: 'uncontrolled-native',
                    }}
                    >
                        <option value="" />
                        {onepgroups.map((g, index) => {
                            const { order, unitName, unitType, docprefix } = g
                            return <option key={index} value={order}>{[unitName, docprefix, `[${unitType}]`].join(" ")}</option>
                            // {unitName ? [unitName, `[${unitType}]`].join(" ") : unitType}
                        })}
                    </NativeSelect>
                </FormControl>

              <FormGroup>
                <FormControlLabel control={<Checkbox defaultChecked onChange={e => setNotifyGroup(e.target.checked)} />} label="ส่งข้อความแจ้งให้ทราบในกลุ่มไลน์" />
            </FormGroup>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>ปิด</Button>
              <Button onClick={() => approveGroup(group)} disabled={onepgroup === group.onepgroup} variant='contained'>ยืนยัน</Button>
            </DialogActions>
          </Dialog>) : <></>
    }, [currentSwitchChecked, groupIndex, handleClose])

  return (
    <div>

        <Grid container spacing={3} {...other}>
        {groups && groups.map((group, index) => {

            const location = {
                pathname: '/dashboard/group',
                state: { group }
            }
            return (
            <Grid key={index} item xs={12} sm={6} md={3} >
                    {/* <Link to={location}> */}
                        <Paper variant={group.approved ? "" :"outlined"} sx={{ p:2, m:2, borderRadius: 2}}
                            style={{
                                height:280,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundImage: `url(${group.pictureUrl})`
                        }} />
                    {/* </Link> */}



                <Stack direction={'column'}>
                    <Stack direction={"row"} sx={{ m:1, alignItems: 'center'}}>
                        {/* <img src={group.pictureUrl} alt={group.groupName} style={{ borderRadius: 25,  maxHeight: 100, width: 100}} /> */}
                        <BlueSwitch {...label} color="secondary" defaultChecked={group.approved} disabled={group.approved}   onChange={e => handleClickOpen(e, index)} />
                        <Typography color={group.approved ? "green" : "orange"}>{group.groupName}</Typography>
                        {group.users && <IconButton size="large" color="inherit" onClick={() => {}} >
                        {/* navigate('/dashboard/group', { state: { group }}) */}
                        <Iconify icon={'material-symbols:person'} /><Typography variant="caption">{group.users.length}</Typography>
                    </IconButton>}
                    </Stack>

                    {group.unitName ? <Typography variant="p">{group.unitName}</Typography> : <></>}
                    {group.unitType ? <Typography variant="caption">{group.unitType} {group.docprefix &&`(${group.docprefix})`}</Typography> : <></>}

                </Stack>

            </Grid>
            )})}
        </Grid>
        {ConfirmDialog}


    {/*
      <Switch {...label} defaultChecked />
      <Switch {...label} defaultChecked color="secondary" />
      <Switch {...label} defaultChecked color="warning" />
      <Switch {...label} defaultChecked color="default" />
      <PinkSwitch {...label} defaultChecked /> */}
    </div>)

}