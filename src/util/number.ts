export type Deg = number // Degrees
export type Rad = number // Radians


export function degToRad(a: Deg): Rad {
  return a * (Math.PI / 180)
}

export function eqNum(a: number, b: number): boolean {
  return Math.round(a) === Math.round(b)
}
