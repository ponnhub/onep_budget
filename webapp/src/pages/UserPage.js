import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Chip,
  Box,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
// import USERLIST from '../_mock/user';

import USERLIST from '../data/onepUsers';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'fullname', label: 'ชื่อ-นามสกุล', alignRight: false },
  { id: 'unitType', label: 'กอง', alignRight: false },
  { id: 'position', label: 'ชื่อตำแหน่ง', alignRight: false },
  // { id: 'isVerified', label: 'Verified', alignRight: false },
  // { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

export const EllipsisText = (props) => {
  const { children } = props

  return (
    <div style={{
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      }}>
      {children}
    </div>
  )
}
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
    return filter(array, (_user) => (_user.fullname.toLowerCase().indexOf(query.toLowerCase()) !== -1 || (_user.position && _user.position.toLowerCase().indexOf(query.toLowerCase()) !== -1)));
  }
  return stabilizedThis.map((el) => el[0]);
}

UserPage.propTypes = {

  basicInfo : PropTypes.object,
  handleBasicInfoChanged : PropTypes.func,
  showUsersUI: PropTypes.bool,
  setShowUsersUI : PropTypes.func

}

export default function UserPage(props) {

  const { basicInfo, handleBasicInfoChanged, showUsersUI, setShowUsersUI } = props

  const location = useLocation()

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [startSortingApplicant, setStartSortingApplicant] = useState(false);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, person) => {
    const selectedIndex = selected.map(s => s.fullname).indexOf(person.fullname);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, person);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  // const handleClick = (event, name) => {
  //   const selectedIndex = selected.indexOf(name);
  //   let newSelected = [];
  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, name);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
  //   }
  //   setSelected(newSelected);
  // };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const handleAddUser = () => {
    handleBasicInfoChanged('onepusers', [...new Map([...basicInfo.onepusers || [], ...selected].map(item => [item.id, item])).values()])
    handleClearSelected()
  }

  // useEffect(() => {

  //   if (startSortingApplicant) {
  //     console.log('selected while startSortingApplicant', selected);
  //     handleAddUser()
  //     setStartSortingApplicant(false)
  //   }

  // }, [startSortingApplicant, selected]);

  const handleClearSelected = () => {
    setSelected([])
    setFilterName("")
  }

  const handleDeleteUser = (i) => {
    const newOnepUsers = [...basicInfo.onepusers]
    newOnepUsers.splice(i, 1)
    console.log('====================================');
    console.log('newOnepUsers', newOnepUsers);
    console.log('====================================');
    handleBasicInfoChanged('onepusers', newOnepUsers)


  }

  const userlists = useMemo(() => (    <Stack direction="column" spacing={1} sx={{ m: 1, width : { md: '50%'}}}>

    {basicInfo && basicInfo.onepusers && basicInfo.onepusers
      // .sort((a, b) => b.applicant - a.applicant)
      .map((u, i) => (<Chip
        style={{ display: 'inline-block'}}
        color={u.applicant ? 'secondary' : 'primary'}
        key={`onepusers${i}`}
        icon={<Iconify icon={u.fullname.trim().toLowerCase().slice(0,3) === "นาย" ? 'gg:boy' : 'gg:girl'} />}
        // label={<EllipsisText>{`${i+1}. ${[u.fullname, u.position].join(" - ")}${i === 0 ? ' (ผู้ขออนุมัติ)' : ''}`}</EllipsisText>}
        label={`${i+1}. ${[u.fullname, [u.position, ["สูง", "ต้น"].includes(u.positionType)
        ? ""
        : (u.positionType || "")].join("")].join(" - ")}${u.applicant ? ' (ผู้ขออนุมัติ)' : ''}`}
        title="คลิกเพื่อตั้งเป็นผู้ขออนุมัติ / คลิก x เพื่อลบ / อย่าลืมกดบันทึกด้านบนขวา"
        onClick={() => {
        handleBasicInfoChanged('onepusers', basicInfo.onepusers.map((u, index) => ({ ...u, applicant: index === i})))
      }}
        onDelete={() => handleDeleteUser(i)}

      />))}

      {/* {basicInfo.onepusers.length > 1 && <Typography variant='caption' textAlign={'center'} >* คลิกเพื่อตั้งเป็นผู้ขออนุมัติ</Typography>} */}
    </Stack>), [showUsersUI, basicInfo])

  if ((['/dashboard/event', '/dashboard/eventform'].includes(location.pathname)) && !showUsersUI) return <Stack direction={'column'}>

    {userlists}
    <Stack direction={'row'}>
      <Button  color='info' variant='outlined' style={{ display: 'inline'}} sx={{ width: { md: '50%'}}} onClick={()  => {
          setShowUsersUI(true)
          window.scrollTo(0, 0);
        }}>เพิ่ม/แก้ไขรายชื่อผู้เข้าร่วม</Button>
      <Box flexGrow={3} />
    </Stack>
  </Stack>

  return (
    <>
      <Helmet>
        <title> บุคลากร สผ. | โปรแกรมอนุมัติค่าใช้จ่าย </title>
      </Helmet>

      {(basicInfo && basicInfo.onepusers || showUsersUI) ? <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} spacing={1} >
          <Typography variant="h4" gutterBottom>
          บุคลากร สผ.
          </Typography>
          <Box flexGrow={1} />
          <Button variant="outlined"
          onClick={() => setShowUsersUI(false)}
          >
            ปิด
          </Button>
          <Button variant="contained"  color='info'
          onClick={handleAddUser}
          startIcon={<Iconify icon="eva:plus-fill" />}>
            เพิ่มผู้ใช้ในร่าง
          </Button>
        </Stack>


        {userlists}


        {showUsersUI && <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} handleClearSelected={handleClearSelected} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, fullname, position, positionType=" ", unitType, avatarUrl } = row;
                    const selectedUser = selected.map(s => s.fullname).indexOf(fullname) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, {id, fullname, position, positionType : ["สูง", "ต้น"].includes(positionType)
                          ? " "
                          : positionType })} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={fullname} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {fullname}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{unitType}</TableCell>

                        <TableCell align="left">{[(position ? position.trim() : ""), ["สูง", "ต้น"].includes(positionType)
        ? ""
        : (positionType || "")].join("")}</TableCell>

                        {/* <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell>

                        <TableCell align="left">
                          <Label color={(status === 'รออนุมัติ' && 'warning') || 'success'}>{status}</Label>
                        </TableCell> */}

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>}
      </Container>

    : <>รายชื่อบุคลากรที่เกี่ยวข้องกับงานจะปรากฏที่นี่ กรุณากดเพิ่มจากหน้าร่าง</>}

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
        {/* <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem> */}

        {/* <MenuItem sx={{ color: 'info.main' }} onClick={handleAddUser}>
          <Iconify icon="eva:plus-fill" />
            เพิ่มผู้ใช้ในร่าง
        </MenuItem> */}
      </Popover>
    </>
  );
}
