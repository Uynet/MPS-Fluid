export default class Particle{
  constructor(pos){
    //phys
    this.pos = pos;
    this.vel = VEC0();

    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(0x4488DD,0.6);
    this.graphics.drawRect(0,0,16,16);//x,y,width,height
  }
  Collision(){
    if(this.pos.y>=300){
      this.vel.y *= -0.5;
      this.pos.y = 300;
    }
  }
  Update(){
    this.pos = ADV(this.pos,this.vel);
    this.vel.y += 0.1;
    this.Collision();
    this.graphics.position = this.pos;
  }
}
