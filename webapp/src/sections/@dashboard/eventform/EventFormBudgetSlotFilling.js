import { useContext, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { Stack } from '@mui/material';
import PropTypes, { number } from 'prop-types';


import { faker } from '@faker-js/faker';

import { BudgetContext } from '../../../pages/EventFormPage';
import EventFormSlotFillingTextfield from './EventFormSlotFillingTextfield';
import BudgetCalculator from '../../../services/budgetCalculator';
// @mui

EventFormBudgetSlotFilling.propTypes = {

    currentActivity: PropTypes.object

}

export default function EventFormBudgetSlotFilling(props) {

    const { pathname, hash, key } = useLocation();

    const { currentActivity } = props

    const {
      basicInfo,
      handleBudgetSlotfilled,
      prependObjectInArray,
      removeObjectFromArray,
    } = useContext(BudgetContext);

    const budgetCalculator = new BudgetCalculator()

    const sectionFields = useMemo(() => {

      if (currentActivity && Object.values(currentActivity).length) {
        
        const fieldsObject = currentActivity.reduce((p, activity) => {

          if (activity.showSubtotal) {
            // console.log('p[activity.numbering]', p[activity.numbering]);
            if (!p[activity.numbering]) return {
              ...p,
              [activity.numbering]: []
            }
          } else if (activity.sectionHeader) {
              // const sectionHeader = [activity.numbering].split(".").pop().join(".")

              // console.log('p', p);
              if (p[activity.sectionHeader]) {
                return {
                  ...p,
                  [activity.sectionHeader]: [...p[activity.sectionHeader], activity]
                }
              } 
              return {
                  ...p,
                  [activity.sectionHeader]: [activity]
              }                               
            }                    
          return p
        }, {})
      
        return fieldsObject
      }
      return {}

    }, [currentActivity])

    const fieldsSubtotals = useMemo(() => {
      
      
      console.log('sectionFields', sectionFields);
      
      if (sectionFields) return Object.entries(sectionFields).reduce((p, [numbering, fields]) => {
        console.log('numbering', numbering);
        console.log('fields', fields);
        const subtotal = {
          [numbering]: budgetCalculator.sectionSubTotal(fields.filter(f => f.included )) //  && (!f.optionValue || (f.optionValue && f.sectionHeader !== optionValues[f.optionValue])))) //
        }
        return {...p, ...subtotal}
           
      }, {})

      return {}

    }, [sectionFields])

    const currentActivityTextFields = useMemo(() => {


        if (!currentActivity || !basicInfo.type) return (<></>)

        
        return currentActivity.map((field, index) => {    
            // console.log('field of currentActivity ', field);
            
            return (
                <EventFormSlotFillingTextfield 
                key={`field-${index}-${basicInfo.type}${field.numbering}${field.timestamp}`}
                field={field} 
                type={basicInfo.type} 
                itemIndex={index}
                handleSlotFilled={handleBudgetSlotfilled}
                fieldsSubtotals={fieldsSubtotals}
                prependObjectInArray={prependObjectInArray}
                removeObjectFromArray={removeObjectFromArray}
              />                    
            )
        })

    }, [currentActivity])


    useEffect(() => {
        // if not a hash link, scroll to top
        if (hash === '') {
          // window.scrollTo(0, 0);
        }
        // else scroll to id
        else {
          setTimeout(() => {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
              element.scrollIntoView({
                block: 'center',
              });
              const elementCard = document.getElementById(`card-${id}`)
              elementCard.classList.add('highlight');
                setTimeout(() => {
                  elementCard.classList.remove('highlight');
                }, 1000)
            }
          }, 0);
        }
      }, [pathname, hash, key]); // do this on route change
    
    
    return (<>
            <Stack spacing={2} sx={{ p: 1 }} bgcolor="grey" >      
                {currentActivityTextFields}
            </Stack>
          </>
    )
}

