import { helpers } from 'helpers';

import Sources from './components/sources';
import Blend from './components/blend';
import Filters from './components/filters';
import Picker from './components/picker';

/**
 * Main VM
 */

let mainData = {
  backgroundStr: '',
  blendStr: '',
  filtersStr: '',
  color: 'transparent',
};

let main = new Vue({
  el: '.container__app',
  data: mainData,
  computed: {
    previewStyle() {
      let style = '';

      style += this.blendStr;
      style += this.backgroundStr;
      style += this.filtersStr;

      return style;
    },
  },
  components: {
    'filterblend-sources': Sources,
    'filterblend-blend': Blend,
    'filterblend-filters': Filters,
    'filterblend-picker': Picker,
  },
  ready: initEvents,
});

function initEvents() {

  let $win = $(window);

  $('input').on('focus', function() {
    setTimeout(this.select.bind(this), 50);
  });

  $win.on('mouseup', function() {
    $win.off('mousemove.filt');
    helpers.toggleDragOverlay(false);
  });

  $(".nano").nanoScroller({
    iOSNativeScrolling: true,
    alwaysVisible: true,
    sliderMaxHeight: 450,
  });

}
