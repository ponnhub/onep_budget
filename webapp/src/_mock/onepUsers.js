import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const users = require('../data/personnel.json');

const onepusers = users.map((u, index) => ({id: faker.datatype.uuid(),
    avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
    name: faker.name.fullName(),
    company: faker.company.name(),
    isVerified: faker.datatype.boolean(),
    status: sample(['active', 'รออนุมัติ']),
    role: sample([
      'Leader',
      'Hr Manager',
      'UI Designer',
      'UX Designer',
      'UI/UX Designer',
      'Project Manager',
      'Backend Developer',
      'Full Stack Designer',
      'Front End Developer',
      'Full Stack Developer',
    ]), ...u}))

export default onepusers;
