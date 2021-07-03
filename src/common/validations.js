export const userRules = {
  username: [
    (value) => {
      if (!value) {
        return "Username is required";
      } else if (!(value.replace(/\s+/g, "").length >= 4)) {
        return "Username must be at least 4 characters";
      } else {
        return true;
      }
    },
  ],
  email: [
    (value) => {
      const regex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (!value) {
        return "Email address is required";
      } else if (!regex.test(value.replace(/\s+/g, ""))) {
        return "Email address is not valid";
      } else {
        return true;
      }
    },
  ],
  password: [
    (value) => {
      if (!value) {
        return "Password is required";
      } else if (!(value.replace(/\s+/g, "").length >= 6)) {
        return "Password must be at least 6 characters";
      } else {
        return true;
      }
    },
  ],
};
