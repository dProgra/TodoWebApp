const express = require("express");
const app = express();
const host = "localhost";
const port = 3001;
var cors = require("cors");

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

MAXIMUM_TITLE_LENGTH = 500;

//In-memory todo list
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

const sql = require("mssql");

sqlConfig = {
  user: "NewUser",
  password: "1",
  database: "TodosDB",
  server: "localhost",
  port: 1434,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

// const testConnection = async () => {
//   try {
//     // make sure that any items are correctly URL encoded in the connection string
//     await sql.connect(sqlConfig);
//     const result = await sql.query`select * from Employee`;
//     console.log(result);
//   } catch (err) {
//     console.log("db error", err);
//   }
// };

// testConnection();

//Return the entire array of todos
app.route("/todos/all").get((req, res) => {
  sql
    .connect(sqlConfig)
    .then(() => {
      return sql.query`SELECT * FROM Todos ORDER BY id DESC`;
    })
    .then((queryResponse) => {
      // send records as a responses
      console.log("completed query. response:", queryResponse);
      res.status(200).json(queryResponse.recordset);
    });
});

//Add a single new todo
app.route("/todo/add").post((req, res) => {
  //let newTodo = req.body;
  let newTodo = {
    id: null,
    title: null,
    completed: false,
  };
  //Check that the values are of the appropriate types and in the appropriate ranges
  if (typeof req.body.title === "string" || req.body.title instanceof String) {
    if (req.body.title.length <= MAXIMUM_TITLE_LENGTH) {
      newTodo.title = req.body.title;
    } else {
      res
        .status(413)
        .json({ backendStatus: "failure", message: "title too long" });
      return;
    }
  } else {
    res
      .status(400)
      .json({ backendStatus: "failure", message: "title not a string" });
    return;
  }
  sql
    .connect(sqlConfig)
    .then(() => {
      return sql.query`INSERT INTO Todos (userId, title, completed) VALUES (1,${newTodo.title},${newTodo.completed});SELECT @@IDENTITY AS ID`;
    })
    .then((queryResponse) => {
      // send records as a responses
      console.log("completed query. response:", queryResponse);
      res
        .status(201)
        .json({ backendStatus: "success", id: queryResponse.recordset[0].id });
    });
  //Assign the todo a unique id from the current time, then push to the array,
  //then return success.
  // todoList.unshift(newTodo);
  // res.status(201).json({ backendStatus: "success", id: newTodo.id.toString() });
});

//Update the title field of the todo with the given id
app.route("/todo/update").put((req, res) => {
  //Check that the values are of the appropriate types and in the appropriate ranges
  if (typeof req.body.title === "string" || req.body.title instanceof String) {
    if (!(req.body.title.length <= MAXIMUM_TITLE_LENGTH)) {
      res
        .status(413)
        .json({ backendStatus: "failure", message: "title too long" });
      return;
    }
  } else {
    res
      .status(400)
      .json({ backendStatus: "failure", message: "title not a string" });
    return;
  }
  let id = req.body.id;
  let todoUpdateText = req.body.title;

  //Search for the todo with the matching id and update its title field,
  //then return success

  sql
    .connect(sqlConfig)
    .then(() => {
      return sql.query`UPDATE Todos SET title = ${todoUpdateText} WHERE id = ${id}`;
    })
    .then((queryResponse) => {
      // send records as a responses
      console.log("completed query. response:", queryResponse.rowsAffected[0]);
      if (1 === queryResponse.rowsAffected[0]) {
        res.status(200).json({
          backendStatus: "success",
        });
      } else {
        //Return server failure if no match is found
        res.status(500).json({
          backendStatus: "failure",
          message: `no match found for id ${id}`,
        });
      }
    });
});

//Update the completed field of the todo with the given id
app.route("/todo/complete").put((req, res) => {
  //Check that the values are of the appropriate types
  if (
    !(
      typeof req.body.completed === "boolean" ||
      req.body.completed instanceof Boolean
    )
  ) {
    res.status(400).json({
      backendStatus: "failure",
      message: "completed field is not a boolean",
    });
    return;
  }
  let id = req.body.id;
  let completed = req.body.completed;
  //console.log("completed:", completed);
  //Search for the todo with the matching id and update its completed field,
  //then return success

  sql
    .connect(sqlConfig)
    .then(() => {
      return sql.query`UPDATE Todos SET completed = ${completed} WHERE id = ${id}`;
    })
    .then((queryResponse) => {
      // send records as a responses
      console.log("completed query. response:", queryResponse);
      if (1 === queryResponse.rowsAffected[0]) {
        res.status(200).json({
          backendStatus: "success",
        });
      } else {
        //Return server failure if no match is found
        res.status(500).json({
          backendStatus: "failure",
          message: `no match found for id ${id}`,
        });
      }
    });
});

//Delete the todo with the given id
app.route("/todo/delete").delete((req, res) => {
  let id = req.body.id;
  //Search for the todo with the matching id and delete,
  //then return success

  sql
    .connect(sqlConfig)
    .then(() => {
      return sql.query`DELETE FROM Todos WHERE id=${id}`;
    })
    .then((queryResponse) => {
      // send records as a responses\
      console.log("completed query. response:", queryResponse);
      if (0 !== queryResponse.rowsAffected[0]) {
        res.status(200).json({
          backendStatus: "success",
        });
      } else {
        //Return server failure if no match is found
        res.status(500).json({
          backendStatus: "failure",
          message: `no match found for id ${id}`,
        });
      }
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://${host}:${port}`);
});
