class Sprite {
	constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }) {
		this.position = position;
		this.width = 50;
		this.height = 150;
		this.image = new Image();
		this.image.src = imageSrc;
		this.scale = scale;
		this.framesMax = framesMax;
		this.framesCurrent = 0;
		this.framesElapsed = 0;
		this.framesHold = 5;
		this.offset = offset;
	}

	draw() {
		c.drawImage(
			this.image,
			this.framesCurrent * (this.image.width / this.framesMax),
			0,
			this.image.width / this.framesMax,
			this.image.height,
			this.position.x - this.offset.x,
			this.position.y - this.offset.y,
			(this.image.width / this.framesMax) * this.scale,
			this.image.height * this.scale
		);
	}

	animateFrames() {
		this.framesElapsed++;

		if (this.framesElapsed % this.framesHold === 0) {
			if (this.framesCurrent < this.framesMax - 1) {
				this.framesCurrent++;
			} else {
				this.framesCurrent = 0;
			}
		}
	}

	update() {
		this.draw();
		this.animateFrames();
	}
}

class Fighter extends Sprite {
	constructor({
		position,
		velocity,
		imageSrc,
		scale = 1,
		framesMax = 1,
		offset = { x: 0, y: 0 },
		sprites,
		attackBox = { offset: {}, width: undefined, height: undefined },
	}) {
		super({
			position,
			imageSrc,
			scale,
			framesMax,
			offset,
		});
		this.velocity = velocity;
		this.width = 50;
		this.height = 150;
		this.lastKey;
		this.attackBox = {
			position: {
				x: this.position.x,
				y: this.position.y,
			},
			offset: attackBox.offset,
			width: attackBox.width,
			height: attackBox.height,
		};
		this.isAttacking;
		this.health = 100;
		this.framesCurrent = 0;
		this.framesElapsed = 0;
		this.framesHold = 5;
		this.sprites = sprites;
		this.canJump = true;
		this.facingRight = true;
		this.dead = false;

		for (const sprite in this.sprites) {
			sprites[sprite].image = new Image();
			sprites[sprite].image.src = sprites[sprite].imageSrc;
		}
	}

	draw() {
		c.save();

		if (!this.facingRight) {
			c.translate(this.position.x + this.width / 2, this.position.y);
			c.scale(-1, 1);
			c.translate(-this.position.x - this.width / 2, -this.position.y);
		}

		c.drawImage(
			this.image,
			this.framesCurrent * (this.image.width / this.framesMax),
			0,
			this.image.width / this.framesMax,
			this.image.height,
			this.position.x - this.offset.x,
			this.position.y - this.offset.y,
			(this.image.width / this.framesMax) * this.scale,
			this.image.height * this.scale
		);

		c.restore();
	}

	update() {
		this.draw();
		if (!this.dead) this.animateFrames();

		this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
		this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

		this.position.x += this.velocity.x;

		if (this.position.x < 0) this.position.x = 0;

		if (this.position.x + this.width > canvas.width) {
			this.position.x = canvas.width - this.width;
		}

		this.position.y += this.velocity.y;

		if (this.position.y + this.height + this.velocity.y >= canvas.height - 95) {
			this.velocity.y = 0;
			this.position.y = canvas.height - 95 - this.height;
			this.canJump = true;
		} else {
			this.velocity.y += gravity;
			this.canJump = false;
		}

		if (this.position.y < 0) {
			this.position.y = 0;
			this.velocity.y = 0;
		}
	}

	attack() {
		this.switchSprite('attack1');
		this.isAttacking = true;
	}

	takeHit() {
		if (this.dead) return;

		this.health -= 10;

		if (this.health <= 0) {
			this.health = 0;
			this.switchSprite('death');
		} else {
			this.switchSprite('takeHit');
		}
	}

	isOnGround() {
		return this.position.y + this.height >= canvas.height;
	}

	switchSprite(sprite) {
		if (this.image === this.sprites.death.image) {
			if (this.framesCurrent === this.sprites.death.framesMax - 1) {
				this.dead = true;
			}
			return;
		}

		if (this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax - 1) return;

		if (this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.framesMax - 1) return;

		switch (sprite) {
			case 'idle':
				if (this.image !== this.sprites.idle.image) {
					this.image = this.sprites.idle.image;
					this.framesMax = this.sprites.idle.framesMax;
					this.framesCurrent = 0;
				}
				break;
			case 'run':
				if (this.image !== this.sprites.run.image) {
					this.image = this.sprites.run.image;
					this.framesMax = this.sprites.run.framesMax;
					this.framesCurrent = 0;
				}
				break;
			case 'jump':
				if (this.image !== this.sprites.jump.image) {
					this.image = this.sprites.jump.image;
					this.framesMax = this.sprites.jump.framesMax;
					this.framesCurrent = 0;
				}
				break;
			case 'fall':
				if (this.image !== this.sprites.fall.image) {
					this.image = this.sprites.fall.image;
					this.framesMax = this.sprites.fall.framesMax;
					this.framesCurrent = 0;
				}
				break;
			case 'attack1':
				if (this.image !== this.sprites.attack1.image) {
					this.image = this.sprites.attack1.image;
					this.framesMax = this.sprites.attack1.framesMax;
					this.framesCurrent = 0;
				}
				break;
			case 'takeHit':
				if (this.image !== this.sprites.takeHit.image) {
					this.image = this.sprites.takeHit.image;
					this.framesMax = this.sprites.takeHit.framesMax;
					this.framesCurrent = 0;
				}
				break;
			case 'death':
				if (this.image !== this.sprites.death.image) {
					this.image = this.sprites.death.image;
					this.framesMax = this.sprites.death.framesMax;
					this.framesCurrent = 0;
				}
				break;
		}
	}
}
