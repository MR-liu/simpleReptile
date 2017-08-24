let cheerio = require('cheerio');
let fs = require('fs');
let request = require('request');
let config = require('./config/api');

var context = "";
var title = "";


let i = 0;
var option = {
    url: config.api.url,
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.6',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Mobile Safari/537.36',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive'
    }
};

function page(){
  i++
  var promise = new Promise((resolve, reject) => {
    request(option, (error, response, body) => {
          if (!error && response.statusCode == 200) {
            // 使用cheerio来筛选页面需要的元素
              var $ = cheerio.load(body, {
                  ignoreWhitespace: true,
                  xmlMode: true
              }); 
          context = $('body').find('#content').text();
          config.api.nextPage = $('body').find('.bottem1').find('a').eq(2).attr('href');
          title = $('body').find('.bookname').find('h1').text();

          resolve("成功!"); //代码正常执行！
          } else {
            console.log(error);
          }
      });
  });
  // 使用fs将读取到的写入文件保存
  promise.then((successMessage) => {
    if (!config.api.nextPage) return;
    fs.writeFile('./data/章节' + i +' '+ title + '.txt', context, 'utf-8', function(err) {
        if (err) {
            console.error("文件生成时发生错误.");
            throw err;
        } else {
            console.info('文件 ' + i +' '+ title + ' 已经成功生成.' );

            option.url = config.api.nextPageHead + config.api.nextPage
            page();
        }
    });
  });
}
page()
