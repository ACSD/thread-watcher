const { Permissions, TextChannel, RichEmbed } = require('discord.js');
const Command = require('../structures/Command');
const ThreadWatcher = require('../structures/ThreadWatcher');

const FLAGS = Permissions.FLAGS;

const watchers = new Map();

module.exports = new Command(
    {
        name: 'watcher',
        description: '',
        usage: 'watch [add|list] channel pattern',
        permissions: new Permissions([FLAGS.MANAGE_MESSAGES]),
        overrides: []
    },
    async (message, op, channel, pattern) => {
        if (!(channel instanceof TextChannel))
            return await message.channel.send(
                'expected a channel for second argument'
            );
        if (!message.guild.channels.has(channel.id))
            return await message.channel.send(
                'that channel is not in this guild'
            );
        if (!pattern instanceof RegExp || !pattern instanceof String)
            return await message.channel.send(
                'expected string or regexp for pattern'
            );

        if (!watchers.has(channel.id)) watchers.set(channel.id, new Map());

        const cwatchers = watchers.get(channel.id);

        const source = pattern instanceof RegExp ? pattern.source : pattern;
        switch (op) {
            case 'add':
                if (cwatchers.has(source))
                    return await message.channel.send(
                        `already watching for ${source} in <#${channel.id}>`
                    );
                cwatchers.set(source, new ThreadWatcher(channel, pattern));
                break;
            case 'list':
                if (cwatchers.size == 0)
                    return await message.channel.send(
                        `no threads are being watched in ${channel.id}`
                    );

                let keys = [...cwatchers.keys()];

                await channel.send(
                    new RichEmbed({
                        fields: keys.map((key) => ({
                            inline: false,
                            name: `${keys}`,
                            value: `watching ${cwatchers.get(key).threads.length} threads`
                        }))
                    })
                );
                break;
            case 'remove':
                break;
            default:
                return await message.channel.send(`${op} is not a valid op`);
                break;
        }
    }
);
