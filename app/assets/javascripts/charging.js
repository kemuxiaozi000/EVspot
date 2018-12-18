$(document).ready(function () {
  $(".small-box").click(function(){
    if($("#charging_id",this).val() == "spot_info"){
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
    }
  });
});
