const cl = console.log;

const env = {
  g : 0.1,//重力
  timer : 0,
  dt : 1/200,//時間の刻み幅
  nu : 0, //粘性係数 ν
  rho : 1, //密度 ρ　
  re : 32, //影響半径 粒子の約二倍
  lambda : 0,//ラプラシアンモデルの係数
  poyo : 0,
  length : 0,//粒子数
}
//vector
const VEC0 = ()=>{
  return { x : 0, y : 0 }
}
//距離
const DIST = (p1,p2)=>{
  return Math.sqrt((p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y));
}
//距離の二乗
const DIST2 = (p1,p2)=>{
  return (p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y);
}
//ベクトルの正規化
const NOMALIZE = (v)=>{
  let a = Math.sqrt(v.x * v.x + v.y * v.y);
  v.x /= a;
  v.y /= a;
  return v;
}
const DOT = (v1,v2)=>{
  return {x:v1.x * v2.x,y:v1.y * v2.y,}
}
const ADV = (v1,v2)=>{ return {x:v1.x + v2.x ,y:v1.y + v2.y}; }
const SUBV = (v1,v2)=>{ return {x:v1.x - v2.x ,y:v1.y - v2.y}; }
const VEC2 = (x1,y1)=>{ return { x : x1, y : y1, } }
  const LENGTH2 = (v)=>{
    return v.x*v.x+v.y*v.y;
  }

