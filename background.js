
function Background() {
  var img = null;
  var imgAspectRatio = 1;
  var CACHE_KEY = '500px-cache';

  // 1 hour cache on 500px queries, this should pretty much eliminate any real
  // QPS.
  var CACHE_LENGTH_MS = 60 * 60 * 1000;

  var whitelistCats = {
    11: 'Animals',
    9: 'City and Architecture',
    8: 'Landscapes',
    12: 'Macros',
    18: 'Nature',
    17: 'Sport',
    6: 'Still life',
    13: 'Travel',
    22: 'Underwater'
  }

  initPhoto();

  function initPhoto() {
    var cache = window.localStorage.getItem(CACHE_KEY);
    var cacheObj = cache && JSON.parse(cache);
    if (cacheObj && Date.now() - cacheObj.time < CACHE_LENGTH_MS ) {
      pickAndLoadPhoto(cacheObj.photos);
    } else {
      _500px.init({
        sdk_key: '70ff1e776b3cac6e599e61de733158ad4afc665f'
      });

      _500px.api('/photos', { feature: 'popular', image_size: 5, page: 1 },
        function (response) {
          window.localStorage.setItem(CACHE_KEY,
              JSON.stringify({time: Date.now(), photos: response.data.photos}));
          pickAndLoadPhoto(response.data.photos);
        });
    }
  }

  function pickAndLoadPhoto(rawPhotos) {
    var photos = filterPhotos(rawPhotos);
    // TODO: Switch this to a CDF that provides weighted probability for better
    // photos, while still letting others sneak in occasionally.
    var photo = photos[Math.floor(Math.random() * photos.length)];
    loadPhoto(photo);
  }

  function loadPhoto(photo) {
    imgAspectRatio = photo.width / photo.height;
    console.log(whitelistCats[photo.category]);
    img = document.createElement('img');
    img.classList.add('bg-image');
    img.classList.add('hidden');
    resize();
    img.src = photo.image_url;
    setupUser(photo.user);
    img.onload = function() {
      window.setTimeout(function unhide() {
        img.classList.remove('hidden');
        var attr = document.getElementsByClassName('attribution')[0];
        attr.classList.remove('hidden');
      }, 10);
    };
    document.body.insertBefore(img, document.body.firstElementChild);

    // Now that we have an image, listen for resizes.
    window.addEventListener('resize', resize);
  }

  function resize() {
    var windowAspectRatio = window.innerWidth / window.innerHeight;
    if (imgAspectRatio < windowAspectRatio) {
      img.style.width = window.innerWidth + 'px';
      img.style.height = window.innerWidth / imgAspectRatio + 'px';
    } else {
      img.style.height = window.innerHeight + 'px';
      img.style.width = window.innerHeight * imgAspectRatio + 'px';
    }
  }

  function filterPhotos(photos) {
    var good = [];
    for (var i = 0; i < photos.length; ++i) {
      if (photos[i].category in whitelistCats) {
        good.push(photos[i]);
      }
    }
    return good;
  }

  function setupUser(user) {
    var link = document.getElementsByClassName('attribution-link')[0];
    var name = document.getElementsByClassName('attribution-name')[0];
    var image = document.getElementsByClassName('attribution-image')[0];

    link.href = 'http://www.500px.com/' + user.username;
    name.textContent = 'Photo by ' + user.fullname;
    image.src = user.userpic_url;
  }
}

new Background();
