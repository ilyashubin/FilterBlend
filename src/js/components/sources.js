import { helpers, nextArrayIndex, range } from '../helpers';

/**
 * Sources VM
 */

let sourcesData = {
  current: 0,
  color: 'white',
  preview: {
    width: 0,
    height: 0,
  },
  items: [
    {
      url: 'http://a629.phobos.apple.com/us/r30/Purple3/v4/d9/f0/0e/d9f00e8a-c409-efc0-5ec2-db34e8d42587/mzl.fmbbrygq.png',
      repeat: 'no-repeat',
      x: 70,
      y: 50,
      isCenter: true,
      size: 'auto',
      imgSize: {
        width: 0,
        height: 0,
        aspectRatio: 1,
      },
      hidden: false,
    },
    {
      url: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/83029FC2F1.jpg',
      repeat: 'no-repeat',
      x: 50,
      y: 50,
      isCenter: true,
      size: 'auto',
      imgSize: {
        width: 0,
        height: 0,
        aspectRatio: 1,
      },
      hidden: false,
    },
  ],
};

export default Vue.extend({
  data() { return sourcesData; },
  template: '#sources',
  props: ['str'],
  methods: {

    /**
     * Helpers
     */
    setCentredCoordinates(item) {
      if (!item.isCenter) return;

      if (item.size == 'auto') {
        item.x = (this.preview.width - item.imgSize.width) / 2;
        item.y = (this.preview.height - item.imgSize.height) / 2;
      } else {
        item.x = (this.preview.width - (this.preview.width * item.size / 100)) / 2;
        item.y = (this.preview.height - (this.preview.width * item.size / item.imgSize.aspectRatio / 100)) / 2;
      }

      item.x = Math.round(item.x);
      item.y = Math.round(item.y);
    },

    /**
     * Switch current background (which we can drag on canvas)
     */
    switchSelected(index) {

      if (typeof index == 'number') {
        this.current = index;
        return;
      }

      let nextInd = nextArrayIndex(this.items, this.current);

      if (this.items[nextInd].hidden) return;
      else this.current = nextInd;
    },

    /**
     * Image repeat handler
     */
    repeatClick(item) {
      item.repeat = item.repeat == 'repeat' ? 'no-repeat' : 'repeat';
    },

    /**
     * Image position handlers
     */
    positionClick(item) {
      item.isCenter = true;
      this.centerBackground(item);
    },
    positionDrag(e, item) {
      item = item || this.items[this.current];
      let incX = item.x;
      let incY = item.y;
      let originX = e.pageX;
      let originY = e.pageY;

      helpers.drag((evt)=> {
        item.isCenter = false;

        item.x = incX + (evt.pageX - originX);
        item.y = incY + (evt.pageY - originY);
      });
    },

    /**
     * Image size handlers
     */
    sizeClick(item) {
      item.size = 'auto';
      this.setCentredCoordinates(item);
    },
    sizeDrag(item, e) {
      // calculate image width in percents from its original size
      let startingPoint = range.lower(Math.round(item.imgSize.width * 100 / this.preview.width), 100);
      // set starting drag point
      let curr = item.size == 'auto' ? startingPoint : item.size;
      let originY = e.clientY;

      helpers.drag((evt)=> {
        item.size = range.between((curr - (evt.pageY - originY)), 0, 100);
        this.setCentredCoordinates(item);
      });
    },

    /**
     * Hide background
     */
    hide(index) {
      let item = this.items[index];
      if (item.hidden) {
        this.items[index].hidden = false;
        return;
      }
      this.items.forEach((el)=> {el.hidden = false});
      this.items[index].hidden = true;

      if (this.current == index)
        this.current = nextArrayIndex(this.items, this.current);
    },

    /**
     * Image dimensions and positioning handlers
     */
    centerBackground(items, onResize) {
      if (!Array.isArray(items)) items = [items];
      items.forEach((item)=> {
        if (onResize && !item.isCenter) return;
        item.isCenter = true;
        this.setCentredCoordinates(item);
      });
    },
    getBackgroundSize(items) {
      let self = this;
      if (!Array.isArray(items)) items = [items];
      items.forEach((item)=> {
        let img = new Image();
        img.onload = function() {
          item.imgSize.width = this.width;
          item.imgSize.height = this.height;
          item.imgSize.aspectRatio = this.width / this.height;
          self.centerBackground(item);
        }
        img.src = item.url;
      });
    },

    /**
     * Handle local image uploading
     */
    readURL(e) {
      let item = e.targetVM;
      let input = e.target;
      let self = this;

      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
          item.url = e.target.result;
          self.getBackgroundSize(item);
        }

        reader.readAsDataURL(input.files[0]);
      }
    },

    /**
     * Calculate background styles for main VM
     */
    compileStyle() {
      let s = '';
      for (let i = 0, len = this.items.length; i < len; i++) {
        let curr = this.items[i];
        if (curr.hidden) continue;
        let x = curr.isCenter ? 'center' : curr.x + 'px';
        let y = curr.isCenter ? 'center' : curr.y + 'px';
        let size = curr.size == 'auto' ? 'auto' : curr.size + '%';
        s +=
          `url('${curr.url}')
           ${curr.repeat}
           ${x}
           ${y} / ${size}`;
        if (i !== len-1) s += ', ';
      }
      this.str = `background: ${s};`;
    },
  },
  watch: {
    '$data': {
      deep: true,
      handler() { this.compileStyle(); },
    }
  },
  ready() {
    let $preview = $('.preview');
    this.getBackgroundSize(this.items);

    $(window).on('resize', ()=> {
      this.preview.width = $preview.outerWidth();
      this.preview.height = $preview.outerHeight();
      this.centerBackground(this.items, true);
    }).trigger('resize');

    this.compileStyle();
  },
});
