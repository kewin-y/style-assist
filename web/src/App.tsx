import { BrowserRouter, Routes, Route } from "react-router"
import ClosetPage from "./features/closet/ClosetPage"
import ChatPage from "./features/chat/ChatPage"
import SavedPage from "./features/saved/SavedPage"

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClosetPage />} />
        <Route path="closet" element={<ClosetPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="saved" element={<SavedPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App