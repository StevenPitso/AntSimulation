const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;


const mapConfig = {
    width: 100, 
    height: 100, 
    tileSize: 10,
    wallProb: 0.02
}

class obstacle{
    constructor(x, y){
        this.x = x;
        this.y =y;
        this.radius = 10;
    }
    draw(ctx){
        ctx.beginPath();
        ctx.fillStyle = 'Red';
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

class point{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.radius = 40;

    }
    draw(ctx){
        ctx.beginPath();
        ctx.fillStyle = 'Red';
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
    }
}
class segment{
    constructor(p1,p2){
        this.point1 = p1;
        this.point2 = p2;
        this.distance = this.segementLength(p1,p2);

    }
    segementLength(p1, p2){
        const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2 );
        return distance;
    }
    draw(ctx){
     
        ctx.beginPath();
        ctx.lineWidth = 7;
        ctx.strokeStyle = 'red';
        ctx.moveTo(this.point2.x, this.point2.y);
        ctx.lineTo(this.point1.x , this.point1.y);
        ctx.stroke();
    }
}


function GenerateGraph(startingNode, nPoints){

let points = [];


    points.push(new point(startingNode.x, startingNode.y))
    let counter = 0
    while(counter  < nPoints){

            const p2 = { x:Math.random() * points[counter].x * 60 ,y: Math.random() * points[counter].y * 60};
            const distance = Math.sqrt((points[counter].x - p2.x) ** 2 + (points[counter].y - p2.y) ** 2 )

            if(distance < 60){
                points.push(new point(p2.x, p2.y))
                counter ++;
            }
    }
  
   drawGraph(points)
   return points;
}

function drawGraph(points){

    let segments  = [];
    for(let p of points){
        p.draw(ctx)
    }

    for(let i = 0; i < points.length; i++){

        if(i < points.length -1){
            segments.push(new segment(points[i], points[i+1]))
        }
        for(const seg of segments){
            seg.draw(ctx)
        }  
    }

}


function GenerateMap(nStartingPoints, MaxPoints){
    let Map = [];
    for(let i = 0; i < nStartingPoints; i++){
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;

    let temp =  GenerateGraph({x: x, y: y}, Math.random() * MaxPoints + 1)
    for(let i = 0; i < temp.length; i++){
        Map.push(temp[i])
    }
    //Map.push(temp)
    }
    console.log(Map)
    return Map;
}

GenerateMap(5, 50)

//GenerateGraph({x: canvas.width/2, y: canvas.height/2}, 20)