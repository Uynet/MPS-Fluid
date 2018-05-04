import Drawer from './drawer.js';
import Calc from './calc.js';
import Particle from './particle.js';
import Wall from './wall.js';

export default class EntityManager{
  static Init(){
    this.list = [];//all
    this.pList = [];//water
    this.wList = [];//all wall
    this.oList = [];//outer wall
    this.iList = [];//inner wall
    //初期配置を設定
    this.Setting();
  }
  static Setting(){
    let p;
    //水柱の初期配置
    for(let i=0;i<4;i++){
      for(let j=0;j<12;j++){
        p = {
          x : 102 + i*12,
          y : 180 + j*12,
        }
        let pa = new Particle(p);
        EntityManager.Add(pa);
      }
    }
    //壁の初期配置
    let size = 32;
    let layer = 3
    for(let k=0;k<layer;k++){
      for(let j=0;j<size;j++){
        for(let i=0;i<size;i++){
          if(/*j==k ||*/ j==size-1-k || i==k || i==size-1-k){
            if(j<k||j>size-1-k||i<k||i>size-1-k)continue;
            p = {
              x : 48 + i*10,
              y : 48 + j*10,
            }
            let wa;
            if(k==layer-1)wa = new Wall(p,"outter");
            else
            wa = new Wall(p,"inner");
            EntityManager.Add(wa);
          }
        }
      }
    }
  }


  //Entityをリストに登録
  static Add(entity){
    this.list.push(entity); 
    if(entity.type == "particle"){
      this.pList.push(entity);
      env.length++;
    }
    if(entity.type == "wall"){
      this.wList.push(entity);
      if(entity.side == "inner")this.iList.push(entity);
      if(entity.side == "outter"){
        this.oList.push(entity);
        env.length++;
      }
    }
  //  Drawer.Add(entity.graphics);
  }
  //Entityをリストから削除
  static Update(){
      this.list.forEach(e=>e.Update());
  }
  static Update2(){
      this.list.forEach(e=>e.Update2());
  }
}
