let canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ctx = document.getElementById("canvas").getContext("2d");

let pointSize =3;
let points = [];
let pointsAux = [];
let v;
let maxx;
let miny;
let center;
let minPoint;
let indexOfMinPoint;
let nextPoints = [];

window.addEventListener('click', 
	function(){
		getPosition(event);
});

//desenha o vetor do ponto minimo
window.addEventListener('keypress',
	function(){
		if(event.keyCode == 97){// 'a'
            drawLineMinPoint(event,minPoint);
            console.log(points)
            console.log(points[indexOfMinPoint].x,points[indexOfMinPoint].y)
            console.log(indexOfMinPoint)
        }
});
    
//calcula os pontos do fecho
window.addEventListener('keypress',
function(){
    if(event.keyCode == 115){// 's'
        nextPoints = nextPoint(minPoint);
        // nextPoints.push(next);
        // drawLine(minPoint.x,minPoint.y,next[0].x,next[0].y,'#AAAeee');
    }
});

//apenas depois do evendo da tecla s
window.addEventListener('keypress',
function(){
    if(event.keyCode == 110 && nextPoints.length>0){// 'n'
        console.log(minPoint);
        console.log('nextPoints: '+ JSON.stringify(nextPoints));
        if(nextPoints.length==1){
            drawLine(nextPoint[0].x,nextPoints[0].y,minPoint.x,minPoint.y,'#6B7CE8');
        }
        else{
            drawLine(minPoint.x,minPoint.y,nextPoint[0].x,nextPoints[0].y,'#6B7CE8');
        }
        nextPoints.splice(nextPoints[0],1);
    }
});

window.addEventListener('keypress',
function(){
    if(event.keyCode == 99){// 'c'
        console.log('c PRESSED')
        checkMinPoint();
    }
});

function getPosition(event){
     
     let rect = canvas.getBoundingClientRect();
     let x = event.clientX - rect.left;
     let y = event.clientY - rect.top;
     v = new Vec2(x,y);
     points.push(v);
     drawCoordinates(x,y);
     console.log('ponto:' + '('+v.x+','+v.y+')');
     checkMinPoint();	    	    
}

function drawCoordinates(x,y){	

	ctx.fillStyle = "#fffff";
	ctx.beginPath();
	ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
	ctx.fill();
	ctx.font = "10px Arial";
    ctx.fillText("Ponto: "+x+','+y, x, y);
}

function drawLine(x1,y1,x2,y2,color){
	ctx.beginPath();
	ctx.moveTo(x1,y1); 
	ctx.lineTo(x2,y2);
	ctx.strokeStyle = color;
	ctx.stroke();
	ctx.closePath();
}

function drawLineMinPoint(point){	
    drawLine(minPoint.x,minPoint.y,canvas.width,minPoint.y,"#000");
}

function pseudoAngle1(u,v){
    let y = v.x;
    let x = u.x;
    if (y >= 0){
        if (x >= 0){
            if (x >= y){
                return y/x;
            }
            return 2 - x/y;
        }
        if(-x<=y){
            return 2+(-x)/y;
        }
        return 4 - y/(-x);
    }
    if(x < 0){
        if(-x >= -y){
            return 4 + (-y)/(-x);
        }
        return 6-(-x)/(-y);
    }
    if(x <= -y){
        return 6 + x/(-y);
    }
    return 8-(-y)/x;
}

function pseudoAngle2(u,v){

    if(isNaN(u.dot(v)/(u.magnitude()*v.magnitude()))){
        return 1;
    }
    else{
        return 1 - (u.dot(v)/(u.magnitude()*v.magnitude()));
    }
}

function checkMinPoint(){

    miny = points[0].y;
    maxx = points[0].x;

    minPoint =  new Vec2(maxx,miny);
 
    for (let i = 0; i < points.length; i++) {
		if (points[i].y > miny) {
            miny = points[i].y;
            minPoint = points[i];
            indexOfMinPoint = i;
           
        }

        else if(points[i].y == miny){
            if(points[i].x > maxx){
                minPoint = points[i];
                indexOfMinPoint = i;
               
            }
        }
        else{
            indexOfMinPoint = 0;
           
        }
    }
    pointsAux = [...points];
    pointsAux.splice(indexOfMinPoint, 1);
    return minPoint;
    console.log('ponto minimo: '+ '('+minPoint.x+','+minPoint.y+')');
}
/**
 * Inicialmente a função nextPoint recebe o pinto minimo no atributo startPoint 
 * e null na variavel.
 * O vetor pointsAux, inicialmente, são todos os pontos menos o ponto minimo. 
 * @param {*} startPoint 
 * @param {*} endPoint 
 */
function nextPoint(startPoint){
    let pointsOrder = [];
    let peseudoAngleArray = [];
    let max;
    let endPoint = new Vec2(1,0);
    
    while(pointsAux.length>0){
        peseudoAngleArray = [];
        //calcula os pseudos usando os pontos e guarda seus valores 
        for(let i = 0; i < pointsAux.length; i++){
            // console.log('pseudo angulo de : '+endPoint.x+','+endPoint.y+' e '+pointsAux[i].x+','+pointsAux[i].y)
            // console.log('= '+pseudoAngle1(endPoint,pointsAux[i]));
            peseudoAngleArray.push([pointsAux[i],pseudoAngle1(endPoint,pointsAux[i])])
        }
        max = getMaxPseudoAngle(peseudoAngleArray);
        // console.log('max objeto: '+ JSON.stringify(max))
        // console.log('Ponto de maximo pseudoangulo :'+max[0].x +','+ max[0].y+ ';' +'pseudoangulo: '+ max[1]);
        // console.log('pointsAux antes do splice: ' + JSON.stringify(pointsAux));
        pointsAux.splice(max[0],1);
        // console.log('pointsAux depois do splice: ' + JSON.stringify(pointsAux));
        pointsOrder.push(max);    
    }
    return pointsOrder;
}
/**
 * Retorna um vetor de duas posições com o ponto na posição 0
 * e o pseudo angulo na posicao 1
 * @param {*} pseudoAngleArray 
 */
function getMaxPseudoAngle(pseudoAngleArray){
    let max=[];
    let aux = 0;
    for(let i = 0; i< pseudoAngleArray.length;i++){
        if(pseudoAngleArray[i][1]>aux){
            max[0] = pseudoAngleArray[i][0];
            max[1] = pseudoAngleArray[i][1];
            aux = pseudoAngleArray[i][1];
        }
    }
    return max;
}

class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
        //norma do vetor(tamanho)
    magnitude(){
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };

        //norma do vetor ao quadrado
    squaredMagnitude(){
        return (x * x + y * y);
    };

        //vetor normalizado
    normalize(){
        this.x = this.x / this.magnitude();
        this.y = this.y / this.magnitude();
    };

        //produto escalar
    dot(v) {
        return this.x * v.x + this.y * v.y;
    };

        //produto vetorial
     cross(v) {
        return this.x * v.y - this.y * v.x;
    };
        
        //adição dde vetores
     add (v) {
        return Vec2(this.x + v.x, this.y + v.y);
    };

        //subtraçao de vetores
    sub(v) {
        return Vec2(this.x - v.x, this.y - v.y);
    };

}

// let u2 = new Vec2(574,304);
// let v2 = new Vec2(432,174)
// let v3 = new Vec2(318,118)
// console.log(pseudoAngle1(u2,u2));
// console.log(pseudoAngle1(u2,v2));
// console.log(pseudoAngle1(u2,v3));
