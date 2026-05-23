import dayjs from 'dayjs';
import preval      from 'preval.macro';
import packageJson from '../../../../package.json';

import('dayjs/plugin/relativeTime')
import('dayjs/locale/th')

const LocalizedFormat = require('dayjs/plugin/localizedFormat')

const buddhistEra = require('dayjs/plugin/buddhistEra')

dayjs.extend(LocalizedFormat)
dayjs.extend(buddhistEra)

const buildTimestamp = preval`module.exports = new Date().getTime();`;


export default function BuildTime() {
    
    const getDateString = () => {

        const lastUpdateMoment = dayjs(buildTimestamp);
        const formattedDate    = lastUpdateMoment.locale('th').format('วันdddที่ D MMMBBBB, LTS');
        // console.log(formattedDate);

        return formattedDate;
    };

    return (
        <div>
            {packageJson.version}
            {'.'}
            {buildTimestamp}
            {' '}
            {'('}
            {getDateString()}
            {')'}
        </div>
    );
}