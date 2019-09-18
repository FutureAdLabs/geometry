# `@adludio/geometry`

2D point and geometry math for cyan

## Installation instruction

```
npm i --save @adludio/geometry
```

## How to use

It's basically a bunch of utility functions, that you can include by using:

```
  import * as p from "@adludio/geometry/point"

  p.point(5, 2) // {x: 5, y: 2}
```

or if you are writing your own TypeScript library with 2D Geometry features:

```

import { Point } from "@adludio/geometry/point"

function draw(ctx: CanvasContext, point: Point) {
  ctx.rect(point.x, point.y)
  ctx.fill("red")
  ctx.draw()
}

```

Coming soon:

### Point

### Anchor

### Transform

### Matrix
