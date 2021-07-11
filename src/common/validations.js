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

export const playlistRules = {
  title: [
    (value) => {
      if (!value || !(value.replace(/\s+/g, "").length > 0)) {
        return "Title is required";
      } else {
        return true;
      }
    },
  ],

  description: [
    (value) => {
      if (!value || !(value.replace(/\s+/g, "").length > 0)) {
        return "Description is required";
      } else {
        return true;
      }
    },
  ],

  thumbnail: [
    (value) => {
      const ALLOWED_EXTENSIONS = [];

      [
        "pjp",
        "jpg",
        "pjpeg",
        "jpeg",
        "jfif",
        "png",
        "gif",
        "svg",
        "bmp",
      ].forEach((item) => {
        ALLOWED_EXTENSIONS.push(item, item.toUpperCase());
      });

      const extension = value && value.name.split(".").pop();

      if (!value) {
        return "Thumbnail is required";
      } else if (!ALLOWED_EXTENSIONS.includes(extension)) {
        return "A valid image is required";
      } else {
        return true;
      }
    },
  ],
};

export const songRules = {
  title: [
    (value) => {
      if (!value || !(value.replace(/\s+/g, "").length > 0)) {
        return "Title is required";
      } else {
        return true;
      }
    },
  ],

  artist: [
    (value) => {
      if (!value || !(value.replace(/\s+/g, "").length > 0)) {
        return "Artist is required";
      } else {
        return true;
      }
    },
  ],

  link: [
    (value) => {
      if (!value || !(value.replace(/\s+/g, "").length > 0)) {
        return "Link to the song is required";
      } else {
        return true;
      }
    },
  ],
};
