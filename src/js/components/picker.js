
/**
 * Picker VM
 */

let data = {
  presets: ['#fff', '#2b2a2f', '#e45353', '#58cb6b', 'transparent'],
};

export default {
  data() { return data; },
  template: '#picker',
  props: ['color'],
};
