const fetch = require('isomorphic-unfetch');

module.exports = async function find(sort = (a, b) => a.no > b.no) {
    let matches = new Map();
    await fetch('https://a.4cdn.org/pol/catalog.json')
        .then((r) => r.json())
        .then((data) => {
            for (let { threads } of data) {
                for (let thread of threads) {
                    matches.set(thread.no, thread);
                }
            }
        });
    return matches;
};
