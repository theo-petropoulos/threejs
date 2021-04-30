import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Fog
const fog = new THREE.Fog('#262837', 1, 15)
scene.fog= fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const doorTexture= textureLoader.load('/textures/door/color.jpg')
const doorAlpha= textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusion= textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeight= textureLoader.load('/textures/door/height.jpg')
const doorNormal= textureLoader.load('/textures/door/normal.jpg')
const doorMetalness= textureLoader.load('/textures/door/metalness.jpg')
const doorRoughness= textureLoader.load('/textures/door/roughness.jpg')

const bricksTexture= textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusion= textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormal= textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughness= textureLoader.load('/textures/bricks/roughness.jpg')

const grassTexture= textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusion= textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormal= textureLoader.load('/textures/grass/normal.jpg')
const grassRoughness= textureLoader.load('/textures/grass/roughness.jpg')

grassTexture.repeat.set(8,8)
grassAmbientOcclusion.repeat.set(8,8)
grassNormal.repeat.set(8,8)
grassRoughness.repeat.set(8,8)

grassTexture.wrapS= THREE.RepeatWrapping
grassAmbientOcclusion.wrapS= THREE.RepeatWrapping
grassNormal.wrapS= THREE.RepeatWrapping
grassRoughness.wrapS= THREE.RepeatWrapping

grassTexture.wrapT= THREE.RepeatWrapping
grassAmbientOcclusion.wrapT= THREE.RepeatWrapping
grassNormal.wrapT= THREE.RepeatWrapping
grassRoughness.wrapT= THREE.RepeatWrapping

/**
 * House
 */
const house= new THREE.Group()
scene.add(house)

const walls= new THREE.Mesh(
    new THREE.BoxBufferGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({
        map:bricksTexture,
        aoMap:bricksAmbientOcclusion,
        normalMap:bricksNormal,
        roughnessMap:bricksRoughness
    })
)
walls.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)    
)
walls.position.y=1.25

house.add(walls)

const roof= new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5, 2, 4),
    new THREE.MeshStandardMaterial({
        color:'rgb(35,0,0)'
    })
)
roof.position.y=2.5 + 1
roof.rotation.y=Math.PI/4

house.add(roof)

const door= new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2, 2.2 , 100, 100),
    new THREE.MeshStandardMaterial({
        map:doorTexture,
        transparent:true,
        alphaMap:doorAlpha,
        metalnessMap:doorMetalness,
        roughnessMap:doorRoughness,
        aoMap:doorAmbientOcclusion,
        displacementMap:doorHeight,
        displacementScale:0.1,
        normalMap:doorNormal
    })
)
door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)    
)
door.position.z=2.01
door.position.y=1

house.add(door)

const bushGeometry = new THREE.SphereBufferGeometry(1,16,16)
const bushMaterial= new THREE.MeshStandardMaterial({
    color:'rgb(25,150,55)'
})

const bush1= new THREE.Mesh(bushGeometry, bushMaterial)
bush1.position.set(0.8,0.2,2.2)
bush1.scale.set(0.5,0.5,0.5)

const bush2= new THREE.Mesh(bushGeometry, bushMaterial)
bush2.position.set(1.4,0.1,2.1)
bush2.scale.set(0.25,0.25,0.25)

const bush3= new THREE.Mesh(bushGeometry, bushMaterial)
bush3.position.set(-0.8,0.1,2.2)
bush3.scale.set(0.4,0.4,0.4)

const bush4= new THREE.Mesh(bushGeometry, bushMaterial)
bush4.position.set(-1,0.05,2.6)
bush4.scale.set(0.15,0.15,0.15)

house.add(bush1,bush2,bush3,bush4)

const graves= new THREE.Group()
scene.add(graves)

const graveGeometry= new THREE.BoxBufferGeometry(0.6,0.8,0.2)
const graveMaterial= new THREE.MeshStandardMaterial({
    color: 'rgb(45,45,45)'
})

for(let i=0;i<30;i++){
    const angle= Math.random()*Math.PI*2
    const radius= 3 + Math.random()*6
    const x= Math.sin(angle) * radius
    const z= Math.cos(angle) * radius

    const grave=new THREE.Mesh(
        graveGeometry,
        graveMaterial
    )
    grave.position.set(x, Math.random()*0.4, z)
    grave.rotation.y=(Math.random()-0.5)*1
    grave.rotation.z=(Math.random()-0.5)*0.5

    grave.castShadow= true

    graves.add(grave)
}

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20, 20),
    new THREE.MeshStandardMaterial({ 
        map:grassTexture,
        aoMap:grassAmbientOcclusion,
        normalMap:grassNormal,
        roughnessMap:grassRoughness
    })
)
floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)    
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.15)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)

scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.15)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)

scene.add(moonLight)

const doorLight = new THREE.PointLight('#ff7d46', 1, 4)
doorLight.position.set(0,2.2,2.7)

house.add(doorLight)

const ghost1= new THREE.PointLight('#ff00ff', 2, 3)
const ghost2= new THREE.PointLight('#ff00ff', 2, 3)
const ghost3= new THREE.PointLight('#ffff00', 2, 3)

scene.add(ghost1, ghost2, ghost3)

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
renderer.setClearColor('#262837')

//Shadow
renderer.shadowMap.enabled= true
moonLight.castShadow= true
doorLight.castShadow= true
ghost1.castShadow= true
ghost2.castShadow= true
ghost3.castShadow= true

walls.castShadow= true
walls.receiveShadow= true

roof.castShadow= true
bush1.castShadow= true
bush2.castShadow= true
bush3.castShadow= true
bush4.castShadow= true

floor.receiveShadow= true

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update ghosts
    const ghost1Angle=elapsedTime * 0.5
    ghost1.position.x=Math.cos(ghost1Angle) * 5
    ghost1.position.z=Math.sin(ghost1Angle) * 5
    ghost1.position.y=Math.sin(elapsedTime) * 2

    const ghost2Angle= - elapsedTime * 0.3
    ghost2.position.x=Math.cos(ghost2Angle) * 4
    ghost2.position.z=Math.sin(ghost2Angle) * 4
    ghost2.position.y=Math.sin(elapsedTime) * 3

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()