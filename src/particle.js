import EntityManager from './entityManager.js';
import Input from './input.js';
import Calc from './calc.js';


export default class Particle{
  constructor(pos){
    //phys
    this.pos = pos;
    this.pos_star = this.pos;//仮の位置
    this.vel = VEC0();//速度
    this.vel_star = this.vel;//仮の速度
    this.velLap = VEC0();//速度ベクトルのらぷらしあん
    this.acc = VEC0();//速度の微分
    this.frc = VEC2(0,env.g);//外力
    this.prs = 0;//圧力
    this.prsGrad = VEC0();//圧力勾配
    this.n;//粒子数密度
      
    this.type = "particle";

    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(0x000000,0.6);
    this.graphics.drawRect(0,0,15,15);//x,y,width,height
    this.SetColor(64,64,255);
  }
  SetColor(r,g,b){
    this.graphics.graphicsData[0].fillColor = r*65536 + g*256 + b;
  }
  Restrict(vec){
    if(LENGTH2(this.vel)>49){
      this.vel = NOMALIZE(this.vel);
      this.vel.x *= 7
      this.vel.y *= 7
    }
  }
  Update(){
    //重力項
    this.acc.y = env.g;
    //粘性項
    /*
    let lapV = Calc.LapV(this,"vel");
    lapV.x*=env.nu;
    lapV.y*=env.nu;
    this.acc.x += lapV.x;
    this.acc.y += lapV.y;
    */
    //粘性項と外力項から仮速度を計算
    this.vel_star.x = this.vel.x + env.dt*this.acc.x;
    this.vel_star.y = this.vel.y + env.dt*this.acc.y;
    this.pos_star.x = this.pos.x + env.dt*this.vel_star.x;
    this.pos_star.y = this.pos.y + env.dt*this.vel_star.y;
    //仮位置に置ける粒子数密度を計算
    this.n = Calc.CalcN(this);
    //境界条件で圧力を0に
    this.isSurface = this.n<env.n0*0.94;
    if(this.isSurface)this.prs = 0;
  }
  InitSolvePressure(){
    let list = EntityManager.list.filter(p=>p!=this);
    this.weights = list.map(p => {return {p:p,w:Calc.Weight(DIST(this.pos,p.pos))};});
    this.a=Calc.Sigma(this.weights.map(p=>p.w));
    this.c=-env.rho*(this.n-env.n0)*env.lambda*env.n0/(env.dt*env.dt*env.n0*2*2);
  }
  SolvePressure(){
    const b = Calc.Sigma(this.weights.map(w => w.p.prs * w.w));
    this.prs = Math.min(5, (b - this.c) / this.a);
  };
  Update2(){
    let gradP = VEC0();
    if(this.prs != 0)gradP = Calc.Grad(this,"prs");
    this.vel.x = this.vel_star.x - env.dt*gradP.x/env.rho;
    this.vel.y = this.vel_star.y - env.dt*gradP.y/env.rho;
//    this.Restrict(this.vel)  //速度制限
    this.pos.x = this.pos_star.x + env.dt*(this.vel_star.x-this.vel.x);
    this.pos.y = this.pos_star.y + env.dt*(this.vel_star.y-this.vel.y);
    this.SetColor(64,64,255);

  }
}
