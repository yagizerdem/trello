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
  webSocketUrl: "http://localhost:3000/ws",
};

export default SD;
