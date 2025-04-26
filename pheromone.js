
class Pheromounes{

    constructor( x, y, type = 'Home',radius = 1){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.type = type;
        this.concentration = 0.01;
        this.avgConcentration = null;
        this.highestInMyRegion = false;
        this.Ants = [];
        this.strenght = 1;
        this.age = 0; 

        
        this.lifespan = Math.random() * 0.52 +  Math.random() * 3.98;

    }
    update(){
       this.age++;
       ///this.strenght *= .011;
       if(this.type == 'Food'){
        this.concentration += 0.02
    
       }
       if(this.type == 'Home'){
        
       }
    }
    pathOptimiser(){

        /*
        * 1) Find the closest pheromnones 
          2) calculated the direction or angle  in the case of our code base 
          3) Add the concentration to the surrounding pheromones 
          4) then done :)
        */
        
    }

    PheromouneAverage(phero){
        let perfectPheromones = phero.filter((p) => p.avgConcentration > 25);  /// make an algo to optimise this integer/



        mainPhero = perfectPheromones.filter((p) => p.highestInMyRegion)
       /// find the angle to this class .
       //const angle = Math.atan2(this.y - Ant.y, this.x - Ant.x)  

      ///  return angle.
    }

    evaporate(){
        const decayRate = (this.type == 'Food') ? 1.2 : .9; 
        return this.age > 60 * this.lifespan * decayRate;
    }
    draw(ctx){
        ctx.beginPath();
        ctx.fillStyle = (this.type == 'Home') ? 'black' : 'green';
        ctx.arc(this.x , this.y, this.radius, 0, Math.PI * 2)
        ctx.fill();
    }
}