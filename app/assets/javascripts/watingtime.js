$(document).ready(function () {

  // 変更ボタン押下処理
  $("#watingtime_update").click(function() {
    var watingtime = $('#watingtime').val();
    $.ajax({
      url: "/api/management/waitingtime/upsert",
      data: {
        value : watingtime
      },
      type: "POST"
    })
    .done(function(data, textStatus, jqXHR) {
      if(data) {
        location.reload();
      } else {
        alert("変更できませんでした。");
      }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      alert("検索できませんでした。");
      console.log(errorThrown);
    })
    .always(function(jqXHR, textStatus, errorThrown) {
      console.log("complete:spotinfo");
    });
  });

});