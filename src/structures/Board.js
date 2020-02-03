const EventEmitter = require('events');
const fetch = require('isomorphic-unfetch');
const assign = require('object-assign');
const Thread = require('./Thread');

// prettier-ignore
const IMPORTANT_KEYS = [
    "no", "closed", "sub", "filename", 
    "ext", "tim", "replies", "images", 
    "id", "country", "last_modified" 
];

class Board extends EventEmitter {
    constructor(name) {
        super();
        this.name = name;
        Object.defineProperty(this, 'threads', {
            configurable: true,
            writable: false,
            enumerable: true,
            value: new Map()
        });
    }

    // prettier-ignore
    async update(dest = 'catalog') {
        let reduced=(await this.reduced('catalog')).map(thread=> assign(thread, {
            closed: "closed" in thread ? thread.closed : false
        }));
        let threads=this.threads,values=[...threads.values()].map(thread=>assign(thread, {
            closed: reduced.find((t) => t.no == thread.no) == null
        }));
        
        // new threads
        const created = reduced.filter(({no})=>!threads.has(no));
        created.forEach(data=>{
            this.emit("created", data, this);
            threads.set(data.no, new Thread(data));
        }, this);

        // updated threads
        const updated = reduced.filter((d)=>threads.has(d.no)&&threads.get(d.no).update(d));
        updated.forEach(data=>this.emit("updated", data, this), this);

        // removed threads
        const removed = values.filter((d)=>threads.has(d)&&d.closed);
        removed.forEach(data=>{
            this.emit("removed", data, this);
            threads.delete(data.no)
        }, this);
    }

    async pages(dest = 'threads') {
        if (dest != 'threads' && dest != 'catalog')
            throw new TypeError("dest expected 'threads' or 'catalog`");
        return await fetch(
            `https://a.4cdn.org/${this.name}/${dest}.json`
        ).then((r) => r.json());
    }

    async reduced(dest = 'threads') {
        return (await this.pages(dest)).reduce(
            (p, c) => [...p, ...c.threads],
            []
        );
    }

    async filtered(pattern) {
        if (pattern instanceof RegExp || 'string' == typeof pattern)
            return (await this.reduced('catalog')).filter((thread) =>
                pattern.test(thread.sub)
            );
        else return [];
    }
}

module.exports = Board;
