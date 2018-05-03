import EntityManager from './entityManager.js';

export default class Calc{
  static Init(){
    let list = EntityManager.pList;
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
  static Sigma(arr){
    let po = 0;
    arr.forEach((e)=>{po+=e});
    return po;
  }
  static Weight(r){
    if(r==0){
      cl("po")
      return 999999999;
    }
    return Math.max(0,env.re/r - 1);
  }
  //粒子pの粒子数密度を求める
  static CalcN(p){
    let n = 0;
    let list = EntityManager.list.filter(q=>q!=p);
    list.forEach(q=>{n += this.Weight(DIST(p.pos,q.pos))});
    return n;
  }
  //各粒子のλを求める
  //最初に一回使うだけ
  static CalcLambda(p){
    let lambda = 0;
    let n = 0;
    let list = EntityManager.pList;
    for(let q of list){ if(p==q)continue;
      lambda += DIST2(p.pos,q.pos)*this.Weight(DIST(p.pos,q.pos));
    }
    for(let q of list){ if(p==q)continue;
      n += this.Weight(DIST(p.pos,q.pos));
    }
    if(n==0)cl("po");
    lambda/=n;
    return lambda;
  }
  //勾配モデル
  static Grad(p,phi){
    let gradPhi = VEC0();
    let pList = EntityManager.list;
    let pMin = EntityManager.pList.reduce((a,c)=>(a.prs<c.prs)?a.prs:c.prs);//圧力の最小値
    for(let q of pList){
      if(p==q)continue;
      let length = DIST(p.pos,q.pos);
      let dist = SUBV(q.pos,p.pos);
      gradPhi.x += ((q[phi]-pMin)*dist.x*this.Weight(length))/(length*length);
      gradPhi.y += ((q[phi]-pMin)*dist.y*this.Weight(length))/(length*length);
    }
    gradPhi.x *= 2/env.n0;
    gradPhi.y *= 2/env.n0;
    return gradPhi;
  }
  //発散モデル
  //u : vec2
  static Div(p,u){
    let divPhi = VEC0();
    let pList = EntityManager.list;
    for(let q of pList){
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
    let pList = EntityManager.list;
    for(let q of pList){ if(p==q)continue;
      let length = DIST(q.pos,p.pos);
      lapPhi += (q[phi]-p[phi])*this.Weight(length);
    }
    lapPhi *= 4/(env.lambda*env.n0);
    return lapPhi;
  }
  //ベクトル場のlap
  static LapV(p,phi){
    let lapPhi = VEC0();
    let pList = EntityManager.list;
    for(let q of pList){ if(p==q)continue;
      let length = DIST(q.pos,p.pos);
      lapPhi.x = (q[phi].x-p[phi].x)*this.Weight(length);
      lapPhi.y = (q[phi].y-p[phi].y)*this.Weight(length);
    }
    lapPhi.x *= 4/(env.lambda*env.n0);
    lapPhi.y *= 4/(env.lambda*env.n0);
    return lapPhi;
  }

  //解いて圧力を更新
  static CalcPressure(){
    const list = EntityManager.pList.concat(EntityManager.iList).filter(p => !p.isSurface);
    list.forEach(p=>p.InitSolvePressure());
    for (let i = 0; i < 10; i++) {
      list.forEach(p => p.SolvePressure());
    }
  }
}
