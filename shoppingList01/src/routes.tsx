import CategoriesPage from "./pages/CategoriesPage";
import ShoppingListsPage from "./pages/ShoppingListsPage";
import ItemsPage from "./pages/ItemsPage";
import ShoppingListDetails from "./pages/ShoppingListDetails";

const protectedRoutes = [
  {
    element: <ShoppingListsPage />,
    index: true,
    path: "/",
  },
  {
    element: <ShoppingListDetails />,
    index: true,
    path: "/:shoppingListId",
  },
  {
    element: <ItemsPage />,
    index: true,
    path: "/items",
  },
  {
    element: <CategoriesPage />,
    index: true,
    path: "/categories",
  },
];

export default protectedRoutes;
