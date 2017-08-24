// 引入库
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

// 定义需要访问的url以及头配置
let context = '';
let url = 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise'
let option = {
    url: url,
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.6',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Mobile Safari/537.36',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive'
    }
};

// 使用resqyest访问页面
let promise = new Promise((resolve, reject) => {
	request(option, (error, response, body) => {
	    if (!error && response.statusCode == 200) {
	    	// 使用cheerio来筛选页面需要的元素
	        let $ = cheerio.load(body, {
	            ignoreWhitespace: true,
	            xmlMode: true
	        });
			context = $('body').find('.note').text();
			resolve("成功!"); //代码正常执行！
	    } else {
	    	console.log(error);
	    }
	});
    
});

// 使用fs将读取到的写入文件保存
promise.then((successMessage) => {
	fs.writeFile('message.txt', context, 'utf-8', function(err) {
	    if (err) {
	        console.error("文件生成时发生错误.");
	        throw err;
	    }
	    console.info('文件已经成功生成.');
	});
});