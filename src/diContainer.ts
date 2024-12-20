import { asClass, createContainer, InjectionMode, Lifetime } from "awilix";
import SD from "./SD";
import FileService from "./services/fileService";

const container = createContainer({
  injectionMode: InjectionMode.PROXY,
  strict: true,
});
container.register({
  [SD.services.fileService]: asClass(FileService).singleton(),
});

export default container;
