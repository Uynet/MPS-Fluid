import Drawer from './drawer.js';
import Particle from './particle.js';
import Wall from './wall.js';

export default class EntityManager{
  static Init(){
    this.list = [];
    let p;
    //水柱の初期配置
    for(let i=0;i<5;i++){
      for(let j=0;j<16;j++){
        p = {
          x : 64 + i*16,
          y : 64 + j*16,
        }
        let pa = new Particle(p);
        EntityManager.Add(pa);
      }
    }
    //壁の初期配置
    //上
    for(let j=0;j<24;j++){
      for(let i=0;i<24;i++){
        if(j>=2 && j<=21 && i>=2 && i<=21)continue;
        p = {
          x : 8 +  i*16,
          y : 8 + j*16,
        }
        let wa = new Wall(p);
        EntityManager.Add(wa);
      }
    }
  }
  //Entityをリストに登録
  static Add(entity){
    this.list.push(entity); 
    Drawer.Add(entity.graphics);
  }
  //Entityをリストから削除
  static Remove(entity){
    let i = this.list.indexOf(entity);
    this.list.splise(i);
    Drawer.Remove(entity.graphics);
  }
  static Update(){
    for(let l of this.list){
      l.Update();
    }
  }
}
