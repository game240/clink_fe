import "./App.css";
import WikiEditor from "./components/WikiEditor";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/colors.css";
import "./styles/texts.css";
import SignupForm from "./components/auth/SignupForm";
import ProtectedRoute from "./routes/ProtectedRoute";
import SigninForm from "./components/auth/SignInForm";
import AuthCallback from "./components/auth/AuthCallback";

import DefaultLayout from "./layouts/DefaultLayout";
import PageLayout from "./layouts/PageLayout";
import WikiPage from "./pages/WikiPage";
import WikiSearch from "./pages/WikiSearch";
import RecentChange from "./pages/RecentChange";
import Landing from "./pages/Landing";
import Organizations from "./pages/Organizations";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        element: <PageLayout />,
        children: [
          {
            path: "",
            element: <Landing />,
          },
          {
            path: "organizations",
            element: <Organizations />,
          },
          {
            path: "edit/*",
            element: (
              <ProtectedRoute>
                <WikiEditor />
              </ProtectedRoute>
            ),
          },
          {
            path: "page/*",
            element: <WikiPage />,
          },
          {
            path: "search",
            element: <WikiSearch />,
          },
          {
            path: "recent-change",
            element: <RecentChange />,
          },
          {
            path: "signup",
            element: <SignupForm />,
          },
          {
            path: "signin",
            element: <SigninForm />,
          },
          {
            path: "auth/callback",
            element: <AuthCallback />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
