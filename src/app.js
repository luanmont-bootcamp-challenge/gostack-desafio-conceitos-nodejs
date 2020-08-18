const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');


const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepository(request, response, next){
  const { id } = request.params;


  if(!isUuid(id)){
    return response.status(400).json({error: 'Invalid repositoy ID'});
  }

  

  return next();
}


app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs, likes = 0 } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes,
  }
  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", validateRepository, (request, response) => {
  const { id } = request.params;

  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  

  const repositoryEdit = {
    id,
    title,
    url,
    techs,
    likes:0
  }

  repositories[repositoryIndex] = repositoryEdit;
  return response.status(200).json(repositoryEdit);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  repositories[repositoryIndex].likes += 1;
  


  return response.status(200).json(repositories[repositoryIndex]);


});

module.exports = app;
