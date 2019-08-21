---
title: Generative Element Backgrounds with the CSS Paint (Houdini) API
published: false
description: Using JS to draw whatever we want, wherever a CSS property takes an image
tags: CSS, JavaScript, Paint, Houdini
---

With the new CSS Paint API (aka Houdini, presumably named after the Melvins album 😁), we can use the full array of HTML Canvas drawing methods (or at least a lot of them) to draw anything we want and use it in any CSS property that takes an image.  Today I want to show how I used Houdini in my newly rebuilt portfolio site* to create generative border images and speech-bubble-shaped divs.  I will also cover using Houdini with webpack and Babel and some of the snags you might hit along the way.
*<small>Not currently polyfilled - you will see a fallback unless you view it with Chrome.</small>

The basics of using Houdini are as follows:  for any CSS property that takes an image, such as background-image, enter `paint(workletName)` as the value.  In a JS file, create a class for your worklet.  At the bottom of the file, call the `registerPaint` method with the `workletName` and the class name as the arguments.  Then, in your main JS file or webpack entry point, feature detect for `CSS.paintWorklet`.  If it's there, which right now is only in Chrome, call `CSS.paintWorklet.addModule('./myWorkletClassFile.js')`; otherwise, after `npm i -S css-paint-polyfill`, we can dynamically import the polyfill so it will be a separate webpack chunk, then call `addModule`.  Now we are ready to develop our class and generate some art!

```javascript
//index.js, webpack entry point
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
```
##Generating a page's background


So let's start with generating a page's background.  Demo 1 is live here.
```html
  //index1.html
  <body>
    <div class="bg">
      <div>a</div>
      <div>b</div>
      ...
      <div>n</div>
    </div>
  </body>
```
Note that the polyfill doesn't always run, and when it doesn't, you just get the background-color on the body, so it might take a few reloads to load properly.  Also, the polyfill works by creating an image, so if you resize or re-orient, you will get repeats or cut-offs of the original image from when the page loaded.  Repeats can be prevented with `background-repeat` set to `no-repeat`; you will just see the background-color on the body.  Since Chrome has some native support for Houdini, when you resize or re-orient, the worklet runs again and redraws to fit the new dimensions, so watch out for that if you write a complex paint function.

The fake placeholder content is in a div that covers the page which will hold the painted background.  This is a workaround for this bug in Chrome which breaks CSS custom properties set on the `body` (also apparently `html` and `:root`), at least with regard to accessing them in a paint worklet.  The CSS is :
```scss
//demo1.scss
.bg{
  --stars: 522;
  min-height: 100vh;
  width: 100%;
  background-image: linear-gradient(black, black);//fallback if paint not supported or polyfilled
  background-image: paint(demo1);//calling paint with demo worklet
  overflow-x: hidden;//discovered by accident but polyfill doesn't work without it,
  //or perhaps other properties, being present
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}
.bg div{
  width: 200px;
  height: 200px;
  background-color: coral;
  margin: 1em auto;
  text-align: center;
  font-size: 3em;
}
```
A second workaround for the Chrome bug is to use pseudo-content on the body, but then the polyfill doesn't work.  A third workaround would be to set custom properties on the body anyway, then in the worklet, test for the presence of props, and if they're not there, as will be the case with Chrome, set a default value.  Anyway, let's get to the worklet!

In our worklet class we can create static helper methods for use in the `paint` method, where we do our drawing.  The `paint` method takes 1 to 4 arguments: the canvas context (`ctx`) on which you call the drawing methods, the dimensions of the element you are drawing on, which we can just destructure as `{ width, height }`, `props` which gives you access to CSS custom properties, and lastly an `args` array that holds arguments passed in when you call the paint worklet from CSS, like `paint(workletName, arg1, arg2)`.  As of right now there is no support anywhere for args 😢.
```javascript
//demo1.js
class Demo1 {
  static get inputProperties() { return ['--stars']; }//access CSS custom property

  //static methods omitted but they all just return random numbers

  paint(ctx, { width, height }, props) {
    const stars = props.get('--stars');//use CSS custom property

    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, width, height);//cover all of element

    for (let i = 0; i < stars; i += 1) {//populate stars on black background
      ctx.fillStyle = `rgba(255, 255, 255, ${Demo.getTransparency()})`;//hsla not working in Edge
      ctx.fillRect(Demo.getDistAlongSide(width), Demo.getDistAlongSide(height), 1, 1);
    }

    const ctr = [//all lines start halfway across, just below bottom
      width / 2,
      height + 2,
    ];

    for (let i = 0; i < 700; i += 1) {
      const startSide = i % 4;
      const endSide = (startSide + Demo.getEndSide()) % 4;
      ctx.beginPath();
      ctx.moveTo(...ctr);//spread coordinates as two args
      ctx.lineTo(...Demo.getPoint(endSide, width, height));
      ctx.lineWidth = Demo.getWidth();
      ctx.lineCap = 'square';
      ctx.strokeStyle = `rgba(${Demo.getColor(240, 15)},
        ${Demo.getColor(240, 15)},
        ${Demo.getColor(50, 20)},
        .05)`;//use high opacity for a Roy Lichtenstein/pop-art look
      ctx.stroke();
    }
  }
}
registerPaint('demo1', Demo1);//called with worklet name and class name
```
Now we are ready to build!  As far as I can tell, the Worklet interface only accepts ES6 classes, so a transpiled-to-ES5-function worklet doesn't work, and neither does a class wrapped in a function by webpack (if there's a way to just minify in webpack please answer my question on SO).  So, I have been processing them outside of webpack.  This works fine but makes iterating in development a little slower.  Install the `babel-minify` package as a dev dependency, then in package.json minify it and place in your dist folder:
```
  //package.json
  "scripts": {
    "lint": "eslint ./src/js",
    "dev": "webpack-dev-server",
    "build": "webpack",
    "prebuild": "rm -f dist/demo.min.js && npx minify src/js/demo.js --out-file dist/demo.min.js"
  }
```
In my webpack config, I use the `CleanWebpackPlugin` and delete everything except `demo.min.js`.  To develop the worklet I then copy it to the `dist` folder and name it `demo.min.js`.  Now when I start `webpack-dev-server`, `/dist` is wiped except for the worklet and the development workflow is normal except for having to manually refresh the browser to reflect a change to the worklet.  When you are done, copy the worklet back to source (renaming appropriately) and build for production.  The prebuild script will minify the worklet and webpack will take care of the rest!
