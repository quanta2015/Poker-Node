


//从一个给定的数组arr中,随机返回num个不重复项
function getArrItems(arr, num) {
    var temp = new Array();
    var result = new Array();

    for (var index in arr) {
        temp.push(arr[index]);
    }
    for (var i = 0; i < num; i++) {
        if (temp.length > 0) {
            var arrIndex = Math.floor(Math.random() * temp.length);
            result[i] = temp[arrIndex];
            temp.splice(arrIndex, 1);
        } else {
            break;
        }
    }
    return result;
}
//从一个给定的数组arr中,随机返回num个不重复项
function getArrSubtract(arr, sub) {
    var temp1 = new Array();
    var temp2 = new Array();
    for (var index in arr) {
        temp1.push(arr[index]);
    }
    for (var index in sub) {
        temp2.push(sub[index]);
    }
    for (var i = temp1.length - 1; i >= 0; i--) {
        a = temp1[i];
        for (var j = temp2.length - 1; j >= 0; j--) {
            b = temp2[j];
            if (a == b) {
                temp1.splice(i, 1);
                temp2.splice(j, 1);
                break;
            }
        }
    }
    return temp1;
}

exports.getPoker = function() {
    var list = new Array();
    var result = {};
    for (var i = 0; i < 54; i++) {
        list[i] = i;
    }
    var poker1 = getArrItems(list, 27);
    var poker2 = getArrSubtract(list, poker1);

    result = {
        poker1: poker1,
        poker2: poker2
    };

    return result;
}