const express = require("express");
const cors = require("cors");
const path = require("path");

const dummy = require("./dummy").dummy;
const myGithub = require("./github");
const myDB = require("./db");
const config = require("./config");

const app = express();
app.use(cors());

app.get("/permission/:roll", (req, res) => {
  const { roll } = req.params;
  myDB.isAllowed(roll).then(allowed => {
    console.log(`Roll ${roll} requested access at ${new Date()}`);
    if (allowed !== false) {
      console.log(`Roll ${roll} already has access.`);
      res.json({ auth: true, roll });
    } else {
      // TODO: implement
      Promise.all([myDB.getAllAllowed()])
        .then(vals => {
          const [allowedROllNames] = vals;
          const ghProms = config.starsRequired.map(repo =>
            myGithub.getStarGazers(repo.name)
          );
          allowedNames = Object.values(allowedROllNames);

          let gazerRepoCount = {};
          Promise.all(ghProms).then(repo => {
            repo.forEach(gazers => {
              gazers.forEach(g => {
                if (g in gazerRepoCount) {
                  gazerRepoCount[g] += 1;
                } else {
                  gazerRepoCount[g] = 1;
                }
              });
            });

            let gazerRepoCountArray = [];
            for (g in gazerRepoCount) {
              gazerRepoCountArray.push({
                name: g,
                starredRepos: gazerRepoCount[g]
              });
            }

            gazerRepoCountArray = gazerRepoCountArray.filter(
              g => g.starredRepos === config.starsRequired.length
            );

            let isNewPerson = false;
            let newPersonName = null;
            for (let i = 0; i < gazerRepoCountArray.length; i++) {
              if (allowedNames.every(n => n !== gazerRepoCountArray[i].name)) {
                newPersonName = gazerRepoCountArray[i].name;
                isNewPerson = true;
                break;
              }
            }
            if (isNewPerson) {
              myDB
                .allowNewPerson({ roll, name: newPersonName })
                .then(() => console.log("Successfully entered into db!"))
                .catch(err => console.log("Error lol!"));
              console.log(
                `Roll ${roll} access request got accepted at ${new Date()}\nPerson Name set to ${newPersonName}`
              );
              res.json({ auth: true, roll });
            } else {
              console.log(
                `Roll ${roll} access request got denied at ${new Date()}`
              );
              res.json({
                auth: false,
                roll,
                starsRequired: config.starsRequired
              });
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  });
});

app.use(express.static(path.join(__dirname, "public")));
const PORT = process.env.PORT || 3838;
app.listen(PORT, () => console.log("Server started on port " + PORT));
