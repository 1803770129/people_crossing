import { useState, useRef, useEffect } from "react";
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
import { MMDLoader } from 'three/addons/loaders/MMDLoader.js';
import { MMDAnimationHelper } from 'three/addons/animation/MMDAnimationHelper.js';
import * as THREE from 'three';
const Mesh = () => {
    let ready = false;
    let effect;
    let scene;
    let camera;
    let helper;
    const clock = new THREE.Clock();
    useEffect(() => {

    }, []);
    const start = () => {
        Ammo().then(() => {
            init();
            animate()
        })
    }
    // 初始化
    const init = () => {
        // 1. 创建场景
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        // 设置辅助对象
        scene.add(new THREE.PolarGridHelper(30, 0));
        // 2. 创建相机
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
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
        effect = new OutlineEffect(renderer);

        // 当加载正在进行时被调用的函数，参数将是XMLHttpRequest实例，其包含了 .total （总的）和 .loaded （已加载的）字节数。
        function onProgress(xhr) {
            if (xhr.lengthComputable) {

                const percentComplete = xhr.loaded / xhr.total * 100;
                console.log(Math.round(percentComplete, 2) + '% downloaded');

            }

        }

        // 声明mmd模型、动作、环境、相机、音声文件
        const modelFile = 'kq/kq.pmx'; // 刻晴模型
        const actionFile = ['kq/jimingyue-motion.vmd']; // 寄明月动作
        const cameraFile = ['kq/Camera.vmd']; // 寄明月相机
        const audioFile = 'kq/jmy.wav'; // 寄明月音声
        const audioParams = { delayTime: 160 * 1 / 30 };

        // mmd资源动画助手
        helper = new MMDAnimationHelper();
        // 加载mmd资源 ：PMD、PMX、VMD和VPD文件
        const loader = new MMDLoader();
        loader.loadWithAnimation(modelFile, actionFile, function (mmd) {
            let mesh = mmd.mesh;
            helper.add(mesh, {
                animation: mmd.animation,
                physics: true
            });
            loader.loadAnimation(cameraFile, camera, function (cameraAnimation) {

                helper.add(camera, {
                    animation: cameraAnimation
                });

                new THREE.AudioLoader().load(audioFile, function (buffer) {

                    const audio = new THREE.Audio(listener).setBuffer(buffer);

                    helper.add(audio, audioParams);
                    scene.add(mesh);

                    ready = true;

                }, onProgress, null);

            }, onProgress, null);
        }, onProgress, null)
        window.addEventListener('resize', onWindowResize);
    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        effect.setSize(window.innerWidth, window.innerHeight);

    }

    //

    function animate() {

        requestAnimationFrame(animate);
        render();

    }

    function render() {

        if (ready) {

            helper.update(clock.getDelta());

        }

        effect.render(scene, camera);

    }

    return (
        <div>
            <div id="cube"></div>
            <button onClick={() => start()}>start</button>
        </div>
    )
}
export default Mesh;