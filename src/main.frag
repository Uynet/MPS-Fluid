precision mediump float;
uniform int size;
uniform vec2 entities[330];
uniform float prses[300];
uniform float isSurfaces[300];

float meta(float r){
  //return 0.4/(r*r+0.1);
  if(r<8.0)return 2.0;
  return 0.0;
}
void main(){
  //gl_FragColor = vec4(0.8,0.8,1,1);
  float x = gl_FragCoord.x;
  float y = gl_FragCoord.y;
  float u = x-256.0/512.0;
  float v = y-256.0/512.0;
  vec2 p = vec2(x,y);
  vec2 w = vec2(u,v);

  float spec = 1.0;//光沢
  vec2 normal = vec2(0.0,0.0);
  vec3 light = vec3(0.0,0.0,0.5);
  float m = 0.0;
  float prs = 0.0;
  for(int i = 0;i<312;i++){
    vec2 po = entities[i];
    float m0 = meta(length(p-po));
    m += m0;
    if(m>1.0){
      //自由表面
      if(isSurfaces[i]==1.){
        gl_FragColor = vec4(0.8,0.96,1.,1.);
        return;
      }
      gl_FragColor = vec4((prses[i]+5.) / 50., 0.4, 1.-prses[i]/50., 1.);
      return;
      prs += prses[i]*1.0/50.0;
    }
    //法線計算
  }

  if(m > 0.030){
    if(m <= 0.032){
      gl_FragColor = vec4(0.0,0.2,0.6,1);
      return;
    }
    gl_FragColor = vec4(prs,0.4,1.0-prs,1.0);
    return;
  }
  gl_FragColor = vec4(0.8,0.8,0.8,1);
}

