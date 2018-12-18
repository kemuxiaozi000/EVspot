$(document).ready(function () {
  var latitude;//緯度
  var longitude;//経度

  getMyplace();

  $(".small-box").click(function(){
    if($("#charging_id",this).val() == "spot_info"){
      spot(latitude, longitude);
    } else if($("#charging_id",this).val() == "qr") {
      qr_url();
    }
  });

  function getMyplace() {
    // var output = document.getElementById("result");
    if (!navigator.geolocation){//Geolocation apiがサポートされていない場合
      // output.innerHTML = "<p>Geolocationはあなたのブラウザーでサポートされておりません</p>";
      alert("あなたのブラウザーでサポートされておりません");
      return;
    }
    function success(position) {
      latitude  = position.coords.latitude;//緯度
      longitude = position.coords.longitude;//経度
      // output.innerHTML = '<p>緯度 ' + latitude + '° <br>経度 ' + longitude + '°</p>';
    }
    function error(error) {
      var err_msg = "";
      switch(error.code)
      {
        case 1:
          err_msg = "位置情報の利用が許可されていません";
          break;
        case 2:
          err_msg = "デバイスの位置が判定できません";
          break;
        case 3:
          err_msg = "タイムアウトしました";
          break;
      }
      //エラーの場合
      // output.innerHTML = err_msg;
      alert(err_msg);
    }
    navigator.geolocation.getCurrentPosition(success, error, {enableHighAccuracy: true});//成功と失敗を判断
  }
  // 画面遷移
  function postForm(url, data) {
    var $form = $('<form/>', {'action': url, 'method': 'post'});
    for(var key in data) {
            $form.append($('<input/>', {'type': 'hidden', 'name': key, 'value': data[key]}));
    }
    $form.appendTo(document.body);
    $form.submit();
  }
  // map画面表示
  function spot(lat, lon) {
    var $form = $('<form />', {
      action: 'map',
      target: '_self',
      method: 'post'
    });
    $postData = $('<input />', {type: 'hidden', name: 'destination', value: ''});
    $form.append($postData);
    $postData = $('<input />', {type: 'hidden', name: 'lat', value: lat});
    $form.append($postData);
    $postData = $('<input />', {type: 'hidden', name: 'lon', value: lon});
    $form.append($postData);
    $("body").append($form);
    window.location.href = window.location.origin + "/map?" + $form.serialize() ;
  }

  // map画面表示
  function qr_url() {
    if ($('#charging').val()=="true") {
      url = "charge_status";
    } else {
      url = "qrreader";
    }
    var $form = $('<form />', {
      target: '_self',
      method: 'GET'
    });
    window.location.href = window.location.origin + "/"+ url + "?" + $form.serialize() ;
  }

});
