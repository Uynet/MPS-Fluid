import Drawer from './drawer.js';
import EntityManager from './entityManager.js';
import Particle from './particle.js';


let state = 0;
export default class Game{
  static Boot(){
    Drawer.Init();
    EntityManager.Init();

    state = 0;
    Game.Run();

  }

  static Update(){
    //各Entityの位置の更新
    EntityManager.Update();
    document.onclick = (e)=>{
      let p = {
        x : (e.clientX - 128),
        y : (e.clientY-8),
      }
      let pa = new Particle(p);
      EntityManager.Add(pa);
    }
  }

  static Run(){
    requestAnimationFrame(Game.Run);

    document.onclick = (e)=>{state = 1 }
    if(state == 1) Game.Update();
    /*描画*/
    Drawer.Renderer.render(Drawer.Stage);
  }
}

