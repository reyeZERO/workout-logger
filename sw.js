// serve from cache instantly, refresh cache in background (fast + offline)
var C="liftlog-v1";
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(C).then(function(c){return c.addAll(["./"])}));
  self.skipWaiting();
});
self.addEventListener("activate",function(e){e.waitUntil(self.clients.claim())});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  e.respondWith(
    caches.match(e.request).then(function(cached){
      var net=fetch(e.request).then(function(res){
        if(res.ok){var cl=res.clone();caches.open(C).then(function(c){c.put(e.request,cl)})}
        return res;
      }).catch(function(){return cached});
      return cached||net;
    })
  );
});
