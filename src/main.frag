precision mediump float;
uniform int size;
uniform vec2 entities[256];
uniform vec2 entities1;
uniform vec2 entities2;

float meta(float r){
  //return 0.4/(r*r+0.1);
  if(r<8.0)return 500000.0;
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
  for(int i = 0;i<140;i++){
    vec2 po = entities[i];
    float m0 = meta(length(p-po));
    m += m0;
    //法線計算
    po.y -= 0.00001;
    float m1 = meta(length(p-po));
    normal.y = m1-m0;
  }

  if(m > 0.005){
    if(m <= 0.0054 && normal.y<0.0){
      gl_FragColor = vec4(0.0,0.2,0.6,1);
      return;
    }
    gl_FragColor = vec4(0.0*spec,0.6*spec,1.0*spec,1.0);
    return;
  }
  gl_FragColor = vec4(0.8,0.8,0.8,1);
}

