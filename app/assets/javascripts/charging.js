$(document).ready(function () {
  // map情報削除
  localStorage.clear();

  // ボタン押下処理
  $(".small-box").click(function () {
    if ($("#charging_id", this).val() == "qr") {
      qr_url();
    }
    if ($("#charging_id", this).val() == "spot_info") {
      spot_info();
    }
  });

  // 認証画面遷移
  function qr_url() {
    if ($('#charging').val() == "true") {
      url = "charge_status";
    } else {
      url = "qrreader";
    }
    var $form = $('<form />', {
      target: '_self',
      method: 'GET'
    });
    window.location.href = window.location.origin + "/" + url + "?" + $form.serialize();
  }

  // スポット情報からmap画面表示
  function spot_info() {
    window.location.href = window.location.origin + "/map?spotinfo_zoom=true";
  }
});
