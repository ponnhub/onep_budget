import { useState, useMemo, useRef } from 'react';
import dayjs from 'dayjs';

import { Card, Typography, Stack, Button, Chip, useTheme, Divider, Box, ToggleButtonGroup, ToggleButton, InputAdornment, FormControlLabel, Switch } from '@mui/material';
import PropTypes from 'prop-types';


import { styled } from '@mui/material/styles';

import { NumericFormat } from 'react-number-format'

import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';

import Iconify from '../../../components/iconify';

import BudgetCalculator from '../../../services/budgetCalculator';
import { NUMBER, THB } from '../../../App';
import unitLabel from '../../../data/unitLabel';
import { iconify } from '../../../data/constants';

// @mui

EventFormSlotFillingTextfield.propTypes = {


    field: PropTypes.object,
    handleSlotFilled: PropTypes.func,
    options:  PropTypes.array,
    multiplicable: PropTypes.bool,
    optionValue : PropTypes.object,
    setOptionValues : PropTypes.func,
    type : PropTypes.string,
    itemIndex  : PropTypes.number,
    fieldsSubtotals : PropTypes.object,
    prependObjectInArray  : PropTypes.func,
    removeObjectFromArray  : PropTypes.func,

}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    '&.Mui-disabled': {
      border: 0,
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }));

  const tooltips = (remark, showReset) => {


    const lists = remark.split('\n')

    return (<HtmlTooltip
      title={
        <>
          <Typography color="inherit">{lists.shift()}</Typography>
          {lists && <ul>
            {lists.map((l, i) => (<li key={i}>{l}</li>))}
            </ul>}
        </>
      }
    >
      <HelpIcon sx={{ display: { xs: 'block', sm: 'none' } }} color={showReset ? 'warning' : 'info'} />
    </HtmlTooltip>)
  }


export default function EventFormSlotFillingTextfield({
    field,
    options,
    multiplicable,
    optionValue,
    setOptionValues,
    type,
    handleSlotFilled,
    itemIndex,
    fieldsSubtotals,
    prependObjectInArray,
    removeObjectFromArray,
}) {

  const theme = useTheme()

const {
  order,
  numbering,
  timestamp,
  name,
  subtotalTitle,
  included,
  a,
  units,
  icon,
  method,
  remark

} =  field

const textFieldValue = useRef()
let timer

// const [included, setIncluded] = useState(field.included || false);
const [newField, setNewField] = useState(field);
const showReset = useMemo(() => a && a < newField.a, [a, newField])
const [customUnits, setCustomUnits] = useState({});
const [reservedTimestamp, setReservedTimestamp] = useState("");
const rowNum = newField.timestamp || newField.numbering
  // const [fixDays, setFixDays] = useState({});
  // const [values, setValues] = useState({});
  // const [aValue, setAValue] = useState(a);
  // const [amountValue, setAmountValue] = useState(1);

  // const defaultAValue = useMemo(() => {
  //   return 1
  // }, [])

  // const defaultAmountValue = useMemo(() => {
  //   return 10
  // }, [])

  function addItem(itemIndex) {

    const splicingField = {
      ...newField,
      timestamp: reservedTimestamp || dayjs().valueOf(),
      included: true
      // selected: !optionValue || (optionValue && (optionValue === newField.sectionHeader))
    }
    setReservedTimestamp("")
    prependObjectInArray(type, splicingField, itemIndex)
    setNewField(_ => ({...field}))

  }
  function handleDelete(index) {
    removeObjectFromArray(type, index)
  }

  const [open, setOpen] = useState(false);
  const [warnToggling, setWarnToggling] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };




  const handleWarningTogglingClose = () => {
    console.log('closing');
    setWarnToggling(false);
  };

  const handleToggled = (e, newValue) => {
    console.log('newValue', newValue);

    if (newValue !==  null) {
      setOptionValues(o => ({
        ...o,
        [numbering] : newValue
      }))

      console.log('====================================');
      console.log('changing to new value', numbering, newValue);
      console.log('====================================');
      handleSlotFilled(type, {...newField, optionValue: e.target.value})
    }
  }

  const subtotal = useMemo(() => {
    const budgetCalculator = new BudgetCalculator()
    return budgetCalculator.fieldSubTotal(newField)
  }, [newField])




  // useEffect(() => {

  //   if (newField.isSectionHeader && fieldsSubtotals && fieldsSubtotals[numbering]) {
  //     handleSlotFilled(type, {...newField, })
  //   }
  // }, [newField, fieldsSubtotals]);


    if (newField.isSectionHeader) {
      if ((field.options) && optionValue !== field.numbering) return <></>

      return (<div id={`${[order, numbering, timestamp].join("-")}`} >
    <Stack direction={{sm: 'column', md: 'row'}}  spacing={{ sm:1, md:2}}  >
      <Paper sx={{ bgcolor: 'darkgrey', p:1}}>
        <Stack direction={{sm: 'column', md: 'row'}}  spacing={{ sm:1, md:2}} alignItems='space-between' >
          <Iconify icon={iconify(icon)}  />
          <Typography variant='h6' color={theme.palette.text.primary} >{name}</Typography>
          <Box sx={{ flexGrow: 1 }} />
          {fieldsSubtotals && (fieldsSubtotals[timestamp || numbering] > 0 ? THB(fieldsSubtotals[timestamp || numbering]) : <></>)}
            <Box sx={{ flexGrow: 1 }} />
            {remark && tooltips(remark, showReset)}
            <Typography sx={{ display: { xs: 'none', sm: 'block' } }}  variant='caption' color={theme.palette.text.primary} >{remark}</Typography>


        </Stack>
      </Paper>

      {options && field.useOptions &&
      <Paper sx={{ p:1, borderColor: optionValue ? 'transparent' : 'orange', borderWidth: optionValue ? 0 : '2px', borderStyle: 'dotted' }} >
        {!optionValue && <Typography variant='caption' color={'warning'}>โปรดเลือก:</Typography>}
        <StyledToggleButtonGroup
          value={optionValue}
          exclusive
          size="small"
          // onClick={handleClickOpen}
          onChange={handleToggled}
          aria-label="text alignment"
          // fullWidth
          >
            {options.map(((t, index) => (
            <ToggleButton key={`option-${index}-${t.value}`} value={t.value} aria-label="left aligned" color='primary' >
              {t.label}
              </ToggleButton>
              )))}
          </StyledToggleButtonGroup>
      </Paper>
        }
    </Stack>
  </div>)}

    if (!textFieldValue.current) textFieldValue.current = {}

    const draftCalcFields = []
    const calculationFields = []

    const originalField = (
      <Card id={`card-${[order, numbering, timestamp].join("-")}`} key={[type, numbering, timestamp].join("-")} sx={{ bgcolor: 'grey', borderColor: 'primary.light', border: 2}}>
        <Stack spacing={1} sx={{ p: 1 }} direction="column" >
            {/* <Typography variant=''>{JSON.stringify(field.remark)}</Typography> */}
          {/* <FormGroup>
            <FormControlLabel control={<Checkbox
            onChange={() => {
              setIncluded(o => !o)
              setNewField(o => ({...o, included: !o.included}))
              // handleSlotChanged('included', e.target.checked)
              handleSlotFilled(type, {...newField, included: !newField.included})
              }} />}  label={name} />
          </FormGroup> */}

          {/* Header */}
          <Stack direction={'row'}  spacing={1} divider={<Divider sx={{ p:1}} orientation="vertical" flexItem />} alignItems='space-between' >

            <>

            <Iconify icon={iconify(icon)}  />

          { method === "free"
          ? <TextField
            fullWidth
            defaultValue={name === field.name ? "" : name}
            onFocus={e => e.target.select()}
            onChange={e => {
              setNewField(o => ({...o, subtotalTitle: e.target.value, name: e.target.value}))

              if (timer) clearTimeout(timer);
              timer = setTimeout(() => {
                
                handleSlotFilled(type, {
                  ...newField,
                  subtotalTitle: e.target.value,
                  name: e.target.value
                })
                // handleSlotChanged('amount', e.target.value)
              }, 100);

            }}
            placeholder={name}



          />
          : <Typography variant='h6' color={theme.palette.text.primary} >{name}</Typography>}
            </>
            {remark && <>
              <Box sx={{ flexGrow: 1 }} />
              {tooltips(remark, showReset)}
              <Typography sx={{ display: { xs: 'none', sm: 'block' } }}  variant='caption' color={theme.palette.text.primary} >{remark}</Typography>
            </>}
          </Stack>

          {/* Text Fields */}
          <Stack spacing={1} sx={{ p: 1 }}  flexGrow={1}  direction={{sm: 'column', md: 'row'}} alignItems={{ sm: "left", md: "center"}} justifyContent="space-between">
            {/* {JSON.stringify(field.multiplicable)} */}
            {/* <br />
            {a} */}

            {units && units.split(" ").map((unitKey, index) =>  {

              draftCalcFields.push({
                key: unitKey,
                label: newField.unitLabel || unitLabel(unitKey)
              })

              textFieldValue.current[unitKey] = newField[unitKey] || 1

              // if (!customUnits || customUnits && !customUnits(rowNum)) return <></>
              if (unitKey === 'subtotal' ) return <></> // || (customUnits && !customUnits[rowNum])

              return (<>

              <NumericFormat
                // value={totalAmount}
                customInput={TextField}
                // onValueChange={handleChange}
                thousandSeparator=","
                // thousandsGroupStyle='thousand'
                decimalSeparator="."

                key={`${[unitKey, index].join("-")}`}
                id={[unitKey, order].join("-")}
                // defaultValue={getDefaultValueBy(basicInfo, field) || 0}
                defaultValue={textFieldValue.current[unitKey]}
                label={!textFieldValue.current[unitKey] ? 'ป้อน' : ""}
                // type="number"
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="start">{unitLabel(unitKey)}</InputAdornment>
                }}
                onValueChange={e => {

                  setNewField(o => ({...o, [unitKey]: e.floatValue}))

                  if (timer) clearTimeout(timer);
                  timer = setTimeout(() => {
                    handleSlotFilled(type, {...newField, [unitKey]: e.floatValue})
                    // handleSlotChanged('amount', e.target.value)
                  }, 200);
                }}
                onFocus={event => {
                  event.target.select();
                }}

              />              
              {method === "free" && <TextField
            defaultValue={field.unitLabel}
            onFocus={e => e.target.select()}
            size='small'
            onChange={e => {
              setNewField(o => ({...o, unitLabel: e.target.value}))

              if (timer) clearTimeout(timer);
              timer = setTimeout(() => {
                handleSlotFilled(type, {...newField, unitLabel: e.target.value})
                // handleSlotChanged('amount', e.target.value)
              }, 100);

            }}
            placeholder={'ป้อนหน่วย'}



          />}
          
              </>

          //     <TextField
          //       key={unitKey}
          //       id={[unitKey, order].join("-")}
          //       // defaultValue={getDefaultValueBy(basicInfo, field) || 0}
          //       defaultValue={textFieldValue.current[unitKey]}
          //       label={unitLabel(unitKey)}
          //       type="number"
          //       size="small"
          //       InputLabelProps={{
          //         shrink: true,
          //       }}
          //       onChange={e => {

          //         setNewField(o => ({...o, [unitKey]: e.target.value}))

          //         if (timer) clearTimeout(timer);
          //         timer = setTimeout(() => {
          //           handleSlotFilled(type, {...newField, [unitKey]: e.target.value})
          //           // handleSlotChanged('amount', e.target.value)
          //         }, 100);
          //       }}
          //       onFocus={event => {
          //         event.target.select();
          //       }}
          //       // onClick={() => {
          //       //   if (!included) setIncluded(true)

          //       // }}
          //     //   onKeyUp={(e) => {
          //     //     // if (Number.isNaN(event.target.value)) {
          //     //     //   event.target.value = 0
          //     //     //   return
          //     //     // }
          //     //     if (e.target.value < 1) e.target.value = 1
          //     //     // if (e.target.value < 0) e.target.value *= -1
          //     // }}
          // />

          )})

          
          // : <NumericFormat
          //     // value={totalAmount}
          //     customInput={TextField}
          //     // onValueChange={handleChange}
          //     thousandSeparator=","
          //     // thousandsGroupStyle='thousand'
          //     decimalSeparator="."
          //     id={order}
          //     // defaultValue={getDefaultValueBy(basicInfo, field) || 0}
          //     defaultValue={newField.amount || 1}
          //     label={unitLabel(unit)}
          //     // type="number"
          //     size="small"
          //     InputLabelProps={{
          //       shrink: true,
          //     }}
          //     placeholder={remark}
          //     onValueChange={e => {

          //       setNewField(o => ({...o, amount: e.floatValue}))

          //       if (timer) clearTimeout(timer);
          //       timer = setTimeout(() => {

          //         handleSlotFilled(type, {...newField, amount: e.floatValue})
          //         // handleSlotChanged('amount', e.target.value)

          //       }, 100);


          //     }}
          //     onFocus={event => {
          //       event.target.select();
          //     }}
          //     // onClick={() => {
          //     //   if (!included) setIncluded(true)

          //     // }}
          //   //   onKeyUp={(e) => {
          //   //     // if (Number.isNaN(event.target.value)) {
          //   //     //   event.target.value = 0
          //   //     //   return
          //   //     // }
          //   //     if (e.target.value < 1) e.target.value = 1
          //   //     // if (e.target.value < 0) e.target.value *= -1
          //   // }}
          //   />
            }


            <Stack  direction={'row'}  spacing={1} flexGrow={2} >
              <NumericFormat
                // value={totalAmount}
                customInput={TextField}
                // onValueChange={handleChange}
                thousandSeparator=","
                // thousandsGroupStyle='thousand'
                decimalSeparator="."
                id={`a${order}`}
                defaultValue={field.a}
                value={newField.a}
                color={showReset ? "warning" : "success"}
                label={'อัตรา'}
                helperText={showReset && "กดปุ่มขวาเพื่อคืนค่าอัตราเดิม"}
                // type="number"
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="start">บาท</InputAdornment>
                }}
                placeholder={a ? `${a}` : '0'}
                onValueChange={e => {

                  setNewField(o => ({
                    ...o,
                    a: e.floatValue,
                    error: e.floatValue > a,
                    under: e.floatValue < a
                  }))
                  if (timer) clearTimeout(timer);
                  timer = setTimeout(() => {

                    // handleSlotChanged('a', e.target.value)
                    handleSlotFilled(type, {...newField, a: e.floatValue})
                  }, 100);



                }}
                onFocus={event => {
                  event.target.select();
                }}
                onKeyUp={(e) => {
                  // if (Number.isNaN(event.target.value)) {
                  //   event.target.value = 0
                  //   return
                  // }
                  // if (e.target.value < 1) e.target.value = 1
                  if (timer) clearTimeout(timer);
                  timer = setTimeout(() => {
                    if (e.target.value < 0) e.target.value *= -1
                  }, 100);


              }}
              />

              {/* {method === "free" && <FormControlLabel control={<Switch 
              onChange={(event) => {
                const ts = dayjs().valueOf()
                setReservedTimestamp(event.target.checked ? ts : "")
                setCustomUnits(o => ({
                  ...o,
                  [ts] : 'amount'
                }))
                    
                setNewField(o => ({
                  ...o,
                  timestamp: ts
                }))
              }} 
              defaultChecked={units !== 'amount'} />} label="เพิ่มหน่วย" />} */}

              {showReset && <Button variant="contained" color="error" size='small' onClick={handleClickOpen} >{remark || `ไม่เกิน ${THB(a)}`}
              </Button>}

            </Stack>


              {subtotal > 0
                  ? <Paper sx={{ p:2, m:2, border: 1, borderColor: 'orange'}} elevation={3}>
                  {newField.units && field.units === 'subtotal'
                    ? THB(subtotal)
                    : `${[...draftCalcFields, { key: 'a', label:''}].reduce((p, {key, label}) => ([p, [NUMBER(newField[key] || 1), label].join(" ")].join(p === "" ? "" : " x ")), "")}  = ${THB(subtotal)}`}
                </Paper>
               : <Box sx={{ p:1, m:1 }}><Typography  variant='caption'>ป้อนค่าต่าง ๆ เพื่อคำนวณ</Typography></Box>}
              {/* new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(number) */}
            </Stack>
          </Stack>
          <Stack direction={'row'}>
            <Box flexGrow={{ xs: 1, sm:  1}} />
            <Button sx={{ mb: {xs: 2, sm: 0}}} variant='contained' disabled={!newField.a} onClick={() => addItem(itemIndex)}>เพิ่มรายการ</Button>
            <Box flexGrow={{ xs: 1, sm: 0}} />
          </Stack>
          {/* {itemIndex} */}
        </Card>
      )



    return <div id={`${[order, numbering, timestamp].join("-")}`}>




    {((field.optionValue && !optionValue) ||field.optionValue && optionValue && (optionValue !== field.sectionHeader))
      ? <></>
    :
      included
      ?

      // <>{JSON.stringify(subtotalText)}</>
      (() => {
        if (field && field.units && field.units.split(" ").length) field.units.split(" ").forEach(unitKey => {

          calculationFields.push({
            key: unitKey,
            label: field.unitLabel || unitLabel(unitKey)
          })
        });

        if (!field.units.includes("subtotal")) calculationFields.push({ key: 'a', label:''})

        const fieldValue = calculationFields.reduce((p, {key, label}) => ([p, [NUMBER(field[key] || 1), label].join(" ")].join(p === "" ? "" : " x ")), "")

        // const thaiFieldValue = calculationFields.reduce((p, {key, label}) => ([p, [THAINUMBER(field[key] || 1), label].join(" ")].join(p === "" ? "" : " x ")), "")
        // // {f.index}. {f.name} ({f.calculation}บาท) เป็นเงิน {f.subtotal} บาท

        // console.log('thaiFieldValue',thaiFieldValue);
        // handleSlotFilled(type, {...newField, subtotalLabel: thaiFieldValue})
      return (<>

        <Chip sx={{ width: {sm: '100%', md: '80%'}}} variant='contained' // {field.under ? 'outlined' : 'contained'}
        icon={<Iconify icon={iconify(field.icon)} />}
        color={field.error ? 'error': 'success'} onDelete={() => handleDelete(itemIndex)}  label={`${name} ${field.units && field.units === 'subtotal' ? '' : `${fieldValue} = `}${THB(subtotal)}`} />

      </>)})()
      : field.remark && ['-', '(blank)', ''].includes(field.remark.trim().toLowerCase())
        ? <></>
        : multiplicable 
          ? originalField 
          : <></>
}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"ค่าอัตรา"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`ต้องการคืนค่าอัตราของ ${name} เป็นอัตราตั้งต้น ${THB(a)}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ปิด</Button>
          <Button variant='contained' color='warning' onClick={() => {
            setNewField(o => ({
              ...o,
              a: field.a,
              error: false,
              under: false
            }))
            handleClose()}} autoFocus>
            คืนค่า
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={warnToggling}
        onClose={handleWarningTogglingClose}
        aria-labelledby="alert-warntoggling-dialog-title"
        aria-describedby="alert-warntoggling-dialog-description"
      >
        <DialogTitle id="alert-warntoggling-dialog-title">
          {"มีรายการที่เพิ่มไว้"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-warntoggling-dialog-description">
            {`คุณมีรายการที่เพิ่มไว้ ยืนยันการลบรายการเดิมและเปลี่ยนประเภทการเบิกหรือไม่`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleWarningTogglingClose}>ปิด</Button>
          <Button variant='contained' color='warning' onClick={() => {
                // setNewField(o => ({...o, a: field.a}))
                // handleClose()

                console.log('ok');



              }
            }
            autoFocus>
            คืนค่า
          </Button>
        </DialogActions>
      </Dialog>
    </div>
}