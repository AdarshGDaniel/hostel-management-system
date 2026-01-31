export const isStaffOrAdmin = () => {
  const data = sessionStorage.getItem("userData");
  if (!data) return false;

  const user = JSON.parse(data).userData;
  return user.userType === "staff" || user.userType === "admin";
};
