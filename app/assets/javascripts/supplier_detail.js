// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(document).ready(function () {
  var supplierId = $('#supplier_id').val();
  var supplierName = $('#supplier_name').text().trim();

  if (photo == "hatakeyama.jpg") {
    $('#supplier_image').html('<img id="supplier_image" alt="" class="media-object" style="width: 80px;height: auto;border-radius: 4px;box-shadow: 0 1px 3px rgba(0,0,0,.15);" src="' + hatakeyama + '"></img>');
  } else if (photo == "matsubara.jpg") {
    $('#supplier_image').html('<img id="supplier_image" alt="" class="media-object" style="width: 80px;height: auto;border-radius: 4px;box-shadow: 0 1px 3px rgba(0,0,0,.15);" src="' + matsubara + '"></img>');
  } else if (photo == "nge48.png") {
    $('#supplier_image').html('<img id="supplier_image" alt="" class="media-object" style="width: 80px;height: auto;border-radius: 4px;box-shadow: 0 1px 3px rgba(0,0,0,.15);" src="' + nge48 + '"></img>');
  } else if (photo == "chubu.png") {
    $('#supplier_image').html('<img id="supplier_image" alt="" class="media-object" style="width: 80px;height: auto;border-radius: 4px;box-shadow: 0 1px 3px rgba(0,0,0,.15);" src="' + chubu + '"></img>');
  } else {
    $('#supplier_image').html('<img id="supplier_image" alt="" class="media-object" style="width: 80px;height: auto;border-radius: 4px;box-shadow: 0 1px 3px rgba(0,0,0,.15);" src="' + no_image + '"></img>');
  }

  $(document).on("click", ".choose", function () {
    $.ajax({
      url: '/api/supplierlist/supplierselect/index',
      type: 'post',
      data: {
        supplier_id: supplierId,
        supplier_name: supplierName
      }
    })
      .done(function (data, textStatus, jqXHR) {
        var url = "charging";
        window.location.href = window.location.origin + "/" + url;
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      });
  });
});