class Demo {
  // static pipe(...fns) {
  //   return function inner(start) {
  //     return fns.reduce((val, fn) => fn(val), start);
  //   };
  // }

  static getHue() {
    return Math.floor(Math.random() * 101) + 190;
  }

  static getDistAlongSide(max) {
    return Math.floor(Math.random() * (max + 1));
  }

  // static getHypoLength(ang) {
  //   return 10 / Math.cos(ang); // 10 is the height of the border area
  // }

  // static getCoord(hypo) {
  //   const dir = hypo < 0 ? -1 : 1;
  //   const opSide = Math.sqrt((hypo * hypo) - 100);
  //   return opSide * dir;
  // }

  static getWidth() {
    return Math.floor(Math.random() * 10) + 1;
  }

  static getPoint(side, width, height) {
    switch (side) {
      case 0:
        return [
          0,
          Demo.getDistAlongSide(height),
        ];
      case 1:
        return [
          Demo.getDistAlongSide(width),
          height,
        ];
      case 2:
        return [
          width,
          Demo.getDistAlongSide(height),
        ];
      case 3:
        return [
          Demo.getDistAlongSide(width),
          0,
        ];
    }
  }

  static getEndSide() {
    return Math.floor(Math.random() * 3) + 1;
  }

  paint(ctx, { width, height }, props) { // eslint-disable-line



    for (let i = 0; i < 1000; i += 1) {
      // console.log([i % 4], width, height);

      // console.log(, );

      const startSide = i % 4;
      const endSide = (startSide + Demo.getEndSide()) % 4;

      // console.log(Demo.getPoint(((i % 4) + Demo.getEndSide()) % 4, width, height));

      // const dir = Demo.getDirectionInRadians(i % 4);
      //
      // const opLen = Demo.pipe(
      //   Demo.getHypoLength,
      //   Demo.getCoord,
      //   Math.round,
      // )(dir);

      // console.log();
      // const deg = 0;
      // const stPt = i $ 6;
      ctx.beginPath();
      ctx.moveTo(...Demo.getPoint(startSide, width, height));
      ctx.lineTo(...Demo.getPoint(endSide, width, height));
      ctx.lineWidth = Demo.getWidth();
      ctx.lineCap = 'square';
      // ctx.strokeStyle = `hsl(${Demo.getHue()}deg, 85%, 49%)`;
      ctx.strokeStyle = `hsl(0deg, 0%, ${i%100}%)`;
      ctx.stroke();
    }
  }
}
registerPaint('demo', Demo); // eslint-disable-line
