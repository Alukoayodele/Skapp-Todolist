import React from "react";
import TodoListItem from "./TodoListItem";

const TodoList = ({ loading, todoList, handleDelete }) => {
  console.log("list here", todoList);

  return (
    <ul className="list-group " style={{ width: "700px", marginTop: "2rem" }}>
      {todoList === null || loading === true ? (
        <p className="center"> No list to show...</p>
      ) : (
        todoList?.map((currentTodoObject) => {
          return (
            <TodoListItem
              key={currentTodoObject.id}
              todo={currentTodoObject.todo}
              id={currentTodoObject.id}
              handleDelete={handleDelete}
            />
          );
        })
      )}
    </ul>
  );
};

export default TodoList;
