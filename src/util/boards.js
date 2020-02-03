const Board = require('../structures/Board');

const BOARD_NAMES = process.env.BOARD_NAMES;
const names = BOARD_NAMES.split(',');

console.log(names);
const boards = new Map();
names.forEach(name=>{
    const board = new Board(name);
    boards.set(name, board);
    setInterval(async (b)=>{
        await b.update();
    }, process.env.BOARD_UPDATE_FREQUENCY, board);
});

module.exports = boards;