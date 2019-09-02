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

var cohrange = 200
var seprange = 50
var alignrange = 150
var rng = new RNG(0)
var boids:Boid[] = []
var speed = 100
for(var i = 0; i < 20; i++){
    boids.push(new Boid(
        new Vector(rng.range(0,500), rng.range(0,500)),
        new Vector(rng.norm(),rng.norm()).sub(new Vector(0.5, 0.5)).normalize().scale(speed),
    ))
}


loop((dt) => {
    dt /= 1000
    dt = clamp(dt,0.002,0.10)
    ctxt.clearRect(0,0,500,500)
    for(var boid of boids){
        cacheBoid(boid)
    }
    for(var boid of boids){
        var acc = new Vector(0,0)

        
        var sepforce = new Vector(0,0)
        var cohforce = new Vector(0,0)
        var aliforce = new Vector(0,0)

        var dist2AverageNeighbourCoh = calcDist2AverageNeighbour(boid,cohrange)
        var dist2AverageNeighbourSep = calcDist2AverageNeighbour(boid,seprange)
        var averageDirectionOfNeighbours = calcDirectionOfNeighbours(boid)
        if(dist2AverageNeighbourCoh.length() > 0){
            cohforce = dist2AverageNeighbourCoh.c().normalize().scale(clamp(map(dist2AverageNeighbourCoh.length(),0,cohrange,50,20),0,50))
        }

        if(dist2AverageNeighbourSep.length() > 0){
            sepforce = dist2AverageNeighbourSep.c().normalize().scale(clamp(map(dist2AverageNeighbourSep.length(),40,seprange,-100,0),-100,0))
        }
        
        if(averageDirectionOfNeighbours.length() > 0){
            aliforce = averageDirectionOfNeighbours.c().normalize().scale(clamp(map(averageDirectionOfNeighbours.length(),0,1,40,80),0,80))
        }
        
        acc.add(sepforce)
        acc.add(cohforce)
        acc.add(aliforce)
        clampMagnitude(acc,0,100)
        boid.speed.add(acc.scale(dt))
        clampMagnitude(boid.speed,80,130)
        boid.pos.add(boid.speed.c().scale(dt))
        boid.pos.x = mod(boid.pos.x,screensize.x)
        boid.pos.y = mod(boid.pos.y,screensize.y)
    }

    for(var boid of boids){
        drawBoid(boid)
    }
    // debugDrawBoid(boids[0])

})


function calcDist2AverageNeighbour(self:Boid,lookradius:number):Vector{
    var boids = getBoidsInSight(self,0.25,lookradius)
    if(boids.length == 0){
        return new Vector(0,0)
    }
    var avg = calcAvgPos(boids)
    var dir = self.cachepos.to(avg)
    return dir
}

function calcDirectionOfNeighbours(self:Boid):Vector{//steer to average heading
    var boids = getBoidsInSight(self,3/8,alignrange)
    if(boids.length == 0){
        return new Vector(0,0)
    }
    var avg = boids.reduce((acc,boid) => acc.add(boid.cachespeed.c().normalize()),new Vector(0,0)).scale(1 / boids.length)
    return avg
}

function calcAvgPos(boids:Boid[]){
    return boids.reduce((acc,boid) => acc.add(boid.cachepos),new Vector(0,0)).scale(1 / boids.length)
}


