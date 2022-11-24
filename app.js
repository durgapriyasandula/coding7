const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "cricketMatchDetails.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
  };
};

//API1//
app.get("/players/", async (request, respponse) => {
  const playersQuery = `SELECT * FROM player_details`;
  const obj = await database.all(playersQuery);
  response.send(
    obj.map((eachPlayer) => convertDbObjectToResponseObject(eachPlayer))
  );
});

//API2//
app.get("/players/:playerId/",async(request,response)=>{
    const {playerId} = request.params;
    const specificPlayerQuery = `SELECT * FROM player_details WHERE player_id=${playerId}`;
    const ob=await database.get(specificPlayerQuery);
    response.send({convertDbObjectToResponseObject(ob)});
});

//API3//
app.put("/players/:playerId/",async(request,response)=>{
    const {playerId} = request.params;
    const {playerName} = request.body;
    const updateQuery = `UPDATE player_details SET player_name=${playerName} WHERE player_id=${playerId}`;
    await.database.run(updateQuery);
    response.send("Player Details Updated");
});

//API4//
app.get("/matches/:matchId/", async(request,response)=>{
    const {matchId} = request.params;
    const matchQuery = `SELECT * FROM player_details WHERE match_id=${matchId}`;
    const match=await database.get(matchQuery);
    response.send({convertDbObjectToResponseObject(match)});
});

//API5//
app.get("/players/:playerId/matches",async(request,response)=>{
    const {playerId} = request.params;
    const Query = `SELECT match_id,match,year FROM match_details NATURAL JOIN player_match_score WHERE player_id=${playerId}`;
    const matches = await database.all(Query);
    respons.send(matches.map((eachMatch)=> convertDbObjectToResponseObject(eachMatch)));
});

//API6//
app.get("/matches/:matchId/players",async(request,response)=>{
    const {matchId} = request.params;
    const QuerySix = `SELECT player_id,player_name FROM player_details NATURAL JOIN player_match_score WHERE match_id=${matchId};`;
    const Six = await database.all(QuerySix);
    response.send(Six.map((each) =>
      convertDbObjectToResponseObject(each)
    ));
});

module.exports = app;
