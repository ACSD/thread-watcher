class Thread {
    constructor(data, board) {
        this.data = data;
        this.board = board;
    }

    update(data) {
        let changed = false;
        for (let key in data) {
            if (key == 'last_replies') this.data[key] = data[key];
            else changed = this.data[key] != data[key] || changed;
            if (changed) this.data[key] = data[key];
        }
        return changed;
    }

    // prettier-ignore
    close() { this.board.threads.delete(this.data.no); }

    async stats() {
        return (await this.board.reduced('catalog')).find(
            (t) => t.no == this.no
        );
    }
}

module.exports = Thread;
