const moment = require('moment');

const helpers = {};

helpers.timeago = (timestamp) =>  {
    const time = moment(timestamp).fromNow();
    return time;
}


module.exports = helpers;