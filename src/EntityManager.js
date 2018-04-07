import Drawer from './drawer.js';
import Particle from './particle.js';

export default class EntityManager{
  static Init(){
    this.list = [];
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
