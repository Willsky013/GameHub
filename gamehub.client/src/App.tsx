// App component
// - Top-level application router mounting pages and global UI (Header/Footer)
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import "./css/App.css"

import Header from "./components/Header"
import Footer from "./components/Footer"

import HomePage from "./pages/HomePage"
import GameLibrary from "./pages/GameLibrary"
import GamePage from "./pages/GamePage"
import ProfilePage from "./pages/ProfilePage"
export default function App() {
    return (
        <BrowserRouter basename="/GameHub">
        
            <Header />
        
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/games" element={<GameLibrary />} />
                <Route path="/game/:slug" element={<GamePage />} />
                <Route path="/profile" element={<ProfilePage />} />
        
                {/* Any unknown route loads Home */}
                <Route path="*" element={<HomePage />} />
            </Routes>
        
            <Footer />
        
        </BrowserRouter>
    );
}
