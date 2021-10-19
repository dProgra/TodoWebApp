import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";

const initialTodoList = [];

let initialState = {
  todoList: initialTodoList,
  other: { user: "Bart" },
};

function myReducer(state = initialState, action) {
  switch (action.type) {
    case "GET_TODOS": {
      const newTodoList = action.payload;
      state = { ...state, todoList: newTodoList };
      return state;
    }
    case "ADD_TODO": {
      const id = action.payload.id;
      const title = action.payload.title;
      let newTodo = {
        id: id,
        title: title,
        completed: false,
      };
      const newTodoList = [newTodo, ...state.todoList];
      state = { ...state, todoList: newTodoList };
      return state;
    }
    case "DELETE_TODO": {
      const id = action.payload;
      const newTodoList = state.todoList.filter((todo) => {
        return todo.id !== id;
      });
      state = { ...state, todoList: newTodoList };
      return state;
    }
    case "EDIT_TODO": {
      const id = action.payload.id;
      const title = action.payload.title;
      const newTodoList = state.todoList.map((todo) => {
        if (id === todo.id) {
          let newTodo = {
            ...todo,
            title: title,
          };
          return newTodo;
        } else {
          return todo;
        }
      });
      state = { ...state, todoList: newTodoList };
      return state;
    }
    case "CHANGE_COMPLETED_STATUS": {
      const id = action.payload.id;
      const completed = action.payload.completed;
      const newTodoList = state.todoList.map((todo) => {
        if (id === todo.id) {
          let newTodo = {
            ...todo,
            title: completed,
          };
          return newTodo;
        } else {
          return todo;
        }
      });
      state = { ...state, todoList: newTodoList };
      return state;
    }
    default: {
      return state;
    }
  }
}

const myStore = createStore(myReducer, applyMiddleware(thunk));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={myStore}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
