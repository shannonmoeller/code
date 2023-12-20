/*!
 * @license MIT
 * Copyright (c) 2022 Shannon Moeller
 * https://github.com/shannonmoeller/code
 */

import { constrainBall, constrainChain, getDistance } from './particles.js';

const EMPTY = 0;
const TOP_LEFT = 1;
const TOP_RIGHT = 2;
const BOTTOM_LEFT = 4;
const BOTTOM_RIGHT = 8;
const FULL = TOP_LEFT + TOP_RIGHT + BOTTOM_LEFT + BOTTOM_RIGHT;

export const Tiles = {
  EMPTY,
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
  FULL,

  TOP: TOP_LEFT + TOP_RIGHT,
  BOTTOM: BOTTOM_LEFT + BOTTOM_RIGHT,
  LEFT: TOP_LEFT + BOTTOM_LEFT,
  RIGHT: TOP_RIGHT + BOTTOM_RIGHT,

  TOP_LEFT_BOTTOM_RIGHT: TOP_LEFT + BOTTOM_RIGHT,
  TOP_RIGHT_BOTTOM_LEFT: TOP_RIGHT + BOTTOM_LEFT,

  LESS_TOP_LEFT: FULL - TOP_LEFT,
  LESS_TOP_RIGHT: FULL - TOP_RIGHT,
  LESS_BOTTOM_LEFT: FULL - BOTTOM_LEFT,
  LESS_BOTTOM_RIGHT: FULL - BOTTOM_RIGHT,
};

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export const detectors = {
  [Tiles.FULL](particle, tile, fn) {
    fn(particle, tile);
  },

  [Tiles.TOP](particle, tile, fn) {
    let top = tile.middle + particle.radius;
    let distance = particle.y - top;

    if (distance < 0) {
      fn(particle, tile, distance);
    }
  },

  [Tiles.BOTTOM](particle, tile, fn) {
    let bottom = tile.middle - particle.radius;
    let distance = bottom - particle.y;

    if (distance < 0) {
      fn(particle, tile, distance);
    }
  },

  [Tiles.LEFT](particle, tile, fn) {
    let left = tile.center + particle.radius;
    let distance = particle.x - left;

    if (distance < 0) {
      fn(particle, tile, distance);
    }
  },

  [Tiles.RIGHT](particle, tile, fn) {
    let right = tile.center - particle.radius;
    let distance = right - particle.x;

    if (distance < 0) {
      fn(particle, tile, distance);
    }
  },

  [Tiles.TOP_LEFT](particle, tile, fn) {
    let distance = getDistance(particle, {
      x: tile.left,
      y: tile.top,
      radius: tile.radius,
    });

    if (distance < 0) {
      fn(particle, tile, distance);
    }
  },

  [Tiles.TOP_RIGHT](particle, tile, fn) {
    let distance = getDistance(particle, {
      x: tile.right,
      y: tile.top,
      radius: tile.radius,
    });

    if (distance < 0) {
      fn(particle, tile, distance);
    }
  },

  [Tiles.BOTTOM_LEFT](particle, tile, fn) {
    let distance = getDistance(particle, {
      x: tile.left,
      y: tile.bottom,
      radius: tile.radius,
    });

    if (distance < 0) {
      fn(particle, tile, distance);
    }
  },

  [Tiles.BOTTOM_RIGHT](particle, tile, fn) {
    let distance = getDistance(particle, {
      x: tile.right,
      y: tile.bottom,
      radius: tile.radius,
    });

    if (distance < 0) {
      fn(particle, tile, distance);
    }
  },

  [Tiles.TOP_LEFT_BOTTOM_RIGHT]() {
    detectors[Tiles.TOP_LEFT](...arguments);
    detectors[Tiles.BOTTOM_RIGHT](...arguments);
  },

  [Tiles.TOP_RIGHT_BOTTOM_LEFT]() {
    detectors[Tiles.TOP_RIGHT](...arguments);
    detectors[Tiles.BOTTOM_LEFT](...arguments);
  },

  [Tiles.LESS_TOP_LEFT](particle, tile, fn) {
    let distance = getDistance(particle, {
      x: tile.left,
      y: tile.top,
      radius: tile.radius - particle.radius * 2,
    });

    if (distance >= 0) {
      fn(particle, tile, distance);
    }
  },

  [Tiles.LESS_TOP_RIGHT](particle, tile, fn) {
    let distance = getDistance(particle, {
      x: tile.right,
      y: tile.top,
      radius: tile.radius - particle.radius * 2,
    });

    if (distance >= 0) {
      fn(particle, tile, distance);
    }
  },

  [Tiles.LESS_BOTTOM_LEFT](particle, tile, fn) {
    let distance = getDistance(particle, {
      x: tile.left,
      y: tile.bottom,
      radius: tile.radius - particle.radius * 2,
    });

    if (distance >= 0) {
      fn(particle, tile, distance);
    }
  },

  [Tiles.LESS_BOTTOM_RIGHT](particle, tile, fn) {
    let distance = getDistance(particle, {
      x: tile.right,
      y: tile.bottom,
      radius: tile.radius - particle.radius * 2,
    });

    if (distance >= 0) {
      fn(particle, tile, distance);
    }
  },
};

export const resolvers = {
  [Tiles.TOP](particle, tile) {
    let top = tile.middle + particle.radius;

    if (particle.y < top) {
      particle.y = top;
    }
  },

  [Tiles.BOTTOM](particle, tile) {
    let bottom = tile.middle - particle.radius;

    if (particle.y > bottom) {
      particle.y = bottom;
    }
  },

  [Tiles.LEFT](particle, tile) {
    let left = tile.center + particle.radius;

    if (particle.x < left) {
      particle.x = left;
    }
  },

  [Tiles.RIGHT](particle, tile) {
    let right = tile.center - particle.radius;

    if (particle.x > right) {
      particle.x = right;
    }
  },

  [Tiles.TOP_LEFT](particle, tile) {
    constrainBall(particle, {
      x: tile.left,
      y: tile.top,
      radius: tile.radius,
      mass: 0,
    });
  },

  [Tiles.TOP_RIGHT](particle, tile) {
    constrainBall(particle, {
      x: tile.right,
      y: tile.top,
      radius: tile.radius,
      mass: 0,
    });
  },

  [Tiles.BOTTOM_LEFT](particle, tile) {
    constrainBall(particle, {
      x: tile.left,
      y: tile.bottom,
      radius: tile.radius,
      mass: 0,
    });
  },

  [Tiles.BOTTOM_RIGHT](particle, tile) {
    constrainBall(particle, {
      x: tile.right,
      y: tile.bottom,
      radius: tile.radius,
      mass: 0,
    });
  },

  [Tiles.TOP_LEFT_BOTTOM_RIGHT]() {
    resolvers[Tiles.TOP_LEFT](...arguments);
    resolvers[Tiles.BOTTOM_RIGHT](...arguments);
  },

  [Tiles.TOP_RIGHT_BOTTOM_LEFT]() {
    resolvers[Tiles.TOP_RIGHT](...arguments);
    resolvers[Tiles.BOTTOM_LEFT](...arguments);
  },

  [Tiles.LESS_TOP_LEFT](particle, tile) {
    constrainChain(particle, {
      x: tile.left,
      y: tile.top,
      radius: tile.radius - particle.radius * 2,
      mass: 0,
    });
  },

  [Tiles.LESS_TOP_RIGHT](particle, tile) {
    constrainChain(particle, {
      x: tile.right,
      y: tile.top,
      radius: tile.radius - particle.radius * 2,
      mass: 0,
    });
  },

  [Tiles.LESS_BOTTOM_LEFT](particle, tile) {
    constrainChain(particle, {
      x: tile.left,
      y: tile.bottom,
      radius: tile.radius - particle.radius * 2,
      mass: 0,
    });
  },

  [Tiles.LESS_BOTTOM_RIGHT](particle, tile) {
    constrainChain(particle, {
      x: tile.right,
      y: tile.bottom,
      radius: tile.radius - particle.radius * 2,
      mass: 0,
    });
  },
};

export function createTilemap(options) {
  let { image, imageOffsets, map, size } = options;

  function collide(particles, fn) {
    for (let particle of particles) {
      let tile = getTileAt(particle.x, particle.y);
      let detect = tile && detectors[tile.type];

      if (!detect) {
        continue;
      }

      detect(particle, tile, fn);
    }
  }

  function constrain(particles) {
    for (let particle of particles) {
      let tile = getTileAt(particle.x, particle.y);
      let resolve = tile && resolvers[tile.type];

      if (!resolve) {
        continue;
      }

      resolve(particle, tile);
    }
  }

  function clear(ctx) {
    let rowCount = map.length - 1;
    let colCount = map[0].length - 1;
    let width = size * colCount;
    let height = size * rowCount;

    ctx.clearRect(0.1, 0.1, width - 0.2, height - 0.2);
  }

  function clearCorner(ctx, x, y) {
    clearTile(ctx, x, y);
    clearTile(ctx, x, y - 1);
    clearTile(ctx, x - 1, y);
    clearTile(ctx, x - 1, y - 1);
  }

  function clearTile(ctx, x, y) {
    ctx.clearRect(size * x, size * y, size, size);
  }

  function render(ctx, viewport) {
    let top = viewport.top;
    let bottom = viewport.bottom + size;
    let left = viewport.left;
    let right = viewport.right + size;

    let rowCount = map.length - 1;
    let colCount = map[0].length - 1;

    let minY = clamp(Math.floor(top / size), 0, rowCount);
    let maxY = clamp(Math.floor(bottom / size), 0, rowCount);
    let minX = clamp(Math.floor(left / size), 0, colCount);
    let maxX = clamp(Math.floor(right / size), 0, colCount);

    for (let y = minY; y < maxY; y++) {
      for (let x = minX; x < maxX; x++) {
        renderTile(ctx, x, y);
      }
    }
  }

  function renderCorner(ctx, x, y) {
    renderTile(ctx, x, y);
    renderTile(ctx, x, y - 1);
    renderTile(ctx, x - 1, y);
    renderTile(ctx, x - 1, y - 1);
  }

  function renderTile(ctx, x, y) {
    let tile = getTile(x, y);

    if (!tile) {
      return;
    }

    let offset = imageOffsets[tile.type];

    if (!offset) {
      return;
    }

    for (let i = 0; i < offset.length; i += 2) {
      ctx.drawImage(
        image,

        size * offset[i],
        size * offset[i + 1],
        size,
        size,

        size * x,
        size * y,
        size,
        size,
      );
    }
  }

  function getMap() {
    return map;
  }

  function setMap(value) {
    map.length = 0;
    map.push(...value);
  }

  function hasCorner(x, y) {
    let rowCount = map.length;
    let colCount = map[0].length;

    if (y < 0 || y + 1 > rowCount) {
      return false;
    }

    if (x < 0 || x + 1 > colCount) {
      return false;
    }

    return true;
  }

  function getCorner(x, y) {
    if (hasCorner(x, y)) {
      return map[y][x];
    }
  }

  function setCorner(x, y, value) {
    if (hasCorner(x, y)) {
      map[y][x] = typeof value === 'function' ? value(map[y][x]) : value;
    }
  }

  function hasTile(x, y) {
    let rowCount = map.length - 1;
    let colCount = map[0].length - 1;

    if (y < 0 || y + 1 > rowCount) {
      return false;
    }

    if (x < 0 || x + 1 > colCount) {
      return false;
    }

    return true;
  }

  function getTile(x, y) {
    if (!hasTile(x, y)) {
      return null;
    }

    let type = EMPTY;

    if (map[y][x]) {
      type += TOP_LEFT;
    }

    if (map[y][x + 1]) {
      type += TOP_RIGHT;
    }

    if (map[y + 1][x]) {
      type += BOTTOM_LEFT;
    }

    if (map[y + 1][x + 1]) {
      type += BOTTOM_RIGHT;
    }

    let radius = size / 2;
    let top = size * y;
    let middle = top + radius;
    let bottom = top + size;
    let left = size * x;
    let center = left + radius;
    let right = left + size;

    return {
      x,
      y,
      type,
      size,
      radius,
      top,
      middle,
      bottom,
      left,
      center,
      right,
    };
  }

  function getTileAt(x, y) {
    return getTile(Math.floor(x / size), Math.floor(y / size));
  }

  return {
    collide,
    constrain,
    clear,
    clearCorner,
    render,
    renderCorner,
    getMap,
    setMap,
    getCorner,
    setCorner,
  };
}
