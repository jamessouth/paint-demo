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

  static getColor(base, range) {
    return base + Math.floor(Math.random() * range + 1);
  }

  paint(ctx, { width, height }, props) { // eslint-disable-line
    // const radgrad = ctx.createRadialGradient(width / 2, height * 1.2, 8, width / 2, height * .9, height);
    // radgrad.addColorStop(0, `hsla(40deg, 90%, 60%, 80%)`);
    // // radgrad.addColorStop(0.9, '#ff9F62');
    // radgrad.addColorStop(.55, `hsla(0deg, 80%, 10%, 80%)`);
    // radgrad.addColorStop(.85, `hsla(0deg, 80%, 0%, 80%)`);
    //
    //
    ctx.fillStyle = 'rgb(0, 0, 0)';
    // ctx.fillStyle = radgrad;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 174; i++) {
      ctx.fillStyle = 'rgb(255, 255, 255)';
      ctx.fillRect(Demo.getDistAlongSide(width), Demo.getDistAlongSide(height), 1, 1);

    }


    const ctr = [
      width / 2,
      height - 5,
    ];

    for (let i = 0; i < 700; i += 1) {
      const startSide = i % 4;
      const endSide = (startSide + Demo.getEndSide()) % 4;
      ctx.beginPath();

      ctx.moveTo(...ctr);
      ctx.lineTo(...Demo.getPoint(endSide, width, height));
      ctx.lineWidth = Demo.getWidth();
      ctx.lineCap = 'square';

      // ctx.strokeStyle = `rgba(250, 250, 250, .11)`;
      ctx.strokeStyle = `rgba(${Demo.getColor(240, 15)}, ${Demo.getColor(240, 15)}, ${Demo.getColor(50, 20)}, .05)`;
      ctx.stroke();

    }
  }
}
registerPaint('demo', Demo); // eslint-disable-line
