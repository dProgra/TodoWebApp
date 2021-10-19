import "./index.css";
import { useState } from "react";
import { addTodoAction } from "./todoActions";
import { useDispatch } from "react-redux";

const AddNewTodo = () => {
  let dispatch = useDispatch();

  let [addText, setAddText] = useState("");

  let addHandler = () => {
    console.log("here");
    let text = addText;
    if (0 === text.trim().length) {
      alert("Please enter valid task");
      return;
    } else {
      console.log("addText:", addText);
      //addTodo(addText);
      dispatch(addTodoAction(text));
      setAddText("");
    }
  };

  return (
    <div>
      <div className="form-group">
        <label htmlFor="addTodoID">New Todo</label>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            id="addTodoID"
            placeholder="Enter new todo..."
            value={addText}
            onChange={(event) => {
              setAddText(event.target.value);
            }}
          />
          <button
            data-clicktype="addtodo"
            id="addTodoButton"
            type="button"
            className="btn btn-primary"
            onClick={addHandler}
          >
            Add Todo
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewTodo;
