class Colony{
    constructor(canvas, ctx, nAnts = 50, x = 0 , y = 0, _DEBUG_ = false){
        
        this.canvas = canvas;
        this.ctx = ctx;
        this._DEBUG_ = _DEBUG_;

        this.x = (x == 0) ?  (Math.random() * canvas.width + 20)  : x;
        this.y = (x == 0) ?  (Math.random() * canvas.height + 20) : y;
        this.nAnts = nAnts;
        this.Ants = [];

        for(let i = 0 ; i < nAnts; i++){
            this.Ants[i] = new Ant(this.canvas, this.x, this.y);
            this.Ants[i].nestNode = {x: this.x, y: this.y}
        }



        this.listPheromones = [];
        this.listFood = [];
        this.MAP = [];
        
    }
    update(){
        for(let ant of this.Ants){
            ant.debugMod = this._DEBUG_
        }

        for(let ant of this.Ants){
            let pheroType = (ant.hasFood == true) ? 'Food' : 'Home';
            
            let pheroRadius = (pheroType == 'Food') ? 1 : 1;
            this.listPheromones.push(new Pheromounes(ant.x ,ant.y , pheroType,pheroRadius));
            ant.update(this.listPheromones, this.MAP);
            ant.foodMap = this.listFood

            const distance = Math.sqrt((ant.x - this.x )**2 + (ant.y - this.y) ** 2)
            if( distance < 20  && ant.hasFood){
                ant.direction -= Math.PI 
                console.log('hit')
            }

        }

    }
    draw(ctx){

        for(const ant of this.Ants){
            ant.draw(ctx)
        }

        ctx.beginPath();
        ctx.fillStyle = '#181100'   // border color :  #181100;
        ctx.arc(this.x, this.y , 20, 0, Math.PI * 2)
        ctx.fill();


    }
}