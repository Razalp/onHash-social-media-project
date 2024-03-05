import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store.tsx'
import { SocketProvider } from './Context/SocketProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(

    
    <Provider store={store}>
    <SocketProvider>
     <BrowserRouter>

    <App />

    </BrowserRouter>
    </SocketProvider>
    </Provider>
   

)
