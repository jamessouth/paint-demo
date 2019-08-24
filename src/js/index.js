const demo1 = document.querySelector('.bg');
const demo2 = document.querySelector('.border');
const demo3 = document.querySelector('.shape');
const demo4 = document.querySelector('.cache');


// import '../css/demo1.scss';
// import '../css/demo2.scss';
// import '../css/demo3.scss';
// import '../css/demo4.scss';

if (CSS.paintWorklet) {
  // switch (demo) {
  //   case demo1:
  //     CSS.paintWorklet.addModule('./demo1.min.js').then(import(/* webpackChunkName: "demo1scss" */ '../css/demo1.scss'));
  //   case demo4:
  //     CSS.paintWorklet.addModule('./demo4.min.js').then(import(/* webpackChunkName: "demo4scss" */ '../css/demo4.scss'));
  //
  // }
  // CSS.paintWorklet.addModule('./demo2.min.js');
  // CSS.paintWorklet.addModule('./demo3a.min.js');
  // CSS.paintWorklet.addModule('./demo3b.min.js');
  // CSS.paintWorklet.addModule('./demo3c.min.js');
  // CSS.paintWorklet.addModule('./demo3d.min.js');
  // CSS.paintWorklet.addModule('./demo4.min.js');
} else {
  import(/* webpackChunkName: "css-paint-polyfill" */ 'css-paint-polyfill').then(() => {
    switch (demo) {
      case demo1:
        CSS.paintWorklet.addModule('./demo1.min.js').then(import(/* webpackChunkName: "demo1scss" */ '../css/demo1.scss'));
      case demo4:
        CSS.paintWorklet.addModule('./demo4.min.js').then(import(/* webpackChunkName: "demo4scss" */ '../css/demo4.scss'));

    }


    // CSS.paintWorklet.addModule('./demo1.min.js');
    // CSS.paintWorklet.addModule('./demo2.min.js');
    // CSS.paintWorklet.addModule('./demo4.min.js');
  });
}

// console.log(demo1, demo4);
// if (demo4) {
//   console.log('4');
// } else {
//   console.log('1');
// }
