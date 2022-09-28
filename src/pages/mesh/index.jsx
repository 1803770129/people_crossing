import { useState, useRef, useEffect } from "react";
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
import * as THREE from 'three';
const Mesh = () => {
    useEffect(() => {

    }, []);
    const start = () => {
        Ammo().then(() => {
            init()
        })
    }
    const init = () => {
        // 1. 创建场景
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        // 设置辅助对象
        scene.add(new THREE.PolarGridHelper(30, 0));
        // 2. 创建相机
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
        // 设置音频
        const listener = new THREE.AudioListener();
        camera.add(listener);
        scene.add(camera);
        // 设置无方向环境光，不可以投射阴影
        const ambient = new THREE.AmbientLight(0x666666);
        scene.add(ambient);
        // 设置平行光，可以投射阴影
        const directionalLight = new THREE.DirectionalLight(0x887766);
        directionalLight.position.set(- 1, 1, 1).normalize()
        scene.add(directionalLight);
        // 设置渲染器
        let renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
        document.getElementById('cube').appendChild(renderer.domElement);
        // 物体描边/高亮
        const effect = new OutlineEffect(renderer);
    }
    return (
        <div>
            <div id="cube"></div>
            <button onClick={() => start()}>start</button>
        </div>
    )
}
export default Mesh;