import { NavigateFunction } from "react-router-dom";

export type HeaderProps = {
  title?: string | JSX.Element | (() => string | JSX.Element);
  backButton?: ((navigate: NavigateFunction) => JSX.Element) | JSX.Element;
}