import EntityManager from './entityManager.js';

export default class Particle{
  constructor(pos){
    //phys
    this.pos = pos;
    this.vel = VEC0();//速度
    this.velLap = VEC0();//速度ベクトルのらぷらしあん
    this.acc = VEC0();//速度の微分
    this.frc = VEC2(0,env.g);//外力
    this.prs;//圧力
    this.prsGrad = VEC0();//圧力勾配
    this.n = this.calcN();//粒子数密度
      
    this.type = "particle";

    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(0x4488DD,0.6);
    this.graphics.drawRect(0,0,15,15);//x,y,width,height
  }
  Collision(){
    for(let l of EntityManager.list){
      if(l.type != "wall")continue;
      if(DIST(this.pos,l.pos) < 16){
        this.pos.x -= this.vel.x;
        this.pos.y -= this.vel.y;
        this.vel.x += 0.1*Math.random();
        this.vel.x *= -0.8;
        this.vel.y *= -0.8;
      }
    }
  }
  //粒子数密度の計算
  CalcN(){
    let n;
    for(let p of EntityManager.list){
      if(p == this)continue;
      n += weight(DIST(this.pos,p.pos));
    }
    return  n;
  }
  //圧力勾配項の計算
  CalcPressure(){
    this.prsGrad

  }
  Update(){
    this.Collision();
    this.CalcPressure();//圧力勾配項の計算
    //NS方程式
    /* Du/Dt = -1/ρ∇P + ν△u + g */
    this.acc.x = -this.prsGrad.x/env.rho + env.nu*this.velLap.x + this.frc.x;
    this.acc.y = -this.prsGrad.y/env.rho + env.nu*this.velLap.y + this.frc.y;

    this.vel = ADV (this.vel,this.acc);
    this.pos = ADV(this.pos,this.vel);
    this.graphics.position = this.pos;
  }
}
