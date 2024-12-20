const SD = {
  common: {
    strongPasswordRegex:
      /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
  },
  localStorageKeys: {
    jwt: "jwt",
  },
  services: {
    fileService: "fileService",
  },
};

export default SD;
