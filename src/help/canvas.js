export const createCanvas = (width, height, matrix = '') => {
  const canvas = document.createElement('CANVAS')
  canvas.width = width
  canvas.height = height
  canvas.background = 'transparent'
  canvas.style.transform = matrix

  return canvas
}

export const setMatrixToCanvasContext = (canvas) => {
  const ctxBlur = canvas.getContext('2d');
  const transform = canvas.style.transform;

  const matrix = transform
    // eslint-disable-next-line
    .match(/^matrix\(([^\(]*)\)$/)[1]
    .split(',')
    .map(Number);
  CanvasRenderingContext2D.prototype.setTransform.apply(
    ctxBlur,
    matrix
  )
}