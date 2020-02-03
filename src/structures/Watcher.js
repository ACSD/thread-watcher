const boards = require('../util/boards');
const Board = require('./Board');
const { RichEmbed } = require('discord.js');

const embed = (data, board) => {
    return new RichEmbed({
    author: { name: `${data.sub}` },
    title: `https://boards.4chan.org/${board.name}/thread/${data.no}`,
    image: { url: `https://i.4cdn.org/pol/${data.tim}${data.ext}` },
    color: data.closed ? 0xff0000 : (data.replies > 0 ? 0x00ff00 : 0xffff00),
    fields: [
        {
            inline: false,
            name: "created",
            value: `${data.now}`
        },
        {
            inline: false,
            name: 'replies',
            value: `${data.replies}`
        },
        {
            inline: false,
            name: 'last modified',
            value: `${new Date(data.last_modified)}`
        }
    ].slice(0, data.replies > 0 ? 2 : 0)
})
};

class Watcher {
    constructor(channel, pattern, boardlist) {
        this.channel = channel;
        this.pattern = pattern;
        this.messages = new Map();
        boardlist.forEach(this.add_listeners, this);
    }

    kill() {
        boardlist.forEach(this.remove_listeners, this);
    }

    add_listeners(name) {
        const board = boards.get(name);

        this.__created = board.on('created', async (data, board) => {
            if (this.pattern.test(data.sub)) await this.created(data, board);
        });
        this.__updated = board.on('updated', async (data, board) => {
            if (this.pattern.test(data.sub)) await this.updated(data, board);
        });
        this.__removed = board.on('removed', async (data, board) => {
            if (this.pattern.test(data.sub)) await this.removed(data, board);
        });
    }

    remove_listeners(name) {
        const board = boards.get(name);
        board.removeListener('created', this.__created);
        board.removeListener('updated', this.__updated);
        board.removeListener('removed', this.__updated);
    }

    // prettier-ignore
    async created(data, board) {
        this.messages.set(data.no, await this.channel.send(embed(data,board)));
    }

    async updated(data, board) {
        if (!this.messages.has(data.no)) return;
        await this.messages.get(data.no).edit(embed(data,board));
    }

    async removed(data, board) {
        if (!this.messages.has(data.no)) return;
        await this.messages.get(data.no).edit(embed(data,board));
        await this.messages.delete(data.no);
    }
}

module.exports = Watcher;
