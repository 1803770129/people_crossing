import{c as O,y as a,ai as w,b1 as Y,bc as Z,_ as C,ar as b,aC as $,bd as G,bp as D,bq as z,bj as J}from"./index.f182de35.js";class X extends O{constructor(N,e={}){super(N),this.isWater=!0;const s=this,W=e.textureWidth!==void 0?e.textureWidth:512,L=e.textureHeight!==void 0?e.textureHeight:512,P=e.clipBias!==void 0?e.clipBias:0,j=e.alpha!==void 0?e.alpha:1,R=e.time!==void 0?e.time:0,T=e.waterNormals!==void 0?e.waterNormals:null,k=e.sunDirection!==void 0?e.sunDirection:new a(.70707,.70707,0),F=new w(e.sunColor!==void 0?e.sunColor:16777215),E=new w(e.waterColor!==void 0?e.waterColor:8355711),S=e.eye!==void 0?e.eye:new a(0,0,0),U=e.distortionScale!==void 0?e.distortionScale:20,V=e.side!==void 0?e.side:Y,A=e.fog!==void 0?e.fog:!1,u=new Z,l=new a,c=new a,h=new a,d=new C,p=new a(0,0,-1),n=new b,v=new a,x=new a,f=new b,g=new C,r=new $,_=new G(W,L),y={uniforms:D.merge([z.fog,z.lights,{normalSampler:{value:null},mirrorSampler:{value:null},alpha:{value:1},time:{value:0},size:{value:1},distortionScale:{value:20},textureMatrix:{value:new C},sunColor:{value:new w(8355711)},sunDirection:{value:new a(.70707,.70707,0)},eye:{value:new a},waterColor:{value:new w(5592405)}}]),vertexShader:`
				uniform mat4 textureMatrix;
				uniform float time;

				varying vec4 mirrorCoord;
				varying vec4 worldPosition;

				#include <common>
				#include <fog_pars_vertex>
				#include <shadowmap_pars_vertex>
				#include <logdepthbuf_pars_vertex>

				void main() {
					mirrorCoord = modelMatrix * vec4( position, 1.0 );
					worldPosition = mirrorCoord.xyzw;
					mirrorCoord = textureMatrix * mirrorCoord;
					vec4 mvPosition =  modelViewMatrix * vec4( position, 1.0 );
					gl_Position = projectionMatrix * mvPosition;

				#include <beginnormal_vertex>
				#include <defaultnormal_vertex>
				#include <logdepthbuf_vertex>
				#include <fog_vertex>
				#include <shadowmap_vertex>
			}`,fragmentShader:`
				uniform sampler2D mirrorSampler;
				uniform float alpha;
				uniform float time;
				uniform float size;
				uniform float distortionScale;
				uniform sampler2D normalSampler;
				uniform vec3 sunColor;
				uniform vec3 sunDirection;
				uniform vec3 eye;
				uniform vec3 waterColor;

				varying vec4 mirrorCoord;
				varying vec4 worldPosition;

				vec4 getNoise( vec2 uv ) {
					vec2 uv0 = ( uv / 103.0 ) + vec2(time / 17.0, time / 29.0);
					vec2 uv1 = uv / 107.0-vec2( time / -19.0, time / 31.0 );
					vec2 uv2 = uv / vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 );
					vec2 uv3 = uv / vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 );
					vec4 noise = texture2D( normalSampler, uv0 ) +
						texture2D( normalSampler, uv1 ) +
						texture2D( normalSampler, uv2 ) +
						texture2D( normalSampler, uv3 );
					return noise * 0.5 - 1.0;
				}

				void sunLight( const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor ) {
					vec3 reflection = normalize( reflect( -sunDirection, surfaceNormal ) );
					float direction = max( 0.0, dot( eyeDirection, reflection ) );
					specularColor += pow( direction, shiny ) * sunColor * spec;
					diffuseColor += max( dot( sunDirection, surfaceNormal ), 0.0 ) * sunColor * diffuse;
				}

				#include <common>
				#include <packing>
				#include <bsdfs>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <lights_pars_begin>
				#include <shadowmap_pars_fragment>
				#include <shadowmask_pars_fragment>

				void main() {

					#include <logdepthbuf_fragment>
					vec4 noise = getNoise( worldPosition.xz * size );
					vec3 surfaceNormal = normalize( noise.xzy * vec3( 1.5, 1.0, 1.5 ) );

					vec3 diffuseLight = vec3(0.0);
					vec3 specularLight = vec3(0.0);

					vec3 worldToEye = eye-worldPosition.xyz;
					vec3 eyeDirection = normalize( worldToEye );
					sunLight( surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight );

					float distance = length(worldToEye);

					vec2 distortion = surfaceNormal.xz * ( 0.001 + 1.0 / distance ) * distortionScale;
					vec3 reflectionSample = vec3( texture2D( mirrorSampler, mirrorCoord.xy / mirrorCoord.w + distortion ) );

					float theta = max( dot( eyeDirection, surfaceNormal ), 0.0 );
					float rf0 = 0.3;
					float reflectance = rf0 + ( 1.0 - rf0 ) * pow( ( 1.0 - theta ), 5.0 );
					vec3 scatter = max( 0.0, dot( surfaceNormal, eyeDirection ) ) * waterColor;
					vec3 albedo = mix( ( sunColor * diffuseLight * 0.3 + scatter ) * getShadowMask(), ( vec3( 0.1 ) + reflectionSample * 0.9 + reflectionSample * specularLight ), reflectance);
					vec3 outgoingLight = albedo;
					gl_FragColor = vec4( outgoingLight, alpha );

					#include <tonemapping_fragment>
					#include <fog_fragment>
				}`},t=new J({fragmentShader:y.fragmentShader,vertexShader:y.vertexShader,uniforms:D.clone(y.uniforms),lights:!0,side:V,fog:A});t.uniforms.mirrorSampler.value=_.texture,t.uniforms.textureMatrix.value=g,t.uniforms.alpha.value=j,t.uniforms.time.value=R,t.uniforms.normalSampler.value=T,t.uniforms.sunColor.value=F,t.uniforms.waterColor.value=E,t.uniforms.sunDirection.value=k,t.uniforms.distortionScale.value=U,t.uniforms.eye.value=S,s.material=t,s.onBeforeRender=function(o,B,m){if(c.setFromMatrixPosition(s.matrixWorld),h.setFromMatrixPosition(m.matrixWorld),d.extractRotation(s.matrixWorld),l.set(0,0,1),l.applyMatrix4(d),v.subVectors(c,h),v.dot(l)>0)return;v.reflect(l).negate(),v.add(c),d.extractRotation(m.matrixWorld),p.set(0,0,-1),p.applyMatrix4(d),p.add(h),x.subVectors(c,p),x.reflect(l).negate(),x.add(c),r.position.copy(v),r.up.set(0,1,0),r.up.applyMatrix4(d),r.up.reflect(l),r.lookAt(x),r.far=m.far,r.updateMatrixWorld(),r.projectionMatrix.copy(m.projectionMatrix),g.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),g.multiply(r.projectionMatrix),g.multiply(r.matrixWorldInverse),u.setFromNormalAndCoplanarPoint(l,c),u.applyMatrix4(r.matrixWorldInverse),n.set(u.normal.x,u.normal.y,u.normal.z,u.constant);const i=r.projectionMatrix;f.x=(Math.sign(n.x)+i.elements[8])/i.elements[0],f.y=(Math.sign(n.y)+i.elements[9])/i.elements[5],f.z=-1,f.w=(1+i.elements[10])/i.elements[14],n.multiplyScalar(2/n.dot(f)),i.elements[2]=n.x,i.elements[6]=n.y,i.elements[10]=n.z+1-P,i.elements[14]=n.w,S.setFromMatrixPosition(m.matrixWorld);const H=o.getRenderTarget(),I=o.xr.enabled,q=o.shadowMap.autoUpdate;s.visible=!1,o.xr.enabled=!1,o.shadowMap.autoUpdate=!1,o.setRenderTarget(_),o.state.buffers.depth.setMask(!0),o.autoClear===!1&&o.clear(),o.render(B,r),s.visible=!0,o.xr.enabled=I,o.shadowMap.autoUpdate=q,o.setRenderTarget(H);const M=m.viewport;M!==void 0&&o.state.viewport(M)}}}export{X as Water};
