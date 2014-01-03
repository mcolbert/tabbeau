function TimePiece() {
  var canvas = document.getElementById('time-piece');
  var ctx = canvas.getContext('2d');

  var PROJECT_DISTANCE = 500;

  var MAX_COMPONENTS = 100;

  var TRANSLATE = getTranslateMatrix(0, 0, PROJECT_DISTANCE);

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(draw);

  function lerp(a, b, alpha) {
    return (1.0 - alpha) * a + alpha * b;
  }

  function draw() {
    var now = Date.now();
    var time = now / 1000 % 60;
    var radians = time / 60 * 2.0 * Math.PI;

    // TODO: Use a bezier curve here or something better than this linear crap.

    var startRotAngle = 0.5;
    var endRotAngle = startRotAngle + Math.PI / 180 * 30;  // Offset by 30 degrees.
    var flipRotAngle = 1 + Math.PI * 2;
    var transitionTime = 0.4;
    var delayShift = 0.5;

    time -= delayShift;
    time = time < 0 ? 60 + time : time;
    var extraRotation = time < transitionTime ?
        lerp(endRotAngle, flipRotAngle, time / transitionTime) :
        lerp(startRotAngle, endRotAngle,
            (time - transitionTime) / (60 - transitionTime));
    var rot = multMatrix(TRANSLATE, getRotationMatrix(extraRotation, 0, 1, 0.2));

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    var x = 0; // x coordinate
    var y = 0; // y coordinate
    var radius = Math.min(1, Math.sqrt(time * 3)) * 100; // Arc radius
    var startAngle = radians; // Starting point on circle
    var endAngle = 2.0 * Math.PI; // End point on circle

    ctx.moveTo(canvas.width / 2, canvas.height / 2);

    // Draw the countdown clock.
    var components = Math.ceil((1 - time / 60) * MAX_COMPONENTS);
    for (var i = 0; i <= components; ++i) {
      var angleRad = i / components * (endAngle - startAngle) + startAngle;
      var pos = [Math.sin(angleRad) * radius, -Math.cos(angleRad) * radius, 0];
      var projPos = project(PROJECT_DISTANCE, matrixVec(rot, pos));
      ctx.lineTo(projPos[0], projPos[1]);
    }
    ctx.lineTo(canvas.width / 2, canvas.height / 2);

    ctx.strokeStyle = '';
    ctx.lineWidth = '';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fill();

    // Draw the stroke around the time piece to let people know what the heck
    // we are doing.
    ctx.fillStyle = '';
    ctx.lineWidth = '1';
    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    for (var i = 0; i <= MAX_COMPONENTS; ++i) {
      var angleRad = i / MAX_COMPONENTS * Math.PI * 2;
      var pos = [Math.sin(angleRad) * 100, -Math.cos(angleRad) * 100, 0];
      var projPos = project(PROJECT_DISTANCE, matrixVec(rot, pos));
      ctx.lineTo(projPos[0], projPos[1]);
    }
    ctx.stroke();

    requestAnimationFrame(draw);
  }

  function getRotationMatrix(angle, x, y, z) {
    var dist = Math.sqrt(x * x + y * y + z * z);
    x /= dist;
    y /= dist;
    z /= dist;
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);

    return [
      x * x * (1.0 - cos) + cos,
      x * y * (1.0 - cos) - z * sin,
      x * z * (1.0 - cos) + y * sin,
      0,
      y * z * (1.0 - cos) + z * sin,
      y * y * (1.0 - cos) + cos,
      y * z * (1.0 - cos) - x * sin,
      0,
      x * z * (1.0 - cos) - y * sin,
      y * z * (1.0 - cos) + x * sin,
      z * z * (1.0 - cos) + cos,
      0
    ];
  }

  function getTranslateMatrix(x, y, z) {
    return [
      1, 0, 0, x,
      0, 1, 0, y,
      0, 0, 1, z
    ];
  }

  function multMatrix(a, b) {
    var r = [];
    for (var i = 0; i < 4; ++i) {
      var tmp = matrixVec(a, [b[0 + i], b[4 + i], b[8 + i], i == 3 ? 1 : 0]);
      r[0 + i] = tmp[0];
      r[4 + i] = tmp[1];
      r[8 + i] = tmp[2];
    }
    return r;
  }

  function matrixVec(matrix, pos) {
    var hCoord = pos.length == 4 ? pos[3] : 1;
    return [
      matrix[0] * pos[0] + matrix[1] * pos[1] + matrix[2] * pos[2] + matrix[3] * hCoord,
      matrix[4] * pos[0] + matrix[5] * pos[1] + matrix[6] * pos[2] + matrix[7] * hCoord,
      matrix[8] * pos[0] + matrix[9] * pos[1] + matrix[10] * pos[2] + matrix[11] * hCoord
    ];
  }

  function project(nearPlane, pos) {
    return [
      pos[0] * nearPlane / pos[2] + canvas.width / 2,
      pos[1] * nearPlane / pos[2] +  + canvas.height / 2];
  }

  function resize() {
    canvas.style.top = (window.innerHeight - canvas.height) / 2 + 'px';
  }
}

new TimePiece();
