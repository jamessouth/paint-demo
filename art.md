generative element backgrounds with css paint

with the new css paint api (aka houdini) we can use the full array of html canvas drawing methods (or at least a lot of them) to draw anything we want and use it in any CSS property that takes an image.  today i want to show how i used houdini in my newly rebuilt portfolio site to create generative border images and speech-bubble shaped divs.  i will cover using houdini with webpack and babel and how to get past all the snags i hit while making the following demos.  note that i am not currently polyfilling houdini in my portfolio site so the css paint stuff will only work in chrome.

The basics of using houdini are the following:  for any css property that takes an image, such as background-image, put `paint(workletName)` as the value.  in a js file, create a class for your worklet.  at the bottom of the file, call the `registerPaint` method with the `workletName` and the class name.  then, in your main js, or since we're using webpack, our entry point, feature detect for `CSS.paintWorklet`.  if it's there, which right now is only in chrome, call  `CSS.paintWorklet.addModule('./myWorkletClassFile.js')`; otherwise, after `npm i -S css-paint-polyfill`, we can dynamically import the polyfill, then call `addModule`.  now we are ready to develop our class and create our generated art!

in our worklet class we can create static helper methods for use in the `paint` method, where we do our drawing.  The `paint` method takes 1 to 4 arguments: the context (`ctx`) on which you call the drawing methods, the dimensions of the element you are drawing on, which we can just destructure as `{ width, height }`, `props` which gives you access to CSS custom properties, and lastly an `args` array that holds arguments passed in when you call the paint worklet from CSS.

class won't bundle if not imported
won't run if transpiled
no luck excluding from babel

css custom properties don't work on body
pseudo element workaround but doesn't work with polyfill
div covering viewport works
polyfilled browsers don't redraw on resize except chrome