const fetch = require('isomorphic-unfetch');


async function pages() {
    return await fetch('https://a.4cdn.org/pol/catalog.json').then((r) =>
        r.json()
    );
}

async function threads() {
    return (await pages()).map(page=>page.threads).reduce((p, c)=>[...p,...c]);
};

async function find(pattern) {
    pattern = pattern instanceof RegExp ? pattern : new RegExp(pattern);
    return (await threads()).filter(thread=>pattern.test(thread.sub));
};

module.exports.pages = pages;
module.exports.threads = threads;
module.exports.find = find;
