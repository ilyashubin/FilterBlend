import { helpers, range } from '../helpers';

/**
 * Filters VM
 */

let filtersData = {
  filters: [
    {
      name: 'saturate',
      enabled: false,
      value: {
        current: 2.5,
        measure: '',
        pace: 0.5,
        step: 0.1,
        min: 0,
        max: 100,
      },
    },
    {
      name: 'grayscale',
      enabled: false,
      value: {
        current: 0.5,
        measure: '',
        step: 0.01,
        min: 0,
        max: 1,
      },
    },
    {
      name: 'sepia',
      enabled: false,
      value: {
        current: 0.5,
        measure: '',
        step: 0.01,
        min: 0,
        max: 1,
      },
    },
    {
      name: 'brightness',
      enabled: false,
      value: {
        current: 1,
        measure: '',
        step: 0.01,
        min: 0,
        max: 10,
      },
    },
    {
      name: 'contrast',
      enabled: false,
      value: {
        current: 1,
        measure: '',
        step: 0.1,
        min: 0,
        max: 10,
      },
    },
    {
      name: 'hue-rotate',
      enabled: false,
      value: {
        current: 60,
        measure: 'deg',
        step: 1,
        min: 0,
        max: 360,
      },
    },
    {
      name: 'invert',
      enabled: false,
      value: {
        current: 0.5,
        measure: '',
        step: 0.01,
        min: 0,
        max: 1,
      },
    },
    {
      name: 'opacity',
      enabled: false,
      value: {
        current: 0.5,
        measure: '',
        step: 0.01,
        min: 0,
        max: 1,
      },
    },
    {
      name: 'blur',
      enabled: false,
      value: {
        current: 5,
        measure: 'px',
        step: 0.1,
        min: 0,
        max: 100,
      },
    },
  ],
};

export default Vue.extend({
  data() { return filtersData; },
  template: '#filters',
  props: ['str'],
  methods: {

    /**
     * Drag filter value with certain step
     */
    drag(item, e) {
      let curr = item.value.current;
      let originY = e.clientY;

      helpers.drag(function(evt) {
        item.enabled = true;

        item.value.current = Math.round((curr - (evt.pageY - originY) *
          item.value.step) * 10) / 10;
        // value should be in min/max range
        item.value.current = range.between(item.value.current, item.value.min, item.value.max);
      });
    },

    /**
     * Reset all filters
     */
    reset() {
      this.filters.forEach((el)=> el.enabled = false );
    },

    /**
     * Calculate filters styles for main VM
     */
    compileStyle() {
      let s = '';
      let enabled = 0;
      for (let i = 0, len = this.filters.length; i < len; i++) {
        let curr = this.filters[i];
        if (!curr.enabled) continue;
        enabled++;
        s += `${curr.name}(${curr.value.current}${curr.value.measure}) `;
      }
      if (!enabled) s += 'none';
      this.str = `-webkit-filter: ${s};`;
      this.str += `filter: ${s};`;
    },
  },
  watch: {
    'filters': {
      deep: true,
      handler() {this.compileStyle();},
    }
  },
  ready() {this.compileStyle();},
});
