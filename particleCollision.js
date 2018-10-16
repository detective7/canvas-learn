var canvas = document.querySelector('canvas');
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

var c = canvas.getContext('2d');

var mouse = {
	x: undefined,
	y: undefined
}

window.addEventListener('mousemove',
	function(event){
		mouse.x = event.x;
		mouse.y = event.y;
})

window.addEventListener('resize',function(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	init();
})

window.addEventListener('click',function(){
	init();
})

function randomIntFromRange(min, max){
	return Math.floor(Math.random() * (max - min +1) + min);
}

function randomColor(opacity){
	return "rgba(" + Math.random() * 255 + "," + Math.random() * 255 + "," + 
		Math.random() * 255 + "," + opacity + ")";
}

function distance(x1, y1, x2, y2){
	const xDist = x2 - x1;
	const yDist = y2 - y1;
	return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

function resolveCollision(particle, otherParticle){
	const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
	const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

	const xDist = otherParticle.x - particle.x;
	const yDist = otherParticle.y - particle.y;

	// Prevent accidental overlap of particles
	if(xVelocityDiff * xDist + yVelocityDiff * yDist >= 0){
		const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

		const m1 = particle.mass;
		const m2 = otherParticle.mass;

		const u1 = rotate(particle.velocity, angle);
		const u2 = rotate(otherParticle.velocity, angle);

		const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 *m2 / (m1 + m2), y: u1.y};
		const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 *m2 / (m1 + m2), y: u2.y};

		const vFinal1 = rotate(v1, -angle);
		const vFinal2 = rotate(v2, -angle);

		particle.velocity.x = vFinal1.x;
		particle.velocity.y = vFinal1.y;

		otherParticle.velocity.x = vFinal2.x;
		otherParticle.velocity.y = vFinal2.y;
	}
}

function Particle(x, y, radius, color){
	this.x = (x === null)? 200 : x;
	this.y = (y === null)? 200 : y;
	this.velocity = {
		x: (Math.random() - 0.5) * 8,
		y: (Math.random() - 0.5) * 8
	}
	this.radius = (radius === null)? 10 : radius;
	this.originColor  = (color === null)? "rgba(104, 215, 226, 0.5)" : color;
	this.strokecolor = (color === null)? "rgba(104, 215, 226, 0.5)" : color;
	this.mass = 1;

	this.update = particles => {
		this.draw();

		for (var i = 0; i < particles.length; i++) {
			if(this === particles[i]) continue;
			if(distance(this.x, this.y, particles[i].x, particles[i].y) < 
				this.radius + particles[i].radius){
				// console.log("has collided");
				resolveCollision(this, particles[i]);
			}
		}


		if(this.y > canvas.height - this.radius - this.velocity.y
			|| this.y < 0 + this.radius - this.velocity.y){
			this.velocity.y = -this.velocity.y;
		}

		if(this.x > canvas.width - this.radius - this.velocity.x
			|| this.x < 0 + this.radius - this.velocity.x){
			this.velocity.x = -this.velocity.x;
		}

		const fillRange = 60;
		if(this.x  < mouse.x + fillRange  && 
			this.x > mouse.x - fillRange &&
			this.y < mouse.y + fillRange  && 
			this.y > mouse.y - fillRange){
			c.beginPath();
			c.arc(this.x, this.y, this.radius, 0, Math.PI * 2,
			false);
			c.fillStyle = this.originColor;
			c.fill();
		}

		this.x += this.velocity.x;
		this.y += this.velocity.y;
	}

	this.draw = () => {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2,
			false);
		c.strokeStyle=this.strokecolor;
		c.stroke();
		c.closePath();
	}
}

// var circle = new Circle(x, y, x, y, radius);
let particles;

function init(){
	particles = [];
	const radius = 20;

	for (var i = 0; i < 200 ; i++) {
		let x = randomIntFromRange(radius, canvas.width - radius);
		let y = randomIntFromRange(radius, canvas.height - radius);
		const color = randomColor(0.5);

		if(i != 0){
			for (var j = 0; j < particles.length; j++) {
				if(distance(x, y, particles[j].x, particles[j].y) < radius + particles[j].radius){
					x = randomIntFromRange(radius, canvas.width - radius);
					y = randomIntFromRange(radius, canvas.height - radius);

					j = -1; // that's cool, it will loop in this detect again
				}
			}
		}

		particles.push(new Particle(x, y, radius, color));
	}

}

function animation(){
	requestAnimationFrame(animation);
	c.clearRect(0, 0, innerWidth, innerHeight);
	
	particles.forEach(particle => {
		particle.update(particles);
	});
	
}
init();
animation();