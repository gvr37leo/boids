class Boid{
    cachepos:Vector
    cachespeed:Vector

    cacheLeft:Vector
    cacheRight:Vector
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
    var oldleft = boid.cacheLeft
    var oldright = boid.cacheRight
    var front = boid.speed.c().normalize().scale(size)
    var backleft = rotate2d(boid.speed.c().normalize(),0.4).scale(size)
    var backright = rotate2d(boid.speed.c().normalize(),-0.4).scale(size)
    boid.cacheLeft = boid.pos.c().add(backleft)
    boid.cacheRight = boid.pos.c().add(backright)
    
    if(oldleft != null){
        var dist = oldright.to(boid.pos.c().add(backright)).length()
        if(dist <= 50){
            drawPolygon([
                oldleft,
                oldright,
                boid.pos.c().add(backright),
                boid.pos.c().add(backleft),
            ])
        }
    }
    drawTriangle(
        boid.pos.c().add(front),
        boid.pos.c().add(backright),
        boid.pos.c().add(backleft),
    )
}

function drawPolygon(points:Vector[]){
    ctxt.beginPath()
    ctxt.moveTo(points[0].x,points[0].y)
    for(var i = 1; i < points.length; i++){
        ctxt.lineTo(points[i].x,points[i].y)
    }
    ctxt.closePath()
    ctxt.fill()
}

function debugDrawBoid(boid:Boid){
    circle(boid.pos,seprange)
    circle(boid.pos,alignrange)
    circle(boid.pos,cohrange)
}

function circle(center:Vector,radius:number){
    ctxt.beginPath();
    ctxt.arc(center.x,center.y,radius,0,TAU)
    ctxt.stroke()
}

function getBoidsInSight(self:Boid,maxangle:number,radius:number){
    var res:Boid[] = []
    for(var boid of boids){
        if(self == boid){
            continue
        }
        if(self.cachepos.to(boid.cachepos).length() <= radius && self.cachespeed.c().normalize().dot(self.cachepos.to(boid.cachepos).normalize()) >= map(maxangle,0,0.5,1,-1)){
            res.push(boid)
        }
    }
    return res
}