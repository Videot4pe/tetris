const waitSync = require('wait-sync');
let Block = require('./block');

module.exports = class Game {
	constructor(n, m)
	{
		this.m = m;
		this.score = 0;
		this.currentBlock = new Block(m);
		this.status = false;
		this.blocks = 0;
		this.field = [];
		for(let i = 0; i < n; i++)
		    this.field.push(new Array(m).fill('-'));
	}

	render()
	{
		this.forceRender();
		setTimeout(() => {
			if (!this.status)
			{
				this.currentBlock.move('move');
				this.render();
			}
		}, 1000);
	}

	forceRender()
	{
		console.clear();
		this.printField();
	}

	rotate(event)
	{
		if (event == 'space')
		{
			let blocks = this.blocks;
			while(this.blocks != blocks + 1)
			{
				this.currentBlock.move('move');
				this.forceRender();
			}
		}
		else
		{
			this.currentBlock.rotate(event);
			this.forceRender();
		}
	}

	insertBlock()
	{
		for (let i = 0; i < this.currentBlock.coords.length; i++)
			for (let j = 0; j < this.currentBlock.coords[i].length; j++)
				if (this.currentBlock.corpus[i][j] != '-')
					this.field[this.currentBlock.coords[i][j].x][this.currentBlock.coords[i][j].y] = this.currentBlock.corpus[i][j];
		this.currentBlock = new Block(this.m);
		this.blocks++;
		this.checkForGameOver();
	}

	printField()
	{
		for (let i = 0; i < this.field.length; i++)
		{
			for (let j = 0; j < this.field[i].length; j++)
			{
				let contains = this.currentBlock.contains(i, j);
				if (contains)
				{
					process.stdout.write(contains + '  ');
					if (i == this.field.length-1)
						this.insertBlock();
					else if (this.field[i+1][j] != '-')
						this.insertBlock();
				}
				else
					process.stdout.write(this.field[i][j] + '  ');
			}
			if (this.checkBorder(i))
			{
				this.forceRender;
				this.break;
			}
			process.stdout.write('\n');
		}
	}

	checkBorder(i)
	{
		let line = true;
		for (let j = 0; j < this.field[i].length; j++)
			if (this.field[i][j] == '-')
				line = false;
		if (line)
		{
			this.field.splice(i, 1);
			this.field.unshift(new Array(this.m).fill('-'))
			this.score++;
			return true;
		}
		return false;
	}

	checkForGameOver()
	{
		for (let i = 0; i < this.currentBlock.coords.length; i++)
			for (let j = 0; j < this.currentBlock.coords.length; j++)
				if (this.field[this.currentBlock.coords[i][j].x][this.currentBlock.coords[i][j].y] == '*' && this.currentBlock.corpus[i][j] == '*')
				{
					this.status = true;
					console.clear();
					console.log('Game over =( \nСчет: ', this.score);
					process.exit(1);
				}
	}
}

