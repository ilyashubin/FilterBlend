/**
 * Output VM
 */

export default {
  template: '#output',
  props: ['str'],
  watch: {
    'str'() {
      Vue.nextTick(this.highlight);
    },
  },
  ready() {
    this.highlight = highlight();
  },
};

function highlight() {
  let $outputBody = document.querySelector('.language-css');
  return function() {
    Prism.highlightElement($outputBody);
  }
}
