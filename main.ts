/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="boid.ts" />
/// <reference path="utils.ts" />


var screensize = new Vector(500,500)

var crret = createCanvas(screensize.x,screensize.y)
var canvas = crret.canvas
var ctxt = crret.ctxt
var TAU = Math.PI * 2


var rng = new RNG(0)
var boids:Boid[] = []
var speed = 100
for(var i = 0; i < 5; i++){
    boids.push(new Boid(
        new Vector(rng.range(0,500), rng.range(0,500)),
        new Vector(rng.norm(),rng.norm()).normalize().scale(speed),
    ))
}

loop((dt) => {
    dt /= 1000
    ctxt.clearRect(0,0,500,500)
    for(var boid of boids){
        cacheBoid(boid)

        separation(boid)
        cohesion(boid)
        alignment(boid)

        boid.pos.add(boid.speed.c().scale(dt))
        boid.pos.x %= screensize.x
        boid.pos.y %= screensize.y
    }

    for(var boid of boids){
        drawBoid(boid)   
    }

})


function separation(self:Boid):Vector{
    var boids = getBoidsInSight(self,0.25,10)
    var avg = calcAvgPos(boids)
    var dir = self.pos.to(avg).scale(-1)
    return dir
}

function cohesion(self:Boid):Vector{// steer to average position
    var boids = getBoidsInSight(self,0.25,50)
    var avg = calcAvgPos(boids)
    var dir = self.pos.to(avg)
    return dir
}

function alignment(self:Boid):Vector{//steer to average heading
    var boids = getBoidsInSight(self,0.25,10)
    var avg = boids.reduce((acc,boid) => acc.add(boid.speed.c().normalize()),new Vector(0,0)).scale(1 / boids.length)
    return avg
}

function calcAvgPos(boids:Boid[]){
    return boids.reduce((acc,boid) => acc.add(boid.pos),new Vector(0,0)).scale(1 / boids.length)
}


