const fetch = require('isomorphic-unfetch');

async function pages() {
    return await fetch('https://a.4cdn.org/pol/threads.json').then((r) =>
        r.json()
    );
}

async function threads() {
    return (await pages())
        .map((page) => page.threads)
        .reduce((p, c) => [...p, ...c]);
}

async function has(no) {
    for (const thread of await threads()) {
        if (thread.no == no) return true;
    }
    return false;
}

module.exports.pages = pages;
module.exports.threads = threads;
module.exports.has = has;
