const users = require('./personnel.json');

const onepusers = users.map((u, index) => ({id: index,
    ...u}))

export default onepusers;
