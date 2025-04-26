
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


canvas.height = window.innerHeight;
canvas.width =window.innerWidth

let myCave = new Cave(canvas);
myCave.terraform(9);
myCave.draw(ctx);

myCave.hitboxes = myCave.getEdgeWalls();
myCave.drawEdges(ctx)


canvas.addEventListener('mousedown', (e) => {
   
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const tileX = Math.floor(mouseX / myCave.MapConfig.unitSize);
    const tileY = Math.floor(mouseY / myCave.MapConfig.unitSize);

    myCave.AddWall(tileX, tileY, 2);
    myCave.hitboxes = myCave.getEdgeWalls();
  
    myCave.draw(ctx);
    myCave.drawEdges(ctx)
});

canvas.addEventListener('mousedown', (e) => {
   
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const tileX = Math.floor(mouseX / myCave.MapConfig.unitSize);
    const tileY = Math.floor(mouseY / myCave.MapConfig.unitSize);

    myCave.RemoveWall(tileX, tileY, 2);
    myCave.hitboxes = myCave.getEdgeWalls();
  
    myCave.draw(ctx);
    myCave.drawEdges(ctx)
});
