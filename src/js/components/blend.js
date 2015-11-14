/**
 * Blend Mode VM
 */

let data = {
  current: 6,
  values: [
    'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
    'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference',
    'exclusion', 'hue', 'saturation', 'color', 'luminosity'
  ],
};

export default {
  data() { return data; },
  template: '#blend',
  props: ['str'],

  methods: {

    reset() {
      this.current = 0;
    },

    compileStyle() {
      this.str = `background-blend-mode: ${this.values[this.current]}; `;
    },
  },

  watch: {
    'current'() {this.compileStyle()}
  },

  ready() {this.compileStyle()},
};
