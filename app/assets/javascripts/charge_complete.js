$(document).ready(function () {

  // 通知ダイアログを表示する
  const messageShow = 10000;  // 表示開始時間
  const fadeinTime = 500;
  const fadeOutTime = 30000;  // 表示終了時間
  // 画面に合わせて位置を調整
  var windowH = $(window).height();
  var windowW = $(window).width();
  var width = $("#messageFade").width();
  $("#messageFade").css("top", parseInt(windowH / 3));
  $("#messageFade").css("left", parseInt((windowW - width) / 2));
  window.setTimeout(function () {
    $('#messageFade').fadeIn(fadeinTime);
    window.setTimeout(function () {
      $('#messageFade').fadeOut();
    }, fadeOutTime);
  }, messageShow);
});
