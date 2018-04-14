import EntityManager from './entityManager.js';
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
    for(let l of EntityManager.list){
      if(l.type != "wall")continue;
      if(DIST(this.pos,l.pos) < 16){
        this.pos.x -= this.vel.x;
        this.pos.y -= this.vel.y;
        this.vel.x += 2 * (Math.random()-0.5);
        this.vel.x = -0.9 * this.vel.x;
        this.vel.y = -0.9 * this.vel.y;
      }
    }
  }
  SetColor(r,g,b){
    this.graphics.graphicsData[0].fillColor = r*65536 + g*256 + b;
  }
  Update(){
    this.Collision();
    //NS方程式
    /* Du/Dt = -1/ρ∇P + ν△u + g */
    this.acc.x = this.frc.x;
    this.acc.y = this.frc.y;
    //粘性項と外力項から仮速度を計算
    this.vel_star = ADV(this.vel,this.acc);
    this.pos_star = ADV(this.pos,this.vel_star);

  }
  Update2(){
    this.vel = this.vel_star;
    this.pos = this.pos_star;
    this.graphics.position = this.pos;
  }
}
