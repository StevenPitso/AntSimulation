

class Cave{

    constructor(canvas){

        this.canvas = canvas;
        this.ctx =canvas.getContext('2d');
        this.debugMod = false;

       

        this.MapConfig = {
            unitSize : 25,
            
            wallProbility : 0.5,
            width : 100,
            height: 100
        }

        this.Map = [];
        this.MapConfig.width = Math.floor(canvas.width / this.MapConfig.unitSize)
        this.MapConfig.height = Math.floor(canvas.height / this.MapConfig.unitSize)
        this.hitboxes = [];
        this.SpawnFoodRegions = [];
        this.colonyRegion; 
      
        this.#initialiseMap();
     
    }

    #initialiseMap(){

        for(let x = 0; x < this.MapConfig.width ; x++){

            this.Map[x] = [];
            for(let y = 0; y < this.MapConfig.height ; y ++){
               
                 this.Map[x][y] = (Math.random() < this.MapConfig.wallProbility | x === 0 | y === 0 | x === this.MapConfig.width  | y === this.MapConfig.height ) ? 1 : 0;
            }
           
        }

    }

    update(editMode ,debugMod) {
        let currentTool = null;
        this.debugMod = debugMod;
      
        if(editMode){
                    // Listen for keyboard presses to update tool
        document.addEventListener('keydown', (e) => {
            if (e.key === 'a' || e.key === 'r') {
                currentTool = e.key;
                //console.log("Current tool:", currentTool);
            }
        });
    
        // Single mouse listener that uses the current tool
        this.canvas.addEventListener('mousedown', (e) => {
            if (!currentTool) return;
    
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;  // Make the mouse acurate :)
            const mouseY = e.clientY - rect.top;
    
            const tileX = Math.floor(mouseX / this.MapConfig.unitSize);
            const tileY = Math.floor(mouseY / this.MapConfig.unitSize);
            
            if (currentTool === 'r') {
                this.RemoveWall(tileX, tileY, 2);
                
            } else if (currentTool === 'a') {
                this.AddWall(tileX, tileY, 2);
               
            }
    
            this.hitboxes = this.getEdgeWalls();
        });
        }

    }
    


    #countNeighbours(x , y, rad = 1){

        let count = 0;
        
        for(let dx  = -rad ; dx <= rad; dx++){

            for(let dy = -rad; dy <= rad; dy++){
                if(dx === 0 && dy === 0 ) continue;

                let nx = x + dx;
                let ny = y + dy;

                if(nx < 0 || ny < 0 || nx >= this.MapConfig.width-1 || ny >= this.MapConfig.height-1){
                    count++;
                }else if (this.Map[nx][ny] === 1){
                    count ++;
                }

            }
        }
        return count ;
    }

    terraform(iterations = 1){
        
       // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for(let i = 0; i < iterations ; i++){
            
            let newMap = [];
            for(let x = 0; x < this.MapConfig.width ; x++){
                newMap[x] = [];
                for(let y = 0; y <this.MapConfig.height ; y ++){
                    const WallCount = this.#countNeighbours(x,y);
                    newMap[x][y] = (WallCount < 4 || x === 0 || y === 0 || this.MapConfig.width-1 <= x||this.MapConfig.height-1 <= y) ? 1 : 0; 
                }
                
            }
    
            this.Map = newMap;
            //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }


    }
   
    SpawnFood(count = 3) {
        let noFood = true;
    
        while (noFood) {
            while (count >= 1) {
                let x = Math.floor(Math.random() * this.MapConfig.width);
                let y = Math.floor(Math.random() * this.MapConfig.height);
    
                let neighborCount = this.#countNeighbours(x, y);
    
                if (neighborCount === 0 && this.Map[x][y] === 0) {

                    this.SpawnFoodRegions.push({x: x * this.MapConfig.unitSize, y: y * this.MapConfig.unitSize});
                    this.Map[x][y] = 2; // 2 = food
                    count--;
                }
            }
    
            noFood = false; // exit outer loop once we've placed the food   :) we need this 
        }
    }


    SpawnColony(){

       let isNotSet = true;

       while(isNotSet){
            let x = Math.floor(Math.random() * this.MapConfig.width);
            let y = Math.floor(Math.random() * this.MapConfig.height);

            let neighborCount = this.#countNeighbours(x,y,3);
            if(neighborCount === 0 &&  this.Map[x][y] === 0){
                this.Map[x][y] = 3; // 3 = Colony 
                isNotSet = false;
                return {x : x * this.MapConfig.unitSize , y : y * this.MapConfig.unitSize};
            }
       }

    }

    AddWall(x,y, radius = 1){

        for(let dx = -radius; dx < radius ; dx++){

            for(let dy = -radius; dy < radius; dy++){
                let nx = x + dx;
                let ny = y + dy;

                if(nx > 0 || ny > 0 || this.MapConfig.width >= nx ||  this.MapConfig.height >= ny){
                    this.Map[nx][ny] = 1;
                }

                
            }
        }

    }

    RemoveWall(x,y, radius = 1){

        for(let dx = -radius; dx < radius ; dx++){

            for(let dy = -radius; dy < radius; dy++){
                let nx = x + dx;
                let ny = y + dy;

                if(nx > 0 || ny > 0 || this.MapConfig.width >= nx ||  this.MapConfig.height >= ny){
                    this.Map[nx][ny] = 0;
                }

                
            }
        }

    }
    getEdgeWalls(layers = 2) {
        const edges = new Set(); /// So Js is cool because we can pass an array to the constructor like this (set())
        const width = this.MapConfig.width;
        const height = this.MapConfig.height;
        const unit = this.MapConfig.unitSize + 10;
    
        const addEdge = (x, y) => {
            if (x >= 0 && y >= 0 && x < width && y < height && this.Map[x][y] === 1) {
                edges.add(`${x},${y}`);
            }
        };
    
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (this.Map[x][y] === 1) {
                    let isEdge = false;
                    for (let dx = -layers; dx <= layers && !isEdge; dx++) {
                        for (let dy = -layers; dy <= layers; dy++) {
                            const nx = x + dx;
                            const ny = y + dy;
                            if (
                                nx >= 0 && ny >= 0 &&
                                nx < width && ny < height &&
                                this.Map[nx][ny] === 0
                            ) {
                                isEdge = true;
                                break;
                            }
                        }
                    }
                    if (isEdge) addEdge(x, y);
                }
            }
        }
    
        // Convert Set to array of hitboxes
        return [...edges].map(entry => {
            const [x, y] = entry.split(',').map(Number);
            return { x, y, width: unit, height: unit };
        });
    }
    
    
    draw(ctx){
           
        let count = 0;
        for(let x = 0; x < this.MapConfig.width; x++){

            for(let y = 0; y < this.MapConfig.height; y++){

                if(this.Map[x][y] === 1){
                    ctx.fillStyle = "#3f3f3f";
                    count++
                   
                }else if (this.Map[x][y] === 0){
                    ctx.fillStyle = "#c3ae7a"
                }else if(this.Map[x][y] === 3){
                    ctx.fillStyle = 'Orange';
                }
                ctx.beginPath();
                ctx.rect(x * this.MapConfig.unitSize, y * this.MapConfig.unitSize, this.MapConfig.unitSize, this.MapConfig.unitSize )
                ctx.fill();
            }
        }
        this.hitboxes = this.getEdgeWalls();
        
    }
    drawEdges(ctx) {
        ctx.fillStyle = "#000";
        this.hitboxes.forEach(({x, y}) => {
            ctx.fillRect(
                x * this.MapConfig.unitSize,
                y * this.MapConfig.unitSize,
                this.MapConfig.unitSize,
                this.MapConfig.unitSize
            );

            if(this.debugMod){
                ctx.beginPath();
                ctx.strokeStyle = "red"
                ctx.rect(x * this.MapConfig.unitSize, y * this.MapConfig.unitSize,this.MapConfig.unitSize, this.MapConfig.unitSize)
                ctx.stroke();
            }
        });
    }
    

}