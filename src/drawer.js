export default class Drawer{
  static Init(){
    return new Promise(res=>{
      let canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      document.body.appendChild(canvas);
      this.gl = canvas.getContext("webgl");
      let vertexPositionBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER,vertexPositionBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array([
        -1.0, -1.0,
        1.0, 1.0,
        -1.0, 1.0,
        -1.0, -1.0,
        1.0, 1.0,
        1.0, -1.0,
      ]),this.gl.STATIC_DRAW);

      let program = this.gl.createProgram();
      this.program = program;
      //
      this.CreateShader("src/main.vert").then(vs=>{
        this.gl.attachShader(program,vs);
        return this.CreateShader("src/main.frag");
      }).then(fs=>{
        this.gl.attachShader(program,fs);
        this.gl.linkProgram(program);
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
          console.log(this.gl.getProgramInfoLog(program))
        }
        this.gl.useProgram(program);

        let attributeLocation = this.gl.getAttribLocation(program,"position");
        this.gl.enableVertexAttribArray(0);
        this.gl.vertexAttribPointer(0,2,this.gl.FLOAT,false,0,0)
        res();
      });
    })
  }

  static Render(entities){
    this.gl.clearColor(0,0,0,1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    //entityの描画
    let size = this.gl.getUniformLocation(this.program,"size");
    this.gl.uniform1i(size,entities.length);
    entities.forEach((e,i)=>{
      let location = this.gl.getUniformLocation(this.program,"entities["+i+"]");
      this.gl.uniform2f(location,64+entities[i].pos.x,400-entities[i].pos.y);
      let location2 = this.gl.getUniformLocation(this.program,"prses["+i+"]");
      this.gl.uniform1f(location2,entities[i].prs);
      let location3 = this.gl.getUniformLocation(this.program,"isSurfaces["+i+"]");
      this.gl.uniform1f(location3,(entities[i].isSurface&&entities[i].type=="particle"));
    })
    this.gl.drawArrays(this.gl.TRIANGLES,0,3);
    this.gl.drawArrays(this.gl.TRIANGLES,3,3);
    this.gl.flush();
  }

  static CreateShader(path){
    return new Promise(res=>{
      let ext = path.split(".")[1];
      let shader;
      switch(ext){
        case "frag" : shader = this.gl.createShader(this.gl.FRAGMENT_SHADER); break;  
        case "vert" : shader = this.gl.createShader(this.gl.VERTEX_SHADER); break;  
      }
      let xhr = new XMLHttpRequest();
      xhr.open("GET",path,true);
      xhr.addEventListener("load",event=>{
        let code = xhr.responseText;
        this.gl.shaderSource(shader,code);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
          console.log(this.gl.getShaderInfoLog(shader))
        }
        res(shader);
      });
      xhr.send(null);
    })
  };
}
