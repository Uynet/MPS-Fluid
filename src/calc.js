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
  static Weight(r){
    if(r==0){
      cl("po")
      return 0;
    }
    return Math.max(0,env.re/r - 1);
  }
  //粒子pの粒子数密度を求める
  static CalcN(p){
    let n = 0;
    let list = EntityManager.list;
    for(let q of EntityManager.list){
      if(p==q)continue;
      n += this.Weight(DIST(p.pos,q.pos));
    }
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
  //
  static CalcPressure(){
    let list = EntityManager.pList.concat(EntityManager.oList);
    let sum = 0;//重み関数の総和
    //係数行列を作る
    for(let y=0;y<list.length;y++){
      sum = 0;
      for(let x=0;x<list.length;x++){if(y == x)continue;
        let po = this.Weight(DIST(list[y].pos,list[x].pos));
        sum += po;
        this.A[y][x] = po;
        this.A[x][y] = po;
      }
      this.A[y][y] = sum+1;//対角成分
    }
    list.forEach((e,i)=>{this.b[i] = env.poyo/(env.n0/e.n-1)});
    //解いて圧力を更新
    
    /*
    this.b = [10,12,21];
    env.length = 3;
    this.A = new Array(3);
    for(let i=0;i<3;i++){
      this.A[i] = new Array(env.length).fill(0);
    }
    this.A[0] = [-3,2,1];
    this.A[1] = [1,-4,1];
    this.A[2] = [2,2,-5];
    */

    let ps = this.GaussSeidel(this.A,this.b);
    list.forEach((e,i)=>{e.prs=ps[i]})

    if(env.timer == 0){
      let ha = this.check(this.A,ps);
      let ya = [];
      this.b.forEach((e,i)=>{ya[i]=e-ha[i]});
      cl(ya)
    }
  }
  //Ax=bを満たすxの近似解
  static CG(A,b){
    et(0,A);
    et(0,b);
    let x = new Array(env.length).fill(1);//最終的なreturn
    let r0 = [];
    this.check(A,x).forEach((e)=>{r0.push(e)});
    let p0 = new Array(r0.length).fill(0);
    p0.forEach((e,i)=>{p0[i]=b[i]-r0[i]});
    r0 = p0;
    let alpha=0;
    let beta=0;
    let prev=0;
    let next=0;
    let pkapk=0;
    let apk=0;
    for(let t=0;t<100;t++){
      prev=0;
      next=0;
      pkapk=0;
      r0.forEach((e)=>{prev+=e*e});//rk rk
      p0.forEach((e,i)=>{pkapk+=e*this.check(A,p0)[i]});
      alpha = prev/pkapk;
      apk=this.check(A,p0);
      x.forEach((e,i)=>{x[i]=e+alpha*p0[i]});
      r0.forEach((e,i)=>{r0[i]=e-alpha*apk[i]});
      r0.forEach((e)=>{next+=e*e});//next
      beta = next/prev;
      p0.forEach((e,i)=>{p0[i]=r0[i]-beta*p0[i]});
    }

    et(0,"r0:"+r0);
    et(0,"A:"+A);
    et(0,"x:"+x);
    et(0,"Ax:"+this.check(A,x));
    return x;
  }
  //Ax=bを満たすxの近似解
  static GaussSeidel(A,b){
    let length = env.length;
    let x = new Array(length).fill(1);//最終的なreturn

    et(0,A);
    et(0,b);
      /*
    let B = A;
    //対角成分が0の時は孤立粒子なので圧力を0にする
    for(let i = 0;i<length;i++){
      if(A[i][i]==0){
      // x[i]=0;
      // B = this.Slice(A,i,i);
        cl("z")
      }
    }
    A = B;
    length = B.length;
    */

    for(let po = 0;po<10;po++){
      for(let i = 0;i<length;i++){
        let next = b[i];
        for(let j = 0;j<length;j++){ if(i==j)continue;
          next -= A[i][j]*x[j];
        }
        next/= A[i][i];
        x[i]=next;
      }
    }
    //A.forEach((e,i)=>{e[i]*=-1});
    //x.forEach((e,i)=>{x[i]*=-1});
    et(0,"A:"+A);
    et(0,"x:"+x);
    et(0,"Ax:"+this.check(A,x));
    return x;
  }
  //行列の要素ijから十字に伸びる成分を除去する
  static Slice(A,i,j){
    A.forEach((e)=>e.splice(i,1));
    A.splice(j,1);
    return A;
  }
  //for debug
  static check(A,x){
    let l = A.length;
    if(x.length!=l){
      cl("A.length:"+l);
      cl("x.length:"+x.length);
    }
    let b = new Array(l).fill(0);

    for(let j = 0;j<l;j++){
      for(let i = 0;i<l;i++){
        b[j] += A[j][i] * x[i];
      }
    }
    return b;
  }
}
