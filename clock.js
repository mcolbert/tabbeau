
function Clock() {

  var perspectiveEl = document.getElementsByClassName('perspective')[0];
  var timeEl = perspectiveEl.getElementsByClassName('time')[0];
  var amPmEl = timeEl.getElementsByClassName('ampm')[0];
  var dateEl = perspectiveEl.getElementsByClassName('date')[0];
  var dateOptions = {month: 'long', day: 'numeric', year: 'numeric'};
  var currentDate = new Date();

  // Set the initial time.
  getCurrentNumberElement('hour').textContent =
      hourToString(currentDate.getHours());
  getCurrentNumberElement('minute').textContent =
      timeToString(currentDate.getMinutes());

  var strSecond = timeToString(currentDate.getSeconds());
  getCurrentNumberElement('second-10').textContent = strSecond[0];
  getCurrentNumberElement('second-1').textContent = strSecond[1];

  dateEl.textContent = currentDate.toLocaleDateString('en-us', dateOptions);
  amPmEl.textContent = currentDate.getHours() >= 12 ? 'PM' : 'AM';

  resize();
  window.addEventListener('resize', resize);

  window.setTimeout(function animateInDate() {
    dateEl.classList.remove('hidden');
  }, 0);

  window.setInterval(function update() {
    var date = new Date();

    var currStrSecond = timeToString(currentDate.getSeconds());
    var strSecond = timeToString(date.getSeconds());

    if (currStrSecond[0] != strSecond[0]) {
      animateNewNumber(getNumberContainer('second-10'),
          getCurrentNumberElement('second-10'), strSecond[0]);
    }

    if (currStrSecond[1] != strSecond[1]) {
      animateNewNumber(getNumberContainer('second-1'),
          getCurrentNumberElement('second-1'), strSecond[1]);
    }

    if (currentDate.getMinutes() != date.getMinutes()) {
      animateNewNumber(getNumberContainer('minute'),
          getCurrentNumberElement('minute'), timeToString(date.getMinutes()));
    }

    if (currentDate.getHours() != date.getHours()) {
      animateNewNumber(getNumberContainer('hour'),
          getCurrentNumberElement('hour'), hourToString(date.getHours()));
      amPmEl.textContent = currentDate.getHours() >= 12 ? 'PM' : 'AM';
    }

    var day = date.toLocaleDateString('en-us', dateOptions);
    if (dateEl.textContent != day) {
      dateEl.textContent = day;
    }

    currentDate = date;
  }, 1000);

  function hourToString(hour) {
    if (hour == 0) return '12';
    if (hour > 12) return String(hour - 12);
    return String(hour);
  }

  function timeToString(value) {
    if (value < 10) return '0' + value;
    return String(value);
  }

  function getNumberContainer(type) {
    return timeEl.getElementsByClassName(type)[0];
  }

  function getCurrentNumberElement(type) {
    var container = getNumberContainer(type);
    return container.getElementsByClassName('number')[0];
  }

  function animateNewNumber(container, prevElement, value) {
    // Create the DOM elements and then animate everything.
    var e = document.createElement('div');
    e.classList.add('number');
    e.classList.add('number-rotate-top-face');
    e.textContent = value;
    container.appendChild(e);

    window.setTimeout(function transition() {
      prevElement && prevElement.classList.add('number-rotate-bottom-face');
      e && e.classList.remove('number-rotate-top-face');

      window.setTimeout(function cleanup() {
        // Remove all other elements if the current node still exists.
        if (!container.contains(e)) return;
        var node = container.firstElementChild;
        while (node) {
          var byebye = node;
          node = node.nextElementSibling;
          if (byebye == e) continue;
          byebye.parentNode && byebye.parentNode.removeChild(byebye);
        }
      }, 400);
    }, 0);
  }

  function resize() {
    perspectiveEl.style.top = (window.innerHeight - 140) / 2 + 'px';
  }
}


new Clock()
