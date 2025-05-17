self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("static-cache").then((cache) => {
            return cache.addAll([
                "./assets/icon192.png",
                "./assets/icon512.png",
                "./landing-page/landing-page.html",
                "./landing-page/landing-page.css",
                "./landing-page/landing-page-script.js",
                "./main-page/main-page.html",
                "./main-page/main-page.css",
                "./main-page/main-page-script.js",
                "./history-page/history-page.html",
                "./history-page/history-page.css",
                "./history-page/history-page-script.js",
                "./common/db-script.js"
            ]).catch(function(error) {
                    console.error('Error :', error);
                });
        })
    );
    console.log("Service Worker installed.");
});
