import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// import { LiffProvider } from 'react-liff';


// line liff 
import liff from '@line/liff';


import { AuthProvider } from "./auth/AuthContext";
//
import App from './App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';


// ----------------------------------------------------------------------
export const isLocalhost = Boolean(window.location.hostname === 'localhost' ||
// [::1] is the IPv6 localhost address.
window.location.hostname === '[::1]' ||
// 127.0.0.0/8 are considered localhost for IPv4.
window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/) 
|| window.location.hostname.includes('ngrok')
);


const root = ReactDOM.createRoot(document.getElementById('root'));
const liffId = process.env.REACT_APP_LIFF_ID

    root.render(
      <HelmetProvider>
        <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>  
            {/* <LiffProvider liffId={liffId}>
        
          </LiffProvider>  */}
        </BrowserRouter>
      </HelmetProvider>
    );

// liff
//   .init({ liffId,
//   withLoginOnExternalBrowser: !isLocalhost})
//   .then(async () => {   
    
//     // if (!liff.isLoggedIn() && !isLocalhost) liff.login()

//   })
//   .catch((e) => {
//     alert(`LIFF error: ${e.message}`)
//   })

  

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
