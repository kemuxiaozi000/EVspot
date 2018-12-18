$(document).ready(function () {

  // map情報削除
  localStorage.clear();

  /**
   * 充電開始可能時間カウント
   */
  function setReservationTime() {
    var now = new Date();
    var reserve = new Date($("#reserveStartTime").val());
    var time = parseInt((now.getTime() - reserve.getTime()) / (1000 * 60));
    time = parseInt($("#reserveBaseRemainingMinute").val()) - time;
    time = time < 0 ? 0 : time;
    if (time != 0) {
      $(".reserveRemainingMinute").text("充電可能まであと" + time + "分");
      $("#reservationMinute").show();
    } else {
      $(".reserveRemainingMinute").text("充電可能です。");
      $("#reservationMinute").hide();
    }
  }

  /**
   * 充電終了残り秒数カウント
   */
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

  function setChargingTime(second) {
    var timer = null;
    remains = second;
    var timeString = getTimeString(remains);
    $('#charging_time').text(timeString);
    function countDown() {
      // 残り秒数を1秒減らす
      if (remains != 0) {
        remains--;
        timeString = getTimeString(remains);
        $('#charging_time').text(timeString);
      } else if (remains <= 0) {
        clearInterval(timer);
        $('#charging_time').text("充電完了");
        $('#charge_icon').attr('src', charge_complete_img_path).attr('alt', '充電完了');
      }
    }
    timer = setInterval(countDown, 1000);
  }

  // 充電開始可能時間
  setReservationTime();

  // 充電終了残り秒数
  var remainingSecond = parseInt($('#chargeRemainingSecond').val());
  setChargingTime(remainingSecond);

});