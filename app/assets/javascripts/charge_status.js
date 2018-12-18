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
    function countDown() {
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
    if (remains <= 0) {
      clearInterval(timer);
      console.log('countdown complete!');
      $('#charge_icon').attr('src', charge_complete_img_path).attr('alt', '充電完了');
      $('.box-title').text('充電完了');
      $('#stop_charging').text('精算する');
    }
  }

  // やめるボタン
  $('#checkout').click(function () {
    var chargeTime = (30 - parseInt(remains / 60));
    $.ajax({
      url: '/api/charge/historyinfo/index',
      data: {
        time: chargeTime,
        spot_id: spot_id,
        supplier_id: 1
      },
      type: 'POST'
    })
      .done(function (data, textStatus, jqXHR) {
        if (data) {
          location.href = '/charge_complete?history_id=' + data;
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      })
  });

  var remainingSecond = parseInt($('#chargeRemainingSecond').val());
  setTime(remainingSecond);
});
