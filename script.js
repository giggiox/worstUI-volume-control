const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.font = '40px impact';

let volumeTop = new Image();
volumeTop.src="./img/volume.png";
volumeTop.onload = renderImages;
let imgCount = 1;
function renderImages(){
    if(--imgCount>0){return}
    //Call animate() when all images have loaded
    animate();
}


let angle = null;
let canShoot = true;

class Volume{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.topX = x-20;
        this.topY = y-95;
    }


    rotateTop(){
		if(angle){
			ctx.translate((this.x+15), (this.y-50));
            ctx.rotate(angle);
            ctx.translate(-(this.x+15), -(this.y-50));
		}
    }

    draw() {		
        ctx.save();
        this.rotateTop();
        ctx.drawImage(volumeTop,this.topX,this.topY,100,100);
    }
}

let volume = new Volume(58,500);


let symbols = []
class Symbol{
	
	constructor(angle,x,y,number = null){
		this.radius = 35;
        this.mass = this.radius/2;
        this.angle = angle;
        this.x = x;
        this.y = y;
		this.dx = Math.cos(angle) * 7;
        this.dy = Math.sin(angle) * 7;
		this.gravity = 0.05;
		this.friction = 0;
		
		if(number == null){
			this.number = Math.floor(Math.random() * (10-1))+1;
			if(Math.random() < 0.7){
				this.number = Math.floor(Math.floor(Math.random() * 6));
				if(this.number == 0){
					this.number = "plus";
				}
				else if(this.number == 1){
					this.number = "minus";
				}
				else if(this.number == 2){
					this.number = "times";
				}	
				else if(this.number == 3){
					this.number = "div";
				}
				else if(this.number == 5){
					this.number = "equals";
				}
			}
		}else{
			this.number = number;
		}
		
		this.image = new Image();
		this.image.src="./img/" + this.number + ".png";
		
		
		this.deleted = false;
	}
	
	hasInside(x,y){
		let distance = Math.sqrt(Math.pow(this.x-x,2),Math.pow(this.y-y),2);
		return distance <= this.radius*2.5;
	}
	
	update(){
		if(this.y + this.radius < 580){
            this.dy += this.gravity;
        } 
		this.dx = this.dx - (this.dx*this.friction);

        this.x += this.dx; 
        this.y += this.dy; 
		
		if(this.y > canvas.height) {
			this.deleted = true;
		}
	}
	
	draw(){
		ctx.save();
        ctx.drawImage(this.image,this.x-20,this.y-95,100,100);
	}
}





function animate(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.clearRect(0,0,canvas.width,canvas.height);

    volume.draw();
    ctx.restore();
	
	if(canShoot){
		canShoot = false;
		let ballPos = sortBallPos(volume.topX + 100, volume.topY + 30);
		symbols.push( new Symbol(angle, ballPos.x, ballPos.y));
		angle = Math.random() * (-1 - (-0.2)) -0.2;
		setTimeout(() => {
			canShoot = true;
		}, 400);
		
	}
	
	symbols.forEach((element) => {
		element.update();
		element.draw();
	});
	
	equations.forEach((element) => {
		element.draw();
	});
	
	
	currentVolumeSymbols.forEach((element) => {
		element.draw();
	});
	
	symbols = symbols.filter(element => !element.deleted);


	ctx.fillStyle = "black";
	ctx.fillText("volume:",160,555);
	
	ctx.beginPath();
    ctx.moveTo(volume.x,volume.y+70);
    ctx.lineTo(volume.x,volume.y+240);
	ctx.lineTo(volume.x+300,volume.y+240);
	ctx.lineTo(volume.x+300,volume.y+70);
	ctx.lineTo(volume.x,volume.y+70);
    ctx.stroke();

	requestAnimationFrame(animate);
}



function sortBallPos(x, y) {
    let rotatedAngle = angle;
    //Work out distance between rotation point & cannon nozzle
    let dx = x - (volume.x + 15);
    let dy = y - (volume.y - 50);
    let distance = Math.sqrt(dx*dx + dy*dy);
    let originalAngle = Math.atan2(dy,dx);
    //Work out new positions
    let newX = (volume.x + 15) + distance * Math.cos(originalAngle + rotatedAngle);
    let newY = (volume.y - 50) + distance * Math.sin(originalAngle + rotatedAngle);

    return {
        x: newX,
        y: newY
    }
}


canvas.addEventListener("mousemove", e => {
    mousePos = {
        x: e.clientX - canvas.offsetLeft,
        y: e.clientY - canvas.offsetTop
    }
});
let mousePos = null;

var equations = [];
var currentVolume = [50];
var currentVolumeSymbols = [];

function displayCurrentVolume(){
	let strCurrentVolume = "" + currentVolume[0];
	
	let positions = [0,0,0];
	if(strCurrentVolume.length == 1){
		positions[0] = 180;
	}else if(strCurrentVolume.length == 2){
		positions[0] = 130;
		positions[1] = 230;
	}else{
		positions[0] = 80;
		positions[1] = 180;
		positions[2] = 280;
	}
	for (let i = 0;i < strCurrentVolume.length;i++){
		currentVolumeSymbols.push(
			new Symbol(0,positions[i],700,strCurrentVolume[i])
		);
	}
	
	/**
	if (currentVolume > 80){
		volumeTop.src="./img/volume3.png";
	}else if(currentVolume > 40){
		volumeTop.src="./img/volume2.png";
	}else if(currentVolume > 20){
		volumeTop.src="./img/volume1.png";
	}else{
		volumeTop.src="./img/volume0.png";
	}**/
}
displayCurrentVolume();

function calculateResult(){
	let operand = equations[0].number;
	let number = "";
	for(let i = 1;i < equations.length;i++){
		number += equations[i].number;
	}
	number = parseInt(number, 10);
	let tmpRes = 0;
	if(operand == "plus"){
		tmpRes = currentVolume[0] + number;
	}else if(operand == "minus"){
		tmpRes = currentVolume[0] - number;
	}else if(operand == "times"){
		tmpRes = currentVolume[0] * number;
	}else if(operand == "div"){
		tmpRes = Math.floor(currentVolume / number);
	}
	if(tmpRes < 0) tmpRes = 0;
	if(tmpRes > 100) tmpRes = 100;
	currentVolume[0] = tmpRes;
	

	
}

canvas.addEventListener("click", e => {
	for(let i = 0;i<symbols.length;i++){

        if(symbols[i].hasInside(mousePos.x,mousePos.y)){
			//collision detected
			if(equations.length < 3){
				if((symbols[i].number == "minus" || symbols[i].number == "plus"
					|| symbols[i].number == "times" || symbols[i].number == "div") && equations.length == 0){
					equations.push(new Symbol(0,400 + equations.length*100,700,symbols[i].number));
					symbols[i].deleted = true;
				}else if(!(symbols[i].number == "minus" || symbols[i].number == "plus"
					|| symbols[i].number == "times" || symbols[i].number == "div") && equations.length != 0){
					equations.push(new Symbol(0,400 + equations.length*100,700,symbols[i].number));
					symbols[i].deleted = true;
				}
			}
			
			if(equations.length >2 && symbols[i].number == "equals"){
				calculateResult();
				while(equations.length > 0){
					equations.pop();
				}				
				while (currentVolumeSymbols.length > 0) {
					currentVolumeSymbols.pop();
				}
				displayCurrentVolume();
				
			}
			
		}			
	}
})



animate();