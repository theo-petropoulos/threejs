import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { AdditiveBlending, ClampToEdgeWrapping } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture= textureLoader.load('/textures/particles/2.png')

/**
 * Galaxy
 */
const parameters= {}
parameters.count= 100000
parameters.size= 0.01
parameters.radius= 5
parameters.branches= 3
parameters.spin= 3
parameters.randomness= 0.5
parameters.randPower= 3

let starGeometry= null
let starMaterial= null
let stars= null

const generateGalaxy= () =>{

    starGeometry!==null ? starGeometry.dispose() : starGeometry= new THREE.BufferGeometry()
    
    const colors= new Float32Array(parameters.count * 3)
    const starPositions= new Float32Array(parameters.count*3)

    for(let i=0; i<parameters.count; i++){
        const i3=i*3

        const radius= Math.random() * parameters.radius 
        const spinAngle= radius * parameters.spin
        const branchAngle=( i % parameters.branches) / parameters.branches * Math.PI * 2 

        const randomX= Math.pow(Math.random(), parameters.randPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomY= Math.pow(Math.random(), parameters.randPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomZ= Math.pow(Math.random(), parameters.randPower) * (Math.random() < 0.5 ? 1 : -1)

        starPositions[i3 + 0]= Math.cos(branchAngle + spinAngle) * radius + randomX
        starPositions[i3 + 1]= randomY
        starPositions[i3 + 2]= Math.sin(branchAngle + spinAngle) * radius + randomZ
    
        colors[i3 + 0]= Math.random()
        colors[i3 + 1]= Math.random()
        colors[i3 + 2]= Math.random()
    }

    starGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(starPositions, 3)
    )
    starGeometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3)
    )

    //Material
    starMaterial!==null ? starMaterial.dispose() : starMaterial= new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: AdditiveBlending,
        vertexColors: true
    })

    stars!==null ? scene.remove(stars) : stars= new THREE.Points(
        starGeometry,
        starMaterial
    )

    scene.add(stars)
}

generateGalaxy()

gui.add(parameters, 'count', 200, 50000, 200).onFinishChange(generateGalaxy)
gui.add(parameters, 'size', 0.001, 0.1, 0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius', 0.01, 20, 0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches', 3, 20, 1).onFinishChange(generateGalaxy)
gui.add(parameters, 'spin', -5, 5, 0.005).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness', 0, 2, 0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randPower', 1, 10, 0.01).onFinishChange(generateGalaxy)



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()