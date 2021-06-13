import React from "react";
// import { connect } from "react-redux";
// import { deleteTodo } from "../../actions/TodoActions";

const Button = () => {
  const handleDelete = () => {};
  return (
    <div style={{ float: "right" }}>
      <button
        type="button"
        class="btn btn-warning btn-sm"
        style={{ marginRight: ".5rem" }}
      >
        Edit
      </button>
      <button
        type="button"
        class="btn btn-danger btn-sm"
        onClick={handleDelete}
      >
        Delete
      </button>
    </div>
  );
};
// const mapStateToProps = (state) => ({
//   todos: state.todos,
// });

export default Button;
