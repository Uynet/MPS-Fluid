import EntityManager from './entityManager.js';

export default class Calc{
  static Init(){
    //係数行列
    this.A = new Array(40);
      for(let i=0;i<40;i++){
        this.A[i] = new Array(40).fill(0);
      }
    cl(this.A);
  }
  static Weight(r){
    return Math.max(0,env.re/r - 1);
  }
  //粒子pの粒子数密度を求める
  static CalcN(p){
    let n = 0;
    for(let q of EntityManager.particleList){
      if(p==q)continue;
      n += this.Weight(DIST(p.pos,q.pos));
    }
    return n;
  }
  //各粒子のλを求める
  //最初に一回使うだけ
  static CalcLambda(p){
    let lambda = 0;
    for(let q of EntityManager.particleList){
      if(p==q)continue;
      lambda += DIST2(p.pos,q.pos)*this.Weight(DIST(p.pos,q.pos));
    }
    lambda/p.n;
    return lambda;
  }
  //勾配モデル
  static Grad(p,phi){
    let gradPhi = VEC0();
    for(let q of EntityManager.particleList){
      if(p==q)continue;
      let length = DIST(p.pos,q.pos);
      let dist = SUBV(q.pos,p.pos);
      gradPhi.x += ((q[phi]-p[phi])*dist.x*this.Weight(DIST(length)))/(length*length);
      gradPhi.y += ((q[phi]-p[phi])*dist.y*this.Weight(DIST(length)))/(length*length);
    }
    gradPhi.x *= 2/env.n0;
    gradPhi.y *= 2/env.n0;
    return gradPhi;
  }
  //発散モデル
  //u : vec2
  static Div(p,u){
    let divPhi = VEC0();
    for(let q of EntityManager.particleList){
      if(p==q)continue;
      let length = DIST(p.pos,q.pos);
      let dist = SUBV(q.pos,p.pos);
      let dot = DOT(dist,u);//速度ベクトルと方向ベクトルの内積
      divPhi.x += ((q[phi]-p[phi])*dot.x*this.Weight(DIST(length)))/(length*length);
      divPhi.y += ((q[phi]-p[phi])*dot.y*this.Weight(DIST(length)))/(length*length);
    }
    divPhi.x *= 2/env.n0;
    divPhi.y *= 2/env.n0;
    return divPhi;
  }
  //ラプラシアンモデル
  //phi ... 物理量(str)
  static Lap(p,phi){
    let lapPhi = 0;
    for(let q of EntityManager.particleList){
      if(p==q)continue;
      let length = DIST(q.pos,p.pos);
      lapPhi += (q[phi]-p[phi])*this.Weight(length);
    }
    lapPhi *= 4/(env.lambda*env.n0);
    return lapPhi;
  }
  //
  static CalcPressure(){
    let list = EntityManager.particleList;
    let sum = 0;//重み関数の総和
    for(let y=0;y<list.length;y++){
      sum = 0;
      for(let x=0;x<list.length;x++){
        if(y == x)continue;
        let po = this.Weight(DIST(list[y].pos,list[x].pos));
        sum += po;
        this.A[y][x] = -po;
        this.A[x][y] = -po;
      }
      //対角成分
      this.A[y][y] = sum;
    }
  }
  //Ax=bを満たすxの近似解
  static GaussSeidel(A,b){
  }
}
