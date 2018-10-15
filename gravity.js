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

var maxRadius =  40,
	minRadius = 3;
var gravity = 0.97,
	friction = 0.9;
function Circle(x, y, dx, dy, radius, fillcolor){
	this.x = (x === null)? 200 : x;
	this.y = (y === null)? 200 : y;
	this.dx = (dx === null)? 5 : dx;
	this.dy = (dy === null)? 1 : dy;
	this.radius = (radius === null)? 10 : radius;
	this.minRadius  = (radius === null)? 3 : radius;
	this.fillcolor = (fillcolor === null)? "rgba(104, 215, 226, 0.5)" : fillcolor;

	this.draw = function(){
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2,
			false);
		c.fillStyle=this.fillcolor;
		c.fill();
	}

	this.update = function(){
		if(this.y > canvas.height - this.radius - this.dy){
			this.dy = -this.dy * friction;	
		}else{
			this.dy += gravity;		
		}

		if(this.x > canvas.width - this.radius - this.dx 
			|| this.x < 0 + this.radius - this.dx){
			this.dx = -this.dx * friction;
		}

		this.x += this.dx;
		this.y += this.dy;

		this.draw();
	}
}

// var circle = new Circle(x, y, dx, dy, radius);
var circleArray = [];

function init(){
	circleArray = [];
	for (var i = 0; i <20; i++) {
		var radius = Math.random() * 30 + 20;
		var x = Math.random() * (innerWidth - radius * 2) + radius;
		var y = Math.random() * (innerHeight - radius * 2) + radius;
		var dx = (Math.random() - 0.5) * 10;
		var fillcolor = "rgba(" + Math.random() * 255 + "," + Math.random() * 255 + "," + 
		Math.random() * 255 + "," + Math.random() + ")";
		circleArray.push(new Circle(x, y, dx, 1, radius, fillcolor));
	}
}

function animation(){
	requestAnimationFrame(animation);
	c.clearRect(0, 0, innerWidth, innerHeight);
	
	for (var i = circleArray.length - 1; i >= 0; i--) {
		circleArray[i].update();
	}
	// circleArray[1].update();
}
init();
animation();