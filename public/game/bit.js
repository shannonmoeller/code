/*!
 * @license MIT
 * Copyright (c) 2022 Shannon Moeller
 * https://github.com/shannonmoeller/code
 */

/**
 * Functions for working with 3d bit matricies.
 *
 * Decoded:
 *
 *   [
 *     [
 *       [1, 0, 0],
 *       [0, 1, 0],
 *       [0, 0, 1],
 *     ],
 *     [
 *       [0, 1, 0],
 *       [0, 1, 0],
 *       [0, 1, 0],
 *     ],
 *   ]
 *
 * Encoded:
 *
 *   [
 *     2, 3,
 *     1, 2, 0,
 *     0, 3, 0,
 *     0, 2, 1
 *   ]
 */

// Flatten 3D bit matrix to array of integers
export function encode3dBits(decoded) {
  let depth = decoded.length;
  let height = depth && decoded[0].length;
  let width = height && decoded[0][0].length;
  let valueCount = height * width;
  let encoded = Array(valueCount).fill(0);

  for (let z = 0; z < depth; z++) {
    let power = 2 ** z;
    let layer = decoded[z].flat();

    for (let i = 0; i < valueCount; i++) {
      encoded[i] += layer[i] && power;
    }
  }

  return [depth, width, ...encoded];
}

// Expand array of integers to 3D bit matrix
export function decode3dBits(encoded) {
  let [depth, width, ...values] = encoded;
  let valueCount = values.length;
  let decoded = Array(depth);

  for (let z = 0; z < depth; z++) {
    let power = 2 ** z;
    let layer = Array(valueCount);

    for (let i = 0; i < valueCount; i++) {
      layer[i] = values[i] & power && 1;
    }

    decoded[z] = chunk(layer, width);
  }

  return decoded;
}

// Format encoded matrix as a human friendly string
export function stringify3dBits(encoded) {
  let [depth, width, ...values] = encoded;
  let chunks = chunk(values, width).map((x) => x.join(', '));

  return `[\n  ${depth}, ${width},\n  ${chunks.join(',\n  ')}\n]`;
}

// Chunk array into 2d matrix
export function chunk(values, width) {
  let { length } = values;
  let chunks = [];

  for (let i = 0; i < length; ) {
    chunks.push(values.slice(i, (i += width)));
  }

  return chunks;
}

// Create a 2d matrix of the given dimensions
export function createMatrix(toWidth, toHeight) {
  return Array(toHeight)
    .fill()
    .map(() => Array(toWidth).fill(0));
}

// Crop or fill a 2d matrix to fit the given dimensions
export function resizeMatrix(matrix, toWidth, toHeight) {
  let height = matrix.length;
  let width = height && matrix[0].length;

  if (height > toHeight) {
    matrix.length = toHeight;
  }

  if (width > toWidth) {
    for (let row of matrix) {
      row.length = toWidth;
    }
  }

  if (width < toWidth) {
    let filler = Array(toWidth - width).fill(0);

    for (let row of matrix) {
      row.push(...filler);
    }
  }

  if (height < toHeight) {
    let filler = Array(toWidth).fill(0);

    for (let i = height; i < toHeight; i++) {
      matrix.push([...filler]);
    }
  }

  return matrix;
}
