import React, { useState } from "react";
import { ref, set, remove } from "firebase/database";
import { db } from "../firebase";

export default function Task({ task, columnId, updateTask, deleteTask, taskEditing }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const taskStatus = taskEditing?.[task.id];

  const startEditing = () => {
    setEditing(true);
    set(ref(db, `taskEditing/${task.id}`), { uid: taskStatus?.uid || "", name: taskStatus?.name || "", type: "editing" });
  };

  const saveTask = () => {
    console.log(title,'title after edit')
    console.log(description,'description after edit')
    updateTask(columnId, task.id, { title, description });
    setEditing(false);
    remove(ref(db, `taskEditing/${task.id}`));
  };

  return (
    <div className="card alert alert-info mt-3  position-relative">
      {editing ? (
        <div className="card-body">
          <input className="form-control mb-2" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea className="form-control mb-2" value={description}  onChange={(e) => setDescription(e.target.value)}/>
          <button className="btn btn-primary btn-sm me-1" onClick={saveTask}>Save</button>
          <button className="btn btn-secondary btn-sm" onClick={() => setEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div className="card-body">
          <h6>{task.title}</h6>
          <p>{task.description}</p>
          <button className="btn btn-primary btn-sm me-1" onClick={startEditing}>Edit</button>
          <button className="btn btn-danger btn-sm" onClick={() => deleteTask(columnId, task.id)}>Delete</button>
        </div>
      )}
      {taskStatus && (
        <div className="position-absolute top-0 end-0 badge bg-warning text-dark">
          {taskStatus.name}  {taskStatus.type}
        </div>
      )}
    </div>
  );
}
