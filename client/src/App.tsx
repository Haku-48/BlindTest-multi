import { Route, Routes} from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Lobby from './pages/Lobby'

function App() {
  return (
    <Routes>
      {/* Home page */}
      <Route path="/" element={<Home />}/>
      {/* Room page (Lobby) */}
      <Route path="/room/:roomId" element={<Lobby />} /> 
    </Routes>
  )
}

export default App
