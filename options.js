function Options(backgroundInstance, clockInstance, timePieceInstance) {
  var background = backgroundInstance;
  var clock = clockInstance;
  var timePiece = timePieceInstance;

  var gearEl = document.getElementsByClassName('gear')[0];
  var showSeconds = document.getElementById('show_seconds');
  showSeconds.checked = clock.isSecondsVisible();

  var showClock = document.getElementById('show_clock');
  showClock.checked = timePiece.isVisible();
  var rotateClock = document.getElementById('rotate_clock');
  rotateClock.checked = timePiece.isClockRotationEnabled();
  updateClockOptions();

  var blur = document.getElementById('blur');
  blur.value = background.getImageBlur();

  var options = document.getElementsByClassName('options')[0];
  var hider = options.getElementsByClassName('hider')[0];

  document.body.addEventListener('click', function onClick(e) {
    if (options.classList.contains('hide')) return;
    var node = e.target;
    while (node && node != options && node != gearEl) {
      node = node.parentElement;
    }
    if (node) return;
    options.classList.add('hide');
  });

  gearEl.addEventListener('click', function onClick() {
    options.classList.remove('hide');
  });

  hider.addEventListener('click', function onClick() {
    options.classList.add('hide');
  });

  blur.addEventListener('change', function onChange() {
    background.setImageBlur(blur.value);
  });

  showSeconds.addEventListener('click', function onClick() {
    clock.setSecondsVisible(showSeconds.checked);
  });

  function updateClockOptions() {
    rotateClock.disabled = !showClock.checked;
  }

  showClock.addEventListener('click', function onClick() {
    updateClockOptions();
    timePiece.setVisible(showClock.checked);
  });

  rotateClock.addEventListener('click', function onClick() {
    timePiece.setClockRotationEnabled(rotateClock.checked);
  });
}

new Options(background, clock, timePiece);
