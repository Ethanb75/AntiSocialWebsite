var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
  '/iconSVG.svg',
  '/tile.png',
  '/tile-wide.png',
  '/index.html.gz',
  '/js/hammer.min.js.gz',
  '/js/noframework-2.8.3.min.js.gz',
  '/js/index.js.gz',
  '/css/main.css.gz',
  '/css/animate.css.gz',
  '/css/normalize.css.gz',
  '/css/font-awesome/css/font-awesome.min.css',
  '/script/main.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});