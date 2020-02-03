//const { Collection } = require('discord.js');
const assert = require('assert');
const catalog = require('../4chan/catalog');
const threads = require('../4chan/threads');
const ThreadEmbed = require('./ThreadEmbed');

class ThreadWatcher {

    constructor(channel, regex = '', frequency = process.env.BOT_FREQUENCY) {
        assert( regex != null && 
                (regex instanceof RegExp || ('string' == typeof regex && regex.length > 0)),
            'first argument expected a regexp or a rexexp string with length greter than 0'
        );
        this.channel = channel;
        this.threads = new Map();
        this.messages = new Map();
        this.regex = regex instanceof RegExp ? regex : new RegExp(regex);
        this.interval = setInterval(this.update.bind(this), frequency);
        this.lastno = 0;
    }

    async update() {
        //console.log('update');
        let messages = this.messages;
        messages.forEach((value, key) => {
            if (value.deleted) this.delete(key);
        });
        let actives = await threads();
        let results = await catalog.find(this.regex);

        let updates = results
            .filter((thread) => this.threads.has(thread.no))
            .filter((thread) => {
                const { no, replies } = thread;
                if (replies != this.threads.get(no).replies) {
                    console.log(`${no}:\t${this.threads.get(no).replies} > ${replies}`);
                    this.threads.set(no, thread);
                    return true;
                }
                return actives.find((t) => t.no == thread.no) == null;
            });

        await updates.forEach(async (thread) => {
            const active = actives.find((t) => t.no == thread.no) != null;
            await messages.get(thread.no).edit(new ThreadEmbed(thread, active));
            if (!active) {
                console.log(`${thread.no}:\tdeactivating`);
                this.delete(thread.no);
            }
        });

        results
            .filter((t) => t.no > this.lastno && !this.threads.has(t.no))
            .map(async (t) => {
                this.set(t.no, t);
                if (t.no > this.lastno) this.lastno = t.no;
            });
    }

    async set(key, value) {
        this.messages.set(key, await this.channel.send(new ThreadEmbed(value)));
        this.threads.set(key, value);
    }

    delete(key) {
        this.messages.delete(key);
        this.threads.delete(key);
    }

    kill() {
        clearInterval(this.interval);
    }
}

module.exports = ThreadWatcher;
