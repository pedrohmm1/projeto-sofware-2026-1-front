import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react'


createRoot(document.getElementById('root')).render(
  <Auth0Provider
      domain="dev-ms8hzcq7g2ruglnt.us.auth0.com"
      clientId="eu5vHkRg1Tw928JtzYHJcPVt2r3fMI3H"
      authorizationParams={{
        audience: "https://dev-ms8hzcq7g2ruglnt.us.auth0.com/api/v2/",
        redirect_uri: window.location.origin
      }}
    >
    <App />
  </Auth0Provider>,
)