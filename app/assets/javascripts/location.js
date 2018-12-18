
var getGeolocationOptions = {
  enableHighAccuracy: true
};

/**
 * 現在地の取得
 * @param {function} successFunc
 * @param {function} failureFunc
 */
function getMyplace(successFunc, failureFunc) {
  if (!navigator.geolocation) {
    //Geolocation apiがサポートされていない場合
    alert("位置情報サービス非対応です。");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    function (position) {
      successFunc(position);
    },
    function (positionError) {
      failureFunc(positionError);
    },
    getGeolocationOptions
  ); //成功と失敗を判断
}
