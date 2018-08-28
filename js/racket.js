class Racket {
	constructor(id, x, y, width, height, mass, speed, acceleration, color) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.mass = mass;
		this.speed = speed;
		this.acceleration = acceleration;
		this.color = color;
		this.numberOfWins = 0;
	}

	Update() {
		this.Draw();
	}

	Draw() {
		ctx.beginPath();
		ctx.save();
		ctx.shadowBlur = 30;
		ctx.shadowColor = this.color;
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.restore();
		ctx.closePath();
	}
}