import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Landing from "./pages/Landing"
import Auth from "./pages/Auth"

export default function App() {
  return(
    <Router>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/auth' element={<Auth />} />
      </Routes>
    </Router>
  )
}