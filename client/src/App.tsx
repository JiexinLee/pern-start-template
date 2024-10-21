import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthProvider from "./context/AuthProvider"
import Auth from "./pages/Auth"
import Home from "./pages/home/Home";

function App() {
  return (
    <div className="flex w-full h-screen">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/home" element={<Home />} />
            <Route path="*" element={<Auth />} />
          </Routes>
          <Toaster
            position="top-center"
            reverseOrder={false}
          />
        </AuthProvider>
      </Router>
    </div>
  )
}

export default App
