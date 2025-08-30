import React, { useState } from "react";
import Auth from "./components/Auth";
import Board from "./components/Board";

function App() {
  const [user, setUser] = useState(null);
  
  if (!user) {
    return <Auth onLogin={setUser} />;
  }
  return(<div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="m-2">Hello, {user.email || "User"}</h4>
        <button className="btn btn-sm btn-primary" onClick={() => setUser(null)}>Logout</button>
      </div>
      <Board />
    </div>)
}

export default App;
