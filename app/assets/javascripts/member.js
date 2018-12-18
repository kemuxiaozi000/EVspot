$(document).ready(function () {

  // 登録ボタン
  $("#memberregister").click(function() {
    if ($("#emailInput").val() != "" && $("#passwordInput").val() != "") {
      $.ajax({
        url: "/api/memberlist/register/index",
        data: {
          email: $("#emailInput").val(),
          password: $("#passwordInput").val()
        },
        type: "POST"
      })
      .done(function(data, textStatus, jqXHR) {
        if(data == 0){
          var url = "/top";
          var $postData;
          var $form = $('<form />', {
          action: url,
          method: 'get'
          });
          $("body").append($form);
          $form.submit();
        }
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      })
      .always(function(jqXHR, textStatus, errorThrown) {
        console.log("complete:callApi");
      });
    }
  });

});