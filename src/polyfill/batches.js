const batches = (array, s) => {
    return array.reduce((p, c, i) => {
        const n = (i / s) << 0;
        if (!p[n]) p[n] = [];
        p[n][i % s] = c;
        return p;
    }, []);
}

Array.prototype.batches = function(s) { return batches(this, s); };

module.exports = batches;