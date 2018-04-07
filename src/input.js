import EntityManager from './EntityManager.js';
import Particle from './particle.js';

let inputedKeyList = (new Array(256)).fill(false);

export default class Input{
  static isKeyInput(key){
    return inputedKeyList[key];
  }
}

(document).on("keydown",(e)=> {
  inputedKeyList[event.keyCode] = true;
  event.preventDefault();
});
$(document).on("keyup",(e)=> {
  inputedKeyList[event.keyCode] = false;
});

