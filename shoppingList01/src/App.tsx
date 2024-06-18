import { useMemo } from "react";
import "./App.css";
import getShoppingAppTheme from "./themes/theme";
import { CssBaseline, ThemeOptions, ThemeProvider, createTheme } from "@mui/material";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import protectedRoutes from "./routes";
import Layout from "./layout/Layout";

function App() {
  const theme = useMemo(() => createTheme(getShoppingAppTheme("light") as unknown as ThemeOptions), []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,

      children: protectedRoutes.map(({ path, element }) => ({
        path: path,
        element: element,
        errorElement: <ErrorPage />,
      })),
    },
  ]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}

export default App;
