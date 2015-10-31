
/**
 * Picker VM
 */

let filtersData = {
  presets: ['#fff', '#2b2a2f', '#e45353', '#58cb6b', 'transparent'],
  opened: false,
  current: 'red',
};

export default Vue.extend({
  data() { return filtersData; },
  template: '#picker',
  props: ['color'],
  methods: {
    open() {
      this.opened = !this.opened;
    },
    close() {
      this.opened = false;
    },
    compileStyle() {
      // this.color = this.current;
    },
  },
  watch: {
    'current': {
      deep: true,
      handler() {this.compileStyle();},
    }
  },
  ready() {
    this.compileStyle();
    initEvents.call(this);
  },
});

function initEvents() {

  /**
   * Close colorpicker popup on document click
   */
  let self = this;
  $(document).on('click', function(e) {
    if ($(e.target).closest('.picker').length)
      return;
    self.close();
  });

}
