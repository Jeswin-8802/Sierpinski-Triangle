const canvas = document.getElementById("viewport")
const ctx = canvas.getContext("2d")
ctx.canvas.width = window.innerWidth
ctx.canvas.height = window.innerHeight

var len = 7 * (window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight) / 8

var multiplier = 1 / 2

var checked = true

var zoom = 54 / 100,
    x = ((window.innerWidth - len) / 2),
    y = (19 * (window.innerHeight + Math.sin(Math.PI/3) * len) / 40)

const createTriangle = (pos, sidelen) => {
    let grd = ctx.createLinearGradient(x * zoom, y * zoom, canvas.width * zoom, canvas.height * zoom)
    grd.addColorStop(0, "#32007d")
    grd.addColorStop(1, "#950056")
    ctx.fillStyle = grd
    ctx.beginPath()
    ctx.moveTo(...pos)
    ctx.lineTo(pos[0] + sidelen / 2, pos[1] - sidelen * Math.sin(Math.PI / 3))
    ctx.lineTo(pos[0] + sidelen, pos[1])
    ctx.lineTo(...pos)
    ctx.closePath()
    if (checked)
        ctx.stroke()
    ctx.fill()
}

const createSierpinskiTriangle = (pos, sidelen, depth) => {
    const innerTriangleSidelen = multiplier * sidelen
    const innerTrianglesPositions = [
      pos,
      [ pos[0] + innerTriangleSidelen, pos[1] ],
      [ pos[0] + innerTriangleSidelen / 2, pos[1] - Math.sin(Math.PI/3) * innerTriangleSidelen ]
    ]
    if(depth == 0) {
      innerTrianglesPositions.forEach((trianglePosition) => {
        createTriangle(trianglePosition, innerTriangleSidelen)
      })
    } else {
      innerTrianglesPositions.forEach((trianglePosition) => {
        createSierpinskiTriangle(trianglePosition, innerTriangleSidelen, depth - 1)
      })
    }
}

createSierpinskiTriangle([x, y], len, 6)

var Depth = document.getElementById("minmax-range1")
var side = document.getElementById("minmax-range2")
//var Zoom = document.getElementById("minmax-range3")

Depth.addEventListener("change", function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    createSierpinskiTriangle([x, y], len, Depth.value)
}, false)

side.addEventListener("change", function() {
    multiplier = side.value / 100
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    createSierpinskiTriangle([x, y], len, Depth.value)
}, false)

//Zoom.addEventListener("change", function() {
//    let z = (Zoom.value / 100) - zoom
//    if (z < 0)
//        z = 1 + z
//    else
//        z = 1 / (1 - z)
//    ctx.clearRect(0, 0, canvas.width, canvas.height)
//    ctx.scale(z, z)
//    x /= z
//    y /= z
//    
//    createSierpinskiTriangle([x, y], len, Depth.value)
//    zoom = Zoom.value / 100
//}, false)

document.getElementById("flexCheckChecked").addEventListener("change", function() {
    if (this.checked)
        checked = true
    else
        checked = false
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    createSierpinskiTriangle([(window.innerWidth - len) / 2, 19 * (window.innerHeight + Math.sin(Math.PI/3) * len) / 40], len, Depth.value)
})

