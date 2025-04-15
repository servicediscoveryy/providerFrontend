export const sessionUser = () => {
  const storedUser = JSON.parse(sessionStorage.getItem("user"));

  return storedUser;
};

export const removeSessionUser = () => {
  const storedUser = sessionStorage.removeItem("user");
};


