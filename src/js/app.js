import { helpers } from 'helpers';

import Sources from './components/sources';
import Blend from './components/blend';
import Filters from './components/filters';
import Picker from './components/picker';
import Output from './components/output';

/**
 * Main VM
 */

let data = {
  backgroundStr: '',
  blendStr: '',
  filterStr: '',
  color: 'transparent',
};

let main = new Vue({
  data,
  el: '#app',

  computed: {
    previewStyle() {
      let s = '';

      s += this.blendStr;
      s += this.backgroundStr;
      s += `-webkit-${this.filterStr}`;
      s += this.filterStr;
      s += `background-color: ${this.color};`;

      return s;
    },
    outputStr() {
      return this.blendStr + '\n' + this.filterStr;
    }
  },

  methods: {
    handleEvents(e) {
      let methodsMap = {
        'mousedown': 'changePosition',
        'click': 'switchSelected',
        'wheel': 'changeSize',
      };

      let method = methodsMap[e.type];

      method && this.$refs.sources[method].apply(this, arguments);
    }
  },

  components: {
    'sources': Sources,
    'blend': Blend,
    'filters': Filters,
    'picker': Picker,
    'output': Output,
  },

  ready: postBind,
});

function postBind() {
  let $win = $(window);

  $('.preview__screen').on('mousedown click wheel', (e)=> {
    this.handleEvents(e.originalEvent);
  });

  $(document).on('focus', 'input', function() {
    setTimeout(this.select.bind(this), 50);
  });

  $win.on('mouseup', function() {
    $win.off('mousemove.fb');
    helpers.toggleDragOverlay(false);
  });

  /**
   * Custom scrollbar
   */
  $(".nano").nanoScroller({
    iOSNativeScrolling: true,
    alwaysVisible: true,
    sliderMaxHeight: 450,
  });

  /**
   * Hint popup
   */
  let isHintClosed = localStorage.getItem('isHintClosed');
  if (!isHintClosed) {
    let $hintBody = $('.js-hint').addClass('is-visible');

    $hintBody.on('click', function() {
      $hintBody.removeClass('is-visible');
      localStorage.isHintClosed = true;
    });
  }

  /**
   * Twitter share window
   */
  $('.share').click(function() {
    var width  = 575,
        height = 400,
        left   = ($(window).width()  - width)  / 2,
        top    = ($(window).height() - height) / 2,
        url    = this.href,
        opts   = 'status=1' +
                 ',width='  + width  +
                 ',height=' + height +
                 ',top='    + top    +
                 ',left='   + left;

    window.open(url, 'twitter', opts);

    return false;
  });

}
