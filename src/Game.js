import Drawer from './drawer.js';
import EntityManager from './entityManager.js';
import Particle from './particle.js';
import Calc from './calc.js';
import Input from './input.js';

let state;
export default class Game{
  static Boot(){
    Drawer.Init().then(()=>{
      EntityManager.Init();
      Calc.Init();
      state = 0;
      Game.Run();
    });
  }

  static Update(){
    EntityManager.Update();//粘性項・外力項の計算
  Calc.CalcPressure();//非圧縮性を保つように圧力計算
    EntityManager.Update2();//圧力勾配項の計算
  }

  static Run(){
    if(state == 1)requestAnimationFrame(Game.Run);
    Game.Update();
    /*描画*/
    Drawer.Render(EntityManager.list);
    env.timer++;
  }
}

  document.onkeydown=function(e){
    if(e.keyCode==88){
      if(state){
        state = 0;
      }else{
        state = 1;
        Game.Run();
      }
    }else{
      Game.Run();
    }
  }
