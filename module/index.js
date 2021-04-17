const axios = require("axios");
const cheerio = require("cheerio");

function started(url) {
  console.log(`started:${url}`);
  const { origin } = new URL(url);

  axios.get(url).then((res) => {
    var $ = cheerio.load(res.data);

    const imgList = $("#hgallery img");
    const nextPageUrl = $("#pages .a1:last-child").attr("href");

    const imgUrlList = imgList.map((_, item) => cheerio(item).attr("src"));

    console.log("imgUrlList", imgUrlList);

    // if (nextPageUrl.includes(".html")) {
    //   started(`${origin}${nextPageUrl}`);
    // }
  });
}

module.exports = started;

// 1. 解析页面内容
// 1.1找到图片地址进行下载
// 1.2找到下一页的地址
// 2. startd(nextPageUrl)
