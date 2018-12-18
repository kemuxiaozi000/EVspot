// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(document).ready(function () {
  var remains = 0;
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

  function setTime(second) {
    var timer = null;
    remains = second;
    var timeString = getTimeString(remains);
    $('#charging_time').text(timeString);
    function countDown(){
      // 残り秒数を1秒減らす
      remains--;
      timeString = getTimeString(remains);
      $('#charging_time').text(timeString);
      if(remains == 0) {
        clearInterval(timer);
        console.log('countdown complete!');
      }
    }
    timer = setInterval(countDown, 1000);
  }

  // やめるボタン
  $('#stop_charging').click(function() {
    var chargeTime = (30 - parseInt(remains / 60));
    if (!confirm('本当にやめますか？')) {
      return false;
    }
    $.ajax({
      url: '/api/charge/historyinfo/create',
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

  // スポット情報
  $("#spot_info").click(function(){
    // Geolocation APIに対応している
    if (navigator.geolocation) {
      getPosition();
    // Geolocation APIに対応していない
    } else {
      alert("この端末では位置情報が取得できません");
    }

    // 現在値取得
    function getPosition() {
      navigator.geolocation.getCurrentPosition(
        function(position){
          spot(position.coords.latitude, position.coords.longitude);

        },
        function(error){
          alert(error);
        }
      )
    }
    // map画面表示
    function spot(lat, lon) {
      var url = "/map";
      var $postData;
      var $form = $('<form />', {
      action: url,
      method: 'get'
      });
      $postData = $('<input />', {type: 'hidden', name: 'destination', value: ''});
      $form.append($postData);
      $postData = $('<input />', {type: 'hidden', name: 'lat', value: lat});
      $form.append($postData);
      $postData = $('<input />', {type: 'hidden', name: 'lon', value: lon});
      $form.append($postData);
      $("body").append($form);
      $form.submit();
    }
  });

  setTime(1800);
});