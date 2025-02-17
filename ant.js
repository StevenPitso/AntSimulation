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
           

        if(!(this.sensors[0].collision) && !(this.sensors[1].collision) && !(this.sensors[2].collision)  && !(this.sensors[3].collision) ){
            this.direction = this.wander(phero, MAP)
        }else if(!(this.sensors[3].collision)){
            this.direction = this.navigateUsingPheromones(phero);
        }else if(this.sensors[3].collision){
            this.direction = this.detectObstacles(MAP);
        }

        const distanceToNest = Math.sqrt((this.x - this.nestNode.x)**2 + (this.y - this.nestNode.y)**2)

        if(distanceToNest < 200 && this.hasFood){
            this.direction = Math.atan2(this.nestNode.y - this.y , this.nestNode.x - this.x);
            if(distanceToNest < 20){
                this.hasFood = false
                this.direction += Math.PI;
            }
        }





        for(let i = 0; i < this.foodMap.length; i++){
             const distanceToFood = Math.sqrt((this.x - this.foodMap[i].x)**2 + (this.y - this.foodMap[i].y)**2)
             if(distanceToFood  < 100 && !this.hasFood  && !this.foodMap[i].carried){
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

        this.x += Math.cos(this.direction)  * (this.speed);
        this.y += Math.sin(this.direction)  * (this.speed );

    }
    navigateUsingPheromones(phero){
        let pheromones = phero;
        let turnRate = .3
        let ClosestPheromones = this.#findClosestNeighbours(pheromones, 50);
        if(this.hasFood){
            pheromones = pheromones.filter(p => (p.type == 'Home'))
            //console.log(pheromones)
            if(this.sensors[1].detectCollision(ClosestPheromones)){
                this.direction -= turnRate ;
               // console.log(this.sensors[1].detectCollision(pheromones))
            }
            if(this.sensors[2].detectCollision(ClosestPheromones)){
                this.direction += turnRate ;
            }
            if(this.sensors[0].detectCollision(ClosestPheromones)){
                this.direction = this.direction ;
            }

        }else if(this.hasFood && ClosestPheromones.length > 30){ //30
            pheromones = pheromones.filter(p =>  (p.type == 'Home'))
            //console.log('Hit')
            if(this.sensors[1].detectCollision(ClosestPheromones)){
                this.direction -= turnRate ;
            }
            if(this.sensors[2].detectCollision(ClosestPheromones)){
                this.direction += turnRate ;
            }
            if(this.sensors[0].detectCollision(ClosestPheromones)){
                this.direction = this.direction;
            }

        }else if(!this.hasFood && ClosestPheromones.length > 20){ // 20

            pheromones = pheromones.filter(p =>  (p.type == 'Home'))
            //console.log(pheromones)
            if(this.sensors[1].detectCollision(ClosestPheromones)){
                this.direction -= turnRate;
            }
            if(this.sensors[2].detectCollision(ClosestPheromones)){
                this.direction += turnRate;
            }
            if(this.sensors[0].detectCollision(ClosestPheromones)){
                this.direction = this.direction;
            }
            //console.log('No food')

        }else{
            pheromones = pheromones.filter(p => (p.type == 'Food'))
            //console.log(pheromones)
            if(this.sensors[1].detectCollision(ClosestPheromones)){
                this.direction -= turnRate  + .5;
               // console.log(this.sensors[1].detectCollision(pheromones))
            }
            if(this.sensors[2].detectCollision(ClosestPheromones)){
                this.direction += turnRate + .5;
            }
            if(this.sensors[0].detectCollision(ClosestPheromones)){
                this.direction = this.direction;
            }
           // console.log('hit')
        }

        
        //
        //console.log(pheromones)
       // console.log(this.sensors[1].detectCollisiontype(phero, 'FOOD'))


        return this.direction;
    }
    detectObstacles(Obstacles){

        //this.sensors[3].update(this.x, this.y, this.direction, Obstacles);
        this.sensors[4].update(this.x, this.y, this.direction, Obstacles);
        this.sensors[5].update(this.x, this.y, this.direction, Obstacles);
       // console.log(this.sensors[3].detectCollisiontype(Obstacles, 500))

        if(this.sensors[3].detectCollisiontype(Obstacles, 500)){
          // this.direction = -this.direction + Math.random() * 4  - 1 *  Math.PI/4;
         //   console.log('ant: '+ this.direction + '  sensors: '+ this.sensors[3].outputAngle)
            //this.direction = -this.sensors[3].outputAngle;
        }
        if(this.sensors[4].detectCollisiontype(Obstacles, 500)){
            // this.direction = -this.direction + Math.random() * 4  - 1 *  Math.PI/4;
            //console.log(this.sensors[4].detectCollisiontype(Obstacles, 500) + ' '+ 'L')
              this.direction += 20*Math.PI/2;
        }
        if(this.sensors[5].detectCollisiontype(Obstacles, 500)){
            // this.direction = -this.direction + Math.random() * 4  - 1 *  Math.PI/4;
             //console.log(this.sensors[5].detectCollisiontype(Obstacles, 500) + ' '+ 'R')
              this.direction -= Math.PI/2;
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

        if(this.debugMod){

            ctx.save()
            ctx.beginPath()
            ctx.rotate(8)
            ctx.moveTo(-this.width/10, -this.height/2)
            ctx.lineTo(-this.width /4 , -this.height * 5)
            ctx.stroke()
            ctx.restore()
       
            ctx.beginPath();
            ctx.rect(-this.width/2 , -this.height/2 , this.width, this.height)
            ctx.stroke()
        }

        ctx.rotate(8);
        ctx.drawImage(this.image, -this.width/2, -this.height/2, this.width, this.height);
        ctx.restore();

        if(this.debugMod){
            this.sensors[0].draw(ctx)
            this.sensors[1].draw(ctx)
            this.sensors[2].draw(ctx)
            this.sensors[3].draw(ctx)
            this.sensors[4].draw(ctx)
            this.sensors[5].draw(ctx)
            this.sensors[6].draw(ctx)
        }

 
    }
 
}