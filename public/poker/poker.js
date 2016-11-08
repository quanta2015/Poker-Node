var INIT             =   1;
var WAITJOIN   =   2;
var DISCARD     =  3;
var WAIT            =  4;
var GAMEOVER =  5;

var pkObj = {
    data:{
        status: INIT,
        root:null,
        pkBoxS:null,
        pkBoxO:null,
        dsBoxS:null,
        dsBoxO:null,
        socket:null,
        uid:null,
        pkNum:27
    },
    init: function() {
        var that = this.data;
        that.root = $(".wrapper");
        that.root.append(loginData);

        that.socket = io();

        //等待对方加入
        that.socket.on('waiting', function() {
            that.root.empty();
            that.root.append(waitData);
        });

        //出牌消息
        that.socket.on('start', function(data) {
            that.root.empty();
            that.root.append(tableData);
            that.pkBoxS = $(".box-me .menu");
            that.pkBoxO = $(".box-other .menu");
            that.dsBoxS = $(".box-me .table-pk");
            that.dsBoxO = $(".box-other .table-pk");

            for (i = 0; i < that.pkNum; i++) {
                var index = data.pokerList[i];
                that.pkBoxS.append("<div class='poker'><img src='" + pkdata[index] + "' id='"+index+"'></div>");
                that.pkBoxO.append("<div class='poker'><img src='" + back + "'></div>");
            }
            if(data.first == 0) {
                $(".box-me .table-menu").hide();
                that.status = WAIT;
            }else{
                that.status = DISCARD;
            }
        });

        //出牌
        that.socket.on('discard', function(data) {

            that.dsBoxO.empty();
            for (i = 0; i < data.pokerList.length; i++) {
                var index = data.pokerList[i];
                that.dsBoxO.append("<div class='poker'><img src='" + pkdata[index] + "' id='"+index+"'></div>");
                that.pkBoxO.children('.poker').first().remove();
            }
            $(".box-me .table-menu").show();
            that.status = DISCARD;
        });

        that.socket.on('gameover', function(data) {
            that.root.empty();
            that.root.append(resultData);
            $(".result-info").text(data);
        });
    },
    login: function() {
        uid = $("#usr").val();
        this.data.socket.emit('join', uid);
        this.data.status = WAITJOIN;
    },

    discard: function() {
        var that = this.data;
        var selectedList = $(".selected");

        if (selectedList.length == 0) {
            alert("请选择要出的牌，若没有请点击放弃");
        } else {
            that.dsBoxS.empty();
            var selectedPokerList = new Array();
            selectedList.each(function() {
                imgData = $(this).children('img').attr("src");
                imgId= $(this).children('img').attr("id");
                that.dsBoxS.append("<div class='poker'><img src='" + imgData + "'></div>");
                selectedPokerList.push(imgId);
                $(this).remove();
            });

            var data= { 
                pokerList: selectedPokerList,
                from:uid,
                lost:false
            };
            that.socket.emit('discard', data);
            $(".box-me .table-menu").hide();
            that.status = WAIT;
        };
    }
}


$(init);

function init() {
    pkObj.init();
    $("body").on("click", statusMachine);
}

function statusMachine(e) {
    var tag = $(e.target).parent();
    var id = $(e.target).attr("id");
    var cls = $(e.target).parent().attr("class");
    if (cls == "poker") {
        id = cls;
    }

    switch(pkObj.data.status) {
        case INIT:
            doInit(id);
            break;
        case DISCARD:
            doDiscard(id,tag);
            break; 
    }
}

function doInit(id) {
    if (id == "loginBtn") {
        pkObj.login();
    }
}

function doDiscard(id,tag) {
    if (id == "btnPush") {
        pkObj.discard();
    }else if (id == "poker") {
        tag.toggleClass('selected');
    }
}