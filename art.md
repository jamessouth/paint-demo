---
title: Generative Element Backgrounds with the CSS Paint (Houdini) API
published: false
description: Using JS to draw whatever we want, wherever a CSS property takes an image
tags: CSS, JavaScript, Paint, Houdini
---

With the new CSS Paint API (aka Houdini, presumably named after the Melvins album  🤘😁), we can use most of the HTML Canvas drawing methods to draw anything we want and use it in any CSS property that takes an image.  Today I want to show how I used Houdini in my newly rebuilt portfolio site* to generate border images and speech-bubble-shaped divs.  I will also cover using the polyfill, using Houdini with webpack and Babel, and some of the snags you might hit along the way.
*<small>Not currently polyfilled - you will see a fallback unless you view it with Chrome</small>

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
// polyfill doesn't work if you use paint more than once a stylesheet 😢 so demo3 is Chrome only
  });
}
```
##Generating a page's background


So let's start with generating a page's background.  Demo 1 is live here*.  Some simple HTML:
```html
  <!--index1.html -->
  <body>
    <div class="bg">
      <div>a</div>
      <div>b</div>
      ...
      <div>n</div>
    </div>
  </body>
```
*<small>Note: the polyfill does not always run - you may need to reload a few times</small>

If the polyfill doesn't run, you will see the background-color on the body.  The polyfill works by creating an image, so if you resize or re-orient, you will get repeats or cut-offs of the original image formed when the page loaded.  Repeats can be prevented with `background-repeat` set to `no-repeat`; you will just see the background-color on the body.  Since Chrome has some native support for Houdini, when you resize or re-orient, the worklet runs again and redraws to fit the new dimensions, so watch out for that if you write a complex paint function.

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

In our worklet class we can create static helper methods for use in the `paint` method, where we do our drawing.  The `paint` method takes 1 to 4 arguments: the canvas context (`ctx`) on which you call the drawing methods, the dimensions of the element you are drawing on, which we can just destructure as `{ width, height }`, `props` which gives you access to CSS custom properties, and lastly an `args` array that holds arguments passed in when you call the paint worklet from CSS, like `paint(workletName, arg1, arg2)`.  As of right now there is no support anywhere for args 😭.
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
Now we are ready to build!  As far as I can tell, the Worklet interface only accepts ES6 classes, so a transpiled-to-ES5-function worklet doesn't work, and neither does a class wrapped in a function by webpack (if there's a way to just minify in webpack please answer my question on SO).  So, I have been processing them outside of webpack.  This works fine but makes iterating in development a little slower.  Install the `babel-minify` package as a dev dependency, then in package.json minify your worklet files and place them in your dist folder:
```
  //package.json
  "scripts": {
    "lint": "eslint ./src/js",
    "dev": "webpack-dev-server",
    "build": "webpack",
    "prebuild": "rm -f dist/demo.min.js && npx minify src/js/demo.js --out-file dist/demo.min.js..."
// && minify the other worklets etc...
  }
```
In my webpack config, I use the `CleanWebpackPlugin` and delete everything except the minified worklet files:
```javascript
  //webpack.config.js
  plugins: [
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: [
      '**/*',
      '!demo1.min.js',
      '!demo2.min.js',
      '!demo3a.min.js',
      '!demo3b.min.js',
      '!demo3c.min.js',
      '!demo3d.min.js',
    ] }),
```
To develop the worklet I then copy it to the `dist` folder and name it `demo.min.js` since that is the name I'm using elsewhere.  Now when I start `webpack-dev-server`, `/dist` is wiped except for the worklet and the development workflow is normal except for having to manually refresh the browser to reflect a change to the worklet.  When you are done, copy the worklet back to source (renaming to `demo.js`) and build for production.  The prebuild script will minify the worklet and webpack will take care of the rest!

##Generating border images

Demo 2 has a similar structure to Demo 1, just some dummy content:
```html
  //index2.html
  <body class="border">
    <div>a</div>
    <div>b</div>
    <div>c</div>
    <div>d</div>
  </body>
```
It is styled similarly except we are using Houdini to generate border images:
```scss
//demo2.scss
.border{
  min-height: 100vh;
  width: 100%;
  background-color: #efefef;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(284px, 1fr));
}
.border div{
  width: 200px;
  height: 200px;
  background-color: coral;
  margin: 1em auto;
  text-align: center;
  font-size: 3em;
  --lines: 343;
  border-image: 82 / 42px / 14;
  border-image-source: linear-gradient(blue, blue);//fallback
  border-image-source: paint(demo2);
  border-style: solid;
}
```
Just drawing a bunch of lines that form the image we set as the border image source:
```javascript
class Demo2 {
  static get inputProperties() { return ['--lines']; }//CSS custom prop

  //static methods omitted but they all just return random numbers

  paint(ctx, { width, height }, props) {
    const lines = props.get('--lines');

    for (let i = 0; i < lines; i += 1) {
      const start = Demo2.getRandomPoint(width, height);
      const end = Demo2.getRandomPoint(width, height);
      ctx.beginPath();
      ctx.moveTo(...start);
      ctx.lineTo(...end);
      ctx.lineWidth = Demo2.getWidth();
      ctx.lineCap = 'square';
      ctx.strokeStyle = `rgba(${Demo2.getColor(36, 150)}, ${Demo2.getColor(108, 150)}, ${Demo2.getColor(12, 200)}, ${Demo2.getTransparency()})`;
      ctx.stroke();
    }
  }
}
registerPaint('demo2', Demo2);
```
##Generating arbitrarily-shaped elements

Lastly, we can use Houdini to carve any shape out of a div with the `mask-image` property.  Any element we do this to will still occupy a rectangle in the CSS box model of course, but within its box we can achieve any look we want.  For this third demo, I went a little crazy:  I re-created the POP! explosion lithograph Roy Lichtenstein made for the cover of the April 25, 1966 issue of *Newsweek*.  This one only works in Chrome because the polyfill does not like multiple `paint` values in a single stylesheet.
```html
  <!--index3.html -->
  <body class="shape">
    <div id="pop">
      <p><span>P</span><span>O</span>P</p>
    </div>
    <div id="expt"></div>
    <div id="blue"></div>
    <div id="outline"></div>
  </body>
```
In the body we have divs for the blue cloud, its outline, the red/white/yellow explosion with the word POP, and the exclamation point.  I'll link to the repo here and just show the styles for applying a mask image:
```scss
//demo3.scss
#outline{
  background-color: #282a2c; // color the div
  -webkit-mask-image: paint(demo3d); // describe what shape we want to see
  mask-image: paint(demo3d);
}
```

```javascript
//demo3d.js
class Demo3d {
  paint(ctx, { width, height }, props) {
    const yoff = -25;
    const xoff = 35;
    ctx.beginPath();
    ctx.moveTo(121 + xoff, 131 + yoff);
    ctx.bezierCurveTo(163 + xoff, 64 + yoff, 178 + xoff, 98 + yoff, 171 + xoff, 111 + yoff);

    // lots of bezier curves...

    ctx.lineWidth = '4';
    ctx.stroke();
  }
}
registerPaint('demo3d', Demo3d);
```
To help draw these shapes I used this tool which generates the draw instructions and adds the x- and y-offsets, which I then used to position the shape within the div.  As you can see, drawing a mask is the same as just drawing an image and in this case isn't totally necessary, I just wanted a cool demonstration of masking 😜.  
