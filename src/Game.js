import Drawer from './drawer.js';
import EntityManager from './entityManager.js';
import Particle from './particle.js';
import Calc from './calc.js';
import Input from './input.js';

let state = 0;
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
    //requestAnimationFrame(Game.Run);
    Game.Update();
    /*描画*/
    Drawer.Render(EntityManager.list);
    env.timer++;
  }
}

  document.onkeydown=function(e){
    Game.Run();
    if(e.keyCode==88){
      cl(Calc.A)
    }
  }
