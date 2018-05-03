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

    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(0x000000,0.6);
    this.graphics.drawRect(0,0,15,15);//x,y,width,height
    this.SetColor(64,64,89);
    if(this.side == "inner")this.graphics.alpha = 0.5;
  }
  SetColor(r,g,b){
    this.graphics.graphicsData[0].fillColor = r*65536 + g*256 + b;
  }
  Update(){
    //仮位置に置ける粒子数密度を計算
    this.n = Calc.CalcN(this);
  }
  Update2(){
    this.graphics.position = this.pos;
  }
}
