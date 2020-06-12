let keypress = require('keypress');
let Game = require('./game');

keypress(process.stdin);
let game = new Game(15, 10);
game.render();

process.stdin.on('keypress', function (ch, key) {
	if (key && key.ctrl && key.name == 'c')
		process.exit(0);
	else
		game.changePosition(key.name);
});
process.stdin.setRawMode(true);
