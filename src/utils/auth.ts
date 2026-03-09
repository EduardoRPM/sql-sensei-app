const AUTH_KEY = "sql-sensei-auth";

export const isAuthenticated = (): boolean => {
  return localStorage.getItem(AUTH_KEY) === "1";
};

export const login = (): void => {
  localStorage.setItem(AUTH_KEY, "1");
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_KEY);
};
