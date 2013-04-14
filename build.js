/**
 * 构建网站的主页面
 */

var ejs = require('ejs');
var fs = require('fs');
var parse = require('xml2json');

console.log('--------------- render blog ---------------');
var xml = fs.readFileSync(__dirname + '/blogs/all.xml', 'utf8');
var blogs = JSON.parse(parse.toJson(xml)).rss.channel.item;

var blogContent = '<h1>博客</h1><ul>'
for (var i = 0; i < blogs.length; i++) {
  var blog = blogs[i];
  var title = blog.title;
  var link = blog.link;
  blogContent += '<li><a href="' + link + '">' + title + '</a></li>\n';
}
blogContent += '</ul>'

console.log('--------------- finish render blog ---------------');

var layoutPage = 'layout';
var pages = ['index', 'blog', 'slider', 'contact'];

console.log('--------------- reading layout ---------------');
str = fs.readFileSync(__dirname + '/' + layoutPage + '.html', 'utf8');
console.log('--------------- finish read layout ---------------');

pages.forEach(function (item) {
  console.log('--------------- rendering File of ' + item + '---------------');
  var content;
  if (item === 'blog') {
    content = blogContent;
  } else {
    content = fs.readFileSync(__dirname + '/' + item + '_content.html', 'utf8');
  }

  var result  = ejs.render(str, {content: content, current: item});
  fs.writeFileSync(__dirname + '/' + item + '.html', result);
  console.log('--------------- finish render File of ' + item + '.html ---------------');
});