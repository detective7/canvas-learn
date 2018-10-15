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

var maxRadius =  40,
	minRadius = 3;
function Circle(x, y, dx, dy, radius, fillcolor){
	this.x = (x === null)? 200 : x;
	this.y = (y === null)? 200 : y;
	this.dx = (dx === null)? 4 : dx;
	this.dy = (dy === null)? 4 : dy;
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
		if(this.x + this.radius > innerWidth || this.x - this.radius < 0){
			this.dx = -this.dx;
		}
		if(this.y + this.radius > innerHeight || this.y - this.radius < 0){
			this.dy = -this.dy;
		}
		this.x += this.dx;
		this.y += this.dy;

		if(mouse.x - this.x < 50 && mouse.x - this.x >-50
			&& mouse.y - this.y < 50 && mouse.y - this.y > -50
			&& this.radius < maxRadius){
			this.radius += 1;
		}else if(this.radius > this.minRadius){
			this.radius -= 1;
		}

		this.draw();
	}
}

// var circle = new Circle(x, y, dx, dy, radius);
var circleArray = [];

function init(){
	circleArray = [];
	for (var i = 0; i <500; i++) {
		var radius = Math.random() * 8 + 3;
		var x = Math.random() * (innerWidth - radius * 2) + radius;
		var y = Math.random() * (innerHeight - radius * 2) + radius;
		var dx = (Math.random() - 0.5);
		var dy = (Math.random() - 0.5);
		var fillcolor = "rgba(" + Math.random() * 255 + "," + Math.random() * 255 + "," + 
		Math.random() * 255 + "," + Math.random() + ")";
		circleArray.push(new Circle(x, y, dx, dy, radius, fillcolor));
	}
}

function animation(){
	requestAnimationFrame(animation);
	c.clearRect(0, 0, innerWidth, innerHeight);
	
	for (var i = circleArray.length - 1; i >= 0; i--) {
		circleArray[i].update();
	}
	// circle.update(c);
}
init();
animation();