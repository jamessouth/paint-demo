import '../css/main.scss';

if (CSS.paintWorklet) {

  import(/* webpackChunkName: "paint-worklet" */ './demo').then((demo) => CSS.paintWorklet.addModule(demo));


  // CSS.paintWorklet.addModule('./demo.min.js');
} else {
  import(/* webpackChunkName: "css-paint-polyfill" */ 'css-paint-polyfill').then(() => CSS.paintWorklet.addModule('./demo.min.js'));
}
