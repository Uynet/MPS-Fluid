import Drawer from './drawer.js';
import EntityManager from './entityManager.js';
import Particle from './particle.js';
import Calc from './calc.js';

let state = 0;
export default class Game{
  static Boot(){
    Drawer.Init();
    EntityManager.Init();
    Calc.Init();
    state = 0;
    Game.Run();
  }

  static Update(){
    EntityManager.Update();//粘性項・外力項の計算
    Calc.CalcPressure();//非圧縮性を保つように圧力計算
    EntityManager.Update2();//圧力勾配項の計算

  }

  static Run(){
    requestAnimationFrame(Game.Run);
    //document.onclick = (e)=>{state = 1;}
    //if(state == 1)
    Game.Update();
    /*描画*/
    Drawer.Renderer.render(Drawer.Stage);
    env.timer++;
  }
}

