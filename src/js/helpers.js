
/**
 * Helpers
 */

let $win = $(window);
let $dragOverlay = $('.drag-overlay');

export let helpers = {

  toggleDragOverlay(bool, vert) {
    $dragOverlay.css('cursor', vert ? 'ns-resize' : 'move').toggle(bool);
  },

  drag(func, isVertical = false) {
    $win.on('mousemove.fb', function() {
      helpers.toggleDragOverlay(true, isVertical);
      func.apply(this, arguments);
    });
  },

};

/**
 * Load image with callback
 */
export function loadImage(src, cb) {
  let img = new Image();
  img.onload = cb;
  img.src = src;
};

/**
 * Cycle through array indexes
 */
export function travelArray(arr, ind) {
  return ind == arr.length - 1 ? 0 : ind + 1;
};

/**
 * Set min/max number range
 */
export let range = {
  bigger(val, upper) {
    return Math.max(val, upper);
  },
  lower(val, lower) {
    return Math.min(val, lower);
  },
  between(val, min, max) {
    return Math.max(Math.min(val, max), min);
  },
};
