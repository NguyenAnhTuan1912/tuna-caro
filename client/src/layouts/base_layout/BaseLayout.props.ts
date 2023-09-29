export interface BaseLayoutProps extends React.PropsWithChildren {
  headerTitle?: string | JSX.Element | (() => string | JSX.Element);
  footerTitle?: string | JSX.Element | (() => string | JSX.Element);
  shownFooter?: boolean;
}