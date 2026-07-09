import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Landing from "./pages/Landing"
import Auth from "./pages/Auth"
import Projects from "./pages/Projects"
import NewProject from "./pages/newProject"
import Roadmap from "./pages/Roadmap"
import Study from "./pages/Study"

export default function App() {
  return(
    <Router>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/auth' element={<Auth />} />
        <Route path="/projects" element={<Projects />} />
        <Route path='/projects/new' element={<NewProject />} />
        <Route path='/roadmap/:projectid' element={<Roadmap />} />
        <Route path="/projects/:projectid/study/:topicid" element={<Study />} />
      </Routes>
    </Router>
  )
}