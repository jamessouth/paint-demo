import '../css/main.scss';

if (CSS.paintWorklet) {
  CSS.paintWorklet.addModule('./demo.min.js');
} else {
  import(/* webpackChunkName: "css-paint-polyfill" */ 'css-paint-polyfill').then(() => CSS.paintWorklet.addModule('./demo.min.js'));
}
