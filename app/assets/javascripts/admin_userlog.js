// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
var dt;
$(document).ready(function () {
  reloadTable(data);
  pageSet($('#last_pageno').val());
});

$(function () {
  $('#datepicker-default .date').datepicker({
    format: "yyyy/mm/dd",
    language: 'ja'
  });

});

// 絞り込みボタンクリック時処理
$(document).on("click", "#research", function () {
  // HTMLでの送信をキャンセル
  event.preventDefault();
  // ページ番号を初期化
  $('#now_pageno').val(1);
  $.ajax({
    url: '/api/management/admin_user_log/index',
    type: 'post',
    data: {
      min_date: $('#min_date').val(),
      max_date: $('#max_date').val(),
      user_name: $('#user_name').val(),
      pageno: $('#now_pageno').val()
    }
  })
    .done(function (data, textStatus, jqXHR) {
      pageSet(data.page);
      reloadTable(data.user_logs);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    });
  document.getElementById("paging_search").style.display = "block";
});

// 引数の内容で一覧を再描画する
function reloadTable(data) {
  var datalist = new Array();
  if (dt !== undefined) {
    dt.destroy();
  }
  if (data.length > 0) {
    for (key in data) {
      userLogsId = data[key].id;
      userLogsDateTime = data[key].datetime;
      userLogsUserName = data[key].user_name;
      userLogsScreen = data[key].screen;
      userLogsAction = data[key].action;
      userLogsParametar = data[key].parametar;

      userLogsDateTime = userLogsDateTime.replace(/(T)/, " ");
      userLogsDateTime = userLogsDateTime.replace(/(\.).*/, "");

      var rowData = new Array();
      rowData[0] = userLogsId;
      rowData[1] = userLogsDateTime;
      rowData[2] = userLogsUserName;
      rowData[3] = userLogsScreen;
      rowData[4] = userLogsAction;
      rowData[5] = userLogsParametar;
      datalist[key] = rowData;
    }
  }

  dt = $('#result-table').DataTable({
    //scrollX: false,
    scrollY: 600,
    retrieve: true,
    ordering: true,
    lengthChange: false,
    searching: false,
    info: false,
    paging: false,
    order: [0, "asc"],
    data: datalist,
  });
  dt.columns.adjust();

}

// 出力ボタンクリック時処理
$(document).on("click", "#csv_output", function () {
  args = 'min_date=' + fixedEncodeURIComponent($('#min_date').val()) + '&max_date=' + fixedEncodeURIComponent($('#max_date').val()) + '&user_name=' + fixedEncodeURIComponent($('#user_name').val());
  document.location.assign('admin_userlog.csv?' + args);
});

//HTTPリクエスト URLエスケープ処理
function fixedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}

// ページングボタンクリック時処理
function paging(int) {
  // HTMLでの送信をキャンセル
  event.preventDefault();
  $.ajax({
    url: '/api/management/admin_user_log/index',
    type: 'post',
    data: {
      min_date: $('#min_date').val(),
      max_date: $('#max_date').val(),
      user_name: $('#user_name').val(),
      pageno: int
    }
  })
    .done(function (data, textStatus, jqXHR) {
      pageSet(data.page);
      reloadTable(data.user_logs);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    });

  $('#now_pageno').val(int);

}

function pageSet(lastPage) {

  var page_head = 0;
  var page_last = 0;
  var front = 0;
  var back = 0;

  currentPage = $("#now_pageno").val();

  page_head = Number(currentPage) - 2;
  if (page_head <= 1) {
    page_head = 1;
  }

  page_last = Number(currentPage) + 2;
  if (page_last >= lastPage) {
    page_last = lastPage;
  }

  front = Number(currentPage) - 5;
  if (front <= 1) {
    front = 1;
  }

  back = Number(currentPage) + 5;
  if (back >= lastPage) {
    back = lastPage;
  }

  $('#current_page').text(currentPage + "/");
  $('#last_page').text(lastPage + "Page");
  $("#pagingLink").empty();
  $('#pagingLink').html('<li><a href="" onclick="paging(1)" >first</a></li>');
  if (currentPage > 1) {
    $('#pagingLink').append('<li><a href="" onclick="paging(' + front + ')" >«</a></li>');
  }

  for (i = page_head; i <= page_last; i++) {
    if (i == currentPage) {
      $('#pagingLink').append('<li><a href="" onclick="paging(' + i + ')" >[' + i + ']</a></li>');
    } else {
      $('#pagingLink').append('<li><a href="" onclick="paging(' + i + ')" >' + i + '</a></li>');
    }
  }

  if (currentPage < lastPage) {
    $('#pagingLink').append('<li><a href="" onclick="paging(' + back + ')" >»</a></li>');
  }
  $('#pagingLink').append('<li><a href="" onclick="paging(' + lastPage + ')" >last</a></li>');
}
