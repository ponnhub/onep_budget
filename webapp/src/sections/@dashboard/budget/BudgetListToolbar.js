import PropTypes from 'prop-types';
// @mui
import { useTheme, styled, alpha } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment } from '@mui/material';

// component
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 320,
  // transition: theme.transitions.create(['box-shadow', 'width'], {
  //   easing: theme.transitions.easing.easeInOut,
  //   duration: theme.transitions.duration.shorter,
  // }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// ----------------------------------------------------------------------

BudgetListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function BudgetListToolbar({ numSelected, filterName, onFilterName, queryName, setEditingName }) {
  let timer
  
  return (
    <StyledRoot
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <StyledSearch
          inputRef={queryName}
          onChange={() => {
            setEditingName(true)
            if (timer) clearTimeout(timer);
              timer = setTimeout(() => {
                  onFilterName()
              }, 500);
              }
          }
          placeholder="ค้นหารายการรหัสเบิกจ่าย..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          
          }
          endAdornment={<IconButton
            sx={{ visibility: queryName.current && queryName.current.value ? "visible" : "hidden" }}
            onClick={() => {
              if (queryName.current) {
                queryName.current.value = "";
                setEditingName(false)
              }
            }}
          >
             <Iconify icon="mdi:clear-circle"  />            
          </IconButton>}
        />
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      )}
    </StyledRoot>
  );
}
