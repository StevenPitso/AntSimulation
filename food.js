class Food{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.selected = false;
        this.collisions = false;
        this.carried = false;
        this.isInNest = false;
        this.radius = 5;
        this.carrierAnt = 0;


    }
    update(ants){
        //check for a collision 
        // Then Update the position of the food / this.class 
        /// relative Ant or ant.class
        

        if(!this.collisions){
            for(let a  = 0 ; a < ants.length ; a++){
                const distance  =  Math.sqrt( (this.x - ants[a].x) ** 2 + (this.y - ants[a].y ) ** 2)
               //console.log(distance)
                if(distance < this.radius + 2 ){

                    if(!ants[a].hasFood && !this.carried){
                        this.collisions = true;
                        this.carrierAnt = a;
                        
                        ants[this.carrierAnt].hasFood = true;
                        this.carried = true;
                        

                       // console.log(this.carrierAnt)
                       ants[this.carrierAnt].direction += Math.PI
                    }


                }
    
            }
        } else if(this.collisions){
            
            this.x = ants[this.carrierAnt].x + Math.cos(ants[this.carrierAnt].direction) * 15;
            this.y = ants[this.carrierAnt].y + Math.sin(ants[this.carrierAnt].direction) * 15;
           // console.log('Moving with ant')

        }
        
        const NestDistance = Math.sqrt( (this.x - ants[this.carrierAnt].nestNode.x) ** 2 + (this.y - ants[this.carrierAnt].nestNode.y)**2)
        if(NestDistance < 20){
    
           this.collisions = false;
           ///ants[this.carrierAnt].direction += Math.PI;
           ants[this.carrierAnt].hasFood = false;
           this.isInNest = true;
        }

        //console.log(ants[1].x)

    }
    disposeFood(){
        return this.isInNest;
    }

    draw(ctx){
        ctx.beginPath();
        ctx.fillStyle = 'Green'
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

    }
}


class FoodSpawer {

    constructor() {

        this.unitsize = 25;
        this.Map = [];
        this.listFoods = [];
        this.MapConfig = {
            unitSize: 25,
            width: 20,
            height: 20,
        };
    }

    initMap(Map, MapConfig) {
        // Initialize the 2D grid map
    
       this.MapConfig = MapConfig
       this.Map = Map
       
      

    }

    update() {
        // You could regenerate food or check state changes here
    }

    #isClear3by3(x, y) {

        if(  x <= 0 || y <= 0 ||
             x >= this.MapConfig.width - 1 ||
             y >= this.MapConfig.height -1
        ){return false} ;


        for(let  dx = -1; dx <=  1; dx++){

            for(let dy = -1; dy <= 1; dy++){

                let nx = x + dx;
                let ny = y + dy;

                if(this.Map[nx][ny] === 1 || this.Map[nx][ny] === 2 ){
                    //console.log(this.Map[nx][ny])
                    return false;
                }
            }
        }

        return true;
    }

    spawer() {

        for(let x = 1; x < this.MapConfig.width -1 ; x++){

            for(let y = 1; y < this.MapConfig.height- 1; y++){
                
                
                if(this.Map[x][y] === 2){
                   // this.listFoods.push(new Food(x * this.MapConfig.width, y * this.MapConfig.height));
                  console.log(s)
                }
            }
        }

    }

    draw(ctx) {

       
        for(let x = 1; x < this.MapConfig.width; x++){

            for(let y = 1; y < this.MapConfig.height; y++){
                
                if(this.Map[x][y] === 2){
                    ctx.beginPath()
                    ctx.fillStyle = '#ff43a4'
                    ctx.rect(x * this.MapConfig.unitSize, y * this.MapConfig.unitSize, this.MapConfig.unitSize, this.MapConfig.unitSize)
                    ctx.fill()
                }
            }
        }
    }
}
