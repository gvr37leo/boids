class Boid{
    cachepos:Vector
    cachespeed:Vector
    constructor(
        public pos:Vector,
        public speed:Vector,
    ){

    }
}

function cacheBoid(boid:Boid){
    boid.cachepos = boid.pos.c()
    boid.cachespeed = boid.speed.c()
}

function drawBoid(boid:Boid){
    ctxt.beginPath()
    boid.pos
    boid.speed
    var size = 5
    var front = boid.speed.c().normalize().scale(size)
    var backleft = rotate2d(boid.speed.c().normalize(),0.4).scale(size)
    var backright = rotate2d(boid.speed.c().normalize(),-0.4).scale(size)
    drawTriangle(
        boid.pos.c().add(front),
        boid.pos.c().add(backright),
        boid.pos.c().add(backleft),
    )
}

function getBoidsInSight(self:Boid,maxangle:number,radius:number){
    var res:Boid[] = []
    for(var boid of boids){
        if(self == boid){
            continue
        }
        if(self.cachepos.to(boid.cachepos).length() <= radius && self.cachespeed.dot(self.cachepos.to(boid.cachepos).normalize()) >= map(maxangle,0,0.5,1,-1)){
            res.push(boid)
        }
    }
    return res
}