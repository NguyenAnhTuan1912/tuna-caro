import { CustomizedModalItemProps } from "tunangn-react-modal";

type SnackBarCloseButtonConfigsType = {
  /**
     * This app use icon from Google Icon, so insert the name of icon here.
     */
  icon?: string;
  isAgree?: boolean;
};

export type SnackBarElementRefsType = {
  container: HTMLDivElement | null;
}

export type SnackBarLayoutProps = React.PropsWithChildren<{
  className?: string;
  header?: (() => JSX.Element) | JSX.Element;
  body?: (() => JSX.Element) | JSX.Element;
  footer?: (() => JSX.Element) | JSX.Element;
  closeBtnConfigs?: SnackBarCloseButtonConfigsType;
  style?: React.CSSProperties;
  snackBarProps: CustomizedModalItemProps;
}>;