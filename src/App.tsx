import { BrowserRouter, Routes, Route } from "react-router";
import Home from './Pages/Home'
import Collections from "./Pages/Collections";
import './App.css'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="/mycollections" element={<Collections />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
