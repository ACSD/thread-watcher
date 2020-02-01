require('dotenv').config();

const Discord = require('discord.js');

const client = new Discord.Client();

const prefix = process.env.BOT_PREFIX;

//TODO clean up regexp 
const args_pattern = /(?:['"]|`{3}|`{1})((?:[^'"`\\]|\\.)*)(?:['"]|`{3}|`{1})|(?!")([^\s]+)(?!")/g;

let commands = require('./src/util/commandloader');
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    commands.forEach((command)=>{
        command.client = client;
    });
});


client.on('message', async (message) => {
    const { author, content, channel } = message;
    if (author.bot || !content.startsWith(prefix)) return;
    let [command, ...args] = [
        ...content.substr(prefix.length).matchAll(args_pattern)
    ].map((v) => v[1] || v[2]);

    if(commands.has(command))
        commands.get(command).execute(message, ...args);
});

client.login(process.env.DISCORD_TOKEN);
