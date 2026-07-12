import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import {App} from "./App";
import "./index.css";
import { Game, Home, Leaderboard, Play, Lobby, AllGames,Profile } from "./Routes/pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, Component: Home },
      { path: "home", Component: Home },
      { path: "leaderboard", Component: Leaderboard },
      { path: "profile", Component: Profile },
      {
        path: "play",
        Component: Play,
        children: [
          { index: true, Component: AllGames },
          { path: "lobby", Component: Lobby },
          { path: "game", Component: Game },
        ],
      },
    ],
  },
]);

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(<RouterProvider router={router} />);
