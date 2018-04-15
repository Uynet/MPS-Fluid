import EntityManager from './entityManager.js';

export default class Calc{
  static Init(){
    let list = EntityManager.particleList;
    //係数行列
    this.A = new Array(env.length);
    for(let i=0;i<env.length;i++){
      this.A[i] = new Array(env.length).fill(0);
    }
    this.b = new Array(env.length).fill(0);

    //各粒子の粒子数密度とその最大値を求める
    let ns = [];//粒子数密度の配列
    list.forEach((e,i,a)=>{ns.push(e.n = Calc.CalcN(e)); });
    env.n0 = ns.reduce((a,c)=>(a>c)?a:c);

    //各粒子のλとその最大値を求める
    let ls = [];//λの配列
    list.forEach((e,i,a)=>{ls.push(e.n = Calc.CalcLambda(e));});
    env.lambda = ls.reduce((a,c)=>(a>c)?a:c);

    //poyoの計算
    env.poyo = (env.lambda*env.n0/4)*(env.rho/(env.dt*env.dt));
  }
  static Weight(r){
    if(r==0){
      cl("unko");
      return 114514;
    }
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
      gradPhi.x += ((q[phi]-p[phi])*dist.x*this.Weight(length))/(length*length);
      gradPhi.y += ((q[phi]-p[phi])*dist.y*this.Weight(length))/(length*length);
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
        this.A[y][x] = po;
        this.A[x][y] = po;
      }
      //対角成分
      this.A[y][y] = -sum;
    }
    for(let i=0;i<list.length;i++){
      this.b[i] = env.poyo/(5/list[i].n-1);
    }
    //解いて圧力を更新
    let ps = this.GaussSeidel(this.A,this.b);
    list.forEach((e,i)=>{
      e.prs=ps[i];
    })
  }
  //Ax=bを満たすxの近似解
  //A:係数行列
  //b:
  //x:圧力の解
  static GaussSeidel(A,b){
    let length = env.length;
    let x = new Array(length).fill(0);
    for(let po = 0;po<6;po++){
      for(let i = 0;i<length;i++){
        let next = b[i];
        for(let j = 0;j<length;j++){
          if(i==j)continue;
          next -= A[i][j]*x[j];
        }
        if(A[i][i]==0){
          x[i]=0;
        }
        else{
          next/= A[i][i];
          x[i]=next/1000000;
        }
      }
    }
    return x;
  }
}
