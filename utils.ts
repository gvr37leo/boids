function rotate2d(v:Vector,rots:number):Vector{
    var cost = Math.cos(rots * TAU)
    var sint = Math.sin(rots * TAU)
    var x = v.x * cost - v.y * sint
    var y = v.y * cost + v.x * sint
    v.x = x
    v.y = y
    return v
}



function drawTriangle(a:Vector,b:Vector,c:Vector){
    ctxt.beginPath()
    ctxt.moveTo(a.x,a.y)
    ctxt.lineTo(b.x,b.y)
    ctxt.lineTo(c.x,c.y)
    ctxt.closePath()
    ctxt.fill()
}