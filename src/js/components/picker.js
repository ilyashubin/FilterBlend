
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
    }
  },
  ready: initEvents,
});

function initEvents() {

  /**
   * Close colorpicker popup
   * on document click
   */
  let self = this;
  $(document).on('click', function(e) {
    if ($(e.target).closest('.picker').length)
      return;
    self.close();
  });

}
