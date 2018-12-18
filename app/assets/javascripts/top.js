$(document).ready(function () {

        //member();

        // クーポン取得
        function member() {

            // クーポン取得(sample)
            // $.ajax({
            //     url: "/api/top/couponinfo/index",
            //     data: {
            //         current_place_lat: lat,
            //         current_place_lon: lon
            //     },
            //     type: "POST"
            // })
            // .done(function(data, textStatus, jqXHR) {
            //     if(data.length > 0) {
            //         for (var key in data) {
            //             // フレーム
            //             var frame = '<div class="info-box" onclick="myFunction('+ data[key].id +')">';
            //             frame += '<span class="info-box-icon bg-aqua"><i class="glyphicon glyphicon-gift"></i></span>'
            //                   + '<div class="info-box-content">'
            //             // タイトル
            //                   + '<span class="info-box-text">' + data[key].title + '</span>'
            //             // 内容
            //                   + '<span class="info-box-number">' + data[key].message + '</span>'
            //                   + '<input type="hidden" id="coupon_id" value="'+ data[key].id + '">'
            //                   + '</div></div>'
            //             $('#coupon_area').append(frame);
            //         }
            //     }
            // })
            // .fail(function(jqXHR, textStatus, errorThrown) {
            //     console.log(errorThrown);
            // })
            // .always(function(jqXHR, textStatus, errorThrown) {
            //     console.log("complete:couponinfo");
            // });
        }

    });