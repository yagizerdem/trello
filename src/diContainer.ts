import { asClass, createContainer, InjectionMode } from "awilix";
import SD from "./SD";

const container = createContainer({
  injectionMode: InjectionMode.PROXY,
  strict: true,
});

container.register({});

export default container;
