import { useState, useEffect } from "react";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [filter, setFilter] = useState("All");

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!title.trim()) {
      alert("Task title is required");
      return;
    }

    const newTask = {
      id: Date.now(),
      title,
      description,
      dueDate,
      completed: false,
      createdAt: Date.now(),
    };

    setTasks([newTask, ...tasks]);

    setTitle("");
    setDescription("");
    setDueDate("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const editTask = (id) => {
    const task = tasks.find((t) => t.id === id);

    const newTitle = prompt("Edit Title", task.title);
    if (newTitle === null) return;

    const newDescription = prompt(
      "Edit Description",
      task.description
    );

    setTasks(
      tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              title: newTitle,
              description: newDescription,
            }
          : t
      )
    );
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Active") return !task.completed;
    if (filter === "Completed") return task.completed;
    return true;
  });

  const activeCount = tasks.filter(
    (task) => !task.completed
  ).length;

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Personal Task Manager</h1>

      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br />
      <br />

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <br />
      <br />

      <button onClick={addTask}>Add Task</button>

      <hr />

      <h3>
        Active: {activeCount} | Completed: {completedCount}
      </h3>

      <button onClick={() => setFilter("All")}>
        All
      </button>

      <button onClick={() => setFilter("Active")}>
        Active
      </button>

      <button onClick={() => setFilter("Completed")}>
        Completed
      </button>

      <hr />

      {filteredTasks.length === 0 ? (
        <p>No Tasks Yet</p>
      ) : (
        filteredTasks.map((task) => {
          const overdue =
            task.dueDate &&
            !task.completed &&
            new Date(task.dueDate) < new Date();

          return (
            <div
              key={task.id}
              style={{
                border: overdue
                  ? "2px solid red"
                  : "1px solid gray",
                padding: "15px",
                marginTop: "10px",
              }}
            >
              <h3
                style={{
                  textDecoration: task.completed
                    ? "line-through"
                    : "none",
                }}
              >
                {task.title}
              </h3>

              <p>{task.description}</p>

              <p>
                Due Date:{" "}
                {task.dueDate || "No due date"}
              </p>

              {overdue && (
                <p style={{ color: "red" }}>
                  Overdue Task
                </p>
              )}

              <button
                onClick={() =>
                  toggleComplete(task.id)
                }
              >
                {task.completed
                  ? "Mark Incomplete"
                  : "Mark Complete"}
              </button>

              {" "}

              <button
                onClick={() => editTask(task.id)}
              >
                Edit
              </button>

              {" "}

              <button
                onClick={() => {
                  const confirmDelete =
                    window.confirm(
                      "Are you sure you want to delete this task?"
                    );

                  if (confirmDelete) {
                    deleteTask(task.id);
                  }
                }}
              >
                Delete
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}

export default App;