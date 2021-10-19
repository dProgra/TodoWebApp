const { v4: uuidv4 } = require("uuid");

console.log("hello from the server", uuidv4());

let todoList = [
  {
    userId: 1,
    id: 1,
    title: "delectus aut autem",
    completed: false,
  },
  {
    userId: 1,
    id: 2,
    title: "quis ut nam facilis et officia qui",
    completed: true,
  },
  {
    userId: 1,
    id: 3,
    title: "fugiat veniam minus",
    completed: false,
  },
  {
    userId: 1,
    id: 4,
    title: "et porro tempora",
    completed: true,
  },
];
const http = require("http");

const hostname = "localhost";
const port = 3000;

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/JSON");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.statusCode = 404;
  console.log("req.url", req.url);
  if("OPTIONS" == req.method){
    res.statusCode = 200;
    res.end("1");
  } else if (req.url == "/todos/all" && "GET" == req.method) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/JSON");
    res.end(JSON.stringify(todoList));
  } else if (req.url == "/todo/add" && "POST" == req.method) {
    res.setHeader("Content-Type", "text/plain");
    res.statusCode = 200;
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString(); // convert Buffer to string
    });
    req.on("end", () => {
      //console.log(body);
      let newTodo = JSON.parse(body);
      //TODO: check if request is valid todo object
      let id = new Date().getTime();
      newTodo.id = id;
      todoList.push(newTodo);
      res.end(JSON.stringify({backendStatus: "success",
      id: id.toString()}));
    });
  } else if (req.url == "/todo/update" && "PUT" == req.method) {
    res.setHeader("Content-Type", "text/plain");
    res.statusCode = 200;
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString(); // convert Buffer to string
    });
    req.on("end", () => {
      console.log("update body:", body);
      let updatedTodo = JSON.parse(body);
      let id = updatedTodo.id;
      let updatedTodoText = updatedTodo.title;

      for(let i = 0; i < todoList.length; i++){
        {
          console.log("todo.id:", todoList[i].id)
          if(id == todoList[i].id){
            todoList[i].title = updatedTodoText;
            res.end(JSON.stringify({backendStatus: "success"}));
            return;
          }
        }
      }
      res.end(JSON.stringify({backendStatus: "failure"}));
    });
  } else if (req.url == "/todo/complete" && "PUT" == req.method) {
    res.setHeader("Content-Type", "text/plain");
    res.statusCode = 200;
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString(); // convert Buffer to string
    });
    req.on("end", () => {
      console.log("update body:", body);
      let updatedTodo = JSON.parse(body);
      let id = updatedTodo.id;
      let completed = updatedTodo.completed;
      console.log("completed:", completed);
      for(let i = 0; i < todoList.length; i++){
        {
          console.log("todo.id:", todoList[i].id)
          if(id == todoList[i].id){
            todoList[i].completed = completed;
            res.end(JSON.stringify({backendStatus: "success"}));
            return;
          }
        }
      }
      res.end(JSON.stringify({backendStatus: "failure"}));
    });
  }else if (req.url == "/todo/delete" && "DELETE" == req.method) {
    res.setHeader("Content-Type", "text/plain");
    res.statusCode = 200;
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString(); // convert Buffer to string
    });
    req.on("end", () => {
      console.log("delete body:", body);
      let id = JSON.parse(body).id;
      console.log("id:", id);

      for(let i = 0; i < todoList.length; i++){
        {
          console.log("todo.id:", todoList[i].id)
          if(id == todoList[i].id){
            todoList.splice(i, 1);
            res.end(JSON.stringify({backendStatus: "success"}));
            break;
          }
        }
      }
      res.end(JSON.stringify({backendStatus: "failure"}));
    });
  } else if (req.url == "/animals") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("dog, cat, mouse");
  } else if (req.url == "/condiments") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("mustard, ketchup, horseradish");
  } else {
    res.setHeader("Content-Type", "text/plain");
    res.end("O_o enter valid url route or request method");
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
