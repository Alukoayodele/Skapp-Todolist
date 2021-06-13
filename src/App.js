import React, { Fragment, useEffect, useState } from "react";
import M from "materialize-css/dist/js/materialize.min.js";
import "./App.css";
import { SkynetClient } from "skynet-js";
import { ContentRecordDAC } from "@skynetlabs/content-record-library";
import { v4 as uuidv4 } from "uuid";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";

// const portal =
//   window.location.hostname === "localhost" ? "https://siasky.net" : undefined;

// Initiate the SkynetClient
const client = new SkynetClient();
const contentRecord = new ContentRecordDAC();
uuidv4();
const filename = "data.json";
const App = () => {
  const [loading, setLoading] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const [dataKey, setDataKey] = useState("");
  const [todo, setTodo] = useState("");
  const [userID, setUserID] = useState();
  const [filePath, setFilePath] = useState();
  const [mySky, setMySky] = useState();
  const [loggedIn, setLoggedIn] = useState(false);

  const dataDomain = "localhost";
  useEffect(() => {
    async function initMySky() {
      try {
        const mySky = await client.loadMySky(dataDomain);

        await mySky.loadDacs(contentRecord);

        const loggedIn = await mySky.checkLogin();

        setMySky(mySky);
        setLoggedIn(loggedIn);
        if (loggedIn) {
          setUserID(await mySky.userID());
        }
      } catch (e) {
        console.error(e);
      }
    }

    initMySky();
  }, []);

  useEffect(() => {
    setFilePath(dataDomain + "/" + dataKey);
  }, [dataKey]);
  useEffect(() => {
    M.AutoInit();
  });

  useEffect(() => {
    const loadTodo = async () => {
      try {
        setLoading(true);
        const { data } = await mySky.getJSON(filePath);
        if (data) {
          setTodoList(data.todolist);
          setLoading(false);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    loadTodo();
  }, [mySky, setLoading, filePath]);
  const handleSumbit = async (e) => {
    e.preventDefault();
    const todoToSubmit = todo;
    try {
      if (todoToSubmit === "") {
        M.toast({ html: "Please fill the field" });
      } else {
        const jsonData = {
          id: uuidv4(),
          todo,
        };
        setTodoList([...todoList, jsonData]);
        setTodo("");
        console.log("form submitted");

        await handleMySkyWrite({
          todolist: [...todoList, jsonData],
        });
      }
    } catch (err) {
      console.log(err);
      setTodo(todoToSubmit);
    }
  };

  const handleDelete = async (id) => {
    let prevTodoList = todoList;
    try {
      const updated = todoList.filter((list) => list.id !== id);
      setTodoList(updated);
      await handleMySkyWrite({
        todolist: updated,
      });
    } catch (err) {
      console.log(err);
      setTodoList(prevTodoList);
    }
  };
  const handleMySkyLogin = async () => {
    const status = await mySky.requestLoginAccess();
    setLoggedIn(status);

    if (status) {
      setUserID(await mySky.userID());
    }
  };
  const handleMySkyLogout = async () => {
    await mySky.logout();
    setLoggedIn(false);
    setUserID("");
  };
  const handleMySkyWrite = async (jsonData) => {
    try {
      console.log("userID", userID);
      console.log("filePath", filePath);
      await mySky.setJSON(filePath, jsonData);
      // console.log(value, "value");
    } catch (error) {
      console.log(`error with setJSON: ${error.message}`);
    }

    try {
      await contentRecord.recordNewContent({
        skylink: jsonData.dirSkylink,
      });
    } catch (error) {
      console.log(`error with CR DAC: ${error.message}`);
    }
  };
  const formProps = {
    handleMySkyWrite,
    handleDelete,
    handleSumbit,
    todo,
    loading,
    setLoading,
    setTodo,
    mySky,
    filePath,
    todoList,
    setTodoList,
  };
  return (
    <Fragment>
      <nav className="red lighten-5">
        <div className="nav-wrapper container-fluid">
          <ul className="right hide-on-med-and-down">
            <li>
              {loggedIn === true && (
                <button
                  onClick={handleMySkyLogout}
                  className=" grey darken-3 btn"
                >
                  Log Out of MySky
                </button>
              )}
              {loggedIn === false && (
                <button
                  onClick={handleMySkyLogin}
                  className=" waves-effect waves-light btn"
                >
                  Login with MySky
                </button>
              )}
              {loggedIn === null && (
                <button className="grey darken-3 btn">Loading MySky...</button>
              )}
            </li>
          </ul>
        </div>
      </nav>

      <div className="container mt-5" style={{ textAlign: "center" }}>
        <h2>To-do List</h2>
        {loggedIn === false ? (
          <p>Please log in with skynet to create list</p>
        ) : (
          <div style={{ marginLeft: "5rem" }}>
            <TodoForm {...formProps} />
            <TodoList todolist={todoList} {...formProps} />
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default App;
