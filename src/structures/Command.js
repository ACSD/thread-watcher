

class Command {
    constructor({ name, description, usage, permissions, overrides, callback }) {
        this.name = name;
        this.description = description;
        this.usage = usage;
        this.permissions = permissions || 0;
        this.overrides = overrides || [];
        this.callback = callback;
    }

    execute(as, ...args) {

    }
}

module.exports = Command;