import { Route, Routes} from 'react-router-dom'
//import './App.css'
import Home from './pages/Home'
import Lobby from './pages/Lobby'
import Preparation from './pages/Preparation'
import Game from './pages/Game'
import Correction from './pages/Correction'
import Results from './pages/Results'


function App() {
  return (
    <Routes>
      {/* Home page */}
      <Route path="/" element={<Home />}/>
      {/* Room page (Lobby) */}
      <Route path="/room/:roomId" element={<Lobby />} /> 
      {/* Preparation page */}
      <Route path="/room/:roomId/preparation" element={<Preparation />} />
      {/* Game page */}
      <Route path="/room/:roomId/game" element={<Game />} />
      {/* Correction page */}
      <Route path="/room/:roomId/correction" element={<Correction />} />
      {/* Results page */}
      <Route path='/room/:roomId/results' element={<Results />} />
    </Routes>
  )
}

export default App
