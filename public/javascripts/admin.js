/**
 * Created by Administrator on 2017/5/27.
 */
$(function () {

    var socket = io.connect('http://192.168.0.193:3000');


    $("#btnSub").click(function () {
        var subStr = $("#subData").val();

        try {
            if (subStr.length == 0) {
                alert('不能为空！')
                return;
            }
            var data = JSON.parse(subStr);
            socket.emit('changedata', data);
            $('#dlog').append('修改完成 好厉害！')

           setTimeout(function(){
               $('#dlog').empty();
           },3000);
        }
        catch (e) {
            alert('数据格式不对！')
        }

    });

});