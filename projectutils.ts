function map2(val,from1,from2,to1,to2):number{
    return lerp(inverseLerp(val,from1,from2),to1,to2)
}

function inverseLerp(val:number,a:number,b:number):number{
    return to(a,val) / to(a,b)
}