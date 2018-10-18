const _ = require('lodash');
module.exports = (users, column = 'firstName', direction = 'down') => {
    let result = _.sortBy(users, column);
    switch (direction) {
        case('down'): {
            return result;
        }
        case('up'): {
            return result.reverse();
        }
    }
}

