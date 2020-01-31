const fetch = require('isomorphic-unfetch');

//TODO implement pattern logic
//TODO implement sort logic
module.exports = async function catalog() {
    let catalog = [];
    await fetch('https://a.4cdn.org/pol/catalog.json').then(
        (r) => (catalog = r.json())
    );
    return catalog;
};
