import { IContext } from "./IContext";

export interface IBuild {
  context: IContext;
  dockerfile: string;
}
