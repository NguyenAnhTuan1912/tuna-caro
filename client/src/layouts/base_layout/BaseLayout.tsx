import Header from 'src/components/header/Header';
import Footer from 'src/components/footer/Footer';

import { BaseLayoutProps } from './BaseLayout.props';

/**
 * Use this component to create a base layout for pages.
 * @param props 
 * @returns 
 */
export default function BaseLayout(props: BaseLayoutProps) {
  return (
    <>
      {
        (props.shownHeader === true || props.shownHeader === undefined)
        && (
          <Header
            {...props.headerOptions}
          />
        )
      }
      { props.children }
      { (props.shownFooter === true || props.shownFooter === undefined) && <Footer /> }
    </>
  )
}