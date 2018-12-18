$(document).ready(function() {
  var charging = $("#charging").val() == "true" ? true : false;
  var chargeStartTime = new Date($("#chargeStartTime").val());
  var chargeRemainingMinute = parseInt($("#chargeRemainingMinute").val());
  var chargeRemainingSecond = parseInt($("#chargeRemainingSecond").val());

  // 充電中の処理
  Push.Permission.request();
  if (charging) {
    // 5分前
    if (chargeRemainingSecond >= 300) {
      setTimeout(function() {
        createAlart(5);
      }, (chargeRemainingSecond - 5 * 60) * 1000);
    }
    // 完了
    if (chargeRemainingSecond != 0) {
      setTimeout(function() {
        createAlart(0);
      }, chargeRemainingSecond * 1000);
    }
  }

  $("#chargeStatus").on("click", function() {
    var start = new Date();
    var time = parseInt(
      (start.getTime() - chargeStartTime.getTime()) / (1000 * 60)
    );
    time = parseInt($("#chargeRemainingBaseMinute").val()) - time;
    time = time < 0 ? 0 : time;
    $(".chargeRemainingMinute").text(time);
  });
});

function createAlart(minutes) {
  var textMessage;
  if (minutes == 0) {
    textMessage = "充電が完了しました。";
  } else {
    textMessage = "あと" + minutes + "分で完了します。";
  }

  if (navigator.serviceWorker) {
    navigator.serviceWorker
      .register("/serviceworker.js", {
        scope: "./"
      })
      .then(function(reg) {
        console.log("[Companion]", "Service worker registered!");

        // プッシュ通知の購読
        var options = {
          userVisibleOnly: true,
          applicationServerKey: window.vapidPublicKey
        };
        reg.pushManager.subscribe(options).then(
          function(subscription) {
            console.log(subscription.subscriptionId);
            console.log(subscription.endpoint);
            // ここから、IndexedDB にデータを書き込んだり、いずれかのウィンドウに
            // それを送信したり、通知を表示したりできます。
            $.ajax({
              url: "/api/webpush/pushsend/index",
              data: params,
              data: {
                subscription: subscription.toJSON(),
                message: textMessage
              },
              type: "POST"
            });
          },
          function(error) {
            // 開発中は、コンソールにエラーを表示するのに役立ちます。
            // 本番環境では、アプリケーションサーバにエラー情報を送信
            // するためにも 役立ちます。
            console.log(error);
          }
        );
      });
  }
}

//センタリングを実行する関数
function centeringIndicatorSyncer() {
  //画面(ウィンドウ)の幅、高さを取得
  var w = $(window).width();
  var h = $(window).height();

  // コンテンツ(#indicator-content)の幅、高さを取得
  var iw = $("#indicator-overlay").outerWidth();
  var ih = $("#indicator-overlay").outerHeight();
  // コンテンツ(#indicator-content)の幅、高さを取得
  var cw = $("#loader").outerWidth();
  var ch = $("#loader").outerHeight();

  //センタリングを実行する
  $("#indicator-overlay").css({
    left: (w - iw) / 2 + "px",
    top: (h - ih) / 2 + "px"
  });
  $("#loader").css({
    left: (w - cw) / 2 + "px",
    top: (h - ch) / 2 + "px"
  });
}
// loaderフェードイン処理
function loaderFadeIn() {
  if ($("indicator-overlay")[0]) return false;

  //オーバーレイ用のHTMLコードを、[body]内の最後に生成する
  $("body").append('<div id="indicator-overlay"></div>');

  //[$modal-overlay]をフェードインさせる
  $("#indicator-overlay").fadeIn("slow");

  //[$indicator-content]をフェードインさせる
  $("#loader").fadeIn("slow");
}

// loaderフェードアウト処理
function loaderFadeOut() {
  $("#loader, #indicator-overlay").fadeOut("slow", function() {
    $("#indicator-overlay").remove();
    $("#searchButton").prop("disabled", false);
    $("#detailSearchButton").prop("disabled", false);
  });
}
