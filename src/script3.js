import './style.css'
import * as THREE from 'three'
import { add } from 'lodash'
import gsap from 'gsap'
import { DirectionalLight, Mesh, MeshPhongMaterial, PlaneGeometry, PointLight, SpotLight, SpotLightHelper } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

$(function(){

    //
    // SHADOW = point, directional, spot
    //

    const gui= new dat.GUI()

    const canvas=document.querySelector('.webgl')

    const scene= new THREE.Scene()

    const material=new THREE.MeshStandardMaterial(
    )

    const sphere=new Mesh(
        new THREE.SphereBufferGeometry(0.5,64,64),
        material
    )
    sphere.castShadow= true

    scene.add(sphere)

    const plane=new Mesh(
        new THREE.PlaneBufferGeometry(3,3,1,1),
        material
    )

    plane.position.y= -0.5
    plane.rotation.x=-Math.PI/2
    plane.receiveShadow= true

    scene.add(plane)

    const directionalLight= new THREE.DirectionalLight(
        'rgb(200,15,10)',
        0.7
    )
    directionalLight.position.set(0.5,1.5,1.5)
    directionalLight.lookAt(sphere)
    directionalLight.castShadow= true
    directionalLight.shadow.mapSize.x=1024
    directionalLight.shadow.mapSize.y=1024
    directionalLight.shadow.camera.near=1
    directionalLight.shadow.camera.far=6
    directionalLight.shadow.camera.top=1.3
    directionalLight.shadow.camera.right=1.3
    directionalLight.shadow.camera.bottom=-1.3
    directionalLight.shadow.camera.left=-1.3
    directionalLight.shadow.radius= 8


    const spotLight= new THREE.SpotLight('rgb(255,255,255)', 0.4, 10, Math.PI*0.3)
    spotLight.castShadow= true
    spotLight.position.set(0,2,2)
    
    const directionalCameraHelper= 
        new THREE.CameraHelper(directionalLight.shadow.camera)

    const spotCameraHelper= new THREE.CameraHelper(spotLight.shadow.camera)

    //scene.add(directionalCameraHelper)
    scene.add(directionalLight, spotLight, spotLight.target, spotCameraHelper)

    const sizes= {
        width:window.innerWidth,
        height:window.innerHeight
    }

    $(window).on('resize', ()=>{
        sizes.width=window.innerWidth
        sizes.height=window.innerHeight

        camera.aspect=sizes.width / sizes.height
        camera.updateProjectionMatrix()

        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.set(0,0,3);
    scene.add(camera)

    const renderer= new THREE.WebGLRenderer({
        canvas,
        alpha:true
    })
    renderer.setClearColor( 0xffffff, 0 );
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled=true

    const controls= new OrbitControls(camera, canvas)
    controls.enableDamping= true

    const clock= new THREE.Clock()

    const tick = () =>
    {
        //const elapsedTime= clock.getElapsedTime()

        controls.update()

        renderer.render(scene, camera)
        window.requestAnimationFrame(tick)
    }
    tick()
})