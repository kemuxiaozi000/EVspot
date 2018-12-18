$(document).ready(function () {
  var charging = $("#charging").val() == "true" ? true : false;
  var chargeStartTime = new Date($("#chargeStartTime").val());
  var chargeRemainingMinute = parseInt($("#chargeRemainingMinute").val());
  var chargeRemainingSecond = parseInt($("#chargeRemainingSecond").val());

  var reservationSpotId = "";
  var reservationSpotName = "";

  // 充電中の処理
  Push.Permission.request();
  if (charging) {
    // 5分前
    if (chargeRemainingSecond >= 300) {
      setTimeout(function () {
        createAlart(5);
      }, (chargeRemainingSecond - 5 * 60) * 1000);
    }
    // 完了
    if (chargeRemainingSecond != 0) {
      setTimeout(function () {
        createAlart(0);
      }, chargeRemainingSecond * 1000);
    }
  }

  $("#chargeStatus").on("click", function () {
    var start = new Date();
    var time = parseInt(
      (start.getTime() - chargeStartTime.getTime()) / (1000 * 60)
    );
    time = parseInt($("#chargeRemainingBaseMinute").val()) - time;
    time = time < 0 ? 0 : time;
    $(".chargeRemainingMinute").text(time);
  });

  $("#reservationStatus").on("click", function () {
    var now = new Date();
    var reserve = new Date($("#reserveStartTime").val());
    var time = parseInt((now.getTime() - reserve.getTime()) / (1000 * 60));
    time = parseInt($("#reserveBaseRemainingMinute").val()) - time;
    time = time < 0 ? 0 : time;
    $(".reserveRemainingMinute").text(time);

    var url = "/charge_welcome?spot_id=" + $("#temporary_spot_id").val();
    if (time != 0) {
      $("#reservationChk").text("充電可能まで");
      $("#reservationMinute").show();
    } else {
      $("#reservationChk").text("充電可能です。");
      $("#reservationMinute").hide();
    }
    $("#reservationBtn").attr("href", url);
  });

  // 時間予約ダイアログ初期表示処理
  $('#reservationModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    reservationSpotId = button.data('spotid');
    reservationSpotName = button.data('spotname');

    $("#reservation_spot_name").text(reservationSpotName);
    var timeReservedSpotId = parseInt($("#time_reservation_spot_id").val());
    if (parseInt(reservationSpotId) == timeReservedSpotId) {
      var index = $("#time_reservation_index").val();
      $('#time_reservation_table tr').each(function (i) {
        if (i == index) {
          // $(this).addClass("success");
          $('td', this).eq(1).children().text("予");
        } else {
          if ($('td', this).eq(1).children().text() != "✕") {
            $('td', this).eq(1).children().text("〇");
          }
          // $(this).removeClass("success");
        }
      });
    } else {
      $('#time_reservation_table tr').each(function (i) {
        if ($('td', this).eq(1).children().text() != "✕") {
          $('td', this).eq(1).children().text("〇");
        }
      });
    }
  });

  // 予約ダイアログの「〇」と「予」をクリックで交互に入れ替えるイベント登録
  $(".reservation_time").on("click", function () {
    var mark = $(this).text();
    if (mark == "〇") {
      $(".reservation_time").each(function (index, element) {
        if ($(element).text() != "✕") {
          $(element).text("〇");
        }
      });
      $(this).text("予");
    } else if (mark == "予") {
      $(this).text("〇");
    }
  });

  // 予約ダイアログの「OK」クリック時イベントの登録
  $("#reservationConfirm").on("click", function () {
    // 予約ダイアログを閉じる
    $("#reservationModal").modal("hide");

    // 「予」があるかどうかをチェック
    var reserveFlag = false;
    var reserveTime = -1;
    $(".reservation_time").each(function (index, element) {
      if ($(element).text() == "予") {
        reserveFlag = true;
        reserveTime = index;
      }
    });

    // 予約済みのスポットと別のスポットの予約ダイアログを開いて、閉じただけの場合は何もしない
    if (!reserveFlag && reservationSpotId != $("#time_reservation_spot_id").val()) return;

    // session追加
    $.ajax({
      url: '/api/charge/reservation_time/index',
      type: 'post',
      data: {
        spot_id: reservationSpotId,
        spot_name: reservationSpotName,
        time_index: reserveTime
      }
    })
      .done(function (data, textStatus, jqXHR) {
        if (reserveFlag) {
          // 予約内容をhiddenに反映
          $("#time_reservation_spot_id").val(reservationSpotId);
          $("#time_reservation_index").val(reserveTime);
          $("#time_reservation_spot_name").text(reservationSpotName);

          $("#reservationDropdown").css("display", '');
          // 画面に合わせて位置を調整
          var windowH = $(window).height();
          var windowW = $(window).width();
          var width = $("#alertFade").width();
          $("#alertFade").css("bottom", parseInt(windowH / 2));
          $("#alertFade").css("left", parseInt((windowW - width) / 2));
          // 通知ダイアログを表示する(500ミリ秒でフェードイン、5秒後に自動でフェードアウト)
          $("#alertFade").fadeIn(500);
          window.setTimeout(function () {
            $("#alertFade").fadeOut();
          }, 5000);
        } else {
          // 予約キャンセル内容をhiddenに反映
          $("#time_reservation_spot_id").val("");
          $("#time_reservation_index").val("");
          $("#time_reservation_spot_name").text("");

          $("#reservationDropdown").css("display", 'none');
          // 画面に合わせて位置を調整
          var windowH = $(window).height();
          var windowW = $(window).width();
          var width = $("#alertFadeNg").width();
          $("#alertFadeNg").css("bottom", parseInt(windowH / 2));
          $("#alertFadeNg").css("left", parseInt((windowW - width) / 2));
          // 通知ダイアログを表示する(500ミリ秒でフェードイン、5秒後に自動でフェードアウト)
          $("#alertFadeNg").fadeIn(500);
          window.setTimeout(function () {
            $("#alertFadeNg").fadeOut();
          }, 5000);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      });
  });

  // 時間予約ステータスアイコンのクリック処理
  $("#specifiedReservationStatus").on("click", function () {
    var index = $("#time_reservation_index").val();
    $('#time_reserved_table tr').each(function (i) {
      if ($('td', this).eq(1).children().text() != "✕") {
        $('td', this).eq(1).children().text("〇");
      }
      if (i == index) {
        $(this).addClass("success");
        $('td', this).eq(1).children().text("予");
      } else {
        $(this).removeClass("success");
      }
    });
  });

  // フッタの「充電する」メニューの設定
  setFooterChargingMenu(charging);
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
      .then(function (reg) {
        console.log("[Companion]", "Service worker registered!");

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
          function (error) {
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
  $("#loader, #indicator-overlay").fadeOut("slow", function () {
    $("#indicator-overlay").remove();
    $("#searchButton").prop("disabled", false);
    $("#detailSearchButton").prop("disabled", false);
  });
}

/**
 * フッタの「充電する」メニューの設定
 * @param {boolean} isCharging 充電中かどうか
 */
function setFooterChargingMenu(isCharging) {
  if (isCharging) {
    $("#footer_charging_anchor").attr("href", "/charge_status");
    $("#footer_charging_icon").attr("src", footer_charging_in_progress_icon);
  } else if (footer_reserving) {
    $("#footer_charging_anchor").attr("href", "/charge_welcome?spot_id=" + footer_temporary_spot_id);
    $("#footer_charging_icon").attr("src", footer_charging_in_reservation_icon);
  } else {
    $("#footer_charging_anchor").attr("href", "/qrreader");
    $("#footer_charging_icon").attr("src", footer_charging_icon);
  }
  $("#footer_charging_icon").css("visibility", "visible");
}