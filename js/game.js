var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var colors = ['#00FF7F', '#7B68EE', '#00FFFF'];
var racketColors = ['#00E8FF', '#FF7400'];
var rackets = [];
var balls = [];
var wKeyDown;
var sKeyDown;
var arrowUpKeyDown;
var arrowDownKeyDown;
var numberOfBalls = 1;
var maxSpeed = 0;
var animationId;
var animationState = true;
var limitation = 5;
var developerMode = true;
var timer;
var autocontrol = false;

canvas.width = innerWidth;
canvas.height = innerHeight;

// Вывод результата игроков
function drawResult() {
	for (let i = 0; i < rackets.length; i++) {
		ctx.beginPath();
		ctx.save();
		ctx.font = "bold 60pt Courier New";
		ctx.shadowBlur = 15;
		if (rackets[i].id == 0) {
			ctx.fillStyle = rackets[i].color;
			ctx.shadowColor = rackets[i].color;
			ctx.fillText(rackets[i].numberOfWins, canvas.width / 2 - ctx.measureText(rackets[i].numberOfWins).width - 100, canvas.height / 2);
		} else {
			ctx.fillStyle = rackets[i].color;
			ctx.shadowColor = rackets[i].color;
			ctx.fillText(rackets[i].numberOfWins, canvas.width / 2 + 100, canvas.height / 2);
		}
		ctx.restore();
		ctx.closePath();
	}
}

function drawMiddleLine() {
	ctx.beginPath();
	ctx.save();
	ctx.lineCap = 'round';
	ctx.setLineDash([10, 10]);
	ctx.moveTo(canvas.width / 2, 0);
	ctx.lineTo(canvas.width / 2, canvas.height);
	// ctx.moveTo(0, canvas.height / 2);
	// ctx.lineTo(canvas.width, canvas.height / 2);
	ctx.strokeStyle = 'gray';
	ctx.stroke();
	ctx.restore();
	ctx.closePath();
}

// Прорисовка линий между доской и мячом
function drawLineBetweenBoardAndBall() {
	for (let i = 0; i < rackets.length; i++) {
		for (let j = 0; j < balls.length; j++) {
			ctx.beginPath();
			ctx.save();
			let gradient = ctx.createLinearGradient(rackets[i].x, rackets[i].y, balls[j].x, balls[j].y);
			gradient.addColorStop(0, rackets[i].color);
			gradient.addColorStop(1, balls[j].color);
			ctx.beginPath();
			ctx.lineCap = 'round';
			ctx.setLineDash([1, 10]);
			ctx.moveTo(rackets[i].x, rackets[i].y + rackets[i].height / 2);
			ctx.lineTo(balls[j].x, balls[j].y);
			ctx.strokeStyle = gradient;
			ctx.stroke();
			ctx.restore();
			ctx.closePath();
		}
	}
}

// Прорисовка линий мячиками
function drawLinesBetweenBalls() {
	for (let i = 0; i < balls.length; i++) {
		for (let j = 0; j < balls.length; j++) {
			if (i == j) continue;
			if (i < j) {
				ctx.beginPath();
				ctx.save();
				let gradient = ctx.createLinearGradient(balls[i].x, balls[i].y, balls[j].x, balls[j].y);
				gradient.addColorStop(0, balls[i].color);
				gradient.addColorStop(1, balls[j].color);
				ctx.beginPath();
				ctx.lineCap = 'round';
				ctx.setLineDash([1, 10]);
				ctx.moveTo(balls[i].x, balls[i].y);
				ctx.lineTo(balls[j].x, balls[j].y);
				ctx.strokeStyle = gradient;
				ctx.stroke();
				ctx.restore();
				ctx.closePath();
			}
		}
	}
}

// Прорисовка максимальной скорости
function drawMaxSpeed() {
	ctx.beginPath();
	ctx.save();
	ctx.font = "30pt Courier New";
	ctx.shadowBlur = 15;
	ctx.shadowColor = '#00E8FF';
	ctx.fillStyle = '#00E8FF';
	ctx.fillText('Max Speed: ' + maxSpeed, canvas.width / 2 - ctx.measureText('Max Speed: ' + maxSpeed).width / 2, 100);
	ctx.restore();
	ctx.closePath();
}

// Прорисовка скорости мяча
function drawBallSpeed() {
	ctx.beginPath();
	ctx.save();
	ctx.font = "30pt Courier New";
	ctx.shadowBlur = 15;
	ctx.shadowColor = '#FF7400';
	ctx.fillStyle = '#FF7400';
	ctx.fillText('Speed: ' + balls[0].speed.toFixed(1), canvas.width / 2 - ctx.measureText('Speed: ' + balls[0].speed.toFixed(1)).width / 2, 200);
	ctx.restore();
	ctx.closePath();
	if (+balls[0].speed.toFixed(1) > maxSpeed) {
		maxSpeed = +balls[0].speed.toFixed(0);
	}
}

function drawDeveloperMode() {
	let interval = 0;
	let marginTop = 15;
	let marginLeft = 50;
	ctx.beginPath();
	ctx.save();
	ctx.font = "bold 10pt Courier New";
	ctx.shadowBlur = 5;
	ctx.shadowColor = '#8A8962';
	ctx.fillStyle = '#8A8962';
	ctx.fillText('current number of balls: ' + balls.length, marginLeft, interval += 50);
	ctx.fillText('total number of balls: ' + (+rackets[0].numberOfWins + +rackets[1].numberOfWins + +balls.length), marginLeft, interval += marginTop);
	ctx.fillText('left racket Y: ' + rackets[0].y.toFixed(2), marginLeft, interval += marginTop);
	ctx.fillText('left racket height: ' + rackets[0].height, marginLeft, interval += marginTop);
	ctx.fillText('right racket Y: ' + rackets[1].y.toFixed(2), marginLeft, interval += marginTop);
	ctx.fillText('right racket height: ' + rackets[1].height, marginLeft, interval += marginTop);
	if (balls[0] != undefined) {
		ctx.fillText('balls[0].x: ' + balls[0].x.toFixed(2), marginLeft, interval += marginTop);
		ctx.fillText('balls[0].y: ' + balls[0].y.toFixed(2), marginLeft, interval += marginTop);
		ctx.fillText('balls[0].vx: ' + balls[0].velocity.x.toFixed(2), marginLeft, interval += marginTop);
		ctx.fillText('balls[0].vy: ' + balls[0].velocity.y.toFixed(2), marginLeft, interval += marginTop);
		ctx.fillText('balls[0].angle: ' + balls[0].angle.toFixed(2) + ' (' + (balls[0].angle * 360 / 6.28).toFixed(2) + '°)', marginLeft, interval += marginTop);
		ctx.fillText('balls[0].speed: ' + balls[0].speed.toFixed(2), marginLeft, interval += marginTop);
		ctx.fillText('balls[0].acceleration: ' + balls[0].acceleration, marginLeft, interval += marginTop);
		ctx.fillText('balls[0].mass: ' + balls[0].mass, marginLeft, interval += marginTop);
		ctx.fillText('balls[0].color: ' + balls[0].color, marginLeft, interval += marginTop);

	}
	ctx.fillText('timer initial seconds: ' + timer.initialSeconds, marginLeft, interval += marginTop);
	ctx.fillText('timer current seconds: ' + timer.currentSeconds.toFixed(2), marginLeft, interval += marginTop);
	ctx.fillText('timer color: ' + timer.color, marginLeft, interval += marginTop);
	ctx.fillText('timer progressWidth: ' + timer.progressWidth.toFixed(2), marginLeft, interval += marginTop);
	ctx.fillText('timer currentPosition: ' + timer.currentPosition.toFixed(2), marginLeft, interval += marginTop);
	ctx.fillText('canvas width: ' + canvas.width, marginLeft, interval += marginTop);
	ctx.fillText('canvas height: ' + canvas.height, marginLeft, interval += marginTop);
	ctx.restore();
	ctx.closePath();
	if (balls[0] != undefined) {
		ctx.beginPath();
		ctx.save();
		// ctx.setLineDash([5, 10]);
		// Вертикальная линия по центру
		ctx.moveTo(balls[0].x, 0);
		ctx.lineTo(balls[0].x, canvas.height);
		// Горизонтальная линия по центру
		ctx.moveTo(0, balls[0].y);
		ctx.lineTo(canvas.width, balls[0].y);
		ctx.strokeStyle = 'gray';
		ctx.stroke();
		ctx.restore();
		ctx.closePath();
		ctx.beginPath();
		ctx.save();
		// Вертикальная линия слева
		ctx.moveTo(balls[0].x - balls[0].radius, 0);
		ctx.lineTo(balls[0].x - balls[0].radius, canvas.height);
		// Вертикальная линия справа
		ctx.moveTo(balls[0].x + balls[0].radius, 0);
		ctx.lineTo(balls[0].x + balls[0].radius, canvas.height);
		// Горизонтальная линия снизу
		ctx.moveTo(0, balls[0].y + balls[0].radius);
		ctx.lineTo(canvas.width, balls[0].y + balls[0].radius);
		// Горизонтальная линия сверху
		ctx.moveTo(0, balls[0].y - balls[0].radius);
		ctx.lineTo(canvas.width, balls[0].y - balls[0].radius);
		ctx.strokeStyle = '#F50338';
		ctx.stroke();
		ctx.restore();
		ctx.closePath();
	}

	for (let i = 0; i < canvas.width; i += 50) {
		ctx.beginPath();
		ctx.save();
		ctx.font = "bold 10pt Courier New";
		ctx.shadowBlur = 5;
		ctx.shadowColor = '#8A8962';
		ctx.fillStyle = '#8A8962';
		ctx.fillText(i, i, 20);
		ctx.restore();
		ctx.closePath();
	}

	for (let i = 0; i < canvas.height; i += 50) {
		ctx.beginPath();
		ctx.save();
		ctx.font = "bold 10pt Courier New";
		ctx.shadowBlur = 5;
		ctx.shadowColor = '#8A8962';
		ctx.fillStyle = '#8A8962';
		ctx.fillText(i, 0, i);
		ctx.restore();
		ctx.closePath();
	}
}

// Начальная инициализация объектов
function init() {
	pushBoards();
	pushBalls(numberOfBalls);
	timer = new Timer(60);
}

init();

// Добавление досок
function pushBoards() {
	for (let i = 0; i < 2; i++) {
		let width = 10;
		let height = 200;
		let color = racketColors[i];
		let mass = 1;
		let speed = 0;
		let acceleration = 0.05;
		let x = (i == 0) ? 0 : canvas.width - width;
		let y = canvas.height / 2 - height / 2;

		rackets.push(new Racket(i, x, y, width, height, mass, speed, acceleration, color));
	}
}

// Добавление мячей
function pushBalls(numberOfBalls) {
	if (balls.length < limitation) {
		let lastBallsLength = balls.length;
		for (let i = lastBallsLength; i < lastBallsLength + numberOfBalls; i++) {
			let radius = 15;
			let color = randomColor();
			let mass = 1;
			let speed = 5; // 5
			let acceleration = 0.01; // 0.01

			let x = randomIntFromRange(canvas.width / 2 - 40, canvas.width / 2 + 40);
			let y = randomIntFromRange(radius, canvas.height - radius);

			for (let j = 0; j < balls.length; j++) {
				if (getDistance(x, y, balls[j].x, balls[j].y) - radius * 2 < 0) {
					x = randomIntFromRange(radius, canvas.width - radius);
					y = randomIntFromRange(radius, canvas.height - radius);

					j = -1;
				}
			}

			balls.push(new Ball(i, x, y, radius, mass, speed, acceleration, color));
		}

		// balls.push(new Ball(0, canvas.width - 50, 50, 15, 1, 2, 0, 'springgreen'));
		// balls[0].velocity.x = -0.98;
		// balls[0].velocity.y = 0.19;
		// balls[0].angle = 0.19;
	}
}

function animate() {
	animationId = requestAnimationFrame(animate);
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if (sKeyDown) {
		rackets[0].y += 5 + rackets[0].acceleration;
		rackets[0].acceleration += 0.5;
		if (rackets[0].y > canvas.height - rackets[0].height) {
			rackets[0].y = canvas.height - rackets[0].height;
		}
	} else if (wKeyDown) {
		rackets[0].y -= 5 - rackets[0].acceleration;
		rackets[0].acceleration -= 0.5;
		if (rackets[0].y < 0) {
			rackets[0].y = 0;
		}
	}

	if (arrowDownKeyDown) {
		rackets[1].y += 5 + rackets[1].acceleration;
		rackets[1].acceleration += 0.5;
		if (rackets[1].y > canvas.height - rackets[1].height) {
			rackets[1].y = canvas.height - rackets[1].height;
		}
	} else if (arrowUpKeyDown) {
		rackets[1].y -= 5 - rackets[1].acceleration;
		rackets[1].acceleration -= 0.5;
		if (rackets[1].y < 0) {
			rackets[1].y = 0;
		}
	}

	if (balls.length <= 0) {
		pushBalls(numberOfBalls);
	}

	for (let i = 0; i < rackets.length; i++) {
		rackets[i].Update();
	}

	for (let i = 0; i < balls.length; i++) {
		balls[i].Update(balls);
		if (developerMode && balls[i] != undefined) {
			balls[i].DrawTrajectory();
		}
	}

	if (autocontrol) {
		if (balls[0].x < canvas.width / 2) {
			rackets[0].y = balls[0].y - rackets[1].height / 2;
			if (rackets[0].y < 0) {
				rackets[0].y = 0;
			} else if (rackets[0].y + rackets[0].height > canvas.height) {
				rackets[0].y = canvas.height - rackets[0].height;
			}
		} else {
			rackets[1].y = balls[0].y - rackets[1].height / 2;
			if (rackets[1].y < 0) {
				rackets[1].y = 0;
			} else if (rackets[0].y + rackets[1].height > canvas.height) {
				rackets[1].y = canvas.height - rackets[1].height;
			}
		}
	}

	drawResult();
	// drawLineBetweenBoardAndBall();
	drawLinesBetweenBalls();
	if (balls.length == 1) {
		drawBallSpeed();
	}
	drawMaxSpeed();
	drawMiddleLine();
	if (developerMode) {
		drawDeveloperMode()
	}

	
	timer.Update(balls);
}

animate();

function randomIntFromRange(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
};

function randomColorFromArray(colors) {
	return colors[Math.floor(Math.random() * colors.length)];
}

function randomColor() {
	let redHex = Math.floor(Math.random() * 255).toString(16);
	let greenHex = Math.floor(Math.random() * 255).toString(16);
	let blueHex = Math.floor(Math.random() * 255).toString(16);
	if (redHex.length == 1) {
		redHex = '0' + redHex;
	}
	if (greenHex.length == 1) {
		greenHex = '0' + greenHex;
	}

	if (blueHex.length == 1) {
		blueHex = '0' + blueHex;
	}

	return '#' + redHex + greenHex + blueHex;
}

function getDistance(x1, y1, x2, y2) {
	let xDistance = x2 - x1;
	let yDistance = y2 - y1;

	return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function rotate(velocity, angle) {
	const rotatedVelocities = {
		x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
		y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
	};

	return rotatedVelocities;
}

function resolveCollision(Ball, otherBall) {
	const xVelocityDiff = Ball.velocity.x - otherBall.velocity.x;
	const yVelocityDiff = Ball.velocity.y - otherBall.velocity.y;

	const xDist = otherBall.x - Ball.x;
	const yDist = otherBall.y - Ball.y;

	// Prevent accidental overlap of balls
	if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
		// Grab angle between the two colliding balls
		const angle = -Math.atan2(otherBall.y - Ball.y, otherBall.x - Ball.x);

		// Store mass in var for better readability in collision equation
		const m1 = Ball.mass;
		const m2 = otherBall.mass;

		// Velocity before equation
		const u1 = rotate(Ball.velocity, angle);
		const u2 = rotate(otherBall.velocity, angle);

		// Velocity after 1d collision equation
		const v1 = {
			x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2),
			y: u1.y
		};
		const v2 = {
			x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2),
			y: u2.y
		};

		// Final velocity after rotating axis back to original location
		const vFinal1 = rotate(v1, -angle);
		const vFinal2 = rotate(v2, -angle);

		// Swap Ball velocities for realistic bounce effect
		Ball.velocity.x = vFinal1.x;
		Ball.velocity.y = vFinal1.y;

		otherBall.velocity.x = vFinal2.x;
		otherBall.velocity.y = vFinal2.y;
	}
}