import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const data = require('./data.json');

const typeData = (type) => {        

    const eventTypes = data[type]

    return eventTypes
};
export default typeData
