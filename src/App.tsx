import "./App.css";
import WikiEditor from "./components/WikiEditor";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
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
import CreateClub from "./pages/CreateClub";
import DefaultLayoutV2 from "./layouts/DefaultLayoutV2";
import AsideLayout from "./layouts/AsideLayout";
import MyClubs from "./pages/MyClubs";
import ClubArchive from "./pages/club/ClubArchive";
import PageLayoutV2 from "./layouts/PageLayoutV2";

const router = createBrowserRouter([
  {
    element: <DefaultLayoutV2 />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "create",
        element: (
          <ProtectedRoute>
            <CreateClub />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-clubs",
        element: (
          <ProtectedRoute>
            <MyClubs />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "club",
    element: <AsideLayout />,
    children: [
      {
        path: "archive",
        element: <ClubArchive />,
      },
    ],
  },
  {
    element: <DefaultLayout />,
    children: [
      {
        element: <PageLayout />,
        children: [
          {
            path: "organizations",
            element: <Organizations />,
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
      {
        element: (
          <PageLayoutV2
            TopItem={() => {
              const [searchParams] = useSearchParams();
              const navigate = useNavigate();
              const location = useLocation();
              const raw = location.pathname.replace(/^\/page\//, "");
              const title = decodeURI(raw);
              const clubId = searchParams.get("clubId");
              const wikiType = searchParams.get("wikiType") || "";
              const isPublic = location.state?.isPublic;

              return (
                <section className="flex justify-between items-end mt-[-24px] mb-[30px]">
                  <h1 className="typo-head-md-b text-gray-09">
                    {wikiType === "knowhow" ? "노하우" : "업무별"} 위키
                  </h1>
                  <button
                    className="w-[117px] h-[60px] bg-primary-04 rounded-[12px] typo-title-md-b text-white cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/edit/${encodeURI(
                          title || ""
                        )}?clubId=${clubId}&wikiType=${wikiType}`,
                        {
                          state: {
                            isPublic,
                          },
                        }
                      )
                    }
                  >
                    편집
                  </button>
                </section>
              );
            }}
          />
        ),
        children: [
          {
            path: "page/*",
            element: <WikiPage />,
          },
        ],
      },
      {
        path: "edit/*",
        element: (
          <ProtectedRoute>
            <WikiEditor />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
