const {
    Permissions,
    MessageMentions
} = require('discord.js');

const REXEXP_PATTERN = /^\/(.*)\/((?:([gmisuy])(?!.*\3))*)$/;
const CHANNELS_PATTERN = /<#([0-9]+)>/;
const USERS_PATTERN = /<@!?([0-9]+)>/;
const ROLES_PATTERN = /<@&([0-9]+)>/;

class Command {
    constructor(
        { name, description, usage, permissions, overrides, requires },
        callback
    ) {
        this.name = name;
        this.description = description;
        this.usage = usage;
        this.permissions = permissions || Permissions.DEFAULT;
        this.requires = requires || Permissions.DEFAULT;
        this.overrides = overrides || [];
        this.callback = callback;
        this.client = null;
    }

    get bound() {
        return this.client != null;
    }

    can({ permissions: { bitfield }, roles }) {
        for (let override of this.overrides)
            if (roles.has(override)) return true;
        const pbitfield = this.permissions.bitfield;
        return (bitfield && pbitfield) == pbitfield;
    }

    transform(args) {
        return [...args].map((value) => {
            if (!this.bound) return value;

            if (CHANNELS_PATTERN.test(value)) {
                const channelid = value.match(CHANNELS_PATTERN)[1];
                console.log(channelid);
                if (this.client.channels.has(channelid))
                    return this.client.channels.get(channelid);
            }

            if (USERS_PATTERN.test(value)) {
                const userid = value.match(USERS_PATTERN)[1];
                console.log(userid);
                if (this.client.users.has(userid));
                return this.client.users.get(userid);
            }

            if (REXEXP_PATTERN.test(value)) return new RegExp(value);

            return value;
        });
    }

    async execute(message, ...args) {
        const perms = message.guild.me.permissionsIn(message.channel);
        if (!perms.has(this.requires) || !this.can(message.member))
            return false;
        return await this.callback(message, ...this.transform(args));
    }
}

module.exports = Command;
