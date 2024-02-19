import * as THREE from "three"
import { OBJLoader } from "three/addons/loaders/OBJLoader.js"

const sword_container = document.getElementById("sword-container")

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, sword_container.clientWidth / sword_container.clientHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setSize(sword_container.clientWidth, sword_container.clientHeight)
sword_container.appendChild(renderer.domElement)

const material = new THREE.MeshBasicMaterial({ color: 0xFEF9E7, wireframe: true })
const loader = new OBJLoader();
let sword
loader.load(
    "public/sword.obj",
    (object) => {
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material = material;
            }
        });
        scene.add(object)
        sword = object
        sword.rotation.z += -.25
    }
)

camera.position.z = 3

function update_size() {
    camera.aspect = knot_container.clientWidth / knot_container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(knot_container.clientWidth, knot_container.clientHeight)
}

function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)

    if (sword)
        sword.rotation.y += 0.001
}

animate()

window.addEventListener("resize", update_size)

let preview_div = document.getElementById("preview")
let preview_img = document.getElementById("preview-render")

let preview_active = false
let preview_hideable = false
const images = document.getElementsByTagName("img")
for (let i = 0; i < images.length; i++) {
    const e = images.item(i)

    if (e.id == "preview-render" || e.classList.contains("link")) {
        continue
    }

    e.addEventListener("mousedown", (ev) => {
        if (preview_active || preview_hideable) return
        preview_active = true
        preview_div.classList.add("show")
        preview_img.classList.add("show")
        preview_img.src = e.src
        setTimeout(() => {
            preview_hideable = true
        }, 0);
    })
}

document.addEventListener("mousedown", (ev) => {
    if (preview_hideable && preview_active) {
        preview_hideable = false
        preview_div.classList.add("hide")
        preview_img.classList.add("hide")
        preview_div.classList.remove("show")
        preview_img.classList.remove("show")
        setTimeout(() => {
            preview_div.classList.remove("hide")
            preview_img.classList.remove("hide")
            preview_active = false
        }, 500);
    }
})

const background_container = document.getElementById("intro-background")

function lerp(a, b, t) {
    return a + (b - a) * t
}

let particles = []
function spawnParticle() {
    const lifetime = lerp(0.5, 2, Math.random())
    const element = document.createElement("div")
    element.classList.add("particle")
    element.style.width = `${lerp(2, 6, Math.random())}px`
    element.style.height = `${lerp(25, 75, Math.random())}px`
    element.style.left = `${Math.random() * 100}%`
    element.style.opacity = `${Math.random() * 100}%`
    element.style.bottom = "0"
    background_container.appendChild(element)
    particles.push({
        t: 0,
        element: element,
        lifetime: lifetime,
    })
}

let spawn_timer = 0
function particle_animate() {
    requestAnimationFrame(particle_animate)

    particles.forEach((particle) => {
        particle.t += 0.01
        particle.element.style.bottom = `${lerp(0, 100, particle.t / particle.lifetime)}%`
    })

    particles = particles.filter((particle) => {
        const alive = particle.t <= particle.lifetime;
        if (!alive) { particle.element.remove() }
        return alive
    })

    spawn_timer -= 0.05

    if (spawn_timer <= 0) {
        spawnParticle()
        spawn_timer = Math.random() * .2
    }
}

particle_animate()
