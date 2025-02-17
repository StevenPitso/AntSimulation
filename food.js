class Food{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.selected = false;
        this.collisions = false;
        this.carried = false;
        this.isInNest = false;
        this.radius = 7;
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