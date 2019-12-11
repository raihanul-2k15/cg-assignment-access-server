function parseLinkHeader(header) {
  if (header.length === 0) {
    throw new Error("input must not be of zero length");
  }

  // Split parts by comma
  let parts = header.split(",");
  let links = {};
  // Parse each part into a named link
  for (let i = 0; i < parts.length; i++) {
    let section = parts[i].split(";");
    if (section.length !== 2) {
      throw new Error("section could not be split on ';'");
    }
    let url = section[0].replace(/<(.*)>/, "$1").trim();
    let name = section[1].replace(/rel="(.*)"/, "$1").trim();
    links[name] = url;
  }
  return links;
}

module.exports = { parseLinkHeader };
