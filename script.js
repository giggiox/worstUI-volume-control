const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


console.log(canvas.height)

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

let volume = new Volume(58,400);


let symbols = []
class Symbol{
	constructor(angle,x,y){
		this.radius = 35;
        this.mass = this.radius/2;
        this.angle = angle;
        this.x = x;
        this.y = y;
		this.dx = Math.cos(angle) * 7;
        this.dy = Math.sin(angle) * 7;
		this.gravity = 0.05;
		this.friction = 0;
		
		
		this.number = Math.floor(Math.random() * (9-1)+1);
		
		if(Math.random() < 0.4){
			this.number = Math.floor(Math.floor(Math.random() * 4));
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
		}
		
		this.image = new Image();
		this.image.src="./img/" + this.number + ".png";
		
		
		this.deleted = false;
	}
	
	hasInside(x,y){
		let distance = dis(this.x,this.y,x,y);
		return distance <= this.radius*3;
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


var equation = "2+2";

function drawEquation(){
	ctx.fillStyle = "black";
	ctx.fillText(equation,50,90)
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
		}, 500);
		
	}
	
	symbols.forEach((element) => {
		element.update();
		element.draw();
	});
	
	symbols = symbols.filter(element => !element.deleted);

	drawEquation();

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
canvas.addEventListener("click", e => {
	for(let i = 0;i<symbols.length;i++){
		let distance = Math.sqrt(Math.pow(symbols[i].x-mousePos.x,2) + Math.pow(symbols[i].y-mousePos.y,2))
		console.log(mousePos)
		console.log(symbols[symbols.length-1]);
        if(distance <= 90){
			console.log("colpito");
			symbols[i].deleted = true;
		}			
	}
	//console.log(symbols[0]);
	
	console.log(symbols);
})





animate();