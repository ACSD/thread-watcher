const fetch = require('isomorphic-unfetch');

//TODO improve pattern validation
module.exports = async function find(
    pattern,
    options = {
        sort: (a, b) => a.no > b.no
    }
) {
    let matches = [];
    await fetch('https://a.4cdn.org/pol/catalog.json')
        .then((r) => r.json())
        .then(async (data) => {
            for (let { threads } of data) {
                for (let thread of threads) {
                    if (!pattern || !pattern.test(thread.sub)) continue;
                    matches.push(thread);
                }
            }
            await matches.sort(options.sort);
        });
    return matches;
};
