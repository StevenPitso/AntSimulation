class Ant{
    constructor(canvas, x, y, width = 25, height = 30, debugMode = false){

        this.ratio = .7;
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        this.width = width * this.ratio;
        this.height = height * this.ratio;
        this.nestNode = {x: 0,y:0}
        this.foodMap = [];

        this.speed = 10

        this.direction = Math.random() *  Math.PI * 2;
        this.turnRate = Math.random() * 0.5 + 0.01;

        this.image = new Image();
        this.image.src = 'Images/Ant.png';

    
        this.hasFood = false;
      
        this.ClosestPheromones = [];
        this.debugMod = debugMode;
        this.senseRange = 40;
        this.collision = false;
        this.sensors = [
            new Sensor(this.x, this.y, Math.PI*0, this.senseRange + 8, ' F', 5),  // 0
            new Sensor(this.x, this.y, -Math.PI/9, this.senseRange,' L', 5),  // 1
            new Sensor(this.x, this.y, Math.PI/9, this.senseRange, ' R', 5),  // 2
            new Sensor(this.x, this.y, Math.PI *0, 15,'O', 10),               // 3
            new Sensor(this.x, this.y, -Math.PI /12, 60,'OL', 3),             // 4
            new Sensor(this.x, this.y, Math.PI /12, 60,'OR', 3),               // 5
            new Sensor(this.x , this.y, Math.PI * 0 , 60, 'Food', 3)

        ]

        
        // #initialise(nSensors){
        //     for(let i = 0; i < nSensors; i++){
             
        //      const _angle_ =  (i - 6 + .5) * Math.PI / 3;
        //      const _angleOffSet_ = this.sensorAngle - _angle_;
        //      const _sX = this.x + Math.cos(_angleOffSet_);
        //      const _sY = this.y + Math.sin(_angleOffSet_);
       
        //      this.sensorObj = {x: _sX, y: _sY, angle: _angleOffSet_};
        //      //console.log(this.sensorObj.angle)
        //      this._Sensors.push(this.sensorObj);
       
        //     }
        //    }

    }
 
    update(phero, MAP){

   
       
        for(let s  = 0 ; s < this.sensors.length; s++){
            this.sensors[s].update(this.x, this.y, this.direction, phero)
        }
        this.sensors[3].update(this.x, this.y, this.direction, MAP);
        this.sensors[4].update(this.x, this.y, this.direction, MAP);
        this.sensors[5].update(this.x, this.y, this.direction, MAP);
        ///console.log(this.x)



       // this.direction = this.detectObstacles(MAP);

        if(!(this.sensors[0].collision) && !(this.sensors[1].collision) && !(this.sensors[2].collision)  && !(this.sensors[3].collision) ){
            this.direction = this.detectObstacles(MAP);
        }else if(!(this.sensors[3].collision)){
            this.direction = this.navigateUsingPheromones(phero);
        }else if(this.sensors[3].collision){
            //console.log('ww')
            this.direction = this.detectObstacles(MAP);
        }

        const distanceToNest = Math.sqrt((this.x - this.nestNode.x)**2 + (this.y - this.nestNode.y)**2)

        if(distanceToNest < 180 && this.hasFood){
            this.direction = Math.atan2(this.nestNode.y - this.y , this.nestNode.x - this.x);
            if(distanceToNest < 20){
                this.hasFood = false
                this.direction += Math.PI;
            }
        }





        for(let i = 0; i < this.foodMap.length; i++){
             const distanceToFood = Math.sqrt((this.x - this.foodMap[i].x)**2 + (this.y - this.foodMap[i].y)**2)
             if(distanceToFood  < 80 && !this.hasFood  && !this.foodMap[i].carried){
               this.direction = Math.atan2(this.foodMap[i].y - this.y, this.foodMap[i].x - this.x)
                if(distanceToFood < 5){
                    this.direction += Math.PI
                }
            }
         }
        if(this.sensors[3].detectCollisionSingleObject(this.nestNode,8)){
            this.hasFood = false;
            this.direction = (this.direction + Math.PI) % (2 * Math.PI);
            this.x += Math.cos(this.direction) * 5; // Move away
            this.y += Math.sin(this.direction) * 5;
           
        }

        this.x += Math.cos(this.direction)  * this.speed;
        this.y += Math.sin(this.direction)  * this.speed;

    }
    navigateUsingPheromones(phero) {
        const turnRate = 0.34;
        const closeRange = 50;
        const closest = this.#findClosestNeighbours(phero, closeRange);
        
        if (closest.length === 0) return this.direction; // No pheromones detected
    
        // Filter by state
        const type = this.hasFood ? 'Home' : 'Food';
        const filtered = closest.filter(p => p.type === type);
    
        if (filtered.length === 0) return this.direction; // No relevant pheromones
    
        // Sensor detection scores (weighted by concentration)
        const scores = [
            this.sensors[0].detectCollisionStrength(filtered), // Front
            this.sensors[1].detectCollisionStrength(filtered), // Left
            this.sensors[2].detectCollisionStrength(filtered)  // Right
        ];
    
        // Choose direction based on strongest signal
        if (scores[1] > scores[2] && scores[1] > scores[0]) {
            this.direction -= turnRate;
        } else if (scores[2] > scores[1] && scores[2] > scores[0]) {
            this.direction += turnRate;
        } else if (scores[0] > 0) {
            // Keep going straight if strongest is ahead
            // Optional: add a slight reinforcement
            this.direction += 0;
        } else {
            // Slightly randomize if no signal is strong
            this.direction += Math.random() * turnRate - turnRate / 2;
        }
        
        return this.direction;
    }

    
    detectObstacles(Obstacles){

      
        for(let i = 1; i < Obstacles.length; i++){

           
           const obx = Obstacles[i].x * 25; // 
           const oby = Obstacles[i].y * 25;
           
           if(        
            
            this.x < obx + Obstacles[i].width &&
            this.x + this.width > obx &&
            this.y < oby + Obstacles[i].height &&
            this.y + this.height > oby){

               this.collision = true;
               this.direction += Math.PI + (Math.PI - 0.50)
           };

        }
        
        return this.direction;
    }
    
    detectFood(listFoodItems){
        if(this.sensors[6].update(listFoodItems)){
            this.direction -= Math.PI * 0.45;
        }
    }


    wander(phero, MAP){

            
            if(this.x <= 50 || this.x >= this.canvas.width -50){
                
                this.direction =  Math.PI - this.direction;
            }
            if(this.y <= 50 ||  this.y >=  this.canvas.height - 50){
                this.direction = -this.direction;
            }
            this.direction += Math.random() *  this.turnRate - this.turnRate /2;

            for(let s = 0; s < this.sensors.length - 1; s++){
                this.sensors[s].update(this.x, this.y, this.direction, phero);
            }
           this.sensors[3].update(this.x, this.y, this.direction, MAP);
           this.sensors[4].update(this.x, this.y, this.direction, MAP);
           this.sensors[5].update(this.x, this.y, this.direction, MAP);


          return this.direction;
    }
    navigate(listPheromones){

        let ClosestPheromones = this.#findClosestNeighbours(listPheromones,10);

        this.ClosestPheromones = ClosestPheromones
        //console.log(ClosestPheromones)
        if(ClosestPheromones.length > 0){    
        let M = ClosestPheromones[0].averageConcentration;
        let C = ClosestPheromones[0].averageConcentration;
        let index = 0;
        for(let i = 0; i < ClosestPheromones.length; i ++){
           C = ClosestPheromones[i].averageConcentration;
           if(M < C){
             index = i
           }
        }
        

        this.direction =  Math.atan2(ClosestPheromones[index].y - this.y, ClosestPheromones[index].x - this.x);
        this.x += Math.cos(this.direction)  * this.speed; 
        this.y += Math.sin(this.direction)  * this.speed;
        }
        //return this.direction;

    }
    #findClosestNeighbours(list, awarenessRange){
        let closestNeighbours = [];
        const radius = awarenessRange;
       
        for(let i = 0; i < list.length; i ++){
          const distance = Math.sqrt((list[i].x - this.x) ** 2 + (list[i].y - this.y) ** 2 )
            if(distance < radius){
                closestNeighbours.push(list[i]);
            }
        }
  
        return closestNeighbours;
    }
    draw(ctx){

        ctx.save();
        ctx.translate( this.x, this.y)
        ctx.rotate(this.direction);
        ctx.rotate(8);

        if(this.debugMod){

            ctx.save()
            ctx.beginPath()
            
            ctx.moveTo(-this.width/10, -this.height/2)
            ctx.lineTo(-this.width /4 , -this.height * 5)
            ctx.stroke()
            ctx.restore()
       
            ctx.beginPath();
            if(this.collision){
             ctx.strokeStyle = 'red';
             ctx.lineWidth = 10;
             this.collision = false;
            }else{
                ctx.strokeStyle = 'blue'
            }
          
            let  rad = 10
            ctx.rect(-(this.width +2*rad)/2, -(this.height+2*rad)/2, this.width+rad, this.height -60)
            ctx.stroke()
  

        }
        let  rad = 10
        ctx.drawImage(this.image, -this.width/2, -this.height/2, this.width, this.height);
        ctx.restore();

        if(this.debugMod){
            this.sensors[0].draw(ctx)
            this.sensors[1].draw(ctx)
            this.sensors[2].draw(ctx)
            //this.sensors[3].draw(ctx)
             this.sensors[4].draw(ctx)
            this.sensors[5].draw(ctx)
            //this.sensors[6].draw(ctx)
        }

 
    }
 
}