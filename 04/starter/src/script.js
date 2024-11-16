import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const group = new THREE.Group()
scene.add(group)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 'blue'}),
)
const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 'red'}),
)
cube2.position.x = 2

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 'green'}),
)
cube3.position.x = -2

group.add(cube1)
group.add(cube2)
group.add(cube3)

group.position.y = 1
/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(1, 1, 3)

scene.add(camera)

const axesHelper = new THREE.AxesHelper(4)
scene.add(axesHelper)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)