const { Permissions, TextChannel, RichEmbed } = require('discord.js');
const Command = require('../structures/Command');
const { catalog } = require('../4chan');

const FLAGS = Permissions.FLAGS;

module.exports = new Command(
    {
        name: 'find',
        description: '',
        usage: 'find pattern',
        requires: new Permissions([FLAGS.SEND_MESSAGES, FLAGS.EMBED_LINKS]),
        permissions: new Permissions([FLAGS.EMBED_LINKS]),
        overrides: ['672933798224068658'],
        channels: {
            mode: "whitelist",
            list: [ "672263292781068288", "672254609615486996" ]
        }
    },
    async ({ channel }, pattern = '', page = '1') => {
        if (!pattern instanceof RegExp && 'string' != typeof pattern)
            return 'expected pattern, string, or no arguments';

        // prettier-ignore
        if ('string' != typeof page &&
            !/[0-9]+/.test(page) &&
            (page = parseInt(page)) == 0
        ) return 'expected a positive integer';

        // prettier-ignore
        if ('string' === typeof pattern)
            switch (pattern) {
                case '': pattern = '.*'; break;
                case 'page-number':
                    return `no not literally${
                        process.env.INSULT_0 != 'GITHUB_TOS'
                            ? ` ${process.env.INSULT_0}`
                            : ''
                    }, put an actual number there`;
                default: break;
            }

        let threadl, threadb;

        // prettier-ignore
        const threads = await catalog
            .find(pattern)
            .then((threads) => threads.sort((a, b) => b.replies - a.replies))
            .then((threads) => (threadb=((threadl=threads.length) > 24))
                ? threads.splice(24 * (page - 1), 24 * page)
                : threads);

        // prettier-ignore
        await channel.send(new RichEmbed({
            title: `${ threadb
                    ? `page ${page} of ${(threadl / 24) << 0}`
                    : `found ${threads.length} results`
            } for ${pattern}`,
            description: threadb
                ? `type !find ${pattern} page-number to view other results`
                : '',
            fields: threads.map((thread) => ({
                inline: false,
                name: `${thread.sub}`,
                value: `https://boards.4chan.org/pol/thread/${thread.no}
                replies: ${thread.replies}`
            }))
        }));
    }
);
