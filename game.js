let Block = require('./block');

module.exports = class Game {
	constructor(n, m)
	{
		this.n = n;
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
				this.changePosition('move');
				this.render();
			}
		}, 1000);
	}

	forceRender()
	{
		console.clear();
		this.printField();
	}

	changePosition(event)
	{
		if (event == 'space')
		{
			let blocks = this.blocks;
			while(this.blocks != blocks + 1)
			{
				this.changePosition('move');
				this.forceRender();
			}
		}
		else
		{
			if(event == 'left')
			{
				if (this.checkSideBorder('left'))
					this.currentBlock.move(event);
			}	
			if(event == 'right')
			{
				if (this.checkSideBorder('right'))
					this.currentBlock.move(event);
			}
			if(event == 'move')
			{
				if (this.checkSideBorder('move'))
					this.currentBlock.move(event);
				else
					this.insertBlock();
			}
			else
				this.currentBlock.rotate(event, this.field);

			this.forceRender();
		}
	}

	checkSideBorder(mode)
	{
		for (let i = 0; i < this.currentBlock.coords.length; i++)
			for (let j = 0; j < this.currentBlock.coords[i].length; j++)
			{
				if (mode == 'left')
				{
					if (this.currentBlock.coords[i][j].y == 0 && this.currentBlock.corpus[i][j] == '*')
						return false;
					if (this.currentBlock.coords[i][j].y > 0)
						if (this.currentBlock.corpus[i][j] == '*' && this.field[this.currentBlock.coords[i][j].x][this.currentBlock.coords[i][j].y - 1] == '*')
							return false;
				}
				else if (mode == 'right')
				{
					if (this.currentBlock.coords[i][j].y == this.m-1 && this.currentBlock.corpus[i][j] == '*')
						return false;
					if (this.currentBlock.coords[i][j].y < this.m-1)
						if (this.currentBlock.corpus[i][j] == '*' && this.field[this.currentBlock.coords[i][j].x][this.currentBlock.coords[i][j].y + 1] == '*')
							return false;
				}
				else if (mode == 'move')
				{
					if (this.currentBlock.coords[i][j].x >= this.n-1 && this.currentBlock.corpus[i][j] == '*')
						return false;
					else
						if (this.currentBlock.corpus[i][j] == '*' && this.field[this.currentBlock.coords[i][j].x + 1][this.currentBlock.coords[i][j].y] == '*')
							return false;
				}
			}
		return true;
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
					process.stdout.write(contains + '  ');
				else
					process.stdout.write(this.field[i][j] + '  ');
			}
			if (this.checkLine(i))
			{
				this.forceRender;
				this.break;
			}
			process.stdout.write('\n');
		}
	}

	checkLine(i)
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
					process.exit(0);
				}
	}
}

