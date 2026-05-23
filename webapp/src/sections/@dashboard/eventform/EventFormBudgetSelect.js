import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Paper, Skeleton, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';

import TextField from '@mui/material/TextField';
import 'dayjs/locale/th';
import { BudgetContext } from '../../../pages/EventFormPage';
import DataService from '../../../services/dataservice';
import { ONEP_PLAN_COLORS, ONEP_PLAN_KEYS } from '../../../data/constants';
import Iconify from '../../../components/iconify';

// @mui

EventFormBudgetSelect.propTypes = {

    handleBasicInfoChanged: PropTypes.func
    
}


export default function EventFormBudgetSelect(props) {

  const { handleBasicInfoChanged } = props

  const {basicInfo} = useContext(BudgetContext);

  const [budgetPlan, setBudgetPlan] = useState(basicInfo && basicInfo.budgetPlan);

  const ds = new DataService()

  let timer

  const queryName = useRef()

  // const [planfullpath, setPlanfullpath] = useState("");

  const [queryNameDone, setQueryNameDone] = useState(true);

  const [editingName, setEditingName] = useState(true);

  const [hideProgressBar, setHideProgressBar] = useState(true);

  const [editingBudgetplan, setEditingBudgetplan] = useState(!budgetPlan);

  const getBestMatchedPlan = () => {

    const text = queryName.current.value
    console.log('text', text);
    setQueryNameDone(false)
    setHideProgressBar(false)

    ds.getPlanWithNameQuery(text)
    .then( planpath  => {
      console.log(planpath);
      if (planpath) {
        // queryName.current.value = planpath
        setBudgetPlan(planpath)
      }
    })
    .catch(e => {
      console.log(e);
    })
    .finally(_ => {
      setHideProgressBar(true)
      setEditingName(false)
      setQueryNameDone(true)
    })
  }

  const showSkeleton = useMemo(() => editingName && !queryNameDone, [editingName, queryNameDone])


  let d = "รายการ"
    return (
        <Paper key={'budgetplaninfo'} elevation={12} sx={{ borderRadius:2, borderColor:'lightgrey'  }}>
            <Stack spacing={2} sx={{ p: 3 }} direction={"column"} >

            <TextField
                id={'queryplanpath'}
                inputRef={queryName}
                // defaultValue={planInfo}
                label={"ค้นหาแผนงาน/กิจกรรม"}
                type="text"
                InputLabelProps={{
                    shrink: true,
                }}
                placeholder={'พิมพ์เพื่อค้นหาและเลือก'}
                variant="standard"
                disabled={!editingBudgetplan}
                onChange={() => {
                  setEditingName(true)
                  if (timer) clearTimeout(timer);
                      timer = setTimeout(() => {
                          getBestMatchedPlan()
                      }, 500);
                  }
                }
            />
            {budgetPlan && budgetPlan.budgetplancodes ? <>
              <Typography>
                {budgetPlan.planresolved && <Iconify
                style={{ cursor: editingBudgetplan ? 'default' : 'pointer'}}
                  onClick={() => {
                    if (editingBudgetplan) return                  
                    setEditingBudgetplan(true)
                    setBudgetPlan()
                    handleBasicInfoChanged('budgetPlan', {})
                  }}
                  icon="material-symbols:push-pin" color={!editingBudgetplan ? "red" : "lightgray"} />}
                รหัส {budgetPlan.budgetplancodes}</Typography>
              {budgetPlan.planresolved && <div>
                {Object.entries(ONEP_PLAN_KEYS).map(([key, value]) => {
                  if (budgetPlan.planresolved[key]) {                    
                  d = value
                  return (<Typography key={key} color={ONEP_PLAN_COLORS[key]}>{value} : {budgetPlan.planresolved[key]}</Typography>)}
                  return <></>
                })

                }
                {editingBudgetplan && <Button variant='contained'
                onClick={() => {

                  queryName.current.value= ""
                  handleBasicInfoChanged('budgetPlan', budgetPlan)
                  setEditingBudgetplan(false)

                }} >
                  {`เลือก${d}นี้`}</Button>}
                </div>}
              </>
              : showSkeleton
                ? <>
                      
                  <Skeleton variant="rectangular" animation='wave' width='80%' />
                  <Skeleton variant="rectangular" animation='wave' />
                  <Skeleton variant="rectangular" animation='wave' />
                  <Skeleton variant="rectangular" animation='wave' />
          
                </> : <></>
            }
        </Stack>
</Paper>

    )

}

