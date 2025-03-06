export const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, value);
};

export const getItemsFromLocalStorage = () => {
  return {
    username: localStorage.getItem("username") || "",
    role: localStorage.getItem("role") || "",
    location: localStorage.getItem("location") || "",
    team: localStorage.getItem("team") || "",
    token: localStorage.getItem("token") || "",
  };
};

export const removeItemsFromLocalStorage = () => {
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  localStorage.removeItem("location");
  localStorage.removeItem("team");
  localStorage.removeItem("token");
};
