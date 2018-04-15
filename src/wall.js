import EntityManager from './entityManager.js';

export default class Wall{
  constructor(pos,side){
    //phys
    this.pos = pos;
    this.vel = VEC0();
    this.frc = 0;//外力
    this.prs = 114514;//圧力
    this.type = "wall";
    this.side = side;
    this.size = 15;

    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(0x000020,0.6);
    this.graphics.drawRect(0,0,this.size,this.size);//x,y,width,height
    if(this.side == "inner")this.graphics.alpha = 0.5;
  }
  Update(){
    this.pos = ADV(this.pos,this.vel);
    this.graphics.position = this.pos;
  }
  Update2(){
    //this.graphics.position = this.pos;
  }
}
