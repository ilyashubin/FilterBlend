
/**
 * Helpers
 */

var helpers = {
  toggleDragOverlay: function(bool) {
    $('.drag-overlay').toggle(bool);
  },
  drag: function(func) {
    $(window).on('mousemove.filt', function() {
      helpers.toggleDragOverlay(true);
      func.apply(this, arguments);
    });
  },
};

/**
 * Cycle through array indexes
 */
var nextArrayIndex = function(arr, ind) {
  return ind == arr.length - 1 ? 0 : ind + 1;
};

/**
 * Set min/max boundaries for number
 */
var range = {
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
