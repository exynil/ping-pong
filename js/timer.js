class Timer {
	constructor(seconds) {
		this.initialSeconds = seconds;
		this.currentSeconds = seconds;
		this.backgroundColor = '#333';
		this.color = '#00ff00';
		this.progressWidth = canvas.width;
		this.progressHeight = 2;
		this.currentPosition = canvas.width;
		this.colorRange = 0;
		this.percent;
		this.initialFontSize = 400;
		this.currentFontSize = this.initialFontSize;
	}
	Update(balls) {
		this.Draw();
		this.currentSeconds -= 0.02;
		// console.log(this.currentSeconds);
		
		if (this.currentSeconds < 3) {
			this.currentFontSize -= 8;
			if (this.currentFontSize < 0) {
				this.currentFontSize = this.initialFontSize;
			}

		}
		if (this.currentSeconds < 0) {
			for (let i = 0; i < balls.length; i++) {
				balls[i].UpdateVelocity();
			}
			this.currentSeconds = this.initialSeconds;
		}
	}
	Draw() {
		ctx.beginPath();
		ctx.save();
		ctx.fillStyle = '#444';
		ctx.fillRect(0, 0, canvas.width, this.progressHeight);
		this.progressWidth = this.currentSeconds * canvas.width / this.initialSeconds;
		if (this.progressWidth > canvas.width / 2) {
			this.currentPosition = this.progressWidth - canvas.width / 2;
			this.percent = this.currentPosition * 100 / (canvas.width / 2);
			this.color = (this.percent * 255 / 100).toFixed(0);
			this.color = (this.color - 255) * -1
			ctx.fillStyle = 'rgb(' + this.color + ', 255, 0)';
			ctx.fillRect(0, 0, this.progressWidth, this.progressHeight);
			ctx.fill();


			
		} else {
			this.currentPosition = this.progressWidth;
			this.percent = this.currentPosition * 100 / (canvas.width / 2);
			this.color = (this.percent * 255 / 100).toFixed(0);
			ctx.fillStyle = 'rgb(255, ' + this.color + ', 0)';
			ctx.fillRect(0, 0, this.progressWidth, this.progressHeight);
			ctx.fill();
		}

		ctx.restore();
		ctx.closePath();

		if (this.currentSeconds < 3) {
			ctx.beginPath();
			ctx.save();
			ctx.font = "20pt Courier New";
			ctx.shadowBlur = 80;
			ctx.font = this.currentFontSize + 'pt Courier New';
			ctx.shadowColor = '#F50338';
			ctx.fillStyle = '#F50338'
			ctx.fillText(this.currentSeconds.toFixed(0), canvas.width / 2 - ctx.measureText(this.currentSeconds.toFixed(0)).width / 2, canvas.height - 100);
			ctx.restore();
			ctx.closePath();
		}	
	}
}