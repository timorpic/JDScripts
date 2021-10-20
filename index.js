/*
 * @layout: post
 * @title: Templates
 * @date: Do not edit
 * @updated: Do not edit
 * @categories: - 分类1, - 分类2
 * @tags: - 标签1, - 标签2
 * @description: 描述
 * @keywords: - 关键字1, -关键字2
 * @comments: true/false
 * @photos: - photo_url_1, - photo_url_2, - photo_url_3
 * @link: 文章的外部url链接
 * @abbrlink: 
 */
//'use strict';
exports.main_handler = async (event, context, callback) => {
  try {
    const { TENCENTSCF_SOURCE_TYPE, TENCENTSCF_SOURCE_URL } = process.env
    //如果想在一个定时触发器里面执行多个js文件需要在定时触发器的【附加信息】里面填写对应的名称，用 & 链接
    //例如我想一个定时触发器里执行jd_speed.js和jd_bean_change.js，在定时触发器的【附加信息】里面就填写 jd_speed&jd_bean_change
    for (const v of event["Message"].split("&")) {
      console.log(v);
      var request = require('request');
      switch (TENCENTSCF_SOURCE_TYPE) {
        case 'local':
          //1.执行自己上传的js文件
          delete require.cache[require.resolve('./'+v+'.js')];
          require('./'+v+'.js')
          break;
        case 'git':
          //2.执行github远端的js文件(因github的raw类型的文件被墙,此方法云函数不推荐)
          request(`https://ghproxy.com/https://raw.githubusercontent.com/timorpic/JDScripts/main/${v}.js`, function (error, response, body) {
            eval(response.body)
          })
          break;
        case 'custom':
          //3.执行自定义远端js文件网址
          if (!TENCENTSCF_SOURCE_URL) return console.log('自定义模式需要设置TENCENTSCF_SOURCE_URL变量')
          request(`${TENCENTSCF_SOURCE_URL}${v}.js`, function (error, response, body) {
            eval(response.body)
          })
          break;
        default:
          //执行自己上传的js文件
          delete require.cache[require.resolve('./'+v+'.js')];
          require('./'+v+'.js')
          break;
      }
    }
  } catch (e) {
    console.error(e)
  }
}
