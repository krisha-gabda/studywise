import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Landing from "./pages/Landing"
import Auth from "./pages/Auth"
import Projects from "./pages/Projects"
import NewProject from "./pages/newProject"
import Roadmap from "./pages/Roadmap"
import Study from "./pages/Study"
import Flashcards from "./pages/Flashcards"
import Quiz from "./pages/Quiz"

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
        <Route path='/projects/:projectid/study/:topicid/flashcards' element={<Flashcards />} />
        <Route path='/projects/:projectid/study/:topicid/quiz' element={<Quiz />} /> 
      </Routes>
    </Router>
  )
}