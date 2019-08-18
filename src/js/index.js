import '../css/demo1.scss';
import '../css/demo2.scss';
import '../css/demo3.scss';

if (CSS.paintWorklet) {
  CSS.paintWorklet.addModule('./demo1.min.js');
  CSS.paintWorklet.addModule('./demo2.min.js');
  CSS.paintWorklet.addModule('./demo3a.min.js');
  CSS.paintWorklet.addModule('./demo3b.min.js');
  CSS.paintWorklet.addModule('./demo3c.min.js');
  CSS.paintWorklet.addModule('./demo3d.min.js');
} else {
  import(/* webpackChunkName: "css-paint-polyfill" */ 'css-paint-polyfill').then(() => {
    CSS.paintWorklet.addModule('./demo1.min.js');
    CSS.paintWorklet.addModule('./demo2.min.js');
    CSS.paintWorklet.addModule('./demo3a.min.js');
    CSS.paintWorklet.addModule('./demo3b.min.js');
    CSS.paintWorklet.addModule('./demo3c.min.js');
    CSS.paintWorklet.addModule('./demo3d.min.js');
  });
}
