import { useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Stack } from '@mui/material';
import PropTypes from 'prop-types';



import { BudgetContext } from '../../../pages/EventFormPage';
import EventFormSlotFillingTextfield from './EventFormSlotFillingTextfield';
import BudgetCalculator from '../../../services/budgetCalculator';
import { THAINUMBER } from '../../../App';
import unitLabel from '../../../data/unitLabel';
// @mui

EventFormMainEventSlotFilling.propTypes = {

    currentMainActivity: PropTypes.object,

}

export default function EventFormMainEventSlotFilling(props) {

    const { pathname, hash, key } = useLocation();

    const { currentMainActivity } = props


    const {
        basicInfo,
        handleBasicInfoChanged,
        handleMainEventSlotfilled,
        prependMainActivitiesObjectInArray,
        removeMainActivitiesObjectFromArray,
        detailedCalculations
    } = useContext(BudgetContext);

    const [optionValues, setOptionValues] = useState(basicInfo && basicInfo.optionValues);


    const sectionFields = useMemo(() => {

        if (currentMainActivity && Object.values(currentMainActivity).length) {

          const fieldsObject = currentMainActivity.reduce((p, activity) => {

            if (activity.isSectionHeader) {
              // console.log('p[index]', p[index]);


              if (activity.sectionHeader) {
                // const sectionHeader = [index].split(".").pop().join(".")

                // console.log('having sectionHeader', activity.sectionHeader);
                // console.log('adding ', activity.sectionHeader, 'to', activity.sectionHeader);

                // console.log('p', p);
                if (p[activity.sectionHeader]) {
                  return {
                    ...p,
                    [activity.sectionHeader]: [...p[activity.sectionHeader], activity]
                  }
                } return {
                    ...p,
                    [activity.sectionHeader]: [activity]
                  }
              }


              if (!p[activity.numbering]) {


              // console.log('isSectionHeader', activity.numbering);
                return {
                ...p,
                [activity.numbering]: []
              }}
              return p
            }

            const index = activity.timestamp || activity.numbering
            if (activity.showSubtotal) {

              const parentsFieldValues = {}
              const rootFieldValues = {}

              if (activity.sectionHeader) {
                // const sectionHeader = [index].split(".").pop().join(".")

                // console.log('having sectionHeader', activity.sectionHeader);
                // console.log('adding ', index, 'to', activity.sectionHeader);

                // console.log('p', p);
                  if (p[activity.sectionHeader]) {
                    parentsFieldValues[activity.sectionHeader] = [...p[activity.sectionHeader], activity]
                  } else {
                    parentsFieldValues[activity.sectionHeader] = [activity]
                  }

              }

              if (activity.optionValue && optionValues && activity.sectionHeader) {

                if (activity.sectionHeader !== optionValues[activity.optionValue]) return p
                // console.log('adding ', index, 'to', activity.optionValue);
                if (p[activity.optionValue]) {

                  return {
                    ...p,
                    ...parentsFieldValues,
                    [activity.optionValue]: [...p[activity.optionValue], activity],
                    [index] : [activity]
                  }
                }
                return {
                  ...p,
                  ...parentsFieldValues,
                  [activity.optionValue]: [activity],
                  [index] : [activity]
                }
              }

              // if (activity.method === 'free') {

              // }

              // if (activity.sectionHeader) {
              //   // const sectionHeader = [index].split(".").pop().join(".")

                // console.log('having sectionHeader', activity.sectionHeader);
                // console.log('adding ', activity.sectionHeadser, 'to', activity.sectionHeader);

                // console.log('p', p);

              //   const parent = currentMainActivity.find(f => f.numbering === activity.sectionHeader)
              //   console.log('activity.sectionHeader', activity.sectionHeader);
              //   console.log('parent showSubtotal', parent && parent.showSubtotal);
              //   if (parent && parent.showSubtotal) {

              //     if (p[activity.sectionHeader]) {
              //       parentsFieldValues[activity.sectionHeader] = [...p[activity.sectionHeader], activity]
              //     } else {
              //       parentsFieldValues[activity.sectionHeader] = [activity]
              //     }



              //     // return {
              //     //   ...p,
              //     //   [activity.sectionHeader]: [activity]
              //     // }


              //   }


              // }

              if (p[index]) {

              // console.log('showSubtotal exists', index);
                return {
                  ...p,
                  ...parentsFieldValues,
                  [index]: [...p[index], activity]
                }
              }


              // console.log('showSubtotal new', index);

              return {
                  ...p,
                  ...parentsFieldValues,
                  [index]: [activity]
                }

            }


            if (activity.sectionHeader) {
              // const sectionHeader = [index].split(".").pop().join(".")

              // console.log('having sectionHeader', activity.sectionHeader);
              // console.log('adding ', index, 'to', activity.sectionHeader);

              // console.log('p', p);
              if (p[activity.sectionHeader]) {
                return {
                  ...p,
                  [activity.sectionHeader]: [...p[activity.sectionHeader], activity]
                }
              } return {
                  ...p,
                  [activity.sectionHeader]: [activity]
                }
            }


            // else
            if (activity.optionValue) {
              // const sectionHeader = [index].split(".").pop().join(".")

              if (!optionValues || !optionValues[activity.optionValue] || (activity.sectionHeader !== optionValues[activity.optionValue])) {

                // console.log('optionValues not matched', index);
                return p
              }

              // console.log('adding ', index, 'to', activity.optionValue);
              if (p[activity.optionValue]) {

                if (activity.sectionHeader !== optionValues[activity.optionValue]) return p
                return {
                  ...p,
                  [activity.optionValue]: [...p[activity.optionValue], activity]
                }
              }
              return {
                ...p,
                [activity.optionValue]: [activity]
              }
            }


            // console.log('others ', index);
            // console.log('adding ', index, 'to', index);
            if (p[index]) {
              return {
                ...p,
                [index]: [...p[index], activity]
              }
            }
            return {
                ...p,
                [index]: [activity]
            }




          }, {})

          return fieldsObject
        }
        return {}

      }, [currentMainActivity, optionValues])

    const fieldsSubtotals = useMemo(() => {


      // console.log('sectionFields', sectionFields);


        if (sectionFields) return Object.entries(sectionFields).reduce((p, [numbering, fields]) => {
          const budgetCalculator = new BudgetCalculator()

          const subtotal = {
            [numbering]: budgetCalculator.sectionSubTotal(fields.filter(f => {
              // console.log(f);
              if (f.sectionHeader && optionValues && optionValues && optionValues[f.optionValue]) {
                // console.log(f.sectionHeader, optionValues[f.optionValue]);
                // console.log(f.sectionHeader === optionValues[f.optionValue]);
              }
              return f.included && (!f.optionValue || (f.optionValue && f.sectionHeader === optionValues[f.optionValue]))
            })) //  ((field.optionValue && !optionValue) ||field.optionValue && optionValue && (optionValue !== field.sectionHeader))
          }
          if (subtotal[numbering] > 0) return {...p, ...subtotal}
          return p

        }, {})

        return {}

      }, [sectionFields, optionValues])

      useEffect(() => {

        if (!currentMainActivity || !Object.values(currentMainActivity).length) return
        if (fieldsSubtotals) {

          // console.log('fieldsSubtotals', fieldsSubtotals);

          const fields = currentMainActivity.reduce(( p, activity) => {

            const {
              name,
              numbering,
              timestamp,
              included,
              isSectionHeader,
              subtotalTitle,
              showSubtotal,
              method,
              explicitHeader=false,
              sectionHeader,
              optionValue,
              relation,
              useOptions,
              options,
              hideCalculation,
              units='amount'
            } = activity

            const rowNum = timestamp || numbering
            if (!fieldsSubtotals[rowNum]) return p
            // if (!showSubtotal) return p


            const calculationFields = []
            // const units = (field && field.units) || 'amount'
            if (units && units.split(" ").length) {
              units.split(" ").forEach(unitKey => {
              calculationFields.push({
                key: unitKey,
                label: activity.unitLabel || unitLabel(unitKey)
              })
            });

              if (!units.includes("subtotal")) calculationFields.push({ key: 'a', label:''})

            }

            const rowName = explicitHeader  ? ''  : (subtotalTitle || name)

            const fieldValue = units === 'subtotal'
                ? `${rowName}${(sectionHeader && !explicitHeader) ? ` เป็นเงิน ${THAINUMBER(fieldsSubtotals[rowNum])} บาท` : ''}`  // 

                // ${method == 'free' 
                // ? ` เป็นเงิน ${THAINUMBER(fieldsSubtotals[rowNum])} บาท` 
                // : ''}
                : `${rowName} (${calculationFields
                  .reduce((text, {key, label}) =>
              ([text, [THAINUMBER(activity[key] || 1), label].join(" ")]
              .join(text === "" ? "" : " x ")), "")}บาท)${(detailedCalculations && !explicitHeader) 
                ? ` = ${THAINUMBER(fieldsSubtotals[rowNum])} บาท`
                : ''}`

              // console.log('fieldValue', fieldValue);
              // console.log('activity', subtotalTitle || name, rowNum, 'showSubtotal', showSubtotal);


            if (showSubtotal) {

              const onlyShowSubtotal = units === 'subtotal'


              const index = Object.entries(p).length + 1 // (!isSectionHeader && sectionHeader ? 0 : 1)
              // console.log('index', index);

              // console.log('using detailedCalculations', detailedCalculations);
              if (!detailedCalculations) {

                if (!hideCalculation) {


                  console.log(name, ' not hiding Calculation');


                  return {
                    ...p,
                    [rowNum]: {
                      index : THAINUMBER(index),
                      name: subtotalTitle || name,
                      explicitHeader,
                      onlyShowSubtotal,
                      calculation: fieldValue,
                      subtotal : THAINUMBER(fieldsSubtotals[rowNum])
                    }
                  }
                }

                if (useOptions) {

                  console.log('using options');
                  return {
                    ...p,
                    [rowNum]: {
                      index : THAINUMBER(index),
                      name: subtotalTitle || name,
                      calculations: [],
                      subtotal : THAINUMBER(fieldsSubtotals[rowNum])
                    }
                  }
                }

                // only show subtotal
                if (sectionHeader) {

                  console.log('having sectionheader');

                  const { calculations=[], ...others } = p[sectionHeader] || {}
                  let optionValueObject = {}
                  if (optionValue) {

                    const { calculations=[], ...others } = p[optionValue] || {}
                    optionValueObject =  {
                      ...others,
                      calculations : [...calculations, fieldValue]
                    }
                    console.log('optionValueObject', optionValueObject);
                  }

                  console.log(`${subtotalTitle || name} เป็นรายการย่อยของ ${sectionHeader}`);
                  console.log('others', others);
                  return {
                    ...p,
                    [sectionHeader]:  {
                      ...others,
                      calculations: [...calculations, fieldValue],
                    },
                    [optionValue] : optionValueObject,
                    [rowNum]: fieldValue
                  }
                }
                return p
              }

              if (explicitHeader) {
                const index = Object.entries(p).length + 1 // (!isSectionHeader && sectionHeader ? 0 : 1)
                // console.log(explicitHeader, index);

                let optionValueObject = {}
                let sectionHeaderObject = {}

                // if (options && sectionHeader && hideCalculation) {

                //   console.log('having options and sectionHeader', rowNum);
                //   console.log('returning one with explicitHeader with options');

                //     return {
                //       ...p,
                //       [sectionHeader]: {
                //         index : THAINUMBER(index),
                //         name: subtotalTitle || name,
                //         calculations : [],
                //         subtotal : THAINUMBER(fieldsSubtotals[sectionHeader])
                //       }

                //     // }
                //   }
                //  }



                if (optionValue) {

                  // console.log('having optionValue ', optionValue);

                  const { calculations=[], ...others } = p[optionValue] || {}
                  if (fieldValue) optionValueObject =  {
                    ...others,
                    calculations : [...calculations, fieldValue]
                  }
                  // console.log('optionValueObject', optionValueObject);
                }

                if (sectionHeader) {

                  // console.log('having sectionHeader ', sectionHeader);

                  const { calculations=[], ...others } = p[sectionHeader] || {}
                  if (fieldValue) sectionHeaderObject =  {
                    ...others,
                    calculations : [...calculations, fieldValue]
                  }
                  // console.log('sectionHeaderObject', sectionHeaderObject);
                }

                // console.log('returning one with explicitHeader ');

                return {
                  ...p,
                  [rowNum] : {
                    index : THAINUMBER(index),
                    name: subtotalTitle || name,
                    calculation: fieldValue,
                    explicitHeader,
                    onlyShowSubtotal,
                    subtotal : THAINUMBER(fieldsSubtotals[rowNum])
                  },
                  ...optionValueObject ? {[optionValue] : optionValueObject} : {},
                  ...sectionHeaderObject ? {[sectionHeader] : sectionHeaderObject} : {}
                }


              }

              if (isSectionHeader) {

                  if (options && sectionHeader && hideCalculation) {
                    // f.included && (!f.optionValue || (f.optionValue && f.sectionHeader === optionValues[f.optionValue]))
                    return {
                      ...p,
                      [rowNum]: {
                        index : THAINUMBER(index),
                        name: subtotalTitle || name,
                        calculations: [],
                        subtotal : THAINUMBER(fieldsSubtotals[rowNum])
                      }
                    }
                  }
                  if (sectionHeader) {

                    const { calculations=[], ...others } = p[sectionHeader] || {}

                    // console.log(`${subtotalTitle || name} เป็นรายการย่อยของ ${sectionHeader}`);
                    // console.log('others', others);
                    // console.log('returning deepest with calculation');
                    return {
                      ...p,
                      [sectionHeader]:  {
                        ...others,
                        calculations: [...calculations, fieldValue]
                      },
                      // [optionValue] : optionValueObject,
                      [rowNum]: {
                        index : THAINUMBER(index),
                        explicitHeader,
                        onlyShowSubtotal,
                        name: explicitHeader ? "" : subtotalTitle || name,
                        calculation: fieldValue,
                        subtotal : THAINUMBER(fieldsSubtotals[rowNum])
                      }
                    }
                  }


                return {
                  ...p,
                  [rowNum]: {
                    index : THAINUMBER(index),
                    name: subtotalTitle || name,
                    calculations: [],
                    subtotal : THAINUMBER(fieldsSubtotals[rowNum])
                  }
                }
              }


              // only show subtotal
              if (sectionHeader) {

                // console.log(`${subtotalTitle || name} เป็นรายการย่อยของ ${sectionHeader}`);

                // let optionValueObject = {}
                //   if (optionValue) {

                //     console.log('having optionValue', optionValue);

                //     const { calculations=[], ...others } = p[optionValue] || {}
                //     optionValueObject =  {
                //       ...others,
                //       calculations : [...calculations, fieldValue]
                //     }
                //     console.log('optionValueObject', optionValueObject);
                //   }
                const parentRowNum = optionValue || sectionHeader


                // console.log('returning deepest with calculation');
                if (p[parentRowNum]) {


                const { calculations=[], ...others } = p[parentRowNum]
                // console.log('others', others);

                  return {
                    ...p,
                    [parentRowNum]:  {
                      ...others,
                      calculations: [...calculations, fieldValue]
                    },
                    [rowNum]: {
                      index : THAINUMBER(index),
                      explicitHeader,
                      onlyShowSubtotal,
                      name: explicitHeader ? "" : subtotalTitle || name,
                      calculation: fieldValue,
                      subtotal : THAINUMBER(fieldsSubtotals[rowNum])
                    }
                  }
                }
                return {
                    ...p,
                    [parentRowNum]: {
                      calculations: [fieldValue]
                    },
                    [rowNum]: {
                      index : THAINUMBER(index),
                      explicitHeader,
                      onlyShowSubtotal,
                      name: explicitHeader ? "" : subtotalTitle || name,
                      calculation: fieldValue,
                      subtotal : THAINUMBER(fieldsSubtotals[rowNum])
                    }
                  }

              }


            // console.log('returning common field');
              return {
                ...p,
                [rowNum] : {
                  index : THAINUMBER(index),
                  name: subtotalTitle || name,
                  calculation: fieldValue,
                  explicitHeader,
                  onlyShowSubtotal,
                  subtotal : THAINUMBER(fieldsSubtotals[rowNum])
                }
              }


            }
            return p
          }, {})

          handleBasicInfoChanged('fields', Object.values(fields))

        }

      }, [fieldsSubtotals, currentMainActivity]);


      useEffect(() => {
        if (optionValues) handleBasicInfoChanged('optionValues', optionValues)
        // console.log('optionValues', optionValues);

      }, [optionValues]);

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

    const currentActivityTextFields = useMemo(() => {


        if (!currentMainActivity || !basicInfo.eventType) return (<></>)


        return currentMainActivity.map((field, index) => {
            // console.log('field of currentMainActivity ', field);


            const optionValue = optionValues && (optionValues[field.numbering] || optionValues[field.sectionHeader] || optionValues[field.optionValue])
            return (
                <EventFormSlotFillingTextfield
                key={`field-${index}-${basicInfo.eventType}${field.numbering}${field.timestamp}`}
                field={field}
                options = {(field.useOptions && currentMainActivity
                  .filter(a => a.options && a.sectionHeader === field.numbering)
                  .map(a => ({
                    label: a.name,
                    value: a.numbering
                  }))) || []
                  }
                optionValue={optionValue}
                setOptionValues={setOptionValues}
                type={basicInfo.eventType}
                itemIndex={index}
                multiplicable={field.multiplicable || (!field.multiplicable && currentMainActivity.find(f => f.numbering === field.numbering))}
                subtotalText={basicInfo && basicInfo.fields && basicInfo.fields[field.numbering]}
                handleSlotFilled={handleMainEventSlotfilled}
                fieldsSubtotals={fieldsSubtotals}
                prependObjectInArray={prependMainActivitiesObjectInArray}
                removeObjectFromArray={removeMainActivitiesObjectFromArray}
              />
            )
        })

    }, [currentMainActivity, optionValues])

    if (!currentMainActivity || !basicInfo.eventType) return (<></>)

    return (
        <Stack spacing={2} sx={{ p: 1 }} bgcolor="grey" >
                {currentActivityTextFields}
            </Stack>
    )
}

