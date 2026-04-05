import { Route, Routes} from 'react-router-dom'
import './App.css'
import Home from './pages/Home'

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
