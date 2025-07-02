
import { useEffect, useState } from "react";
import axios from "axios";
import {
  auth,
  googleProvider,
} from "./firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import "./styles.css";

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Tasks
  const [allTasks, setAllTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [taskMessages, setTaskMessages] = useState({}); // NEW

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = () => {
    axios
      .get("http://localhost:5000/api/tasks")
      .then((res) => {
        const sorted = res.data.sort(
          (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
        );
        setAllTasks(sorted);
        setTasks(sorted);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();

    if (showSignup) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          setUser({ email: user.email });
          setEmail("");
          setPassword("");
        })
        .catch((error) => {
          console.error(error);
          alert(error.message);
        });
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          setUser({ email: user.email });
          setEmail("");
          setPassword("");
        })
        .catch((error) => {
          console.error(error);
          alert(error.message);
        });
    }
  };

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        setUser({ email: user.email, photoURL: user.photoURL });
      })
      .catch((error) => {
        console.error(error);
        alert(error.message);
      });
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/tasks", {
        title,
        description,
        dueDate,
        completed: false,
        priority: priority ? parseInt(priority) : 0,
      })
      .then(() => {
        setTitle("");
        setDescription("");
        setDueDate("");
        setPriority("");
        fetchTasks();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/tasks/${id}`)
      .then(() => {
        fetchTasks();
        showTaskMessage(id, "✅ Deleted successfully!");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const startEditing = (task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditDueDate(task.dueDate?.substr(0, 10));
    setEditPriority(task.priority || "");
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/tasks/${editingTask._id}`, {
        title: editTitle,
        description: editDescription,
        dueDate: editDueDate,
        completed: editingTask.completed,
        priority: editPriority ? parseInt(editPriority) : 0,
      })
      .then(() => {
        setEditingTask(null);
        fetchTasks();
        showTaskMessage(editingTask._id, "✅ Updated successfully!");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleToggleComplete = (task) => {
    axios
      .put(`http://localhost:5000/api/tasks/${task._id}`, {
        ...task,
        completed: !task.completed,
      })
      .then(() => {
        fetchTasks();
        showTaskMessage(task._id, task.completed ? "✅ Marked incomplete!" : "✅ Completed!");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleShare = (task) => {
  const recipient = prompt("Enter email address to share this task:");
  if (!recipient) return;

  // Simulate sending email (e.g. via backend later):
  setTimeout(() => {
    showTaskMessage(
      task._id,
      `✅ Message sent to ${recipient}!`
    );
  }, 1000);

  };

  const showTaskMessage = (taskId, msg) => {
    setTaskMessages((prev) => ({
      ...prev,
      [taskId]: msg,
    }));
    setTimeout(() => {
      setTaskMessages((prev) => {
        const newMessages = { ...prev };
        delete newMessages[taskId];
        return newMessages;
      });
    }, 3000);
  };

  const showAllTasks = () => {
    setTasks(allTasks);
  };

  const showCompletedTasks = () => {
    const completed = allTasks.filter((t) => t.completed);
    setTasks(completed);
  };

  const showDueTodayTasks = () => {
    const todayStr = new Date().toISOString().substr(0, 10);
    const dueToday = allTasks.filter(
      (t) => t.dueDate?.substr(0, 10) === todayStr
    );
    setTasks(dueToday);
  };

  const showPriorityTasks = () => {
    const sorted = [...allTasks].sort(
      (a, b) => (a.priority || 0) - (b.priority || 0)
    );
    setTasks(sorted);
  };

  if (!user) {
    return (
      <div className="container mt-5">
        <div className="login-box mx-auto" style={{ maxWidth: "400px" }}>
          <h2 className="mb-4 text-center todo-heading">
            {showSignup ? "Sign Up" : "Login"} to Todo App
          </h2>

          <button
            className="btn btn-outline-danger w-100 mb-3"
            onClick={handleGoogleSignIn}
          >
            <i className="bi bi-google me-2"></i>
            Continue with Google
          </button>

          <hr />

          <form onSubmit={handleEmailLogin}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              {showSignup ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <p className="text-center mt-3">
            {showSignup
              ? "Already have an account?"
              : "Don’t have an account?"}{" "}
            <button
              className="btn btn-link p-0"
              onClick={() => setShowSignup(!showSignup)}
            >
              {showSignup ? "Log in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        darkMode ? "bg-dark text-light min-vh-100" : "bg-light min-vh-100"
      }
    >
      <div className="container d-flex flex-column align-items-center py-5">
        <div className="text-center mb-4">
          <h1 className="todo-heading">
            <i className="bi bi-card-checklist me-2"></i>
            Todo App
          </h1>
          <div className="d-flex justify-content-center align-items-center">
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt="Avatar"
                className="rounded-circle me-2"
                style={{ width: "30px", height: "30px" }}
              />
            )}
            <span>{user.email}</span>
          </div>
          <button
            className={`btn ${
              darkMode ? "btn-light" : "btn-dark"
            } mt-2 me-2`}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
          <button
            className="btn btn-outline-danger mt-2"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>

        {/* Add New Task */}
        <form
          onSubmit={handleSubmit}
          className="mb-4 todo-container bg-body-secondary"
          style={{ maxWidth: "600px", width: "100%" }}
        >
          <h4>Add New Task</h4>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Priority (e.g. 1 = high)"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              min={1}
            />
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-3">
            <input
              type="date"
              className="form-control"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Add Task
          </button>
        </form>

        {/* Filters */}
        <div className="mb-4 d-flex gap-2">
          <button className="btn btn-outline-dark" onClick={showAllTasks}>
            Tasks
          </button>
          <button
            className="btn btn-outline-success"
            onClick={showCompletedTasks}
          >
            Completed
          </button>
          <button
            className="btn btn-outline-warning"
            onClick={showDueTodayTasks}
          >
            Due Today
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={showPriorityTasks}
          >
            Priority
          </button>
        </div>

        {/* Edit Form */}
        {editingTask && (
          <form
            onSubmit={handleEditSubmit}
            className="mb-4 todo-container bg-warning-subtle"
            style={{ maxWidth: "600px", width: "100%" }}
          >
            <h4>Edit Task</h4>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                className="form-control"
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
                min={1}
              />
            </div>
            <div className="mb-3">
              <textarea
                className="form-control"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="mb-3">
              <input
                type="date"
                className="form-control"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-success me-2">
              Save
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditingTask(null)}
            >
              Cancel
            </button>
          </form>
        )}

        {/* Task List */}
        <ul
          className="list-group"
          style={{ maxWidth: "700px", width: "100%" }}
        >
          {tasks.map((task) => (
            <li
              key={task._id}
              className={
                "list-group-item " +
                (darkMode ? "bg-dark text-light border-light" : "")
              }
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{task.title}</strong>{" "}
                  {task.completed && (
                    <span className="badge bg-success">Done</span>
                  )}
                  <br />
                  {task.description && <small>{task.description}</small>}
                  <br />
                  {typeof task.priority !== "undefined" && (
                    <small>Priority: {task.priority}</small>
                  )}
                  <br />
                  {task.dueDate && (
                    <small>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </small>
                  )}
                </div>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => handleToggleComplete(task)}
                  >
                    {task.completed ? "Undo" : "Complete"}
                  </button>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => startEditing(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(task._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => handleShare(task)}
                  >
                    Share
                  </button>
                </div>
              </div>

              {taskMessages[task._id] && (
                <div className="mt-2 alert alert-success p-2" role="alert">
                  {taskMessages[task._id]}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;


// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   GoogleAuthProvider,
//   signInWithPopup,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
// } from "firebase/auth";
// import { auth } from "./firebase";

// function App() {
//   const [user, setUser] = useState(null);
//   const [showSignup, setShowSignup] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [allTasks, setAllTasks] = useState([]);
//   const [tasks, setTasks] = useState([]);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [dueDate, setDueDate] = useState("");
//   const [priority, setPriority] = useState("");
//   const [editingTask, setEditingTask] = useState(null);
//   const [editTitle, setEditTitle] = useState("");
//   const [editDescription, setEditDescription] = useState("");
//   const [editDueDate, setEditDueDate] = useState("");
//   const [editPriority, setEditPriority] = useState("");
//   const [darkMode, setDarkMode] = useState(false);

//   // Per-task messages
//   const [taskMessages, setTaskMessages] = useState({});

//   useEffect(() => {
//     if (user) {
//       fetchTasks();
//     }
//   }, [user]);

//   const fetchTasks = () => {
//     axios
//       .get("http://localhost:5000/api/tasks")
//       .then((res) => {
//         const sorted = res.data.sort(
//           (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
//         );
//         setAllTasks(sorted);
//         setTasks(sorted);
//       })
//       .catch((err) => {
//         console.error(err);
//       });
//   };

//   const handleEmailLogin = (e) => {
//     e.preventDefault();

//     if (showSignup) {
//       createUserWithEmailAndPassword(auth, email, password)
//         .then((userCredential) => {
//           const user = userCredential.user;
//           setUser({ email: user.email, photoURL: user.photoURL });
//           setEmail("");
//           setPassword("");
//         })
//         .catch((error) => {
//           console.error(error);
//           alert(error.message);
//         });
//     } else {
//       signInWithEmailAndPassword(auth, email, password)
//         .then((userCredential) => {
//           const user = userCredential.user;
//           setUser({ email: user.email, photoURL: user.photoURL });
//           setEmail("");
//           setPassword("");
//         })
//         .catch((error) => {
//           console.error(error);
//           alert(error.message);
//         });
//     }
//   };

//   const handleGoogleSignIn = () => {
//     const provider = new GoogleAuthProvider();
//     signInWithPopup(auth, provider)
//       .then((result) => {
//         const user = result.user;
//         setUser({ email: user.email, photoURL: user.photoURL });
//       })
//       .catch((error) => {
//         console.error(error);
//         alert(error.message);
//       });
//   };

//   const handleLogout = () => {
//     signOut(auth)
//       .then(() => setUser(null))
//       .catch((err) => console.error(err));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     axios
//       .post("http://localhost:5000/api/tasks", {
//         title,
//         description,
//         dueDate,
//         completed: false,
//         priority: priority ? parseInt(priority) : 0,
//       })
//       .then(() => {
//         setTitle("");
//         setDescription("");
//         setDueDate("");
//         setPriority("");
//         fetchTasks();
//       })
//       .catch((err) => {
//         console.error(err);
//       });
//   };

//   const handleDelete = (task) => {
//     axios
//       .delete(`http://localhost:5000/api/tasks/${task._id}`)
//       .then(() => {
//         fetchTasks();
//         showTaskMessage(task._id, "✅ Deleted successfully!");
//       })
//       .catch((err) => {
//         console.error(err);
//         showTaskMessage(task._id, "❌ Failed to delete.");
//       });
//   };

//   const startEditing = (task) => {
//     setEditingTask(task);
//     setEditTitle(task.title);
//     setEditDescription(task.description);
//     setEditDueDate(task.dueDate?.substr(0, 10));
//     setEditPriority(task.priority || "");
//   };

//   const handleEditSubmit = (e) => {
//     e.preventDefault();
//     axios
//       .put(`http://localhost:5000/api/tasks/${editingTask._id}`, {
//         title: editTitle,
//         description: editDescription,
//         dueDate: editDueDate,
//         completed: editingTask.completed,
//         priority: editPriority ? parseInt(editPriority) : 0,
//       })
//       .then(() => {
//         setEditingTask(null);
//         fetchTasks();
//         showTaskMessage(editingTask._id, "✅ Updated successfully!");
//       })
//       .catch((err) => {
//         console.error(err);
//         showTaskMessage(editingTask._id, "❌ Update failed.");
//       });
//   };

//   const handleToggleComplete = (task) => {
//     axios
//       .put(`http://localhost:5000/api/tasks/${task._id}`, {
//         ...task,
//         completed: !task.completed,
//       })
//       .then(() => {
//         fetchTasks();
//         showTaskMessage(
//           task._id,
//           task.completed
//             ? "✅ Marked incomplete!"
//             : "✅ Marked complete!"
//         );
//       })
//       .catch((err) => {
//         console.error(err);
//       });
//   };

//   const handleShare = (task) => {
//     const recipient = prompt("Enter email address to share this task:");
//     if (!recipient) return;

//     // Simulate sending the email:
//     setTimeout(() => {
//       showTaskMessage(
//         task._id,
//         `✅ Message sent to ${recipient}!`
//       );
//     }, 1000);

//     // 🔥 Uncomment below for real backend:
//     /*
//     axios.post("http://localhost:5000/api/send-email", {
//       to: recipient,
//       subject: `Task shared: ${task.title}`,
//       body: `Task: ${task.title}\nDescription: ${task.description}\nDue: ${
//         task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"
//       }\nPriority: ${task.priority}`,
//     })
//       .then(() => {
//         showTaskMessage(task._id, `✅ Message sent to ${recipient}!`);
//       })
//       .catch((err) => {
//         console.error(err);
//         showTaskMessage(task._id, "❌ Failed to send message.");
//       });
//     */
//   };

//   const showTaskMessage = (taskId, msg) => {
//     setTaskMessages((prev) => ({
//       ...prev,
//       [taskId]: msg,
//     }));

//     setTimeout(() => {
//       setTaskMessages((prev) => {
//         const updated = { ...prev };
//         delete updated[taskId];
//         return updated;
//       });
//     }, 3000);
//   };

//   const showAllTasks = () => setTasks(allTasks);
//   const showCompletedTasks = () =>
//     setTasks(allTasks.filter((t) => t.completed));
//   const showDueTodayTasks = () => {
//     const todayStr = new Date().toISOString().substr(0, 10);
//     setTasks(allTasks.filter((t) => t.dueDate?.substr(0, 10) === todayStr));
//   };
//   const showPriorityTasks = () => {
//     const sorted = [...allTasks].sort(
//       (a, b) => (a.priority || 0) - (b.priority || 0)
//     );
//     setTasks(sorted);
//   };

//   if (!user) {
//     return (
//       <div className="container mt-5" style={{ maxWidth: "400px" }}>
//         <h2 className="mb-4 text-center">
//           <i className="bi bi-card-checklist me-2"></i>
//           {showSignup ? "Sign Up" : "Login"} to Todo App
//         </h2>

//         <button
//           className="btn btn-outline-danger w-100 mb-3"
//           onClick={handleGoogleSignIn}
//         >
//           <i className="bi bi-google me-2"></i>
//           Continue with Google
//         </button>

//         <hr />

//         <form onSubmit={handleEmailLogin}>
//           <div className="mb-3">
//             <input
//               type="email"
//               className="form-control"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <input
//               type="password"
//               className="form-control"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <button type="submit" className="btn btn-primary w-100">
//             {showSignup ? "Sign Up" : "Sign In"}
//           </button>
//         </form>

//         <p className="text-center mt-3">
//           {showSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
//           <button
//             className="btn btn-link p-0"
//             onClick={() => setShowSignup(!showSignup)}
//           >
//             {showSignup ? "Log in" : "Sign up"}
//           </button>
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div
//       className={
//         darkMode ? "bg-dark text-light min-vh-100" : "bg-light min-vh-100"
//       }
//     >
//       <div className="container py-4">
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <div className="d-flex align-items-center">
//             {user.photoURL && (
//               <img
//                 src={user.photoURL}
//                 alt="avatar"
//                 className="rounded-circle me-2"
//                 style={{ width: "40px", height: "40px" }}
//               />
//             )}
//             <span>{user.email}</span>
//           </div>

//           <div>
//             <button
//               className="btn btn-secondary me-2"
//               onClick={() => setDarkMode(!darkMode)}
//             >
//               {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
//             </button>
//             <button
//               className="btn btn-outline-danger"
//               onClick={handleLogout}
//             >
//               Log Out
//             </button>
//           </div>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="mb-4 p-4 border rounded bg-body-secondary"
//           style={{ maxWidth: "600px", width: "100%" }}
//         >
//           <h4>Add New Task</h4>
//           <div className="mb-3">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <input
//               type="number"
//               className="form-control"
//               placeholder="Priority (e.g. 1 = high)"
//               value={priority}
//               onChange={(e) => setPriority(e.target.value)}
//               min={1}
//             />
//           </div>
//           <div className="mb-3">
//             <textarea
//               className="form-control"
//               placeholder="Description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             ></textarea>
//           </div>
//           <div className="mb-3">
//             <input
//               type="date"
//               className="form-control"
//               value={dueDate}
//               onChange={(e) => setDueDate(e.target.value)}
//             />
//           </div>
//           <button type="submit" className="btn btn-primary w-100">
//             Add Task
//           </button>
//         </form>

//         <div className="mb-4 d-flex gap-2">
//           <button className="btn btn-outline-dark" onClick={showAllTasks}>
//             All
//           </button>
//           <button
//             className="btn btn-outline-success"
//             onClick={showCompletedTasks}
//           >
//             Completed
//           </button>
//           <button
//             className="btn btn-outline-warning"
//             onClick={showDueTodayTasks}
//           >
//             Due Today
//           </button>
//           <button
//             className="btn btn-outline-primary"
//             onClick={showPriorityTasks}
//           >
//             Priority
//           </button>
//         </div>

//         {/* Edit Form */}
//         {editingTask && (
//           <form
//             onSubmit={handleEditSubmit}
//             className="mb-4 p-4 border rounded bg-warning-subtle"
//             style={{ maxWidth: "600px", width: "100%" }}
//           >
//             <h4>Edit Task</h4>
//             <div className="mb-3">
//               <input
//                 type="text"
//                 className="form-control"
//                 value={editTitle}
//                 onChange={(e) => setEditTitle(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="mb-3">
//               <input
//                 type="number"
//                 className="form-control"
//                 placeholder="Priority (e.g. 1 = high)"
//                 value={editPriority}
//                 onChange={(e) => setEditPriority(e.target.value)}
//                 min={1}
//               />
//             </div>
//             <div className="mb-3">
//               <textarea
//                 className="form-control"
//                 value={editDescription}
//                 onChange={(e) => setEditDescription(e.target.value)}
//               ></textarea>
//             </div>
//             <div className="mb-3">
//               <input
//                 type="date"
//                 className="form-control"
//                 value={editDueDate}
//                 onChange={(e) => setEditDueDate(e.target.value)}
//               />
//             </div>
//             <button type="submit" className="btn btn-success me-2">
//               Save
//             </button>
//             <button
//               type="button"
//               className="btn btn-secondary"
//               onClick={() => setEditingTask(null)}
//             >
//               Cancel
//             </button>
//           </form>
//         )}

//         {/* Task List */}
//         <ul className="list-group" style={{ maxWidth: "700px", width: "100%" }}>
//           {tasks.map((task) => (
//             <li
//               key={task._id}
//               className={
//                 "list-group-item d-flex flex-column " +
//                 (darkMode ? "bg-dark text-light border-light" : "")
//               }
//             >
//               <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                   <strong>{task.title}</strong> —{" "}
//                   {task.completed ? "✅" : "❌"}
//                   <br />
//                   {task.description && (
//                     <small className="text-muted">{task.description}</small>
//                   )}
//                   <br />
//                   {typeof task.priority !== "undefined" && (
//                     <small className="text-primary">
//                       Priority: {task.priority}
//                     </small>
//                   )}
//                   <br />
//                   {task.dueDate && (
//                     <small className="text-secondary">
//                       Due: {new Date(task.dueDate).toLocaleDateString()}
//                     </small>
//                   )}
//                 </div>
//                 <div className="d-flex gap-2">
//                   <button
//                     className="btn btn-outline-success btn-sm"
//                     onClick={() => handleToggleComplete(task)}
//                   >
//                     {task.completed ? "Mark Incomplete" : "Mark Complete"}
//                   </button>
//                   <button
//                     className="btn btn-outline-primary btn-sm"
//                     onClick={() => startEditing(task)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="btn btn-outline-danger btn-sm"
//                     onClick={() => handleDelete(task)}
//                   >
//                     Delete
//                   </button>
//                   <button
//                     className="btn btn-outline-info btn-sm"
//                     onClick={() => handleShare(task)}
//                   >
//                     Share
//                   </button>
//                 </div>
//               </div>
//               {taskMessages[task._id] && (
//                 <div className="alert alert-info mt-2 mb-0 p-2">
//                   {taskMessages[task._id]}
//                 </div>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default App;
