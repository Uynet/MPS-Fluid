import Drawer from './drawer.js';
import Calc from './calc.js';
import Particle from './particle.js';
import Wall from './wall.js';

export default class EntityManager{
  static Init(){
    this.list = [];
    this.particleList = [];
    //初期配置を設定
    this.Setting();
  }
  static Setting(){
    let p;
    //水柱の初期配置
    for(let i=0;i<4;i++){
      for(let j=0;j<10;j++){
        p = {
          x : 64 + i*16,
          y : 64 + j*16,
        }
        let pa = new Particle(p);
        EntityManager.Add(pa);
      }
    }

    //各粒子の粒子数密度とその最大値を求める
    let ns = [];//粒子数密度の配列
    for(let p of this.particleList){
      p.n = Calc.CalcN(p);
      ns.push(p.n);
    }
    env.n0 = ns.reduce((a,c)=>(a>c)?a:c);


    //各粒子のλとその最大値を求める
    let ls = [];//λの配列
    for(let p of this.particleList){
      ls.push(Calc.CalcN(p));
    }
    env.lambda = ls.reduce((a,c)=>(a>c)?a:c);


    //壁の初期配置
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
    if(entity.type == "particle"){
      this.particleList.push(entity);
    }
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
  static Update2(){
    for(let l of this.list){
      l.Update2();
    }
  }
}
