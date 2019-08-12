class Demo2 {
  static get inputProperties() { return ['--lines']; }

  static getRandomPoint(width, height) {
    return [
      Math.floor(Math.random() * (width + 1)),
      Math.floor(Math.random() * (height + 1)),
    ];
  }

  static getWidth() {
    return Math.floor(Math.random() * 30) + 1;
  }

  static getColor(base, range) {
    return base + Math.floor(Math.random() * range + 1);
  }

  static getTransparency() {
    return Math.floor(Math.random() * 101) / 100;
  }


  function drawShape(ctx, xoff, yoff) {
    ctx.beginPath();
    ctx.moveTo(191 + xoff, 120 + yoff);
    ctx.bezierCurveTo(175 + xoff, 124 + yoff, 224 + xoff, 81 + yoff, 280 + xoff, 120 + yoff);
    ctx.bezierCurveTo(293 + xoff, 129 + yoff, 304 + xoff, 147 + yoff, 298 + xoff, 144 + yoff);
    ctx.bezierCurveTo(310 + xoff, 163 + yoff, 308 + xoff, 192 + yoff, 309 + xoff, 185 + yoff);
    ctx.bezierCurveTo(308 + xoff, 170 + yoff, 293 + xoff, 234 + yoff, 306 + xoff, 243 + yoff);
    ctx.bezierCurveTo(253 + xoff, 301 + yoff, 227 + xoff, 271 + yoff, 229 + xoff, 280 + yoff);
    ctx.bezierCurveTo(220 + xoff, 273 + yoff, 204 + xoff, 255 + yoff, 198 + xoff, 247 + yoff);
    ctx.bezierCurveTo(181 + xoff, 238 + yoff, 183 + xoff, 127 + yoff, 188 + xoff, 135 + yoff);
    ctx.stroke();
  }

  function drawShape(ctx, xoff, yoff) {
  ctx.beginPath();
  ctx.moveTo(193 + xoff, 180 + yoff);
  ctx.bezierCurveTo(187 + xoff, 174 + yoff, 216 + xoff, 162 + yoff, 221 + xoff, 183 + yoff);
  ctx.bezierCurveTo(215 + xoff, 188 + yoff, 199 + xoff, 193 + yoff, 193 + xoff, 182 + yoff);
  ctx.stroke();
}

function drawShape(ctx, xoff, yoff) {
  ctx.beginPath();
  ctx.moveTo(242 + xoff, 180 + yoff);
  ctx.bezierCurveTo(248 + xoff, 159 + yoff, 285 + xoff, 173 + yoff, 278 + xoff, 180 + yoff);
  ctx.bezierCurveTo(269 + xoff, 195 + yoff, 240 + xoff, 189 + yoff, 241 + xoff, 180 + yoff);
  ctx.stroke();
}




  paint(ctx, { width, height }, props) { // eslint-disable-line
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
registerPaint('demo2', Demo2); // eslint-disable-line
