

class Sensor{

    constructor(x, y , angle, range, ID = 0, radius = 20){

       
       this.x = x ;
       this.y = y ;
       this.angle = angle;
       this.range = range;
       this.outputAngle = NaN;

      this.ID = ID

        this.collision = false;
        this.lineWidth = 2;
        this.radius = radius;
       
    }

    


    update(antX, antY , antAngle, phero){

          this.x = antX + Math.cos(antAngle + this.angle) * this.range;
          this.y = antY + Math.sin(antAngle + this.angle) * this.range;
          this.collision = this.detectCollision(phero)
         /// console.log(this.collision)
       
    }

    detectCollision(phero){

      for(let p = 0; p < phero.length; p++){
         const distance = Math.sqrt((phero[p].x - this.x) ** 2 + (phero[p].y - this.y ) ** 2);

         
         if(distance < this.radius + phero[p].radius){
            //this.outputAngle = Math.atan2( phero[p].x - this.x, phero[p].y - this.y);
            return true;
         }
      
      }
      return false;
    }
    detectCollisiontype(objects, change){

        for(let p = 0; p < objects.length; p++){
          const distance = Math.sqrt((objects[p].x - this.x) ** 2 + (objects[p].y - this.y ) ** 2);

          
          if(distance < this.radius + change){
            this.outputAngle = Math.atan2( objects[p].y - this.y,  objects[p].x - this.x);
            return true;
          }
      
      }
      return false; 
    }
    detectCollisionSingleObject(object, change){
      const  distance = Math.sqrt((object.x - this.x) ** 2 + (object.y - this.y ) ** 2);
      if(distance < this.radius + change){
        return true;
      }
      return false;
    }

  

  getCirclePoints(centerX, centerY, radius, numPoints) {
    const points = [];

    for (let i = 0; i < numPoints; i++) {
        const angle = (2 * Math.PI * i) / numPoints;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        points.push({ x, y });
    }

    return points;
 }

    detectCollisiontype(obstacles) {

      return false;
  }
  


  
    detectCollisionStrength(pheromones) {
      let totalStrength = 0;
  
      for (let p of pheromones) {
          const dx = this.x - p.x;
          const dy = this.y - p.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < this.range * this.range) {
              totalStrength += p.concentration || 1; // Assume 1 if no value
          }
      }
  
      return totalStrength;
  }
    

    draw(ctx){

    

        ctx.save()
        ctx.beginPath();
        if(this.collision){
          ctx.strokeStyle = 'Blue'
          ctx.lineWidth = this.lineWidth *2
          ctx.arc(this.x, this.y , this.radius, 0, Math.PI * 2);
          // console.log('hit' + this.ID)
        }else{
          ctx.strokeStyle = 'Red'
          ctx.lineWidth = this.lineWidth
          ctx.arc(this.x, this.y , this.radius, 0, Math.PI * 2);
        }

        ctx.stroke();
        ctx.restore();

      

    }



}