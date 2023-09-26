import React from 'react'

import Header from 'src/components/header/Header';
import Footer from 'src/components/footer/Footer';

import { BaseLayoutProps } from './BaseLayout.props';

export default function BaseLayout(props: BaseLayoutProps) {
  return (
    <>
      <Header
        title={props.headerTitle}
      />
      { props.children }
      <Footer />
    </>
  )
}