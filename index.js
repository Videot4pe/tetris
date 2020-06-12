let keypress = require('keypress');
let Game = require('./game');

keypress(process.stdin);
let game = new Game(15, 10);
game.render();

process.stdin.on('keypress', function (ch, key) {
	if (key && key.ctrl && key.name == 'v')
	{
		game = new Game(15, 10);
		game.render();
	}
	else if (key && key.ctrl && key.name == 'c')
		process.exit(1);
	else
		game.rotate(key.name);
});

process.stdin.setRawMode(true);
process.stdin.resume();