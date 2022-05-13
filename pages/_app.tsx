import type { AppProps } from 'next/app';
import { AppBase } from 'douhub-ui-web-basic';
import '../styles/global.css';
import '../styles/app.css';

function App(appProps: AppProps) {
    return <>
        <div className="hidden text-sky-600 bg-sky-700 border-sky-500 ring-sky-500 focus:ring-sky-500 focus:border-sky-500 hover:bg-sky-500 hover:bg-sky-700" />
        <AppBase {...appProps} />
    </>
}

export default App
