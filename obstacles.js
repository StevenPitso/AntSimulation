class Obstacle{
     constructor(x, y, radius = 9){
        this.x = x;
        this.y = y;
        this.radius = radius;

     }
     draw(ctx){
        ctx.beginPath();
        ctx.fillStyle = '#4f3a05';
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2 );
        ctx.fill();
     }
}