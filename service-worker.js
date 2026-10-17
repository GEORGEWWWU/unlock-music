/**
 * [本地化改造] 本项目不再使用 Service Worker。
 *
 * 原文件是 workbox 自动生成的，其中 importScripts(
 *   "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"
 * ) 会从 Google CDN 拉取缓存框架——这是本项目最后一处外部网络依赖。
 *
 * 应用侧（js/app.bde85ddf.js 里的 registerServiceWorker 调用）已经删除，
 * 这里留一份"自我注销"的空实现：若某个 https 域名上还残留旧版 SW，
 * 它下次被唤醒时会清空缓存并把自己卸载掉。
 */

self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys.map(function (k) {
            return caches.delete(k);
          })
        );
      })
      .then(function () {
        return self.registration.unregister();
      })
      .catch(function () {
        /* 忽略：注销失败也不影响功能 */
      })
  );
});

self.addEventListener("fetch", function () {
  /* 不拦截任何请求，全部交给浏览器原生网络栈（同源静态文件） */
});
