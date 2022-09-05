import { useState, useRef } from "react";
import { World,Cube,Model,OrbitCamera, useLoop, Skybox, ThirdPersonCamera,useKeyboard } from "lingo3d-react";

function App() {
  let [position,setPosition] = useState({x:0,y:0,z:0});
  let [walking,setWalking]=useState(false);
  let modelRef = useRef();
  const key = useKeyboard();
  const movtion = key==="w"?"walking":"idle"
  
  const handleClick=(ev)=>{
    // ev.point.y=0;
    // setPosition(ev.point);
    // setWalking(true);
    // let model = modelRef.current;
    // model.lookAt(ev.point)
  }
  
  // useLoop(()=>{
  //   let model = modelRef.current;
  //   model.moveForward(-1)
  // },walking)

  useLoop(()=>{
    modelRef.current.moveForward(-1)
    setWalking(true);
  },key==="w")
  const handleIntersect=()=>{
    setWalking(false)
  }

  return (
    <World>
      <div style={{position:'absolute',top:0,zIndex:'9999'}}>NOIR</div>
      <Skybox texture="5.jpg" textureRepeat={30} physics="map" />
        <Cube width={9999} depth={9999} y={-100} onClick={handleClick} texture="ground.jpg" textureRepeat={30} />
        <ThirdPersonCamera active mouseControl>
        <Model
          ref={modelRef}
          src="sbs1.fbx"
          physics="character"
          animations={{
            dancing:"dancing.fbx",
            idle:"idle.fbx",
            walking:"Walking.fbx"
          }}
          animation={movtion}
          intersectIds={["orangeBox"]} // 可触碰的模型
          onIntersect={handleIntersect}// 触碰到上述id时回调
        />
        </ThirdPersonCamera>
        
        {/* <OrbitCamera active  enableZoom enableFly /> */}
        <Cube id="orangeBox" scale={0.2} color="orange" x={position.x} y={position.y} z={position.z} visible={false} />
    </World>
  );
}

export default App;
