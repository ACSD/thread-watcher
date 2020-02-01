const fetch = require('isomorphic-unfetch');

async function pages() {
    return await fetch('https://a.4cdn.org/pol/threads.json').then((r) =>
        r.json()
    );
}

module.exports = async function stats() {
    return (await pages())
        .map((page) => page.threads)
        .reduce((p, c) => [...p, ...c]);
};

module.exports.pages = pages;
