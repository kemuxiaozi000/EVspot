$(document).ready(function () {
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/serviceworker.js', { scope: './' })
    .then(function(reg) {
      console.log('[Companion]', 'Service worker registered!');

      // プッシュ通知の購読
      var options = {
        userVisibleOnly: true,
        applicationServerKey: window.vapidPublicKey
      };
      reg.pushManager.subscribe(options).then(
        function (subscription) {
          console.log(subscription.subscriptionId);
          console.log(subscription.endpoint);
          // ここから、IndexedDB にデータを書き込んだり、いずれかのウィンドウに
          // それを送信したり、通知を表示したりできます。
          params = {
            subscription: subscription.toJSON()
          };

          $.ajax({
            url: '/web_push',
            data: params,
            type: "POST"
          });
        }, function (error) {
          // 開発中は、コンソールにエラーを表示するのに役立ちます。
          // 本番環境では、アプリケーションサーバにエラー情報を送信
          // するためにも 役立ちます。
          console.log(error);
        }
      );
    });
}
});
