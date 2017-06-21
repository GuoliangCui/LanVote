# LanVote
局域网投票基于Socket

#运行方法
npm install 安装依赖包

修改 public/javascripts/index.js 中的监听地址
  line 7:  var socket = io.connect('http://localhost:3000');
  改为 本机局域网IP 如：var socket = io.connect('http://192.168.0.193:3000');

 如果没有安装PM2 可以运行 npm start

 如果已经安装了PM2 执行 PM2 start ./bin/www