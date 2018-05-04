import EntityManager from './entityManager.js';
import Input from './input.js';
import Calc from './calc.js';

export default class Wall{
  constructor(pos,side){
    this.side = side;
    this.pos = pos;
    this.pos_star = this.pos;//仮の位置
    this.vel = VEC0();//速度
    this.vel_star = this.vel;//仮の速度
    this.velLap = VEC0();//速度ベクトルのらぷらしあん
    this.acc = VEC0();//速度の微分
    this.frc = VEC2(0,env.g);//外力
    this.prs = 0;
    this.prsGrad = VEC0();//圧力勾配
    this.n;//粒子数密度
      
    this.type = "wall";
  }
  SetColor(r,g,b){
    this.graphics.graphicsData[0].fillColor = r*65536 + g*256 + b;
  }
  Update(){
    //仮位置に置ける粒子数密度を計算
    this.n = Calc.CalcN(this);
    //自由表面判定
    this.isSurface = this.n<env.n0*env.surf;
    if(this.isSurface)this.prs = 0;
  }
  InitSolvePressure(){
    let list = EntityManager.pList.concat(EntityManager.oList).filter(p=>p!=this);
    this.weights = list.map(p => {return {p:p,w:Calc.Weight(DIST(this.pos,p.pos))};});
    this.a=Calc.Sigma(this.weights.map(p=>p.w));
    this.c=-env.alpha*env.rho*(this.n-env.n0)*env.lambda*env.n0/(env.dt*env.dt*env.n0*2*2);
  }
  SolvePressure(){
    const b = Calc.Sigma(this.weights.map(w => w.p.prs * w.w));
    this.prs = (b - this.c) / this.a;
  };
  Update2(){
  }
}
