import EntityManager from './EntityManager.js';
import Particle from './particle.js';

let inputedKeyList = (new Array(256)).fill(false);
let timer = 0;

export default class Input{
  static isKeyInput(key){
    return inputedKeyList[key];
  }
  static isKeyClick(key){
    return (env.timer == timer && inputedKeyList[key])
  }
}

$(document).on("keydown",(e)=> {
  if(!inputedKeyList[e.keyCode])timer = env.timer;
  inputedKeyList[e.keyCode] = true;
});
$(document).on("keyup",(e)=> {
  inputedKeyList[e.keyCode] = false;
});

