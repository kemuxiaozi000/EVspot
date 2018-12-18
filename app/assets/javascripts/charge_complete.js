$(document).ready(function () {

  $(".receipt").click(function(){
    var id = this.id;

    $.ajax({
      url: "/api/historyview/historyinfo/index",
      data: {
        id : id
      },
      type: "POST"
    })
    .done(function(data, textStatus, jqXHR) {
      if(data) {
        $("#receipt_place").text( data.spot_name)
        $("#receipt_time").text( data.datetime)
        $("#receipt_volume").text( data.volume)
        $("#receipt_price").text( data.price)
        $("#receipt_area").text( data.producing_area)
        $("#receipt_types").text( data.pst_name)
      }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    })
    .always(function(jqXHR, textStatus, errorThrown) {
      console.log("complete:historyinfo");
    });
  });

});
