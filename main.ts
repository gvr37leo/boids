/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="node_modules/vectorx/vector.ts" />

var crret = createCanvas(500,500)
var canvas = crret.canvas
var ctxt = crret.ctxt
var TAU = Math.PI * 2
class Boid{
    constructor(
        public pos:Vector,
        public dir:Vector,
    ){

    }
}

var boids:Boid[] = []
var rng = new RNG(0)
for(var i = 0; i < 100; i++){
    boids.push(new Boid(
        new Vector(rng.range(0,500), rng.range(0,500)),
        new Vector(rng.norm(),rng.norm()).normalize(),
    ))
}

function rotate2d(v:Vector,rots:number):Vector{
    var cost = Math.cos(rots * TAU)
    var sint = Math.sin(rots * TAU)
    var x = x * cost - y * sint
    var y = y * cost + x * sint
    v.x = x
    v.y = y
    return v
}

function drawBoid(boid:Boid){
    ctxt.beginPath()
    boid.pos
    boid.dir
    var size = 5
    var front = boid.dir.c().normalize().scale(size)
    var backleft = rotate2d(boid.dir.c().normalize(),0.4).scale(size)
    var backright = rotate2d(boid.dir.c().normalize(),-0.4).scale(size)
    drawTriangle(
        boid.pos.c().add(front),
        boid.pos.c().add(backright),
        boid.pos.c().add(backleft),
    )
}

function drawTriangle(a:Vector,b:Vector,c:Vector){
    ctxt.beginPath()
    ctxt.moveTo(a.x,a.y)
    ctxt.lineTo(b.x,b.y)
    ctxt.lineTo(c.x,c.y)
    ctxt.closePath()
    ctxt.fill()
}

function updateBoid(boid:Boid){

}

loop((dt) => {

    for(var boid of boids){

    }

    for(var boid of boids){
        drawBoid(boid)   
    }

    ctxt.clearRect(0,0,500,500)
})
function getBoidsInSight(self:Boid,maxangle:number,radius:number){
    var res:Boid[] = []
    for(var boid of boids){
        if(self == boid){
            continue
        }
        if(self.pos.to(boid.pos).length() <= radius && self.dir.dot(self.pos.to(boid.pos).normalize()) >= 0){
            res.push(boid)
        }
    }
    return res
}

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

function calcAvgPos(boids:Boid[]){
    return boids.reduce((acc,boid) => acc.add(boid.pos),new Vector(0,0)).scale(1 / boids.length)
}

function alignment(self:Boid):Vector{//steer to average heading
    var boids = getBoidsInSight(self,0.25,10)
    var avg = boids.reduce((acc,boid) => acc.add(boid.dir.c().normalize()),new Vector(0,0)).scale(1 / boids.length)
    return avg
}
