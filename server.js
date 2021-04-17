const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const PORT = 30001;
const app = express();

const entryUrl = "https://www.invshen.net/g/35469";

function started(url) {
  return axios.get(url).then((res) => {
    const pool = [];
    const { origin } = new URL(url);

    const $ = cheerio.load(res.data);
    const nextPageUrl = $("#pages .a1:last-child").attr("href");

    const imgElemList = $("#hgallery img");

    imgElemList.map((_, item) => {
      const src = $(item).attr("src");
      pool.push(src);
    });

    if (nextPageUrl.includes(".html")) {
      return {
        pool,
        nextPage: `${origin}${nextPageUrl}`,
      };
    }

    return {
      pool,
      nextPage: "",
    };
  });
}

function test(url) {
  let pool = [];

  return new Promise((resolve) => {
    function ggg(address) {
      started(address)
        .then((res) => {
          pool = pool.concat(res.pool);
          if (res.nextPage) {
            ggg(res.nextPage);
          } else {
            resolve(pool);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
    ggg(url);
  });
}

app.get("/getImgList", (request, response) => {
  console.log(`started:${entryUrl}`);

  test(entryUrl).then((arr) => {
    response.send(arr);
  });
});

app.listen(PORT, () => {
  console.log(`app is running at port ${PORT}`);
});
