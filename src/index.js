import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetch("http://13.233.85.25:5000/tasks")
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  const addTask = () => {
    fetch("http://13.233.85.25:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title })
    })
    .then(res => res.json())
    .then(newTask => setTasks([...tasks, newTask]));
    setTitle("");
  };

  const toggleTask = (id) => {
    fetch(`http://13.233.85.25:5000/tasks/${id}`, { method: "PUT" })
      .then(() => {
        setTasks(tasks.map(task =>
          task.id === id ? { ...task, completed: !task.completed } : task
        ));
      });
  };

  const deleteTask = (id) => {
    fetch(`http://13.233.85.25:5000/tasks/${id}`, { method: "DELETE" })
      .then(() => setTasks(tasks.filter(task => task.id !== id)));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Todo App</h1>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add task..."
      />
      <button onClick={addTask}>Add</button>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <span
              onClick={() => toggleTask(task.id)}
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                cursor: "pointer"
              }}
            >
              {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

