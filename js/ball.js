class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Ball {
	constructor(id, x, y, radius, mass, speed, acceleration, color, isboard) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.mass = mass;
		this.speed = speed;
		this.acceleration = acceleration;
		this.color = color;
		this.angle = (Math.random() * Math.PI * 2);
		// this.angle = 4.2;
		this.velocity = {
			x: Math.cos(this.angle),
			y: Math.sin(this.angle)
		}
	}

	UpdateVelocity() {
		this.angle = (Math.random() * Math.PI * 2);
		this.velocity.x = Math.cos(this.angle);
		this.velocity.y = Math.sin(this.angle);
	}

	Update(balls) {
		// Проверка на столкновение мяча с левой доской
		if (this.x - this.radius <= rackets[0].x + rackets[0].width && this.y + this.radius >= rackets[0].y && this.y - this.radius <= rackets[0].y + rackets[0].height) {
			this.velocity.x *= -1;
			if (this.x <= rackets[0].x + rackets[0].width) {
				this.velocity.y *= -1;
			}
		}

		// Проверка на столкновение мяча с правой доской
		if (this.x + this.radius >= rackets[1].x && this.y + this.radius >= rackets[1].y && this.y - this.radius <= rackets[1].y + rackets[1].height) {
			this.velocity.x *= -1;
			if (this.x >= rackets[1].x) {
				this.velocity.y *= -1;
			}
		}

		// Увеличиваем счетчики побед игроков, если противник не смог отразить мяч
		if (this.x + this.radius <= 0) {
			rackets[1].numberOfWins++;
		} else if (this.x - this.radius >= innerWidth) {
			rackets[0].numberOfWins++;
		}

		// Удаляем объект если он вышел за левый и правый край
		if (this.x + this.radius <= 0 || this.x - this.radius >= innerWidth) {
			for (let i = 0; i < balls.length; i++) {
				if (balls[i].id == this.id) {
					balls.splice(i, 1);
					for (let j = 0; j < balls.length; j++) {
						balls[j].id = j;
					}
					break;
				}
			}
			return;
		}

		// Обнаружение столкновений мяча с другими мячами
		for (let i = 0; i < balls.length; i++) {
			if (this === balls[i]) continue;
			if (getDistance(this.x, this.y, balls[i].x, balls[i].y) - this.radius - balls[i].radius < 0) {
				resolveCollision(this, balls[i]);
			}
		}

		// Блокировка верхнего и нижнего края
		if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight) {
			this.velocity.y = -this.velocity.y;
		}

		// Блокировкая левого края
		// if (this.x - this.radius < 0) {
		// 	this.velocity.x = -this.velocity.x;
		// }

		// Блокировкая правого края
		// if (this.x + this.radius > innerWidth) {
		// 	this.velocity.x = -this.velocity.x;
		// }

		// Передвигаем мяч по вектору движения
		this.x += this.velocity.x * this.speed;
		this.y += this.velocity.y * this.speed;
		this.speed += this.acceleration;
		this.Draw();
	}

	Draw() {
		// Прорисовка внутреннего круга мяча
		ctx.beginPath();
		ctx.save();
		ctx.shadowBlur = 30;
		ctx.shadowColor = this.color;
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.radius - this.radius / 2, Math.PI * 2, false);
		ctx.fill();
		ctx.restore();
		ctx.closePath();

		// Прорисовка внешнего круга мяча
		ctx.beginPath();
		ctx.save();
		ctx.shadowBlur = 30;
		ctx.shadowColor = this.color;
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
		ctx.arc(this.x, this.y, this.radius - this.radius / 4, Math.PI * 2, false);
		ctx.fill('evenodd');
		ctx.restore();
		ctx.closePath();
	}

	// Прорисовка траетории движения мяча
	DrawTrajectory() {
		let coordinates = [new Point(this.x, this.y)];
		let velocity = new Point(this.velocity.x, this.velocity.y);
		let x, y;
		let thisX = this.x;
		let thisY = this.y;
		let length;

		do {

			if (velocity.x <= 0) {
				if (this.angle > Math.PI) {
					length = Math.tan(Math.PI / 2 - this.angle);
				} else {
					length = Math.tan(Math.PI / 2 + this.angle);
				}
				
			} else {
				if (this.angle < Math.PI) {
					length = Math.tan(Math.PI / 2 - this.angle);
				} else {
					length = Math.tan(Math.PI / 2 + this.angle);
				}
			}
			

			// Вниз и вправо
			if (velocity.x >= 0 && velocity.y >= 0) {
				y = canvas.height - this.radius;

				x = thisX + length * (canvas.height - thisY - this.radius);
				velocity.y *= -1;
			}
			// Вниз и влево
			else if (velocity.x <= 0 && velocity.y >= 0) {
				y = canvas.height - this.radius;

				x = thisX - length * (canvas.height - thisY - this.radius);
				velocity.y *= -1;
			}
			// Вверх и влево
			else if (velocity.x <= 0 && velocity.y <= 0) {
				y = this.radius;
				
				x = thisX - length * (thisY - this.radius);
				
				velocity.y *= -1;
			}
			// Вверх и вправо
			else if (velocity.x >= 0 && velocity.y <= 0) {
				y = this.radius;
				
				x = thisX + length * (thisY - this.radius);
				
				velocity.y *= -1;
			}

			thisX = x;
			thisY = y;


			coordinates.push(new Point(x, y));

		} while (thisX > 0 && thisX < canvas.width);



		ctx.beginPath();
		ctx.save();
		ctx.strokeStyle = this.color;
		ctx.moveTo(this.x, this.y);
		for (let i = 0; i < coordinates.length; i++) {
			ctx.lineTo(coordinates[i].x, coordinates[i].y);
		}
		ctx.stroke();
		ctx.restore();
		ctx.closePath();

		
	}
}