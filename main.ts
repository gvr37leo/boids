/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="boid.ts" />
/// <reference path="utils.ts" />
/// <reference path="projectutils.ts" />


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
    }
    for(var boid of boids){
        var acc = new Vector(0,0)
        var sepforce = map(Dist2AverageNeighbour(boid,50).length(),0,50,0,-100) 
        var cohforce = map(Dist2AverageNeighbour(boid,400).length(),0,400,0,50)
        var aliforce = averageSpeedOfNeighbours(boid)
        acc.add(sepforce)
        acc.add(cohforce)
        acc.add(aliforce)

        boid.speed.add(acc.scale(dt))
        boid.pos.add(boid.speed.c().scale(dt))
        boid.pos.x %= screensize.x
        boid.pos.y %= screensize.y
    }

    for(var boid of boids){
        drawBoid(boid)   
    }

})


function Dist2AverageNeighbour(self:Boid,lookradius:number):Vector{
    var boids = getBoidsInSight(self,0.25,lookradius)
    if(boids.length == 0){
        return new Vector(0,0)
    }
    var avg = calcAvgPos(boids)
    var dir = self.cachepos.to(avg)
    return dir
}

function averageSpeedOfNeighbours(self:Boid):Vector{//steer to average heading
    var boids = getBoidsInSight(self,0.25,10)
    if(boids.length == 0){
        return new Vector(0,0)
    }
    var avg = boids.reduce((acc,boid) => acc.add(boid.cachespeed.c().normalize()),new Vector(0,0)).scale(1 / boids.length)
    return avg
}

function calcAvgPos(boids:Boid[]){
    return boids.reduce((acc,boid) => acc.add(boid.cachepos),new Vector(0,0)).scale(1 / boids.length)
}


