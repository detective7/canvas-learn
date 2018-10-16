var canvas = document.querySelector('canvas');
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

var c = canvas.getContext('2d');

var mouse = {
	x: canvas.width/2,
	y: canvas.height/2
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

function Particle(x, y, radius, color){
	this.x = (x === null)? 200 : x;
	this.y = (y === null)? 200 : y;
	this.radius = (radius === null)? 10 : radius;
	this.color = (color === null)? "rgba(104, 215, 226, 0.5)" : color;
	this.radians = Math.random() *Math.PI * 2;
	this.velocity = 0.04;
	this.distanceFromCenter = randomIntFromRange(50, 120);
	this.lastMouse = {x: x,y: y};

	this.update = particles => {
		const lastPoint = {x: this.x, y: this.y};
		this.radians += this.velocity;
		//Drag effect (if you move mouse to 100px from origin point, it can only get 5px,for creat the delay animation)
		this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05;
		this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05;

		this.x = this.lastMouse.x + Math.cos(this.radians) * this.distanceFromCenter;
		this.y = this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCenter;
		this.draw(lastPoint);
	}

	this.draw = lastPoint => {
		//c.save();
		c.beginPath();
		c.lineCap="round";
		c.strokeStyle = this.color;
		c.lineWidth = this.radius;
		c.moveTo(lastPoint.x, lastPoint.y);
		c.lineTo(this.x, this.y);
		c.stroke();
		c.closePath();
		//c.restore();
	}
}

// var circle = new Circle(x, y, x, y, radius);
let particles;

function init(){
	particles = [];

	for (var i = 0; i < 30 ; i++) {
		const radius = (Math.random() * 3) + 3;
		let x = canvas.width/2;
		let y = canvas.height/2;
		const color = randomColor(0.5);

		particles.push(new Particle(x, y, radius, color));
	}

}

function animation(){
	requestAnimationFrame(animation);
	c.fillStyle = "rgba(0, 0, 0, 0.05)";
	c.fillRect(0, 0, innerWidth, innerHeight);
	
	particles.forEach(particle => {
		particle.update(particles);
	});
	
}
init();
animation();