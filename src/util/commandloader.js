const fs = require('fs');
const path = require('path');

const commands = new Map();

fs.readdirSync(path.resolve(__dirname, '../commands')).forEach((file) => {
    const command = require(`../commands/${file}`);
    if (commands.has(command.name))
        throw new Error(
            `attempted to override existing command ${
                command.name
            } in ${path.resolve(__dirname, `../commands/${file}`)}`
        );
    
    commands.set(command.name, command);
});

module.exports = commands;
