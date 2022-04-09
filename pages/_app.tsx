import type { AppProps } from 'next/app';
import { AppBase } from 'douhub-ui-web-basic';
import '../styles/global.css';
import Class from './_class';

function App(appProps: AppProps) {
  return <>
  <AppBase {...appProps} />
  <Class/>
  </>
}

export default App
