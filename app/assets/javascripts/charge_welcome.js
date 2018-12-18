$(document).ready(function () {

  // 順番予約押下処理
  $(".order_reservation").click(function () {
    $.ajax({
      url: "/api/charge/reservation/index",
      type: "POST"
    })
      .done(function (data, textStatus, jqXHR) {
        location.reload();
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      })
      .always(function (jqXHR, textStatus, errorThrown) {
        console.log("complete:reservation");
      });
  });

});