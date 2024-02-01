import { HeaderProps } from "src/components/header/Header.props";

export interface BaseLayoutProps extends React.PropsWithChildren {
  footerTitle?: string | JSX.Element | (() => string | JSX.Element);
  shownFooter?: boolean;
  shownHeader?: boolean;
  headerOptions?: HeaderProps;
}