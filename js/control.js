addEventListener('resize', function() {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	rackets[1].x = innerWidth - rackets[1].width;
});

addEventListener('keydown', function(event) {
	switch (event.code) {
		case 'Escape':
			location.href = '../index.html';
			break;
		case 'Space':
			if (animationState) {
				cancelAnimationFrame(animationId);
				animationState = false;
				ctx.beginPath();
				ctx.save();
				ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.restore();
				ctx.closePath();

				ctx.beginPath();
				ctx.save();
				ctx.shadowBlur = 10;
				ctx.shadowColor = '#F50338';
				ctx.font = "bold 60pt Courier New";
				ctx.fillStyle = '#F50338';
				ctx.fillText('<PAUSE>', canvas.width / 2 - ctx.measureText('<PAUSE>').width / 2, canvas.height / 2);
				ctx.font = "bold 20pt Courier New";
				ctx.fillText('<PING PONG by exynil>', canvas.width / 2 - ctx.measureText('<PING PONG by exynil>').width / 2, canvas.height / 2 + 50);
				ctx.fillText('<2018>', canvas.width / 2 - ctx.measureText('<2018>').width / 2, canvas.height / 2 + 100);
				ctx.restore();
				ctx.closePath();
			} else {
				animate();
				animationState = true;
			}
			break;
		case 'NumpadAdd':
			pushBalls(1);
			break;
		case 'KeyR':
			for (let i = 0; i < balls.length; i++) {
				balls[i].UpdateVelocity();
			}
			break;
		case 'KeyM':
			if (developerMode) {
				developerMode = false;
			} else {
				developerMode = true;
			}
			break;
		case 'KeyH':
			if (hotKeys) {
				hotKeys = false;
			} else {
				hotKeys = true;
			}
			break;
		case 'KeyC':
			for (let i = 0; i < balls.length; i++) {
				// balls[i].color = randomColor();
			}
			break;
		case 'Numpad1':
			// Играть в одиночном режиме
			break;
		case 'Numpad2':
			// Играть с другом
		break;
		case 'Numpad3':
			// Компьютер против компьютера
			(autocontrol) ? autocontrol = false : autocontrol = true;
		break;
		case 'NumpadEnter':
			let value = 5;
			value = (value - 0.02).toFixed(3);
			console.log(value);
			console.log(value.toFixed(0));
		break;	
		default:
			// console.log(event.code);
			break;
	}

	if (event.code == 'KeyW') {
		wKeyDown = true;
		rackets
	} else if (event.code == 'KeyS') {
		sKeyDown = true;
	} else if (event.code == 'ArrowDown') {
		arrowDownKeyDown = true;
	} else if (event.code == 'ArrowUp') {
		arrowUpKeyDown = true;
	}
});

addEventListener('keyup', function(event) {
	if (event.code == 'KeyW') {
		wKeyDown = false;
		rackets[0].acceleration = 1;
	} else if (event.code == 'KeyS') {
		sKeyDown = false;
		rackets[0].acceleration = 1;
	} else if (event.code == 'ArrowDown') {
		arrowDownKeyDown = false;
		rackets[1].acceleration = 1;
	} else if (event.code == 'ArrowUp') {
		arrowUpKeyDown = false;
		rackets[1].acceleration = 1;
	}
});