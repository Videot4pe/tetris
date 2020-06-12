const forms = require('./forms.js');

module.exports = class Block
{
	constructor(m)
	{
		this.m = m;
		this.done = false;
		this.coords = [];
		this.corpus = [];

		this.randomForm();
		this.randomPosition();
	}


	randomPosition()
	{
		let size = this.corpus.length;
		let randomY = Math.floor(Math.random() * Math.floor(this.m-this.corpus.length));
		for (let i = 0; i < size; i++)
		{
			this.coords.push([]);
			for (let j = 0; j < size; j++)
				this.coords[i].push({x: i, y: randomY + j});
		}
	}

	randomForm()
	{
		this.corpus = forms[Math.floor(Math.random() * Math.floor(forms.length))];
		for (let i = 0; i < Math.floor(Math.random() * Math.floor(4)); i++)
			this.rotate();
	}

	rotate(event)
	{
		if (event == 'up' || event == 'down')
		{
			let tmp = [];
			for (let i = 0; i < this.corpus.length; i++)
			{
				tmp.push([]);
				for (let j = 0; j < this.corpus[i].length; j++)
				{
					tmp[i][j] = event == 'up' ? this.corpus[this.corpus[i].length - 1 - j][i] : this.corpus[j][this.corpus.length - 1 - i]
				}
			}
			if (this.checkBorder('right', tmp) < this.m && this.checkBorder('left', tmp) > -1)
				this.corpus = tmp;
		}
		else
			this.move(event);
	}

	contains(i, j)
	{
		for (let k = 0; k < this.coords.length; k++)
			for (let l = 0; l < this.coords[k].length; l++)
				if (this.coords[k][l].x == i && this.coords[k][l].y == j && this.corpus[k][l] != '-')
					return this.corpus[k][l];
		return false;
	}

	move(event)
	{
		if (event == 'move')
		{
			for (let i = 0; i < this.coords.length; i++)
				for (let j = 0; j < this.coords[i].length; j++)
					this.coords[i][j].x++;
		}
		if (event == 'left' && this.checkBorder('left', this.corpus) > 0)
		{
			for (let i = 0; i < this.coords.length; i++)
				for (let j = 0; j < this.coords[i].length; j++)
					this.coords[i][j].y--;
		}
		if (event == 'right' && this.checkBorder('right', this.corpus) < this.m-1)
		{
			for (let i = 0; i < this.coords.length; i++)
				for (let j = 0; j < this.coords[i].length; j++)
					this.coords[i][j].y++;
		}
	}

	checkBorder(mode, tmp)
	{
		let border = mode == 'left' ? this.m-1 : 0;
		for (let i = 0; i < tmp.length; i++)
			for (let j = 0; j < tmp[i].length; j++)
				if(tmp[i][j] == '*')
				{
					if (mode == 'left')
					{
						if (border > this.coords[i][j].y)
							border = this.coords[i][j].y;
					}
					else
					{
						if (border < this.coords[i][j].y)
							border = this.coords[i][j].y;
					}
				}
		return border;
	}
}