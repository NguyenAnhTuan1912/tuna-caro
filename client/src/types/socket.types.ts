import { NavigateFunction } from "react-router-dom";

// Import type from classes
import { ChangeDataFnType } from "src/classes/GlobalPrivateData";

// Import from other types
import { LangTextJSONType } from "./lang.types";

export type InitCallBackDataType = {
  configParams?: {
    maxDisconnectionDuration: number;
  }
};

export type ListenerArgsType = {
  changeData: ChangeDataFnType;
  navigate: NavigateFunction;
  langText: LangTextJSONType;
};