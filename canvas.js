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
let next_point;
let indexOfMinPoint;
let nextPoints = [];
let points_interated;
let dir_vec2;
let initialPoints = [];
let indexesOfNextsPoints = [];
let indexOfMinPoint2;
let pointsTriang = [];
let candidatos =[];

window.addEventListener('click', 
	function(){
        if(document.getElementById('myModal').style.display === 'none'){
            getPosition(event);
        }

});

//desenha o vetor do ponto minimo
window.addEventListener('keypress',
	function(){
        //calculo a minima só aqui e trago ele pro começo do vetor
		if(event.keyCode == 97){// 'a'
			checkMinPoint();
            drawLineMinPoint(event,minPoint);
            //direcao antiga q uso pra ver qual o menor angulo
            dir_vec2 = new Vec2(1,0);
            //aqui conta qnts pontos ja foram olhados pra ignorar o points_interated primeiros
            points_interated = 1;
            console.log(points)
            console.log(minPoint)
            console.log(points[indexOfMinPoint].x,points[indexOfMinPoint].y)
            console.log(indexOfMinPoint)
        }
});
    
//calcula os pontos do fecho
// window.addEventListener('keypress',
// function(){
//     if(event.keyCode == 115){// 's'
//         //se ja tiver interado todos nao faz nada
//     	if(points_interated > points.length) return;
//         //calculo o proximo e trago ele pro começo
//         next_point = nextPoint2(points_interated);
//     	//aumento os interados
//         points_interated++;
//         //calculo a nova direcao
//     	dir_vec2 = next_point.sub(minPoint);

//         drawLine(minPoint.x,minPoint.y,next_point.x,next_point.y,'#AAAeee');
//         minPoint = next_point;
//         console.log(minPoint);
//     }
// });

window.addEventListener('keypress',
function(){
    if(event.keyCode == 115){// 's'
        //se ja tiver interado todos nao faz nada
    	while(points_interated <= points.length){
    		//calculo o proximo e trago ele pro começo
	        next_point = nextPoint2(points_interated);
	        nextPoints.push(next_point);
	    	//aumento os interados
	        points_interated++;
	        //calculo a nova direcao
	    	dir_vec2 = next_point.sub(minPoint);

	        drawLine(minPoint.x,minPoint.y,next_point.x,next_point.y,'#AAAeee');
	        minPoint = next_point;
	        console.log(minPoint);
    	}
    }
    console.log(nextPoints);
});

//gera arquivo com os pontos em ordem
window.addEventListener('keypress',
function(){
	console.log(JSON.stringify(nextPoints));
    if(event.keyCode == 100){// 'd'
    	let saida = 'o Jarvis\r\n';
    	for(let i = 0; i< initialPoints.length;i++){	
    		saida += 'v '+initialPoints[i].x+' '+initialPoints[i].y+' 0'+'\r\n';	
    	}
    	saida += 'f ';
    	let count = 0;
    	let anterior;
    	let array = [];
    	array.push(indexOfMinPoint2+1);
    	for(let j = 0 ;j < nextPoints.length;j++){
    		for(let i = 0; i< initialPoints.length;i++){
    			if(i != indexOfMinPoint2 && initialPoints[i].x == nextPoints[j].x && initialPoints[i].y == nextPoints[j].y ){
    				console.log('i: '+i);
    				array.push(i+1);
    				console.log('arr: '+array);
    			}    			
    		}	
    	}
    	console.log('array: '+array)
    	for (let i = 0; i <array.length; i++) {
	    		saida += array[i]+' '; 
    		
    	}
    	download('saida',saida);
    }
});

let modal = document.getElementById("myModal");
let span = document.getElementsByClassName("close")[0];

//abre modal para escolher arquivo
window.addEventListener('keypress',
    function(){ 
        if(event.keyCode == 102){// 'f'
            modal.style.display = "block";

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }
        }
    });

    //fecha modal de escolha de arquivo
window.addEventListener('keypress',
	function(){
        //calculo a minima só aqui e trago ele pro começo do vetor
		if(event.keyCode == 120){// 'x'
            modal.style.display = "none";
        }
});

//organiza os pontos
window.addEventListener('keypress',
	function(){

        if(event.keyCode == 114){// 'r'
            // console.log(pointsTriang)
            console.log(bubbleSort(pointsTriang))
        }
});

//triangulação
window.addEventListener('keypress',
	function(){
        if(event.keyCode == 116){// 't'
            console.log('triangulação');
            bubbleSort(pointsTriang)
            triang();
            drawArestas();
        }
});

function getPosition(event){
     
     let rect = canvas.getBoundingClientRect();
     let x = event.clientX - rect.left;
     let y = event.clientY - rect.top;
     v = new Vec2(x,y);
     points.push(v);
     initialPoints.push(v);
     pointsTriang.push(v);
     drawCoordinates(x,y);
     console.log('ponto:' + '('+v.x+','+v.y+')');
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

function drawLineMinPoint(){	

    drawLine(minPoint.x,minPoint.y,canvas.width,minPoint.y,"#000");
}

function cos_vec2(u,v){

        return u.dot(v)/(u.magnitude()*v.magnitude());
}

function checkMinPoint(){

    miny = points[0].y;
    maxx = points[0].x;

    minPoint =  new Vec2(maxx,miny);
 
    indexOfMinPoint = 0;       
    for (let i = 1; i < points.length; i++) {
		if (points[i].y < miny) {
            miny = points[i].y;
            minPoint = points[i];
            indexOfMinPoint = i;
           
        }

        else if(points[i].y == miny){
            if(points[i].x > maxx){
            	maxx = points[i].x;
                minPoint = points[i];
                indexOfMinPoint = i;
               
            }
        }
    }
    console.log('ponto minimo: '+ '('+points[indexOfMinPoint].x+','+points[indexOfMinPoint].y+')');
   	indexOfMinPoint2 = indexOfMinPoint;
    //trago ele pro começo aqui trocando ele com o primero de lugar
    points[indexOfMinPoint] = points[0];
    points[0] = minPoint;
    indexOfMinPoint = 0;

    return minPoint;
}

function nextPoint2(startPoint){

	next_id = 0;
    //vejo se ele ja fecha com o primeiro aqui
	if(startPoint > 1){
    	max_cos = cos_vec2(dir_vec2, points[0].sub(points[startPoint-1]));
    	fechou = true;
    }else{
    	max_cos = -100;
    }
    for (let i = startPoint; i < points.length; i++) {
        //calculo o vetor do testado pro ponto anterior e faco o angulo com a direcao antiga
    	actual = cos_vec2(dir_vec2, points[i].sub(points[startPoint-1]));
        //se for maior ele eh o novo candidato
    	if(actual>max_cos){
    		max_cos = actual;
    		next_id = i;
    	}
    }
    //se o next eh o começo significa q voltei pro primeiro e q o fecho ta fechado
    if(next_id==0){
    	points_interated = points.length;
    	startPoint--;
    }
    //levo ele pro fim dos q ja foram testados, ou seja depois dele ta so os caras q eu ainda nao testei e nao tao no fecho   
    let ax = points[startPoint];
    points[startPoint] = points[next_id];
    points[next_id] = ax;
    return points[startPoint];
}

function bubbleSort(array) {

    // Use an isSorted flag to determine whether or not there
    // is more sorting to do when we are in the while loop
    let isSorted = false;

    while(!isSorted) {

        // Mark is sorted true, then re-mark it false in the loop.
        // If the loop is finished, then isSorted will stay true
        // and we will thus exit the while loop and return
        isSorted = true;

        for(let i = 0; i < array.length - 1; i++) {
            let a = array[i].x ;
            let b = array[i+1].x;
            c = a > b
            if(a > b) {
                // Swap by holding the first element in a temp variable,
                // then reassigning indexes i and i+1 to each other
                let temp = array[i];
                array[i] = array[i + 1];
                array[i + 1] = temp;
                // Mark the isSorted flag false because there is still sorting to do if we are in the loop
                isSorted = false;
            }
        }
    }
    // Return the sorted array!
   
    return array;
}

//================================
		//CRIAR ARQUIVO
//================================

function download(filename, text) {
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename+'.obj');

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

//================================
		//LER ARQUIVO 
//================================
let fileArray = [];  // where I will store the contents

function readMultipleFiles(evt) {
    //Retrieve all the files from the FileList object
    var files = evt.target.files;
    window.array = []
    if (files) {
        for (let i = 0, f; f = files[i]; i++) {
            let r = new FileReader();
            r.onload = (function (f) {
                return function (e) {
                    let contents = e.target.result;
                    window.array.push(contents);
                    fileArray = [...contents.split("\r\n")];
                    for(i = 0; i<fileArray.length;i++){
                        let a = [...fileArray[i].split(" ")];
                        pointsTriang.push(new Vec2(Number(a[0]),Number(a[1])));
                        drawCoordinates(a[0],a[1]) 
                    }
                    modal.style.display = "none";
                };
            })(f);
            r.readAsText(f);
        }
    } else {
        alert("Failed to load files");
    }
}
document.getElementById('fileInput').addEventListener('change', readMultipleFiles, false);

let triangulos = [];
let arestas = [];
function triang(){
    //count = pointsTriang.length;
    start = 0;
    while (pointsTriang.length>0) {
        if (start == 0) {
            triangulos.push(new Triang(pointsTriang[0],pointsTriang[1],pointsTriang[2]));
            arestas.push(new Aresta(pointsTriang[0],pointsTriang[1]));
            arestas.push(new Aresta(pointsTriang[1],pointsTriang[2]));
            arestas.push(new Aresta(pointsTriang[2],pointsTriang[0]));
            pointsTriang.splice(0,3);
            count = pointsTriang.length;
            start += 1;
            drawLine(triangulos[0].p1.x,triangulos[0].p1.y,triangulos[0].p3.x,triangulos[0].p3.y)
            drawLine(triangulos[0].p3.x,triangulos[0].p3.y,triangulos[0].p2.x,triangulos[0].p2.y)
            drawLine(triangulos[0].p2.x,triangulos[0].p2.y,triangulos[0].p1.x,triangulos[0].p1.y)
        }

        // let triangulo = triangulos[start-1];
        // for(let j=0; j<3;j++){
        //     let arestaTeste = new Aresta(pointsTriang[0],triangulo.pontos[j]);
        //     for (let k=0; k < arestas.length; k++) {

        //         if(arestaTeste.checkArestaIgual(arestas[k]) || testaAresta(arestaTeste, arestas[k])){
        //             candidatos.push(arestaTeste)
        //             candidatos.push(new Aresta(arestaTeste.p1,arestas[k].p2));
        //         }
        //         else{
        //             console.log('arestas: '+JSON.stringify(arestaTeste.p1)+','+JSON.stringify(arestaTeste.p2)+' e '+ JSON.stringify(arestas[k].p1)+','+JSON.stringify(arestas[k].p2))
        //             console.log('são iguais ou colidem')
        //         }
        //     }
        // }
        let arestaTeste1;
        let arestaTeste2;
        for(let k=0; k<arestas.length;k++){
            arestaTeste1 = new Aresta(pointsTriang[0],arestas[k].p1);
            arestaTeste2 = new Aresta(pointsTriang[0],arestas[k].p2);
            console.log('aresta: '+k+' ponto 1'+JSON.stringify(arestaTeste1.p1)+','+JSON.stringify(arestaTeste1.p2)+' e '+ JSON.stringify(arestas[k].p1)+','+JSON.stringify(arestas[k].p2))
            console.log('aresta: '+k+' ponto 2'+JSON.stringify(arestaTeste2.p1)+','+JSON.stringify(arestaTeste2.p2)+' e '+ JSON.stringify(arestas[k].p1)+','+JSON.stringify(arestas[k].p2))
            if(arestaTeste1.checkArestaIgual(arestas[k]) || testaAresta(arestaTeste1, arestas[k])){
                candidatos.push(arestaTeste1)
                candidatos.push(new Aresta(arestaTeste1.p1,arestas[k].p2));
                console.log('adicionar')
            }
            else{
                console.log('não adicionar')
            }
            if(arestaTeste2.checkArestaIgual(arestas[k]) || testaAresta(arestaTeste2, arestas[k])){
                candidatos.push(arestaTeste2)
                candidatos.push(new Aresta(arestaTeste2.p1,arestas[k].p2));
                console.log('adicionar')
            }
            else{
                console.log('não adicionar')
            }
            console.log('candidatos iniciais: '+ JSON.stringify(candidatos));
            for (let m=0; m<arestas.length; m++) {
                for (let l=0; l<candidatos.length; l++) { // <-- no need to check the values before "i"
                    if (!testaAresta(candidatos[l], arestas[m])) {
                        console.log('remover candidato: ' + JSON.stringify(candidatos[l]))
                        candidatos.splice(l,1);
                    }
                }
            }

        }
        start += 1;
        pointsTriang.splice(0,1);
    }
    removeArestasDupli(candidatos);
    // console.log(JSON.stringify(triangulos))
}

function testaAresta(AB, CD){
    if(AB.aresta.cross(CD.p1.sub(AB.p1)) == AB.aresta.cross(CD.p2.sub(AB.p1)) 
      && CD.aresta.cross(AB.p1.sub(CD.p1)) == CD.aresta.cross(AB.p2.sub(CD.p1)) ){
        console.log('As arestas não colidem! Ligaaaa os pontos aê')
        return true; 
    }
    else return false;
}

function removeArestasDupli(arestas){
    for (i=0; i<arestas.length; i++) {
        for (k=i+1; k<arestas.length; k++) { // <-- no need to check the values before "i"
            if (arestas[i].check(arestas[k])) {
                arestas.splice(k,1);
            }
        }
    }
    return arestas;
}

function drawArestas(){
    for (let i = 0; i < candidatos.length; i++) {
        drawLine(candidatos[i].p1.x,candidatos[i].p1.y,candidatos[i].p2.x,candidatos[i].p2.y,"red");   
    }
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
        return (this.x * this.x + this.y * this.y);
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
        return new Vec2(this.x + v.x, this.y + v.y);
    };

        //subtraçao de vetores
    sub(v) {
        return new Vec2(this.x - v.x, this.y - v.y);
    };
    checkIgual(v){
        if(this.x == v.x && this.y == v.y){
            return true;
        }
        else{
            return false;
        }
    }

}

class Triang{
    constructor(p1, p2, p3) {
        this.p1 = new Vec2(p1.x,p1.y);
        this.p2 = new Vec2(p2.x,p2.y);
        this.p3 = new Vec2(p3.x,p3.y);
        this.pontos =[];
        this.pontos[0] = this.p1;
        this.pontos[1] = this.p2;
        this.pontos[2] = this.p3;
        this.vec1 = p3.sub(p1);//P1P3 = p3-p1
        this.vec2 = p2.sub(p3);//P3P2 = p2-p3
        this.vec3 = p1.sub(p2);//P2P1 = p1-p2

    }
}

class Aresta{
    constructor(p1, p2) {
        this.p1 = new Vec2(p1.x,p1.y);
        this.p2 = new Vec2(p2.x,p2.y);

        this.aresta = p2.sub(p1);//P3P2 = p2-p3
    }

    checkArestaIgual(aresta){//checa se tem algum ponto em comum
        if(this.p1.checkIgual(aresta.p1) || this.p2.checkIgual(aresta.p2)){
            return true;
        }
        else if(this.p1.checkIgual(aresta.p2) || this.p2.checkIgual(aresta.p1)){
            return true;
        }
        else{
            return false;
        }
    }

    check(aresta){//checa se é exatamente igual
        if(this.p1.checkIgual(aresta.p1) && this.p2.checkIgual(aresta.p2)){
            return true;
        }
        else if(this.p1.checkIgual(aresta.p2) && this.p2.checkIgual(aresta.p1)){
            return true;
        }
        else{
            return false;
        }
    }
}
