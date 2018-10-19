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
	this.velocity = {
		x: (Math.random() - 0.5) * 20,
		y: 3
	};
	this.friction = 0.8;
	this.gravity = 1;
}
//for when we new a star will not new the update function for one time
Star.prototype.draw = function() {
	c.save();
	c.beginPath();
	c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

	c.shadowColor = '#E3EAEF';
	c.shadowBlur = 20;
	c.shadowOffsetX = 0;
	c.shadowOffsetY = 0;

	c.fillStyle = "#E3EAEF";
	c.fill();
	c.closePath();
	c.restore();
}

Star.prototype.update = function() {
	this.draw();

	if(this.y + this.radius + this.velocity.y > canvas.height){
		this.velocity.y = -this.velocity.y * this.friction;
		this.shatter();
	}else{
		this.velocity.y += this.gravity;
	}

	if(this.x + this.radius + this.velocity.x > canvas.width ||
		this.x + this.radius + this.velocity.x < 0){
		this.velocity.x = -this.velocity.x * this.friction;
	}
	this.x += this.velocity.x;
	this.y += this.velocity.y;
}

Star.prototype.shatter = function(){
	this.radius -= 3;
	for(let i = 0; i < 8; i++){
		miniStars.push(new MiniStar(this.x, this.y, 2));
	}

}

function MiniStar(x, y, radius, color){
	Star.call(this, x, y, radius, color);
	this.velocity = {
		x: randomIntFromRange(-5, 5),
		y: randomIntFromRange(-15, 15)
	};
	this.friction = 0.8;
	this.gravity = 0.1;
	// times of frame to live
	this.ttl = randomIntFromRange(80, 100);
	this.opacity = 1;
}

MiniStar.prototype.draw = function() {
	c.save();
	c.beginPath();
	c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
	c.fillStyle= 'rgba(227, 234, 239, '+this.opacity+')';
	//c.fillStyle= 'rgba(0, 0, 255, ${this.opacity})';//es6

	c.shadowColor = '#E3EAEF';
	c.shadowBlur = 20;
	c.fill();
	c.restore();
}

MiniStar.prototype.update = function() {
	this.draw();

	if(this.y + this.radius + this.velocity.y > canvas.height){
		this.velocity.y = -this.velocity.y * this.friction;
	}else{
		this.velocity.y += this.gravity;
	}
	this.y += this.velocity.y;
	this.x += this.velocity.x;
	this.ttl -= 1;
	this.opacity -= 1 / this.ttl;
}

function createMountainRange(mountainAmount, height, color) {
	for (let i = 0; i < mountainAmount; i++) {
		let mountainWidth = canvas.width / mountainAmount;

		c.beginPath();
		c.moveTo(i * mountainWidth, canvas.height);
		c.lineTo(i * mountainWidth + mountainWidth + 325, canvas.height);

		c.lineTo(i * mountainWidth + mountainWidth / 2, canvas.height - height);
		c.lineTo(i * mountainWidth - 325, canvas.height);
		c.fillStyle = color;
		c.fill();
		c.closePath();
	}
}
const backgroundGradient = c.createLinearGradient(0, 0, 0, canvas.height);
backgroundGradient.addColorStop(0, '#171e26');
backgroundGradient.addColorStop(1, '#3f586b');
// var circle = new Circle(x, y, x, y, radius);
let stars;
let miniStars;
let backgroundStars;
let ticker = 0;
let randomSpawnRate = 75;
function init(){
	stars = [];
	miniStars = [];
	backgroundStars = [];

	for (var i = 0; i < 1 ; i++) {
		const radius = 15;
		let x = canvas.width/2;
		let y = 30;
		const color = randomColor(0.5);

		stars.push(new Star(x, y, radius, color));
	}

	for (var i = 0; i < 150; i++) {
		const x = Math.random() * canvas.width;
		const y = Math.random() * canvas.height;
		const radius = Math.random() * 3;
		backgroundStars.push(new Star(x, y, radius, 'white'));
	}

}

function animation(){
	requestAnimationFrame(animation);
	c.fillStyle = backgroundGradient;
	c.fillRect(0, 0, innerWidth, innerHeight);
	
	backgroundStars.forEach(backgroundStar => {
		backgroundStar.draw();
	});

	createMountainRange(1, canvas.height - 150, "#384551");
	createMountainRange(2, canvas.height - 200,  "#2B3843");
	createMountainRange(3, canvas.height - 380 , "#26333E");

	stars.forEach((star, index) => {
		star.update();
		if(star.radius <= 3) {
			stars.splice(index, 1);
		}

	});
	
	miniStars.forEach((miniStar, index) => {
		miniStar.update();
		if(miniStar.ttl == 0) {
			miniStars.splice(index, 1);
		}
	});

	ticker ++;
	if(ticker % randomSpawnRate == 0){
		const radius = randomIntFromRange(10, 15);
		const x = randomIntFromRange(radius, canvas.width - radius);
		const y = -15;
		stars.push(new Star(x, y, radius, "E3EAEF"));
		randomSpawnRate = randomIntFromRange(75, 200);
	}
}
init();
animation();