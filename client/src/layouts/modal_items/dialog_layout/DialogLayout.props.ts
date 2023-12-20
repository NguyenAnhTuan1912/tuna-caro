export type DialogLayoutProps = React.PropsWithChildren<{
  title?: any;
  className?: string;
  close: (data: any) => any;
  style: React.CSSProperties;
}>