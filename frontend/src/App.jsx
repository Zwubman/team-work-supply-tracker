import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import RequestsListPage from "./pages/RequestsListPage";
import MyRequestsListPage from "./pages/MyRequestsListPage";
import MovementsListPage from "./pages/MovementsListPage";
import SupplyRequestFormPage from "./pages/SupplyRequestFormPage";
import MovementFormPage from "./pages/MovementFormPage";
import EditItemFormPage from "./pages/EditItemFormPage";
import AddItemFormPage from "./pages/AddItemFormPage";
import SuplierDashboardPage from "./pages/SuplierDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import LayoutPage from "./pages/LayoutPage";
import ItemCardPage from "./pages/ItemCardPage";
import ProtectedRoutePage from "./pages/ProtectedRoutePage";
import ItemsPage from "./pages/ItemsPage";
import AdminOverview from "./components/dashboards/AdminOverview";
import SuplierOverview from "./components/dashboards/SuplierOverview";
import NotFound from "./components/common/NotFound";

// Protected Route Component
function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function DashboardRedirect() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      if (user.role === "Admin") {
        navigate("/admin-dashboard");
      } else if (user.role === "Supplier") {
        navigate("/suplier-dashboard");
      }
    }
  }, [user, navigate]);
  return null;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="home" element={<HomePage />} />
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <DashboardRedirect />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="requests"
        element={
          <ProtectedRoute>
            <RequestsListPage filter="all" />
          </ProtectedRoute>
        }
      />
      <Route
        path="requests/pending"
        element={
          <ProtectedRoute>
            <RequestsListPage filter="pending" />
          </ProtectedRoute>
        }
      />
      <Route
        path="requests/approved"
        element={
          <ProtectedRoute>
            <RequestsListPage filter="approved" />
          </ProtectedRoute>
        }
      />
      <Route
        path="requests/rejected"
        element={
          <ProtectedRoute>
            <RequestsListPage filter="rejected" />
          </ProtectedRoute>
        }
      />
      <Route
        path="requests/cancelled"
        element={
          <ProtectedRoute>
            <RequestsListPage filter="cancelled" />
          </ProtectedRoute>
        }
      />

      <Route
        path="my-requests"
        element={
          <ProtectedRoute>
            <MyRequestsListPage filter="all" />
          </ProtectedRoute>
        }
      />
      <Route
        path="my-requests/pending"
        element={
          <ProtectedRoute>
            <MyRequestsListPage filter="pending" />
          </ProtectedRoute>
        }
      />
      <Route
        path="my-requests/approved"
        element={
          <ProtectedRoute>
            <MyRequestsListPage filter="approved" />
          </ProtectedRoute>
        }
      />
      <Route
        path="my-requests/rejected"
        element={
          <ProtectedRoute>
            <MyRequestsListPage filter="rejected" />
          </ProtectedRoute>
        }
      />
      <Route
        path="my-requests/cancelled"
        element={
          <ProtectedRoute>
            <MyRequestsListPage filter="cancelled" />
          </ProtectedRoute>
        }
      />

      <Route
        path="movements"
        element={
          <ProtectedRoute>
            <MovementsListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="supply-request"
        element={
          <ProtectedRoute>
            <SupplyRequestFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="movement-form"
        element={
          <ProtectedRoute>
            <MovementFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="edit-item"
        element={
          <ProtectedRoute>
            <EditItemFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="add-item"
        element={
          <ProtectedRoute>
            <AddItemFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="analytics"
        element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="layout"
        element={
          <ProtectedRoute>
            <LayoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="item-card"
        element={
          <ProtectedRoute>
            <ItemCardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="protected"
        element={
          <ProtectedRoute>
            <ProtectedRoutePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="items"
        element={
          <ProtectedRoute>
            <ItemsPage />
          </ProtectedRoute>
        }
      />

      {/* Dashboard Routes with Nested Protected Routes */}
      <Route
        path="suplier-dashboard"
        element={
          <ProtectedRoute>
            <SuplierDashboardPage />
          </ProtectedRoute>
        }
      >
        <Route index element={<SuplierOverview />} />
        <Route
          path="my-requests"
          element={<MyRequestsListPage filter="all" />}
        />
        <Route
          path="my-requests/pending"
          element={<MyRequestsListPage filter="pending" />}
        />
        <Route
          path="my-requests/approved"
          element={<MyRequestsListPage filter="approved" />}
        />
        <Route
          path="my-requests/rejected"
          element={<MyRequestsListPage filter="rejected" />}
        />
        <Route
          path="my-requests/cancelled"
          element={<MyRequestsListPage filter="cancelled" />}
        />
      </Route>

      <Route
        path="admin-dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="requests" element={<RequestsListPage filter="all" />} />
        <Route
          path="requests/pending"
          element={<RequestsListPage filter="pending" />}
        />
        <Route
          path="requests/approved"
          element={<RequestsListPage filter="approved" />}
        />
        <Route
          path="requests/rejected"
          element={<RequestsListPage filter="rejected" />}
        />
        <Route
          path="requests/cancelled"
          element={<RequestsListPage filter="cancelled" />}
        />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="movements" element={<MovementsListPage />} />
      </Route>

      {/* Catch all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
