// src/auth.js
export function getAuth() {
  return {
    role: localStorage.getItem("role") || "",
    userId: localStorage.getItem("userId") || "",
    name: localStorage.getItem("name") || "",
    email: localStorage.getItem("email") || "",
  };
}

export function setAuth({ _id, role, name, email }) {
  const normalizedRole = role === "CustomerCareOfficer" ? "Support_Manager" : role;
  localStorage.setItem("role", normalizedRole);
  localStorage.setItem("name", name || "");
  localStorage.setItem("email", email || "");
  if (normalizedRole === "manager" || normalizedRole === "UserManager" || normalizedRole === "Support_Manager") {
    localStorage.removeItem("userId"); // staff doesn't need userId
  } else {
    localStorage.setItem("userId", _id); // customers keep userId
  }
}


export function clearAuth() {
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  localStorage.removeItem("name");
  localStorage.removeItem("email");
}

