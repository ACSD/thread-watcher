const { Permissions, TextChannel, RichEmbed } = require('discord.js');
const Command = require('../structures/Command');
const ThreadWatcher = require('../structures/ThreadWatcher');

const FLAGS = Permissions.FLAGS;

const watchers = new Map();

module.exports = new Command(
    {
        name: 'watchers',
        description: '',
        usage: 'watch [add|list] channel pattern',
        requires: new Permissions([
            FLAGS.SEND_MESSAGES,
            FLAGS.EMBED_LINKS,
            FLAGS.MANAGE_MESSAGES
        ]),
        permissions: new Permissions([
            FLAGS.ADMINISTRATOR,
        ]),
        overrides: ['671978823310639104'],
        channels: {
            mode: 'whitelist',
            list: ['672263292781068288', '672254609615486996']
        }
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
                await message.channel.send(
                    `started watching for ${source} in <#${channel.id}>`
                );
                break;
            case 'list':
                if (cwatchers.size == 0)
                    return await message.channel.send(
                        `no threads are being watched in <#${channel.id}>`
                    );
                
                //TODO clean up hackfix for overflow on fields
                let keys = [...cwatchers.keys()].slice(0, 24);

                await message.channel.send(
                    new RichEmbed({
                        fields: keys.map((key) => ({
                            inline: false,
                            name: `${keys}`,
                            value: `watching ${
                                cwatchers.get(key).threads.size
                            } threads`
                        }))
                    })
                );
                break;
            case 'remove':
                if(cwatchers.has(source)) {
                    cwatchers.get(source).kill();
                    await message.channel.send('OK');
                    break;
                }
                await message.channel.send(`not watching for ${source}`);
                break;
            default:
                await message.channel.send(`${op} is not a valid op`);
                break;
        }
    }
);
