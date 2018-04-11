import EntityManager from './entityManager.js';

export default class Wall{
  constructor(pos){
    //phys
    this.pos = pos;
    this.vel = VEC0();
    this.frc = 0;//外力
    this.prs = 114514;//圧力
    this.type = "wall";
    this.size = 15;

    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(0x444455,0.6);
    this.graphics.drawRect(0,0,this.size,this.size);//x,y,width,height
  }
  Update(){
    this.pos = ADV(this.pos,this.vel);
    this.graphics.position = this.pos;
  }
}
