const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


console.log(canvas.height)

let volumeTop = new Image();
volumeTop.src="./volume.png";
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
	}
	
	update(){
		if(this.y + this.radius < 580){
            this.dy += this.gravity;
        } 
		this.dx = this.dx - (this.dx*this.friction);

        this.x += this.dx; 
        this.y += this.dy; 
	}
	
	draw(){
		ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
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
		}, 500);
		
	}
	
	[...symbols].forEach(object => object.update());
	[...symbols].forEach(object => object.draw());

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




animate();