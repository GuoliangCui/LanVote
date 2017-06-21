/**
 * Created by Administrator on 2017/5/24.
 */
var fs = require('fs');
var filePath = '../data/data.json';

var ioObj = function () {
    this.initData = [];
    this.init = function (io) {
        var that=this;
        io.on('connection', function (socket) {
            formatData();
            socket.emit('init', initData);

            //socket.emit('pulish',{hello:'world'});

            socket.on('submit', function (data) {
                var data = {id: '', data: 'A1:张三'};
                console.log(data);
            });

            socket.on('use', function (data) {
                socket.broadcast.emit('suse', data);
            });
            socket.on('nouse', function (data) {
                socket.broadcast.emit('snouse', data);
            });
            socket.on('subdata', function (data) {

                for (var i = 0; i < initData.length; i++) {
                    var obj = initData[i];
                    if (obj.ID == data.id) {
                        var pName = data.data.split(':')[0];
                        var pVal = data.data.split(':')[1];
                        obj[pName] = pVal;
                    }
                }
                console.log('有人提交');
                console.log(initData);
                that.upDB();
                socket.broadcast.emit('subdata', data);
            });
            socket.on('changedata',function(data){
                if (data.type == 1) {
                    for (var i = 0; i < initData.length; i++) {
                        var obj = initData[i];
                        for (var j =1; j <= 4; j++) {
                            obj[('A'+j)]='';
                        }
                    }
                    that.upDB();
                    socket.broadcast.emit('init', initData);
                }
                if(data.type==2){
                    var tid=data.id;
                    var pv=data.data.split(':');
                    var pName=pv[0];
                    var pVal=pv.length>1?pv[1]:'';
                    for (var i = 0; i < initData.length; i++) {
                        var obj = initData[i];
                        if (obj.ID == tid) {
                            obj[pName]=pVal;
                        }
                    }
                    that.upDB();
                    socket.broadcast.emit('subdata', {id:data.id,data:data.data});
                }

            });
        });
    }

    this.upDB = function () {
        var result = JSON.stringify(initData);
        fs.writeFileSync(filePath,result);
    }

    function formatData() {
        //console.log(fs);
        var result = JSON.parse(fs.readFileSync(filePath).toString());
        //fs.readFile(filePath,function(err,data){
        //    console.log(data);
        //});
        console.log(result);
        //数据库获取
        //initData=[
        //    {ID:'11',DT:'5月24日',A1:'',A2:'',A3:'',A4:'231'},
        //    {ID:'22',DT:'5月25日',A1:'',A2:'',A3:'',A4:''}
        //];
        initData = result;
        for (var i = 0; i < initData.length; i++) {
            var obj = initData[i];
            if (obj.A1 == '') {
                obj.A1 = '0';
            }
            if (obj.A2 == '') {
                obj.A2 = '0';
            }
            if (obj.A3 == '') {
                obj.A3 = '0';
            }
            if (obj.A4 == '') {
                obj.A4 = '0';
            }
        }
    }
};
module.exports = new ioObj();