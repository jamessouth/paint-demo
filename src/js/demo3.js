class Demo3 {





//   function drawShape(ctx, xoff, yoff) {
//   ctx.beginPath();
//   ctx.moveTo(193, 180);
//   ctx.bezierCurveTo(187, 174, 216, 162, 221, 183);
//   ctx.bezierCurveTo(215, 188, 199, 193, 193, 182);
//   ctx.stroke();
// }
//
// function drawShape(ctx, xoff, yoff) {
//   ctx.beginPath();
//   ctx.moveTo(242, 180);
//   ctx.bezierCurveTo(248, 159, 285, 173, 278, 180);
//   ctx.bezierCurveTo(269, 195, 240, 189, 241, 180);
//   ctx.stroke();
// }




  paint(ctx, { width, height }, props) { // eslint-disable-line
    ctx.beginPath();
    ctx.moveTo(191, 120);
    ctx.bezierCurveTo(175, 124, 224, 81, 280, 120);
    ctx.bezierCurveTo(293, 129, 304, 147, 298, 144);
    ctx.bezierCurveTo(310, 163, 308, 192, 309, 185);
    ctx.bezierCurveTo(308, 170, 293, 234, 306, 243);
    ctx.bezierCurveTo(253, 301, 227, 271, 229, 280);
    ctx.bezierCurveTo(220, 273, 204, 255, 198, 247);
    ctx.bezierCurveTo(181, 238, 183, 127, 188, 135);
    ctx.fill('evenodd');
    ctx.stroke();

  }
}
registerPaint('demo3', Demo3); // eslint-disable-line
