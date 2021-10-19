import "./index.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  editTodoAction,
  deleteTodoAction,
  changeCompletedStatusAction,
} from "./todoActions";

export default function Todo({ todo }) {
  let dispatch = useDispatch();

  let [editFlag, setEditFlag] = useState(false);
  let [localTodoTitle, setLocalTodoTitle] = useState(todo.title);
  let [checkedFlag, setCheckedFlag] = useState(todo.completed);

  let deleteHandler = (id) => {
    //deleteTodo(id);
    dispatch(deleteTodoAction(id));
  };

  let editHandler = () => {
    setEditFlag(true);
  };

  let saveHandler = () => {
    //editTodo(todo.id, localTodoTitle);
    dispatch(editTodoAction(todo.id, localTodoTitle));

    setEditFlag(false);
  };

  let checkHandler = () => {
    setCheckedFlag(!checkedFlag);
    //changeCompletedStatus(todo.id, !checkedFlag);
    dispatch(changeCompletedStatusAction(todo.id, !checkedFlag));
  };

  return (
    <div className="Todo">
      <li className="list-group-item">
        <div className="d-flex bd-highlight">
          <input
            type="checkbox"
            checked={checkedFlag}
            onChange={checkHandler}
            className="d-flex p-1 bd-highlight align-self-baseline"
          />
          {editFlag ? (
            <input
              type="text"
              value={localTodoTitle}
              className="mx-1 flex-grow-1 bd-highlight align-self-baseline text-break"
              onChange={(e) => {
                setLocalTodoTitle(e.target.value);
                console.log(checkedFlag);
              }}
            />
          ) : (
            <span className="px-2 flex-grow-1 bd-highlight align-self-baseline text-break">
              {localTodoTitle}
            </span>
          )}
          <span className="d-flex px-1 bd-highlight align-self-baseline">
            {editFlag ? (
              <i
                onClick={saveHandler}
                className="bi bi-save p-2 me-1 border border-2 rounded align-self-baseline"
              ></i>
            ) : (
              <i
                onClick={editHandler}
                className="bi bi-pencil p-2 me-1 border border-2 rounded align-self-baseline"
              ></i>
            )}

            <i
              onClick={() => {
                deleteHandler(todo.id);
              }}
              className="bi bi-trash p-2 me-1 border border-2 rounded align-self-baseline"
            ></i>
          </span>
        </div>
      </li>
    </div>
  );
}
