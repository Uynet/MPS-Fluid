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
  Collision(){
    //💩
    for(let l of EntityManager.list){
      if(l.type != "wall")continue;
      if(DIST(this.pos,l.pos) < 16){
        this.pos.x -= this.vel.x;
        this.pos.y -= this.vel.y;
        this.vel.x*=-0.5;
        this.vel.y*=-0.5;
      }
    }
  }
  SetColor(r,g,b){
    this.graphics.graphicsData[0].fillColor = r*65536 + g*256 + b;
  }
  Restrict(){
    if(LENGTH2(this.vel)>10000){
      this.vel = NOMALIZE(this.vel);
      this.vel.x *= 100;
      this.vel.y *= 100;
    }
  }
  Update(){
    //NS方程式
    /* Du/Dt = -1/ρ∇P + ν△u + g */

    //重力項
    //this.acc.x = 0;
    this.acc.y = env.g;

    //粘性項と外力項から仮速度を計算
    this.vel_star.x = this.vel.x + env.dt*this.acc.x;
    this.vel_star.y = this.vel.y + env.dt*this.acc.y;
    this.pos_star.x = this.pos.x + env.dt*this.vel_star.x;
    this.pos_star.y = this.pos.y + env.dt*this.vel_star.y;

    //仮位置に置ける粒子数密度を計算
    this.n = Calc.CalcN(this);

    //境界条件で圧力を0に
    if(this.n<env.n0*0.95){
      this.prs = 0;
    }
  }
  Update2(){
    let gradP = VEC0();
    if(this.prs)gradP = Calc.Grad(this,"prs");

    //this.vel.x = this.vel_star.x - env.dt * gradP.x/env.rho;
    //this.vel.y = this.vel_star.y - env.dt * gradP.y/env.rho;
    //this.Restrict()  //速度制限
    this.pos.x = this.pos_star.x - env.dt * env.dt * gradP.x/env.rho;
    this.pos.y = this.pos_star.y - env.dt * env.dt * gradP.y/env.rho;

    let po = Math.floor(this.prs*1);
    this.SetColor(64,64,255);
    if(this.prs == 0)this.SetColor(128,192,255);
    this.graphics.position = this.pos;
  }
}
