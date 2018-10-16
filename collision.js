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

function distance(x1, x2, y1, y2){
	const xDist = x2 - x1;
	const yDist = y2 - y1;
	return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

var maxRadius =  40,
	minRadius = 3;
var gravity = 0.97,
	friction = 0.9;
function Circle(x, y, radius, fillcolor){
	this.x = (x === null)? 200 : x;
	this.y = (y === null)? 200 : y;
	this.radius = (radius === null)? 10 : radius;
	this.originColor  = (fillcolor === null)? 3 : fillcolor;
	this.fillcolor = (fillcolor === null)? "rgba(104, 215, 226, 0.5)" : fillcolor;

	this.update = function(){
		this.draw();
	}

	this.draw = function(){
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2,
			false);
		c.fillStyle=this.fillcolor;
		c.fill();
	}
}

// var circle = new Circle(x, y, dx, dy, radius);
let circle1, circle2;

function init(){
	circle1 = new Circle(canvas.width/2, canvas.height/2, 200, randomColor(0.8));
	circle2 = new Circle(canvas.width/2, canvas.height/2, 50, randomColor(0.8));
}

function animation(){
	requestAnimationFrame(animation);
	c.clearRect(0, 0, innerWidth, innerHeight);
	

	circle2.x = mouse.x;
	circle2.y = mouse.y;

	if(distance(circle1.x, circle2.x, circle1.y, circle2.y) <= circle1.radius + circle2.radius){
		circle1.fillcolor = circle2.fillcolor;
	}else{
		circle1.fillcolor = circle1.originColor;
	}

	circle1.update();
	circle2.update();

}
init();
animation();