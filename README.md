 1.Setup and Run Instructions

     1.git clone https://github.com/Introversionguy/Trello-clone-Prajwal-Barde
     2.open terminal npm install
     3.npm run dev

 2. Real-Time Architecture and Data Flow

    1.Multiple clients connect to a central Firebase Realtime Database.
    2.Updates (create, edit, delete tasks/columns) are broadcasted instantly to all connected clients.

    Components:
    1.Frontend (React + Firebase)
        UI components: Columns, Tasks, Drag & Drop,Board,Auth
        State management: Props Driling.

    2.Backend (Firebase Realtime Database)
         1.Stores columns and tasks in a structured JSON format:
        2.
  {"boards": { "board1": {  "columns": { "todo": {
          "name": "To Do", "order": 1, "tasks": { "task1": {"title": "Design UI", "description": "Create wireframes dashboard",order": 1,"createdBy": "user1",  "timestamp": 1690000000000 },
            "task2": {... } }} }  },
  "presence": { "user1": { "name": "Alice", "avatar": "","online": true }, }}

        3.Realtime listeners (onValue, onChildAdded) push updates to all clients instantly.

    3.Data Flow:
        1.User performs an action (add/edit/delete task)
        2.Frontend updates Using Props state optimistically
        3.Changes are pushed to Firebase
        4.Firebase triggers updates to all subscribed clients
        5.UI is synced across all clients in real time.
    4.Drag & Drop Handling:
        1.Reorder tasks within a column or move between columns
        2.Update positions in Firebase to maintain consistent order

3.Tradeoffs and Limitations
        1.Tradeoffs :
            1.Firebase Realtime Database is easy to implement but may not scale well for thousands of concurrent updates.
            2.Optimistic UI may temporarily show outdated data if a backend write fails.
            3.Minimal conflict resolution; simultaneous edits on the same task may override changes.

        2.Limitations
            1.No authentication-based access control; all users see all tasks.
            2.Offline support is limited; unsynced changes may be lost.
            3.No advanced undo/redo history.
            4.Column reordering is implemented, but performance may degrade with very large boards.
            5.Dependency on Firebase makes switching backends non-trivial.        

            
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
