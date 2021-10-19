import "./index.css";
import Todo from "./todo";
import { useSelector } from "react-redux";

export default function TodoList() {
  let todoList = useSelector((store) => {
    return store.todoList;
  });
  return (
    <div className="TodoList">
      {todoList.map((todo) => {
        return <Todo key={todo.id} todo={todo} />;
      })}
    </div>
  );
}
