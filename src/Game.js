import Drawer from './drawer.js';
import EntityManager from './entityManager.js';
import Particle from './particle.js';

export default class Game{
  static Boot(){
    Drawer.Init();
    EntityManager.Init();
    Game.Run();
  }

  static Update(){
    //各Entityの位置の更新
    EntityManager.Update();
    //何で2倍になってんの??
    document.onclick = (e)=>{
      let p = {
        x : (e.clientX - 256),
        y : (e.clientY-8),
      }
      let pa = new Particle(p);
      EntityManager.Add(pa);
    }
  }

  static Run(){
    requestAnimationFrame(Game.Run);

    Game.Update();
    /*描画*/
    Drawer.Renderer.render(Drawer.Stage);
  }
}

