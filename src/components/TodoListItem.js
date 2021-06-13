import React from "react";

const TodoListItem = ({ todo, id, handleDelete }) => {
  return (
    <li className="list-group-item">
      <a href="#" className="green-text">
        {todo}
      </a>

      <button
        type="button"
        className="btn red btn-sm black-text"
        style={{ float: "right", marginLeft: ".5rem" }}
        onClick={() => handleDelete(id)}
      >
        Delete
      </button>
    </li>
  );
};

export default TodoListItem;
