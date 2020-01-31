require('dotenv').config();
const find = require("./src/util/find");
const ThreadWatcher = require('./src/structures/ThreadWatcher');

const Discord = require('discord.js');

const client = new Discord.Client();

const prefix = process.env.BOT_PREFIX;

const args_pattern = /(?:['"]|`{3}|`{1})((?:[^'"`\\]|\\.)*)(?:['"]|`{3}|`{1})|(?!")([^\s]+)(?!")/g;
const CHANNELS_PATTERN = Discord.MessageMentions.CHANNELS_PATTERN;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});


const embed = (threads, pattern) => {
    console.log(threads);
    return new Discord.RichEmbed({
        title: `${
            threads.length > 20 ? 'first 20' : threads.length
        } results for ${pattern}`,
        fields: threads.slice(0, 20).map((thread) => ({
            inline: false,
            name: `[${thread.replies}] ${thread.sub}`,
            value: `<https://boards.4chan.org/pol/thread/${thread.no}>`
        }))
    });
};

client.on('message', async (message) => {
    if (message.author.bot) return;
    const { content, channel } = message;
    let [command, ...args] = [...content.matchAll(args_pattern)].map(
        (v) => v[1] || v[2]
    );

    if (!(channel.id == '672254609615486996' || channel.id == "672263292781068288")) return;
   
    if (!command.startsWith(prefix)) return;

    //await message.delete();

    let rawchannel, pattern;
    switch (command.substr(prefix.length)) {
        case 'watch':
            if(message.author.id != "357219721885777921") 
                break;
            [rawchannel, pattern] = args;

            if (CHANNELS_PATTERN.test(rawchannel)) {
                const channelid = rawchannel.match(/([0-9]+)/)[0];
                const target = message.guild.channels.get(channelid);
                if (!target)
                    await channel.send('that channel is not in this guild');
                else new ThreadWatcher(target, pattern);
            } else await channel.send('expected channel for first argument');
            break;
        case 'find':
            [pattern] = args;
            const threads = await find(new RegExp(pattern))
            const reply = await channel.send(embed(threads, pattern));
            //await reply.delete(5000);
            break;
        case 'args':
            await channel.send(args.join("\n====\n"));
            console.log(args);
            break;
        case 'yeet':
            if(message.author.id != "357219721885777921") 
                break;
            let [count] = args;
            await channel.bulkDelete(parseInt(count) || 2);
            break;
    }
});

client.login(process.env.DISCORD_TOKEN);
