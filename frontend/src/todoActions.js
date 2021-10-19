export function getTodosAction() {
  return (dispatch, getState) => {
    fetch(`${process.env.REACT_APP_API_HOST}/todos/all`)
      .then((response) => {
        return response.json();
      })
      .then((todoListLocal) => {
        dispatch({ type: "GET_TODOS", payload: todoListLocal });
      });
  };
}

export function deleteTodoAction(id) {
  console.log("in deleteTodoAction1");

  return (dispatch, getState) => {
    console.log("in deleteTodoAction2");
    //Send a request to the backend to delete the todo with the given id
    fetch(`${process.env.REACT_APP_API_HOST}/todo/delete`, {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        //If the backend delete process is successful, then remove todo element from the list.
        //Otherwise, throw an error.
        if ("success" === data.backendStatus) {
          dispatch({ type: "DELETE_TODO", payload: id });
        } else {
          throw new Error("Error deleting todo: " + data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function addTodoAction(title) {
  console.log("in addTodoAction1");

  return (dispatch, getState) => {
    console.log("in addTodoAction2");

    //Send a request to the backend to add the new todo
    fetch(`${process.env.REACT_APP_API_HOST}/todo/add`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        //If the backend todo add process is successful, then add then give the new todo
        //its assigned id and add it to the global array.
        //Otherwise, throw an error
        if ("success" === data.backendStatus) {
          dispatch({
            type: "ADD_TODO",
            payload: { id: data.id, title: title },
          });
        } else {
          throw new Error("Error adding todo:" + data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function editTodoAction(id, title) {
  console.log("in editTodoAction1");

  return (dispatch, getState) => {
    console.log("in editTodoAction2");
    fetch(`${process.env.REACT_APP_API_HOST}/todo/update`, {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        title: title,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        //If backend process is successful, then update the in-memory list.
        //Otherwise, throw an error.
        if ("success" === data.backendStatus) {
          dispatch({ type: "EDIT_TODO", payload: { id: id, title: title } });
        } else {
          throw new Error("Error updating todo: " + data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function changeCompletedStatusAction(id, completed) {
  console.log("in changeCompletedStatusAction1");

  return (dispatch, getState) => {
    console.log("in changeCompletedStatusAction2");
    //Send the todoCompletedUpdate to the backend to update the todo with the given id
    fetch(`${process.env.REACT_APP_API_HOST}/todo/complete`, {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id, completed: completed }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if ("success" === data.backendStatus) {
          dispatch({
            type: "CHANGE_COMPLETED_STATUS",
            payload: { id: id, completed: completed },
          });
        } else {
          throw new Error(
            "Error changing todo completed status: " + data.message
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
}
