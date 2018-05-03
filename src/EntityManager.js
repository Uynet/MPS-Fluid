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
    for(let i=0;i<6;i++){
      for(let j=0;j<6;j++){
        p = {
          x : 144 + i*16,
          y : 144 + j*16,
        }
        let pa = new Particle(p);
        EntityManager.Add(pa);
      }
    }
    //壁の初期配置
    for(let k=1;k<3;k++){
      for(let j=0;j<24;j++){
        for(let i=0;i<24;i++){
          if(j==k || j==23-k || i==k || i==23-k){
            if(j<k||j>23-k||i<k||i>23-k)continue;
            p = {
              x : 8 +  i*16,
              y : 8 + j*16,
            }
            let wa;
            if(k==2)wa = new Wall(p,"outter");
            else wa = new Wall(p,"inner");
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
