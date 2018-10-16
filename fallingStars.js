var canvas = document.querySelector('canvas');
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

var c = canvas.getContext('2d');


window.addEventListener('resize', () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
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

function Star(x, y, radius, color){
	this.x = (x === null)? 200 : x;
	this.y = (y === null)? 200 : y;
	this.radius = (radius === null)? 10 : radius;
	this.color = (color === null)? "rgba(104, 215, 226, 0.5)" : color;
}
//for when we new a star will not new the update function for one time
Star.prototype.update = function() {
	this.draw();
}

Star.prototype.draw = function() {
	c.beginPath();
	c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
	c.fillStyle=this.color;
	c.fill();
}
// var circle = new Circle(x, y, x, y, radius);
let stars;

function init(){
	stars = [];

	for (var i = 0; i < 1 ; i++) {
		const radius = 30;
		let x = canvas.width/2;
		let y = 30;
		const color = randomColor(0.5);

		stars.push(new Star(x, y, radius, color));
	}

}

function animation(){
	requestAnimationFrame(animation);
	c.fillStyle = "rgba(0, 0, 0, 0.05)";
	c.clearRect(0, 0, innerWidth, innerHeight);
	
	stars.forEach(star => {
		star.update();
	});
	
}
init();
animation();