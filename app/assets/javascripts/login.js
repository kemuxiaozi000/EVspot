$(document).ready(function () {

  function login() {
    if ($('#idInput').val() == "") {
      $('#idVal').addClass("has-error");
      document.getElementById("err_msg").style.display = "block";
    } else if ($('#pwdInput').val() == "") {
      $('#pwdVal').addClass("has-error");
      document.getElementById("err_msg").style.display = "block";
    } else {
      $.ajax({
        url: "/api/login/usercheck/index",
        data: {
          "email": $('#idInput').val(),
          "pwd": $('#pwdInput').val()
        },
        type: "post"
      })
      .done(function (data, textStatus, jqXHR) {
        if (data == 'Success') {
          $(location).attr('href',"/top");
        } else {
          $('#idVal').addClass("has-error");
          $('#pwdVal').addClass("has-error");
          document.getElementById("err_msg").style.display = "block";
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        $('#idVal').addClass("has-error");
        $('#pwdVal').addClass("has-error");
        document.getElementById("err_msg").style.display = "block";
      })
    }
  }

  // ログインボタン押下処理
  $('#login').on('click', function(){
    login()
  });
  // ENTERキーでログイン処理
  $('#pwdInput').keydown(function(event) {
    if (event.keyCode == 13) {
      login();
      return false;
    }
  });

  // ID欄の赤枠削除
  $("#idInput").bind('change keyup blur input blur.autocompletechange', function () {
    $('#idVal').removeClass("has-error");
  });

  // pwd欄の赤枠削除
  $("#pwdInput").bind('change keyup blur input blur.autocompletechange', function () {
    $('#pwdVal').removeClass("has-error");
  });

});