import './style.css'
import * as THREE from 'three'
import { add } from 'lodash'
import gsap from 'gsap'
import { AdditiveBlending, DirectionalLight, Mesh, MeshPhongMaterial, PlaneGeometry, PointLight, SpotLight, SpotLightHelper } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

$(function(){
    let stoptick=0;

    const gui = new dat.GUI()
    gui.hide()

    let pourAudio = new Audio('audios/pouring.mp3')

    const canvas = document.querySelector('.webgl')

    const scene = new THREE.Scene()

    /**
     * Sizes
     */
    const sizes= {
        width:window.innerWidth,
        height:window.innerHeight
    }

    const parameters = {}
    parameters.count = 2000
    parameters.size = 0.1
    parameters.color = '#FFC300'

    /**
     * Bubble material
     */
    const bubbleMaterial = new THREE.MeshStandardMaterial()
    bubbleMaterial.color = new THREE.Color(parameters.color)
    bubbleMaterial.transparent = true
    bubbleMaterial.opacity = 0.4
    // bubbleMaterial.metalness = 0.1
    // bubbleMaterial.roughness = 0.4
    //bubbleMaterial.blending = AdditiveBlending
    bubbleMaterial.depthTest = false

    /**
     * Geometries
     */
    const bubbleGeometry = new THREE.SphereBufferGeometry(0.5,32,32)

    /**
     * Bubbles generation
     */
    const bubbles = new THREE.Group()
    for(let i=0; i<parameters.count; i++){
        const bubble = new THREE.Mesh(
            bubbleGeometry,
            bubbleMaterial
        )

        bubble.position.x = (Math.random()-0.5)*10
        bubble.position.z = (Math.random()-0.5)*10
        bubble.position.y = - (Math.random() * 1 / Math.pow(Math.random(),Math.random()) - 0.5) * 15

        let scale=Math.random() / 2
        bubble.scale.set(scale, scale, scale)


        bubbles.add(bubble)
    }

    scene.add(bubbles)

    /**
     * Lights
     */
    const ambientLight= new THREE.AmbientLight('rgb(255,255,255)', 1)
    scene.add(ambientLight)

    const directionalLight= new THREE.DirectionalLight('rgb(35,50,15)', 1)
    directionalLight.position.set(0,3,6)
    // scene.add(directionalLight)

    // const rectAreaLight= new THREE.RectAreaLight('rgb(195,195,195)', 1, 2, 2)
    // rectAreaLight.position.set(0,3,6)
    // scene.add(rectAreaLight)

    /**
     * Lights GUI
     */

    var fdirectionalLight= gui.addFolder('directionalLight')
    fdirectionalLight.open()
    fdirectionalLight.add(directionalLight, 'intensity', 0, 1, 0.001)
    fdirectionalLight.addColor(directionalLight, 'color')

    const directionalLightHelper= new THREE.DirectionalLightHelper(directionalLight)
    // scene.add(directionalLightHelper)

    //Camera
    const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 100)
    camera.position.set(0,10,5);
    camera.lookAt(scene)
    scene.add(camera)

    //Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    //Render
    const renderer= new THREE.WebGLRenderer({
        canvas
    })
    renderer.setClearColor( 0xffffff, 1 );
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    //renderer.shadowMap.enabled=true

    //Resize
    $(window).on('resize', ()=>{
        sizes.width=window.innerWidth
        sizes.height=window.innerHeight

        camera.aspect=sizes.width / sizes.height
        camera.updateProjectionMatrix()

        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    //Time
    const clock = new THREE.Clock()

    //Refresh
    const tick = () =>
    {
        if(stoptick==1) return 0
        const elapsedTime= clock.getElapsedTime()

        bubbles.children.forEach((bubble) => {
            bubble.position.y += elapsedTime / 10
            bubble.position.z += (Math.random()-0.5)/1.4
            bubble.position.x += (Math.random()-0.5)/1.4
        })

        controls.update()

        renderer.render(scene, camera)
        window.requestAnimationFrame(tick)
    }

    $(document).on('click', ()=>{
        setTimeout(() => {
            tick()
        }, 600);
        pourAudio.play()
        setTimeout(() => {
            $(canvas).css('opacity', 0)
            $("#title").css('opacity', 1)
            setTimeout(() => {
                stoptick=1;
                $(canvas).remove()
            }, 4000);
        }, 5000);
    })
})

function clog(x){
    return console.log(x)
}