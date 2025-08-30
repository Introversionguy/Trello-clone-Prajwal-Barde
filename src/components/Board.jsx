import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { ref, onValue, set, push, remove, onDisconnect } from "firebase/database";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Column from "./Column";

export default function Board() {
  const [columns, setColumns] = useState({});
  const [users, setUsers] = useState({});
  const [taskEditing, setTaskEditing] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      console.log(currentUser)
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const columnsRef = ref(db, "boards/board1/columns");
    onValue(columnsRef, (snapshot) => {
      const data = snapshot.val() || {};
      setColumns(data);
      console.log(data,'column data after login')
    });
   const usersRef = ref(db, "presence");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      setUsers(data);
        console.log(data,'User data after login')
    });
     const editingRef = ref(db, "taskEditing");
    onValue(editingRef, (snapshot) => {
      setTaskEditing(snapshot.val());
    });
     if (!user) return;
    const userRef = ref(db, `presence/${user.uid}`);
    const avatar = `https://i.pravatar.cc/40?u=${user.uid}`;
    set(userRef, {name: user.email,avatar: avatar,online: true,});
    onDisconnect(userRef).set({
      name: user.email,
      avatar: avatar,
      online: false,
    });
  }, [user]);

  const addColumn = () => {
    const colRef = push(ref(db, "boards/board1/columns"));
    set(colRef, {name: "New Column", order: Object.keys(columns).length + 1,tasks: {},});
  };

  const updateColumn = (columnId, data) => {  const colRef = ref(db, `boards/board1/columns/${columnId}`);
    set(colRef, {...columns[columnId],...data, });
  };

  const deleteColumn = (columnId) => {
    remove(ref(db, `boards/board1/columns/${columnId}`));
  };

  const addTask = (columnId) => {
    const taskRef = push(ref(db, `boards/board1/columns/${columnId}/tasks`));
    set(taskRef, { title: "New Task", description: "",createdBy: user.uid, timestamp: Date.now(),});
  };

  const updateTask = (colId, taskId, data) => {
    const taskRef = ref(db, `boards/board1/columns/${colId}/tasks/${taskId}`);
    const updatedTask = {...columns[colId].tasks[taskId],...data};
   set(taskRef, updatedTask);
  };

  const deleteTask = (colId, taskId) => {
    remove(ref(db,`boards/board1/columns/${colId}/tasks/${taskId}`));
  };

  const onDragStart = (start) => {
    if (start.type === "TASK") 
      {
      set(ref(db, `taskEditing/${start.draggableId}`), { uid: user.uid,name: user.email,type: "moving",});
    }
  };

  const onDragEnd = (result) => {
    const { source, destination, type, draggableId } = result;

    if (!destination) {

      if (type === "TASK") {
        remove(ref(db, `taskEditing/${draggableId}`));
      }
      return;
    }

    if (type === "COLUMN") {
      const colArray = Object.entries(columns);
      const [removed] = colArray.splice(source.index, 1);
      colArray.splice(destination.index, 0, removed);

      set(ref(db, "boards/board1/columns"), Object.fromEntries(colArray));
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const tasksArray = Object.entries(columns[source.droppableId].tasks || {});
      const [removed] = tasksArray.splice(source.index, 1);
      tasksArray.splice(destination.index, 0, removed);

      set(
        ref(db, `boards/board1/columns/${source.droppableId}/tasks`),
        Object.fromEntries(tasksArray)
      );
    } else {
      const sourceTasks = { ...columns[source.droppableId].tasks };
      const destTasks = { ...columns[destination.droppableId].tasks };
      const [movedId, movedTask] = Object.entries(sourceTasks)[source.index];
      delete sourceTasks[movedId];
      destTasks[movedId] = movedTask;
      set(ref(db, `boards/board1/columns/${source.droppableId}/tasks`), sourceTasks);
      set(ref(db, `boards/board1/columns/${destination.droppableId}/tasks`), destTasks);
    }

    if (type === "TASK") {
      remove(ref(db, `taskEditing/${draggableId}`));
    }
  };

  const colArray = Object.entries(columns);
  const onlineUsers = Object.values(users).filter((u) => u.online);

  return (
    <div className="container mt-3">
      <div className="my-2">
        <span className="alert alert-success">Online Users: {onlineUsers.length}</span>
        <div className="d-flex mt-4">
          {onlineUsers.map((user, index) => (
            <img key={index} className="rounded-circle" src={user.avatar} width={30} height={30}/>
          ))}
        </div>
      </div>
      <button className="btn btn-success mb-2" onClick={addColumn}>
        Add Column
      </button>
      <div className="card alert alert-success">
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="COLUMN" direction="horizontal">
          {(user) => (
            <div className="d-flex flex-row gap-2 overflow-auto py-2" ref={user.innerRef}  {...user.droppableProps}>
              {colArray.map(([colId, col], index) => (
                <Draggable key={colId} draggableId={colId} index={index}>
                  {(userCol) => (
                    <div
                      ref={userCol.innerRef}
                      {...userCol.draggableProps}
                      {...userCol.dragHandleProps}
                    >
                <Column column={col} columnId={colId} addTask={addTask} deleteColumn={deleteColumn} updateColumn={updateColumn}
                        updateTask={updateTask} deleteTask={deleteTask} users={users}  taskEditing={taskEditing} />
                    </div>
                  )}
                </Draggable>
              ))}
              {user.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      </div>
    </div>
  );
}
