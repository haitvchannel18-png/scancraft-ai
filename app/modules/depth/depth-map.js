// modules/depth/depth-map.js

class DepthMap {

normalize(points){

const values = points.map(p=>p.depth)

const max = Math.max(...values)
const min = Math.min(...values)

return points.map(p=>({

...p,
depth: (p.depth - min) / (max - min + 1e-6)

}))

}

// 🔥 convert to grid
toGrid(points, size=256){

const grid = Array(size).fill(0).map(()=>Array(size).fill(0))

points.forEach(p=>{
grid[p.y][p.x] = p.depth
})

return grid

}

}

export default new DepthMap()
