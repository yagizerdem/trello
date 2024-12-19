const SD = {
  common: {
    strongPasswordRegex:
      /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
  },
  localStorageKeys: {
    jwt: "jwt",
  },
};

export default SD;
