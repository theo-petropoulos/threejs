import './style.css'
import * as THREE from 'three'
import { add } from 'lodash'
import gsap from 'gsap'
import { DirectionalLight, Mesh, MeshPhongMaterial, PointLight, SpotLight, SpotLightHelper } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

$(function(){

    const gui= new dat.GUI()

    //Textures
    const loadingManager= new THREE.LoadingManager()

    $(loadingManager).ready(function(){
        
    })
    const textureLoader= new THREE.TextureLoader(loadingManager)
    const cubeTextureLoader= new THREE.CubeTextureLoader(loadingManager)
    const fontLoader= new THREE.FontLoader()

    const matcapTexture= textureLoader.load('/textures/matcaps/test.png')

    // fontLoader.load(
    //     '/fonts/helvetiker_regular.typeface.json',
    //     function(font){
    //         const textGeometry= new THREE.TextBufferGeometry(
    //             'Theo Petropoulos',
    //             {
    //                 font,
    //                 size: 0.3,
    //                 height:0.1,
    //                 curveSegments:4,
    //                 bevelEnabled:true,
    //                 bevelThickness:0.03, // z
    //                 bevelSize:0.02, // x - y 
    //                 bevelOffset:0,
    //                 bevelSegments:5
    //             }
    //         )
    //         // textGeometry.computeBoundingBox()
    //         // textGeometry.translate(
    //         //     - ( textGeometry.boundingBox.max.x - 0.02 ) / 2,
    //         //     - ( textGeometry.boundingBox.max.y - 0.02 ) / 2,
    //         //     - ( textGeometry.boundingBox.max.z - 0.03 ) / 2,
    //         // )
    //         textGeometry.center()
    //         const material=new THREE.MeshToonMaterial({
                
    //         })
    //         // gui.add(material, 'metalness', -2, 2, 0.01)
    //         // gui.add(material, 'roughness', 0, 1, 0.005)

    //         const text= new THREE.Mesh(textGeometry, material)
    //         scene.add(text)
    //         // gui.add(textGeometry, 'height', -0.5, 0.5, 0.001)
    //         const sphereGeometry=new THREE.SphereBufferGeometry(0.5,64,64)
            
    //         for(let i=0; i<250; i++){
    //             const sphere=new THREE.Mesh(sphereGeometry, material)

    //             sphere.position.set(
    //                 ( Math.random() - 0.5 ) * 12,
    //                 ( Math.random() - 0.5 ) * 12,
    //                 ( Math.random() - 0.5 ) * 12,
    //             )

    //             sphere.rotation.x= Math.random()*Math.PI
    //             sphere.rotation.y= Math.random()*Math.PI

    //             const scale= Math.random()
    //             sphere.scale.set(scale,scale,scale)

    //             scene.add(sphere)
    //         }
    //     }
    // )

    const doorTexture= textureLoader.load('/textures/door/color.jpg')
    const alphaTexture= textureLoader.load('/textures/door/alpha.jpg')
    const ambientOcclusionTexture= textureLoader.load('/textures/door/ambientOcclusion.jpg')
    const metalnessTexture= textureLoader.load('/textures/door/metalness.jpg')
    const roughnessTexture= textureLoader.load('/textures/door/roughness.jpg')
    const normalTexture= textureLoader.load('/textures/door/normal.jpg')
    const heightTexture= textureLoader.load('/textures/door/height.jpg')
    const gradientTexture= textureLoader.load('/textures/gradients/3.jpg')
    //const matcapTexture= textureLoader.load('/textures/matcaps/test.png')
    gradientTexture.minFilter= THREE.NearestFilter
    gradientTexture.magFilter= THREE.NearestFilter
    gradientTexture.generateMipmaps= false

    const environmentMapTexture= cubeTextureLoader.load([
        '/textures/environmentMaps/1/px.jpg',
        '/textures/environmentMaps/1/nx.jpg',
        '/textures/environmentMaps/1/py.jpg',
        '/textures/environmentMaps/1/ny.jpg',
        '/textures/environmentMaps/1/pz.jpg',
        '/textures/environmentMaps/1/nz.jpg'
    ])
    
    //const colorTexture= textureLoader.load('/textures/door/color.jpg')
   

    //mipMapping sizes = power of 2
    // checkerTexture.minFilter= THREE.NearestFilter
    // // => 
    // checkerTexture.generateMimaps= false
    // checkerTexture.magFilter= THREE.NearestFilter

    // colorTexture.rotation=Math.PI * 0.5
    // colorTexture.center.x=0.5
    // colorTexture.center.y=0.5


    
    // const parameters={
    //     color: 0xff0000,
    //     spin: function(){
    //         gsap.to(mesh.rotation, {
    //             duration:1,
    //             y:mesh.rotation.y + 10
    //         })
    //     }
    // }

    const cursor={
        posX:0,
        posY:0
    }

    $(window).on('mousemove', (e)=>{
        cursor.posX= e.clientX / sizes.width - 0.5
        cursor.posY= e.clientY / sizes.height - 0.5
    })

    //Scene
    const scene = new THREE.Scene()
    

    //Mesh
    // const geometry= new THREE.BufferGeometry()
    // const geometry = new THREE.BoxBufferGeometry(1,1,1)

    // const count=250
    // const positionsArray= new Float32Array(count*3*3)

    // for(let i=0; i<count*3*3; i++){
    //     positionsArray[i]= (Math.random()-0.5)*3
    // }

    // const positionsAttribute= new THREE.BufferAttribute(positionsArray, 3)
    // geometry.setAttribute('position', positionsAttribute)

    // const material = new THREE.MeshBasicMaterial({
    //     map: checkerTexture
    // })
    // const mesh = new THREE.Mesh(geometry, material)
    // mesh.scale.set(1,1,1)

    // scene.add(mesh)

    // const material= new THREE.MeshBasicMaterial({
    //     color: 'rgb(127,22,54)',
    //     opacity: 0.7,
    //     transparent: true
    // })

    //const material= new THREE.MeshNormalMaterial()

    // const material= new THREE.MeshMatcapMaterial()
    // material.matcap= matcapTexture

    // const material= new THREE.MeshDepthMaterial()

    // const material= new THREE.MeshLambertMaterial()

    // const material= new THREE.MeshPhongMaterial()
    // material.shininess= 100
    // material.specular= new THREE.Color('rgb(0,15,175)')

    // const material=new THREE.MeshToonMaterial()
    // material.gradientMap= gradientTexture

    // const material= new THREE.MeshStandardMaterial()
    // material.map= doorTexture
    // material.aoMap= ambientOcclusionTexture
    // material.displacementMap= heightTexture
    // material.displacementScale= 0.05
    // material.metalnessMap= metalnessTexture
    // material.roughnessMap= roughnessTexture
    // material.normalMap= normalTexture
    // material.normalScale.set(0.5,0.5)
    // material.transparent=true
    // material.alphaMap= alphaTexture

    const material=new THREE.MeshStandardMaterial()
    material.metalness= 0.7
    material.roughness=0.2
    //material.envMap= environmentMapTexture
    
    // gui.add(material, 'metalness', -2, 2, 0.01)
    // gui.add(material, 'roughness', 0, 1, 0.001)
    // // gui.add(material, 'aoMapIntensity', -10, 10, 0.1)
    // // gui.add(material, 'displacementScale', -2, 2, 0.001)

    // const sphere= new THREE.Mesh(
    //     new THREE.SphereBufferGeometry(0.5,64,64),
    //     material
    // )

    // sphere.geometry.setAttribute(
    //     'uv2', 
    //     new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
    // )

    // const cone=new THREE.Mesh(
    //     new THREE.ConeBufferGeometry(0.45,1,64,64),
    //     material
    // )

    // cone.position.y=0.9

    // gui.add(cone.position, 'y', 0.4, 0.6, 0.001)
    // gui.add(cone.scale, 'y', 0.5, 1, 0.005)

    const plane= new THREE.Mesh(
        new THREE.PlaneBufferGeometry(1,1,100,100),
        material
    )

    plane.geometry.setAttribute(
        'uv2', 
        new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
    )

    plane.position.x= -1.5

    const torus= new THREE.Mesh(
        new THREE.TorusBufferGeometry(0.5,0.2,64,128),
        material
    )

    torus.geometry.setAttribute(
        'uv2', 
        new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
    )

    torus.position.x= 1.5

    const cube = new THREE.Mesh(
        new THREE.BoxBufferGeometry(1,1,1),
        material
    )

    const floor= new Mesh(
        new THREE.PlaneBufferGeometry(10,10),
        material
    )

    floor.rotation.x=-Math.PI/2
    floor.position.y=-2

    scene.add(cube, torus, plane, floor)

    // scene.add(sphere, cone)

    //Axes helper
    const axesHelper= new THREE.AxesHelper()
    scene.add(axesHelper)

    //Lights
    //Min cost = ambient & hemisphere
    //Moderate cost = directional & point
    //High cost = spot & rectarea

    //const ambientLight= new THREE.AmbientLight('rgb(255,255,255)', 0.5)
    //ambientLight.color=
    //ambientLight.intensity=

    const directionalLight= new THREE.DirectionalLight('rgb(0,25,155)', 0.3)
    directionalLight.position.set(0,1,1.5)

    const hemisphereLight= new THREE.HemisphereLight('rgb(225,0,15)', 'rgb(0,15,225)')
    const pointLight= new THREE.PointLight('rgb(255,255,255)', 0.5)
    pointLight.position.set(1,-0.5,1)

    const rectLight= new THREE.RectAreaLight(0x4e00ff, 2, 3, 3)
    rectLight.position.set(-1.5,0,1.5)
    rectLight.lookAt(new THREE.Vector3())

    const spotLight=new THREE.SpotLight('rgb(15,225,35)', 0.7, 10, Math.PI* 0.05, 0.25, 1)
    spotLight.position.set(0,2,3)
    spotLight.target.position.x= torus.position.x

    //Light helpers
    const hemiHelper=new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
    const directionHelper=new THREE.DirectionalLightHelper(directionalLight, 0.2)
    const pointHelper= new THREE.PointLightHelper(pointLight)
    const spotHelper= new THREE.SpotLightHelper(spotLight)
    const rectHelper= new RectAreaLightHelper(rectLight)

    
    scene.add(rectHelper, rectLight,spotLight, spotLight.target, hemiHelper, directionHelper, pointHelper, spotHelper)

    window.requestAnimationFrame(function(){
        spotHelper.update()
    })

    //Sizes
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

    $(window).on('dblclick', ()=>{
        const fullscreenElement= document.fullScreenElement || document.webkitFullscreenElement
        if(!fullscreenElement){
            if(canvas.requestFullscreen) canvas.requestFullscreen()
            else if(canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen()
        }
        else{
            if(document.exitFullscreen) document.exitFullscreen()
            else if(document.webkitExitFullscreen) document.webkitExitFullscreen()
        }
    })
    
    //Camera
    //Last 2 parameters => near, far ( use camera.position.length())
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    //const aspectRatio = sizes.width/sizes.height
    //const camera= new THREE.OrthographicCamera(-1*aspectRatio, 1*aspectRatio, 1, -1, 0.1, 100)
    camera.position.set(0,0,3);
    scene.add(camera)

    //Renderer
    const canvas=document.querySelector('.webgl')
    const renderer= new THREE.WebGLRenderer({
        canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    //Controls
    const controls= new OrbitControls(camera, canvas)
    controls.enableDamping= true
    // controls.target.y=2

    // gsap.to(mesh.position, { duration : 1, delay: 1, x: 2})

    //Time
    const clock= new THREE.Clock()

    //Debug
    // gui
    //     .add(mesh.position, 'y')
    //     .min(-3)
    //     .max(3)
    //     .step(0.01)
    //     .name('height')
    
    // gui
    //     .add(mesh, 'visible')

    // gui 
    //     .add(material, 'wireframe')

    // gui
    //     .addColor(parameters, 'color')
    //     .onChange(function(){
    //         material.color.set(parameters.color)
    //     })
    
    // gui
    //     .add(parameters, 'spin')

    //Animations
    const tick = () =>
    {
        //Clock
        const elapsedTime= clock.getElapsedTime()

        //Update objects
        // sphere.rotation.y= 0.1*elapsedTime;
        // plane.rotation.y= 0.2*elapsedTime;
        // torus.rotation.y= 0.3*elapsedTime;

        // sphere.rotation.x= 0.15*elapsedTime;
        // plane.rotation.x= 0.15*elapsedTime;
        // torus.rotation.x= 0.15*elapsedTime;

        // camera.position.x=Math.sin(cursor.posX*Math.PI*2)*Math.PI
        // camera.position.y=cursor.posY*5
        // camera.position.z=Math.cos(cursor.posX*Math.PI*2)*Math.PI
        // camera.lookAt(mesh.position)

        controls.update()

        renderer.render(scene, camera)
        window.requestAnimationFrame(tick)
    }
    tick()
});

function clog(x){
    return console.log(x)
}