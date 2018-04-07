export default class Drawer{
  //setting stage
  static Init(){
    this.app = new PIXI.Application(400, 400, {backgroundColor : 0x1099bb});
    this.Stage = this.app.stage;///new PIXI.Stage(0x000000);
    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);
    this.Renderer = new PIXI.autoDetectRenderer(400,400);
    this.Renderer.backgroundColor = 0xe0e3e4;
    $("#pixiview").append(this.Renderer.view);
    this.rect = document.getElementById("pixiview").getBoundingClientRect();

    //描画関数開始
    this.Renderer.render(this.Stage);
  }

  static Add(graphics){
    this.Stage.addChild(graphics);//作成した四角をシーンに追加
  }
}
