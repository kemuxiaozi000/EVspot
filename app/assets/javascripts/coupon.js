// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(document).ready(function () {
  var spotId = $('.spot_id').val();
  $.ajax({
    url: '/api/couponlist/couponinfo/index',
    type: 'post',
    data: {
      spot_id: spotId,
    }
  })
  .done(function (data, textStatus, jqXHR) {
    // HTML作成
    var content = '';
    if (data) {
      // クーポン情報をレコードごとに表示する
      for (var key in data) {
        content += '<div class="info-box couponinfo" id="' + key + '">';

        content += '<span class="info-box-icon bg-aqua">';
        content += '<img src="'+ iconCoupon+'"alt="">';
        content += '</span>';
        content += '<div class="info-box-content">';
        content += '<span class="info-box-text">';
        content += '<strong>' + data[key].title + '</strong><br>';
        content += data[key].from_date + '　~　' + data[key].to_date;
        content += '</span>';
        content += '<span class="">' + data[key].message + "</span>"
        content += '</div>';
        content += '';
        content += '</div>';
      }
    } else {
      // クーポンがない場合にメッセージを表示する
      content += '<div class="info-box bg-yellow">';
      content += '<div class="info-box-content">';
      content += '<span class="info-box-text">';
      content += 'クーポンがありません。';
      content += '</span>';
      content += '</div>';
      content += '</div>';
    }
    $('.coupon_list_area').html(content);
  })
  .fail(function (jqXHR, textStatus, errorThrown) {
    console.log(errorThrown);
  });

  $(document).on("click", ".couponinfo", function () {
    var id = this.id;
    $('#'+id).addClass("bg-gray");
    $('#'+id).children().removeClass("bg-aqua");
  });
});
