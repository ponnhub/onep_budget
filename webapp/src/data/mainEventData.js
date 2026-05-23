import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const data = require('./data.json');

const mainEventData = (type) => {        
    const keys = data.events.map(e => (e.event))

    const mainEventsData = keys.reduce((p, k) => {
        if (data[k]) {
            p[k] = data[k]
        }
        return p
    }, {})

    return mainEventsData[type]
};
export default mainEventData
