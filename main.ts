/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="boid.ts" />
/// <reference path="utils.ts" />
/// <reference path="projectutils.ts" />


var screensize = new Vector(document.documentElement.clientWidth,document.documentElement.clientHeight)

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
for(var i = 0; i < 100; i++){
    boids.push(new Boid(
        new Vector(rng.range(0,screensize.x), rng.range(0,screensize.y)),
        new Vector(rng.norm(),rng.norm()).sub(new Vector(0.5, 0.5)).normalize().scale(speed),
    ))
}
var mousepos = screensize.c().scale(0.5)
document.addEventListener('mousemove',e => {
    mousepos = getMousePos(canvas,e)
})
var mousedown = false
document.addEventListener('mousedown', () => {
    mousedown = true
})
document.addEventListener('mouseup', () => {
    mousedown = false
})
var backgroundanim = new Anim()
backgroundanim.animType = AnimType.repeat
backgroundanim.stopwatch.start()
backgroundanim.begin = 0
backgroundanim.end = 360
backgroundanim.duration = 60 * 1000
ctxt.fillRect(0,0,screensize.x,screensize.y)

var windstrength = 40
var winddirectionanim = new Anim()
winddirectionanim.animType = AnimType.repeat
winddirectionanim.stopwatch.start()
winddirectionanim.begin = 0
winddirectionanim.end = 1
winddirectionanim.duration = 10 * 1000

loop((dt) => {
    dt /= 1000
    dt = clamp(dt,0.002,0.10)
    // ctxt.clearRect(0,0,screensize.x,screensize.y)
    ctxt.fillStyle = `hsl(${backgroundanim.get()},100%,50%)`
    for(var boid of boids){
        cacheBoid(boid)
    }
    // if(mousedown){
    //     debugger
    // }
    for(var boid of boids){
        var acc = new Vector(0,0)

        
        var sepforce = new Vector(0,0)
        var cohforce = new Vector(0,0)
        var aliforce = new Vector(0,0)

        var dist2AverageNeighbourCoh = calcDist2AverageNeighbour(boid,cohrange)
        var dist2AverageNeighbourSep = calcDist2AverageNeighbour(boid,seprange)
        var averageDirectionOfNeighbours = calcDirectionOfNeighbours(boid)
        var dst2mousepos = boid.cachepos.to(mousepos)
        if(dist2AverageNeighbourCoh.length() > 0){
            cohforce = dist2AverageNeighbourCoh.c().normalize().scale(clamp(map(dist2AverageNeighbourCoh.length(),0,cohrange,50,20),0,50))
        }

        if(dist2AverageNeighbourSep.length() > 0){
            sepforce = dist2AverageNeighbourSep.c().normalize().scale(clamp(map(dist2AverageNeighbourSep.length(),40,seprange,-100,0),-100,0))
        }
        
        if(averageDirectionOfNeighbours.length() > 0){
            aliforce = averageDirectionOfNeighbours.c().normalize().scale(clamp(map(averageDirectionOfNeighbours.length(),0,1,40,80),0,80))
        }

        if(dst2mousepos.length() > 0){
            acc.add(dst2mousepos.c().normalize().scale(clamp(map(dst2mousepos.length(),130,150,-300,0),-300,0)))
        }
        
        
        acc.add(sepforce)
        acc.add(cohforce)
        acc.add(aliforce)
        acc.add(rotate2d(new Vector(0,-1),winddirectionanim.get()).scale(windstrength))
        clampMagnitude(acc,0,300)
        boid.speed.add(acc.scale(dt))
        clampMagnitude(boid.speed,10,130)
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


