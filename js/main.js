const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

let gameOver = false;

const gravity = 0.7;

const background = new Sprite({
	position: {
		x: 0,
		y: 0,
	},
	imageSrc: './img/background.png',
});

const shop = new Sprite({
	position: {
		x: 620,
		y: 128,
	},
	imageSrc: './img/shop.png',
	scale: 2.75,
	framesMax: 6,
});

const player = new Fighter({
	position: {
		x: 100,
		y: 0,
	},
	velocity: {
		x: 0,
		y: 0,
	},
	offset: {
		x: 0,
		y: 0,
	},
	imageSrc: './img/samuraiMack/Idle.png',
	scale: 2.5,
	framesMax: 8,
	offset: {
		x: 215,
		y: 155,
	},
	sprites: {
		idle: {
			imageSrc: './img/samuraiMack/Idle.png',
			framesMax: 8,
		},
		run: {
			imageSrc: './img/samuraiMack/Run.png',
			framesMax: 8,
		},
		jump: {
			imageSrc: './img/samuraiMack/Jump.png',
			framesMax: 2,
		},
		fall: {
			imageSrc: './img/samuraiMack/Fall.png',
			framesMax: 2,
		},
		attack1: {
			imageSrc: './img/samuraiMack/Attack1.png',
			framesMax: 6,
		},
		takeHit: {
			imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
			framesMax: 4,
		},
		death: {
			imageSrc: './img/samuraiMack/Death.png',
			framesMax: 6,
		},
	},
	attackBox: {
		offset: {
			x: 100,
			y: 50,
		},
		width: 150,
		height: 50,
	},
});

player.draw();

const enemy = new Fighter({
	position: {
		x: 860,
		y: 100,
	},
	velocity: {
		x: 0,
		y: 0,
	},
	offset: {
		x: -50,
		y: 0,
	},
	imageSrc: './img/kenji/Idle.png',
	scale: 2.5,
	framesMax: 4,
	offset: {
		x: 215,
		y: 170,
	},
	sprites: {
		idle: {
			imageSrc: './img/kenji/Idle.png',
			framesMax: 4,
		},
		run: {
			imageSrc: './img/kenji/Run.png',
			framesMax: 8,
		},
		jump: {
			imageSrc: './img/kenji/Jump.png',
			framesMax: 2,
		},
		fall: {
			imageSrc: './img/kenji/Fall.png',
			framesMax: 2,
		},
		attack1: {
			imageSrc: './img/kenji/Attack1.png',
			framesMax: 4,
		},
		takeHit: {
			imageSrc: './img/kenji/Take hit.png',
			framesMax: 3,
		},
		death: {
			imageSrc: './img/kenji/Death.png',
			framesMax: 7,
		},
	},
	attackBox: {
		offset: {
			x: -170,
			y: 50,
		},
		width: 170,
		height: 50,
	},
});

enemy.draw();

const keys = {
	a: {
		pressed: false,
	},
	d: {
		pressed: false,
	},
	ArrowLeft: {
		pressed: false,
	},
	ArrowRight: {
		pressed: false,
	},
};

decreaseTimer();

function animate() {
	window.requestAnimationFrame(animate);
	background.update();
	shop.update();
	c.fillStyle = 'rgba(255, 255, 255, 0.15';
	c.fillRect(0, 0, canvas.width, canvas.height);
	player.update();
	enemy.update();

	player.velocity.x = 0;
	enemy.velocity.x = 0;

	if (keys.a.pressed && player.lastKey === 'a') {
		player.velocity.x = -5;
		player.facingRight = false;
		player.switchSprite('run');
	} else if (keys.d.pressed && player.lastKey === 'd') {
		player.velocity.x = 5;
		player.facingRight = true;
		player.switchSprite('run');
	} else {
		player.switchSprite('idle');
	}

	if (player.velocity.y < 0) {
		player.switchSprite('jump');
	} else if (player.velocity.y > 0) {
		player.switchSprite('fall');
	}

	if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
		enemy.velocity.x = -5;
		enemy.facingRight = true;
		enemy.switchSprite('run');
	} else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
		enemy.velocity.x = 5;
		enemy.facingRight = false;
		enemy.switchSprite('run');
	} else {
		enemy.switchSprite('idle');
	}

	if (enemy.velocity.y < 0) {
		enemy.switchSprite('jump');
	} else if (enemy.velocity.y > 0) {
		enemy.switchSprite('fall');
	}

	if (
		rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
		player.isAttacking &&
		player.framesCurrent === 4
	) {
		enemy.takeHit();
		player.isAttacking = false;
		gsap.to('#enemyHealth', {
			width: enemy.health + '%',
		});
	}

	if (player.isAttacking && player.framesCurrent === 4) {
		player.isAttacking = false;
	}

	if (
		rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
		enemy.isAttacking &&
		enemy.framesCurrent === 2
	) {
		player.takeHit();
		enemy.isAttacking = false;
		gsap.to('#playerHealth', {
			width: player.health + '%',
		});
	}

	if (enemy.isAttacking && enemy.framesCurrent === 2) {
		enemy.isAttacking = false;
	}

	if (enemy.health <= 0 || player.health <= 0) {
		determineWinner({ player, enemy, timerId });
		gameOver = true;
	}
}

animate();

function restartGame() {
	location.reload();
}

window.addEventListener('keydown', e => {
	if (gameOver) return;

	if (!player.dead) {
		switch (e.key) {
			case 'd':
				keys.d.pressed = true;
				player.lastKey = 'd';
				break;
			case 'a':
				keys.a.pressed = true;
				player.lastKey = 'a';
				break;
			case 'w':
				if (player.canJump) {
					player.velocity.y = -20;
					player.canJump = false;
				}
				break;
			case 's':
				player.attack();
				break;
		}
	}

	if (!enemy.dead) {
		if (gameOver) return;

		switch (e.key) {
			case 'ArrowRight':
				keys.ArrowRight.pressed = true;
				enemy.lastKey = 'ArrowRight';
				break;
			case 'ArrowLeft':
				keys.ArrowLeft.pressed = true;
				enemy.lastKey = 'ArrowLeft';
				break;
			case 'ArrowUp':
				if (enemy.canJump) {
					enemy.velocity.y = -20;
					enemy.canJump = false;
				}
				break;
			case 'ArrowDown':
				enemy.attack();
				break;
		}
	}
});

window.addEventListener('keyup', e => {
	switch (e.key) {
		case 'd':
			keys.d.pressed = false;
			break;
		case 'a':
			keys.a.pressed = false;
			break;
	}
	switch (e.key) {
		case 'ArrowRight':
			keys.ArrowRight.pressed = false;
			break;
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false;
			break;
	}
});

document.querySelector('#restartBtn').addEventListener('click', () => {
	restartGame();
});
