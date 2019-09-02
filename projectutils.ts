function map2(val,from1,from2,to1,to2):number{
    return lerp(inverseLerp(val,from1,from2),to1,to2)
}

function inverseLerp(val:number,a:number,b:number):number{
    return to(a,val) / to(a,b)
}

function clampMagnitude(v:Vector,min:number,max:number):Vector{
    if(v.length() > max){
        return setMagnitude(v,max)
    }else if(v.length() < min){
        return setMagnitude(v,min)
    }else{
        return v
    }
}

function setMagnitude(v:Vector,magnitude:number):Vector{
    return v.scale(magnitude / v.length())
}