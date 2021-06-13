import React from "react";

// import M from "materialize-css/dist/js/materialize.min.js";
const TodoForm = ({
  todo,
  setTodo,
  handleLogin,
  loading,
  handleSetTodo,
  handleSumbit,
}) => {
  // console.log(todo);

  return (
    <form className="form-inline" onSubmit={handleSumbit}>
      <input
        type="text"
        className="form-control mb-2 mr-sm-2"
        name="todo"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
      />

      <input
        disabled={loading}
        onClick={handleSetTodo}
        type="submit"
        className="btn btn-primary mb-2"
      />
    </form>
  );
};

export default TodoForm;
