import axios from "axios";

const API_BASE_URL = "https://team-work-supply-tracker.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("Request config:", {
    method: config.method,
    url: config.url,
    headers: config.headers,
    data: config.data,
  });
  return config;
});

// Auth API
export const authAPI = {
  signUp: (userData) => api.post("/users/sign-up", userData),
  signIn: (credentials) => api.post("/users/sign-in", credentials),
  signOut: () => api.post("/users/sign-out"),
};

// Items API
export const itemsAPI = {
  getAllItems: () => api.get("/items/all-items"),
  addItem: (itemData) => api.post("/items/add-item", itemData),
  updateItem: (id, itemData) => api.put(`/items/update-item/${id}`, itemData),
  deleteItem: (id) => api.delete(`/items/delete-item/${id}`),
};

// Movements API
export const movementsAPI = {
  createOutbound: (movementData) =>
    api.post("/movements/create-outbound", movementData),
  getAllMovements: () => api.get("/movements/all-movements"),
  getOutboundMovements: () => api.get("/movements/all-outbound"),
  getInboundMovements: () => api.get("/movements/all-inbound"),
};

// Supply Requests API
export const supplyAPI = {
  createRequest: (requestData) => api.post("/supplies/request", requestData),
  getMyRequests: () => api.get("/supplies/my-requests"),
  getAllSupplies: () => api.get("/supplies/all-supplies"),
  getPendingRequests: () => api.get("/supplies/pending-requests"),
  getApprovedRequests: () => api.get("/supplies/approved-requests"),
  getRejectedRequests: () => api.get("/supplies/rejected-requests"),
  getCancelledRequests: () => api.get("/supplies/cancelled-requests"),
  approveRequest: (supplyId) => api.patch(`/supplies/approve/${supplyId}`),
  rejectRequest: (supplyId) => api.patch(`/supplies/reject/${supplyId}`),
  cancelRequest: (supplyId) => api.put(`/supplies/cancel/${supplyId}`),
  updateRequest: (supplyId, requestData) =>
    api.patch(`/supplies/update/${supplyId}`, requestData),
};

export default api;
