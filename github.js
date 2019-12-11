const axios = require("axios");
const { parseLinkHeader } = require("./utils");

const getStarGazersCount = async repo => {
  // TODO: fix it
  //return 1;

  const res = await axios.get(
    `https://api.github.com/repos/raihanul-2k15/${repo}`
  );
  return res.data.stargazers_count;
};

const getStarGazers = async repo => {
  // TODO: fix it
  //return ["raihanul-testing", "other-testing"];

  let gazers = [];
  let nextLink = `https://api.github.com/repos/raihanul-2k15/${repo}/stargazers?per_page=100`;

  do {
    console.log("Requesting star gazers data from github...");
    let response = null;
    try {
      response = await axios.get(nextLink);
    } catch (err) {
      console.log("Caught error!");
      console.log(err);
    }
    let someGazersInfo = response.data;
    gazers = [...gazers, ...someGazersInfo.map(i => i.login)];
    if (response.headers.link === undefined) {
      nextLink = undefined;
    } else {
      let paginationLinks = parseLinkHeader(response.headers.link);
      nextLink = paginationLinks.next;
    }
  } while (nextLink !== undefined);
  return gazers;
};

module.exports = { getStarGazers, getStarGazersCount };
