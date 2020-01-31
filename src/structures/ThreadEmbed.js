const { RichEmbed } = require("discord.js");

class ThreadEmbed extends RichEmbed {
    constructor(thread, active=true) {
        super({
            author: { name: `${thread.sub}` },
            title: active
                ? `https://boards.4chan.org/pol/thread/${thread.no}`
                : `https://archive.4plebs.org/pol/thread/${thread.no}`,
            image: {
                url: `https://i.4cdn.org/pol/${thread.tim}${thread.ext}`
            },
            color: active ? 0x00ff00 : 0xff0000,
            fields: [
                {
                    inline: false,
                    name: "replies",
                    value: `${thread.replies}`
                },
                {
                    inline: false,
                    name: "created",
                    value: `${thread.now}`
                }
            ]
        });
    }
}

module.exports = ThreadEmbed;