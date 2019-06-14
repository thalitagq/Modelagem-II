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


function getPosition(event){
     
     let rect = canvas.getBoundingClientRect();
     let x = event.clientX - rect.left;
     let y = event.clientY - rect.top;
     v = new Vec2(x,y);
     points.push(v);
     initialPoints.push(v);
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


// function readTextFile(file)
// {
//     var rawFile = new XMLHttpRequest();
//     rawFile.open("GET", file, false);
//     rawFile.onreadystatechange = function ()
//     {
//         if(rawFile.readyState === 4)
//         {
//             if(rawFile.status === 200 || rawFile.status == 0)
//             {
//                 var allText = rawFile.responseText;
//                 alert(allText);
//             }
//         }
//     }
//     rawFile.send(null);
// }


//================================
		//LER ARQUIVO 
//================================
let fileArray = [];  // where I will store the contents

function readMultipleFiles(evt) {
    //Retrieve all the files from the FileList object
    var files = evt.target.files;
    window.array = []
    let a
    if (files) {
        for (let i = 0, f; f = files[i]; i++) {
            let r = new FileReader();
            r.onload = (function (f) {
                return function (e) {
                    let contents = e.target.result;
                    window.array.push(contents);
                    fileArray =[...contents.split("\n")];
                    fileArray[0].split(" ")

                    for(i = 0; i<fileArray.length;i++){
                        a = [...fileArray[i].split(" ")];
                        v = new Vec2(a[0],a[1]);
                        points.push(v);
                        initialPoints.push(v)
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

}