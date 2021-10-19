import "./index.css";
import { useEffect } from "react";
import TodoList from "./todolist";
import AddNewTodo from "./addnewtodo";
import { useDispatch } from "react-redux";
import { getTodosAction } from "./todoActions";

export default function App() {
  console.log("host:", process.env.REACT_APP_API_HOST);
  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTodosAction());
  }, []);

  return (
    <div className="App">
      <div className="card m-5">
        <div className="card-body">
          <h1>Important Todos:</h1>
          <AddNewTodo />
          <ul id="todoList" className="list-group">
            <TodoList />
          </ul>
        </div>
      </div>
    </div>
  );
}
