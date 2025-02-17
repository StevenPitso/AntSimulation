// Main.js file


/* 
  this a Ant simulations which uses slime moulds for pheromone navigation 
  and PATH making  this is my first attempt at making a simulation

  ant so far it's fun there are some future upgrades, might be added to this
  project
  - concentrations pheremone navigations
  - maybe apply a pathfinding algorithm e.g A*
  - make a better collision detections system;
  - fix bugs ( hasFood no food Bug , leaving bounds)
*/
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.height =  window.innerHeight;
canvas.width =  window.innerWidth;

let myColony = new Colony(canvas ,ctx ,100,canvas.width * .5 ,canvas.height * .5);


function DrawMap(){
    let MAP = []
    let draw = false;
    let pheromones = false;
    let DebugMode = false;

     document.addEventListener('mousemove', (e) =>{
      document.onkeydown = (event)=> {
       //console.log(event.key)
        if(event.key == 'e'){
          draw = !draw;
          a
        }
        if(event.key == 'p'){
          pheromones = !pheromones;
        }
        if(event.key == 'd'){
          DebugMode = !DebugMode;
          myColony._DEBUG_ =! myColony._DEBUG_
        }
        if(event.key == 's'){

        }
      }

        if(draw){
          MAP.push(new Obstacle(e.x *0.9999, e.y *0.9999,50))
        }

     });

   return MAP;
}

let MaP =  DrawMap()

function spwanFood(n, Tn = 3){

  let Foodlist = []
  for(let c = 0 ; c < Tn ; c++){
    let Node = {x: Math.random() * canvas.width, y: Math.random() * canvas.height }
    for(let i = 3; i <= n +3 ; i++){
      Foodlist.push(new Food(Node.x + i + Math.random() * 30 + i* Math.random() * -2+1, Node.y + i  + Math.random() * 30 + i * Math.random() * -2+1))
    }
  } 

  return Foodlist;
}
let FFood = spwanFood(-3)
myColony.listFood = FFood;

function animate(){
    canvas.width  =  window.innerWidth
    canvas.height =  window.innerHeight;

    myColony.MAP = MaP;
    
    for(let m of MaP){
      m.draw(ctx)
    }



    for(let i = 0; i < myColony.listPheromones.length; i++){
      myColony.listPheromones[i].draw(ctx)
    }

    for(let f of FFood){
      f.draw(ctx) 
     }

    myColony.draw(ctx);
    myColony.update();




    for(let i = 0; i < myColony.listPheromones.length; i++){
       myColony.listPheromones[i].update();
       if(myColony.listPheromones[i].evaporate()){
         myColony.listPheromones.splice(i, 2);
         i--;
       }
    }
   
    for(let i = 0; i < myColony.listFood.length; i++){
      myColony.listFood[i].update(myColony.Ants);
      if(myColony.listFood[i].disposeFood()){
        myColony.listFood.splice(i,1);
        i--;
      }
    }



    requestAnimationFrame(animate);
}
 
animate()