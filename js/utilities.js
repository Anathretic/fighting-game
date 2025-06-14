function rectangularCollision({ rectangle1, rectangle2 }) {
	return (
		rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
		rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
		rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
		rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
	);
}

function determineWinner({ player, enemy, timerId }) {
	clearTimeout(timerId);

	document.querySelector('#textDisplay').style.display = 'flex';

	if (player.health === enemy.health) {
		document.querySelector('#textDisplay').innerHTML = 'Remis';
	} else if (player.health > enemy.health) {
		document.querySelector('#textDisplay').innerHTML = 'Gracz nr 1 wygrał';
	} else if (player.health < enemy.health) {
		document.querySelector('#textDisplay').innerHTML = 'Gracz nr 2 wygrał';
	}

	gameOver = true;

	const restartBtn = document.querySelector('#restartBtn');
	restartBtn.style.display = 'inline-block';
}

let timer = 60;
let timerId;
function decreaseTimer() {
	if (timer > 0) {
		timerId = setTimeout(decreaseTimer, 1000);
		timer--;
		document.querySelector('#timer').innerHTML = timer;
	}

	if (timer === 0) {
		determineWinner({ player, enemy, timerId });
	}
}
