/* 
  this a Ant simulations which uses slime moulds for pheromone navigation 
  and PATH making  this is my first attempt at making a simulation

  ant so far it's fun there are some future upgrades, might be added to this
  project
  - concentrations pheremone navigations
  - maybe apply a pathfinding algorithm e.g A*
  - make a better collision detections system;2
  - fix bugs ( hasFood no food Bug , leaving bounds)
  - Apply design patterns (Object Pool )
  - 
*/
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.height =  window.innerHeight;
canvas.width =  window.innerWidth;

let labelDebugMode = document.getElementById('labelDebugMode');
let labelWallMode = document.getElementById('labelWallMode');
let labelEditMap =document.getElementById('labelEditMap');
const state = InputsAndOutputs();

let myCave = new Cave(canvas);
myCave.terraform(9); // Terraform FIRST!


let colonyCoords = myCave.SpawnColony();
let myColony = new Colony(canvas ,ctx ,100,colonyCoords.x , colonyCoords.y);

let foodSpawer = new FoodSpawer();
foodSpawer.initMap(myCave.Map, myCave.MapConfig);
foodSpawer.spawer(10);
myCave.SpawnFood(6);



function spwanFood(Tn = 3){
  let Foodlist = myCave.SpawnFoodRegions;
  let listFood = [];
  
  for(let i = 0; i <  myCave.SpawnFoodRegions.length; i++){
       for(let n = 0; n <= Tn; n++){

        listFood.push(new Food(Foodlist[i].x + Math.random() * 50, Foodlist[i].y+ Math.random() * 50))
       } 
  }

  return listFood;
}

let FFood = spwanFood(80)
myColony.listFood = FFood;


function animate(){
    canvas.width  =  window.innerWidth
    canvas.height =  window.innerHeight;

    myCave.update(state.editMode,state.debugMode);
    

    myCave.draw(ctx);

    myColony.MAP = myCave.getEdgeWalls();
    myCave.drawEdges(ctx);
    foodSpawer.draw(ctx)

    for(let i = 0; i < myColony.listPheromones.length; i++){
      myColony.listPheromones[i].draw(ctx)
    }

    for(let f of FFood){
      f.draw(ctx) 
     }


  
    myColony.draw(ctx);
    myColony.update(state.debugMode);
    
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
        myColony.foodCollected ++;
        i--;
      }
    }


 
    requestAnimationFrame(animate);
}
 
animate()



function InputsAndOutputs() {
  const state = {
    debugMode: false,
    editMode: false,
    removeWall: true,
    addWall: false,
  };

  document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase(); // in case caps lock is on

    if (key === 'd') {
      document.getElementById("labelDebugMode").textContent = (state.debugMode) ?  'Debug Mode : OFF' : 'Debug Mode : ON';
      state.debugMode = !state.debugMode;
      
    } else if (key === 'e') {
      state.editMode = !state.editMode;
      document.getElementById("labelEditMap").textContent = (state.editMode) ?  'EDIT Mode  : ON' : 'EDIT Mode  : OFF';
    } else if (key === 'r') {
      state.removeWall = !state.removeWall;
    } else if (key === 'a') {
      state.addWall = !state.addWall;
    }
    
    if(state.editMode){
      if(key == 'r'){
        toolFlag = 'Tool : Removing Wall'
      }else if(key === 'a'){
        toolFlag ='Tool : Adding wall'
      }
      document.getElementById("labelWallMode").textContent = toolFlag
    }



     console.log("Updated state:", state);
  });

  return state; // the object reference stays the same, so you can track updates (YEAH THIS SICK i KNOW :)
}
