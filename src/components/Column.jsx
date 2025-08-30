import React, { useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import Task from "./Task";

export default function Column({column,columnId,addTask,deleteColumn,updateColumn,updateTask,deleteTask,taskEditing,}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.name);

 const handleSave = () => {
  if (title.trim() === "") {
    alert("Column name cannot be empty!");
    return;
  }
  const updatedData = {name: title.trim(),};
  console.log(updatedData,'Column Data')
  updateColumn(columnId, updatedData);
  setIsEditing(false);
};

  return (
    <div className="card">
      <div className="card-body">
       {isEditing ? (
  <div className="d-flex align-items-center mb-2 gap-2">
    <input className="form-control form-control-sm" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
    <button className="btn btn-sm btn-primary" onClick={handleSave}>
      Save
    </button>
    <button className="btn btn-sm btn-secondary" onClick={() => setIsEditing(false)}>
      Cancel
    </button>
  </div>
) : (
  <div className="d-flex flex-column mb-2">
    <h5 className="mb-2">{column.name}</h5>
    <div className="d-flex gap-2">
      <button className="btn btn-sm btn-primary" onClick={() => setIsEditing(true)}>
        Edit
      </button>
      <button className="btn btn-sm btn-danger" onClick={() => deleteColumn(columnId)}>
        Delete
      </button>
    </div>
  </div>
)}
 <div className="d-flex justify-content-center mb-2">
    <button  className="btn btn-sm btn-success w-100" onClick={() => addTask(columnId)}>
      Add Task
    </button>
  </div>
        <Droppable droppableId={columnId} type="TASK">
          {(user) => (
            <div
              ref={user.innerRef}
              {...user.droppableProps}
              className="d-flex flex-column gap-2"
            >
              {column.tasks &&
                Object.entries(column.tasks).map(([taskId, task], index) => (
                  <Draggable key={taskId} draggableId={taskId} index={index}>
                    {(drag) => (
                      <div className="mb-2" ref={drag.innerRef} {...drag.draggableProps} {...drag.dragHandleProps} >
         <Task task={{ ...task, id: taskId }} columnId={columnId} updateTask={updateTask} deleteTask={deleteTask} taskEditing={taskEditing} />
                      </div>
                    )}
                  </Draggable>
                ))}
              {user.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
}
