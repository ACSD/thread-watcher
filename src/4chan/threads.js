const fetch = require('isomorphic-unfetch');

/**
 TODO implement pattern logic
 TODO implement sort logic 
*/
module.exports = async function threads() {
    let threads = [];
    await fetch('https://a.4cdn.org/pol/threads.json').then(
        (r) => (threads = r.json())
    );
    return threads;
};
