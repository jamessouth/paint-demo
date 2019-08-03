class Demo {
  // static getHue() {
  //   return Math.floor(Math.random() * 101) + 190;
  // }

  static getDistAlongSide(max) {
    return Math.floor(Math.random() * (max + 1));
  }

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
    // const radgrad = ctx.createRadialGradient(width / 2, height * 1.2, 8, width / 2, height * .9, height);
    // radgrad.addColorStop(0, `hsla(0deg, 90%, 60%, 80%)`);
    // // radgrad.addColorStop(0.9, '#ff9F62');
    // radgrad.addColorStop(.55, `hsla(0deg, 80%, 10%, 80%)`);
    //
    //
    // ctx.fillStyle = 'rgb(60, 60, 60)';
    // ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < 13000; i += 1) {
      const startSide = i % 4;
      const endSide = (startSide + Demo.getEndSide()) % 4;
      ctx.beginPath();
      ctx.moveTo(...Demo.getPoint(startSide, width, height));
      ctx.lineTo(...Demo.getPoint(endSide, width, height));
      ctx.lineWidth = Demo.getWidth();
      // ctx.lineCap = 'square';
      // ctx.strokeStyle = `hsla(0deg, 50%, 0%, .02)`;
      ctx.strokeStyle = `rgba(${10 + (i % 20)}, ${5 + (i % 30)}, ${0 + (i % 20)}, .01)`;
      ctx.stroke();
    }
  }
}
registerPaint('demo', Demo); // eslint-disable-line
