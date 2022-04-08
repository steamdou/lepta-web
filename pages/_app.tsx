import type { AppProps } from 'next/app';
import { AppBase } from 'douhub-ui-web-basic';
import '../styles/global.css';


function App(appProps: AppProps) {
  return <AppBase {...appProps} />
}

export default App
