$(document).ready(function () {

  $(".small-box").click(function () {
    if ($("#charging_id", this).val() == "qr") {
      qr_url();
    }
  });

  // map画面表示
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

});
