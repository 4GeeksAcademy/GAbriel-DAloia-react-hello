import React, { useState, useEffect } from "react";
import "../../styles/index.css";

const Home = () => {
  const [lista, setlista] = useState("");
  const [arr, setArr] = useState([]);

  const getTodos = async () => {
    try {
      const res = await fetch(
        "https://playground.4geeks.com/todo/users/gabodaloi"
      );
      if (res.status === 404) {
        await crearUsuario();
        return;
      }
      console.log(res);

      const data = await res.json();
      setArr(data.todos);
    } catch (error) {
      console.log(error);
    }
  };
  const crearUsuario = async () => {
    try {
      const rest = await fetch(
        "https://playground.4geeks.com/todo/users/gabodaloi",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const add = async (e) => {
    if (e.key === "Enter" && lista.trim() !== "") {
      try {
        const rest = await fetch(
          "https://playground.4geeks.com/todo/todos/gabodaloi",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              label: lista,
              is_done: false,
            }),
          }
        );
        if (rest.status === 201) {
          getTodos();
          setlista("");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteTodo = async (id) => {
    try {
      const rest = await fetch(
        `https://playground.4geeks.com/todo/todos/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (rest.status === 204) {
        getTodos();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAll = async () => {
    try {
      // Eliminar todas individualmente (la API no tiene bulk delete)
      await Promise.all(
        arr.map((todo) =>
          fetch(`https://playground.4geeks.com/todo/todos/${todo.id}`, {
            method: "DELETE",
          })
        )
      );
      setArr([]);
    } catch (error) {
      console.error("Error deleting all todos:", error);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="box">
      <div className="input">
        <h1>todos</h1>
        <input
          type="text"
          value={lista}
          onChange={(e) => setlista(e.target.value)}
          onKeyDown={add}
          className="inputt"
          placeholder="Agg una tarea"
        />

        {arr.length === 0 ? (
          <p className="p">No hay tareas pendientes</p>
        ) : (
          <ul>
            {arr.map((elemento, index) => (
              <div key={index} className="flex mt-2 align-items-start inp">
                <li>{elemento.label}</li>
                <button className="x" onClick={() => deleteTodo(elemento.id)}>X</button>
              </div>
            ))}
          </ul>
        )}
        <button className="butom " onClick={deleteAll}>
          Eliminar tareas
        </button>
      </div>
    </div>
  );
};

export default Home;
