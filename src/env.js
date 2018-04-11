const cl = console.log;
/*Key*/
const KEY = {
  UP : 38,
  DOWN : 40,
  RIGHT : 39,
  LEFT : 37,
  Z : 90
}
//vector
const VEC0 = ()=>{
  let v = {
    x : 0,
    y : 0,
  }
  return v;
}
const DIST = (p1,p2)=>{
  return Math.sqrt((p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y));
}
//ベクトルの正規化
const NOMALIZE = (v)=>{
  let a = Math.sqrt(v.x * v.x + v.y * v.y);
  v.x /= a;
  v.y /= a;
  return v;
}
const ADV = (v1,v2)=>{
  return {x:v1.x + v2.x ,y:v1.y + v2.y};
}
const VEC2 = (x1,y1)=>{
  return {
    x : x1,
    y : y1,
  }
}
const env = {
  g : 0.1,//重力
  nu : 0, //圧力勾配係数 ν
  rho : 1, //密度 ρ　
  re : 32, //影響半径 粒子の約二倍
}

//重み関数
//arg : r : length
//return : float
const weight = (r)=>{
  return Math.max(0,(env.re/r)-1);
}
