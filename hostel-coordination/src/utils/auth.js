export const setAuth = (token, user) => {
  sessionStorage.setItem("authToken", token);
  sessionStorage.setItem(
    "userData",
    JSON.stringify({
      isLoggedIn: true,
      userData: user,
    })
  );
};

export const getAuthToken = () => {
  return sessionStorage.getItem("authToken");
};

export const getUser = () => {
  const data = sessionStorage.getItem("userData");
  return data ? JSON.parse(data) : null;
};

export const logout = () => {
  sessionStorage.clear();
};
