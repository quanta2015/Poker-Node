var socket;
var uid;

$(init);


function init() {

    $("body").on("click", "#loginBtn", doLogin);
    $("body").on('click', '.box-me .poker', doSelectPoker);
    $("body").on('click', '#btnPush', doPushPoker);


    $(".wrapper").append(loginData);

    socket = io();

    socket.on('waiting', function(list) {
        $(".wrapper").empty();
        $(".wrapper").append(waitData);
    });

    socket.on('start', function(data) {
        //渲染桌面
        $(".wrapper").empty();
        $(".wrapper").append(tableData);
        //渲染头像
        $(".box-me .table-head").append("<img src='" + me + "'>");

        //渲染扑克
        for (i = 0; i < 27; i++) {
            var index = data.pokerList[i];
            $(".box-me .menu").append("<div class='poker'><img src='" + pkdata[index] + "' id='"+index+"'></div>");
            $(".box-other .menu").append("<div class='poker'><img src='" + back + "'></div>");
        }

        if(data.first == 0) {
                $("#btnPush").hide();
                $("#btnClean").hide();
        }
        
    });

    socket.on('discard', function(data) {
        $(".box-other .table-pk").empty();
        for (i = 0; i < data.pokerList.length; i++) {
            var index = data.pokerList[i];
            $(".box-other .table-pk").append("<div class='poker'><img src='" + pkdata[index] + "' id='"+index+"'></div>");
            $(".box-other .menu").children('.poker').first().remove();
        }
        //显示出牌菜单
        $("#btnPush").show();
        $("#btnClean").show();
    });

    socket.on('gameover', function(data) {
        $(".wrapper").empty();
        $(".wrapper").append(resultData);
        $(".result-info").text(data);
    });

}

function doLogin() {
    uid = $("#usr").val();
    socket.emit('join', uid);
}

function doSelectPoker() {
    $(this).toggleClass('selected');
}

function doPushPoker() {

    if ($(".selected").length == 0) {
        alert("请选择要出的牌，若没有请点击放弃");
    } else {
        $(".box-me .table-pk").empty();
        var selectedPokerList = new Array();
        $(".selected").each(function() {
            imgData = $(this).children('img').attr("src");
            imgId= $(this).children('img').attr("id");
            $(".box-me .table-pk").append("<div class='poker'><img src='" + imgData + "'></div>");
            selectedPokerList.push(imgId);
            $(this).remove();
        });

        var data= { 
            pokerList: selectedPokerList,
            from:uid,
            lost:false
        };
        socket.emit('discard', data);

        $("#btnPush").hide();
        $("#btnClean").hide();
    };
}