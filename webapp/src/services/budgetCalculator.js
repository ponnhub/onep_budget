import typeData from '../data/typeData';


class BudgetCalculator {



    eventBudget = ({type, optionValues, activity}) => {

        this.total = 0
        if (!type) return this.total


        const td = activity || typeData(type)

        // function getDefaultValueBy(basicInfo, unit, amount) {
        //     switch (unit) {
        //       case 'day':
        //         return (amount || (basicInfo && Number(basicInfo.daystotal))) || 0;

        //       default:
        //         return 0;
        //     }
        //   }

        // const optionValues = td.reduce((p, field) => {
        //   if (field.useOptions) {
        //     console.log('====================================');
        //     console.log(field);
        //     console.log('====================================');
        //     return {
        //       ...p,
        //       [field.numbering] : field.optionValue
        //     }
        //   }
        //   return p
        // }, {})

        // console.log('====================================');
        // console.log('optionValues', optionValues);
        // console.log('====================================');

          this.total = td.reduce((p, field) => {

            const {
              included,
              order,
              unit,
              amount=1,
              a=0,
              day=1,
              night=1,
              room=1,
              meal=1,
              hour=1,
              leg=1,
              bag=1,
              book=1,
              km=1,
              assessee=1,
              event=1,
              person=1,
              place=1

            } = field

            // console.log('field.optionValue', field.optionValue, field.sectionHeader, field.sectionHeader !== optionValues[field.optionValue]);
            // if (field.optionValue && (optionValues[field.optionValue] && (field.sectionHeader !== optionValues[field.optionValue]))) {
            //   return p
            // }
            const selected = !field.optionValue || (optionValues && optionValues[field.optionValue] && field.optionValue && field.sectionHeader === optionValues[field.optionValue])
            if (!included || !selected || !a) return p
            // && (!f.optionValue || (f.optionValue && f.sectionHeader === optionValues[f.optionValue]))

            // const customAmount = (activity && activity[`${basicInfo.type}.${order}`])
            // ? Number(activity[`${basicInfo.type}.${order}`])
            // : getDefaultValueBy(basicInfo, unit, amount)


            p += [amount,
              a,
              day,
              night,
              room,              
              meal,
              hour,
              leg,
              bag,
              book,
              km,
              assessee,
              event,
              person,
              place].reduce((subtotal, multiplier) => (subtotal * multiplier), 1)

            return p
        }, 0)

        return this.total
    }

    fieldSubTotal = (field) => {

      this.subtotal = 0


      const {
        amount=1,
        a=0,
        day=1,
        night=1,
        room=1,
        meal=1,
        hour=1,
        leg=1,
        bag=1,
        book=1,
        km=1,
        assessee=1,
        event=1,
        person=1,
        place=1

      } = field

      this.subtotal = [amount,
        a,
        day,
        night,
        room,
        meal,
        hour,
        leg,
        bag,
        book,
        km,
        assessee,
        event,
        person,
        place].reduce((subtotal, multiplier) => (subtotal * multiplier), 1)

      return this.subtotal
    }

    sectionSubTotal = (fields) => {

      this.subtotal = fields.reduce((p, field) => p + this.fieldSubTotal(field), 0)
      return this.subtotal


    }

}

export default BudgetCalculator