import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetch("/tasks")
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  const addTask = () => {
  fetch("/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  })
    .then(() => fetch("/tasks"))
    .then(res => res.json())
    .then(data => {
      setTasks(data);
      setTitle("");
    })
    .catch(err => console.error(err));
};


  const toggleTask = (id) => {
    fetch(`/tasks/${id}`, { method: "PUT" })
      .then(() => {
        setTasks(tasks.map(task =>
          task.id === id ? { ...task, completed: !task.completed } : task
        ));
      });
  };

  const deleteTask = (id) => {
    fetch(`/tasks/${id}`, { method: "DELETE" })
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
useEffect(() => {
  fetch("/tasks/api/health")
    .then(res => res.json())
    .then(data => console.log("Health:", data));
}, []);

