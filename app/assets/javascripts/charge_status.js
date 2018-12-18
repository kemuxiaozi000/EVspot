// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(document).ready(function () {
  var remains = 0;
  var latitude;//緯度
  var longitude;//経度

  getMyplace();

  function getTimeString(second) {
    var min = parseInt(second / 60);
    var sec = second % 60;
    var timeString = '残り時間　';

    if (min < 10) {
      timeString += '0';
    }
    timeString += min;
    timeString += ':';
    if (sec < 10) {
      timeString += '0';
    }
    timeString += sec;
    return timeString;
  }

  /**
   *
   * @param {integer} second 残り秒数
   */
  function setTime(second) {
    var timer = null;
    remains = second;
    var timeString = getTimeString(remains);
    $('#charging_time').text(timeString);
    statusView(timer, remains);
    function countDown(){
      // 残り秒数を1秒減らす
      if (remains != 0) {
        remains--;
      }
      timeString = getTimeString(remains);
      $('#charging_time').text(timeString);
      statusView(timer, remains);
    }
    timer = setInterval(countDown, 1000);
  }

  /**
   *
   * @param {id} timer インターバル
   * @param {integer} remains 残り秒数
   */
  function statusView(timer, remains) {
    if(remains <= 0) {
      clearInterval(timer);
      console.log('countdown complete!');
      $('#charge_icon').attr('src', charge_complete_img_path).attr('alt', '充電完了');
      $('.box-title').text('充電完了');
      $('#stop_charging').text('精算する');
    }
  }

  // やめるボタン
  $('#checkout').click(function() {
    var chargeTime = (30 - parseInt(remains / 60));
    $.ajax({
      url: '/api/charge/historyinfo/index',
      data: {
        time: chargeTime,
        spot_id: spot_id
      },
      type: 'POST'
    })
    .done(function(data, textStatus, jqXHR) {
      if (data) {
        location.href='/charge_complete?history_id=' + data;
      }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    })
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
  // スポット情報
  $("#spot_info").click(function(){
    spot(latitude, longitude);
  });

  var remainingSecond = parseInt($('#chargeRemainingSecond').val());
  setTime(remainingSecond);
});
