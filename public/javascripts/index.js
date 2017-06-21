/**
 * Created by Administrator on 2017/5/24.
 */

$(function () {
    var initData=null;
    var socket = io.connect('http://192.168.0.193:3000');
    var subData = null;

    socket.on('init', function (data) {
        initData=data;
        initTable();
    });
    socket.on('news', function (data) {
        console.log(data);
        socket.emit('my other event', {my: 'data'});
    });
    socket.on('suse', function (data) {
        console.log('有人用了');

        var tid = data.id;
        var pName = data.data.split(':')[0];
        $('.list').off('focus', 'tr[data-id="' + tid + '"]>td>input[data-prop="' + pName + '"]');
        $('.list tr[data-id="' + tid + '"]>td>input[data-prop="' + pName + '"]').attr('disabled', 'disabled').removeClass('nouse').addClass('inuse');
    });
    socket.on('subdata', function (data) {
        console.log('有人提交了');

        var tid = data.id;
        var pName = data.data.split(':')[0];
        var pVal=data.data.split(':')[1];
        $('.list').off('focus', 'tr[data-id="' + tid + '"]>td>input[data-prop="' + pName + '"]');
        $('.list tr[data-id="' + tid + '"]>td>input[data-prop="' + pName + '"]').attr('disabled', 'disabled').removeClass('inuse').addClass('book').val(pVal);
    });

    socket.on('snouse', function (data) {
        //console.log('有人不用了');
        console.log(data);
        var tid = data.id;
        var pName = data.data.split(':')[0];
        $('.list tr[data-id="' + tid + '"]>td>input[data-prop="' + pName + '"]').removeAttr('disabled').removeClass('inuse').addClass('nouse');
        $(".list").on('focus', 'tr[data-id="' + tid + '"]>td>input[data-prop="' + pName + '"]', function () {
            TDFocus(this);
        });
    });

    function initTable() {
        var tbody = $('.list>tbody');
        tbody.html('');
        if (initData) {
            for (var i = 0; i < initData.length; i++) {
                var obj = initData[i];
                var className='book';
                if(obj.A1=='0')
                {
                    className='nouse'
                }
                var $tr = $('<tr data-id="' + obj.ID + '"><td>' + obj.DT + '</td><td><input type="text" data-prop="A1"></td><td><input type="text" data-prop="A2"></td><td><input  type="text" data-prop="A3"></td><td><input type="text" data-prop="A4"></td></tr>');

                for (var j = 1; j <=4; j++) {
                    var $ipt=  $tr.find('input[data-prop="A'+j+'"]');
                    var ival=obj[('A'+j)];
                    if (ival!='0') {
                        $ipt.addClass('book').attr('disabled','disabled').val(ival);
                    }
                    else{
                        $ipt.addClass('nouse');
                    }
                }
                tbody.append($tr);
            }
        }
    }

    $(".list").on('focus', 'input.nouse', function () {
        TDFocus(this);
        $(this).on('blur', function () {
            TDBlur(this);
        });
    });

    //获取焦点事件
    function TDFocus(obj) {
        //console.log('获取了焦点');
        //$("#dlog").html("出发了" + (new Date()).getTime())
        var tid = $(obj).parent().parent().attr('data-id');
        var pName = $(obj).attr('data-prop');
        var data = {id: tid, data: pName + ':1'};
        //发送服务端数据
        socket.emit('use', data);
    }

    //失去焦点事件
    function TDBlur(obj) {
        //console.log('失去了焦点');
        var tid = $(obj).parent().parent().attr('data-id');
        var pName = $(obj).attr('data-prop');
        var data = {id: tid, data: pName + ':0'};
        var val = $(obj).val();
        if (val.length == "") {
            //发送服务端数据
            socket.emit('nouse', data);
        }
        else {
            subData = {id: tid, data: pName + ':' + val};
        }
    }
    //提交
    $('#btnOk').click(function(){
        if(subData!=null){
            var tid=subData.id;
            var pName=subData.data.split(':')[0];
            var pVal=subData.data.split(':')[1];
            if(pVal.length>3)
            {
                alert('Yo,名字还挺长啊,赶紧改成2-3字的！！');
                return;
            }
            if(confirm('确定提交么？')){

                $('.list').off('focus', 'tr[data-id="' + tid + '"]>td>input[data-prop="' + pName + '"]');
                $('.list tr[data-id="' + tid + '"]>td>input[data-prop="' + pName + '"]').attr('disabled','disabled');
                socket.emit('subdata', subData);
                subData=null;
            }
        }else {
            alert('你确定改了数据了？')
        }
    });
});

