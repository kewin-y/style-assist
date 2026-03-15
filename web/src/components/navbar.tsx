import { NavLink } from "react-router";

export function Navbar() {
    return (
        <div className="navbar bg-base-100">
            <NavLink to="/" className="px-2 m-3 py-2 rounded-xl border-3 border-solid
        hover:bg-gray-100 transition-colors duration-200">closet</NavLink>
            <NavLink to="/chat" className="px-2 m-3 py-2 rounded-xl border-3 border-solid
        hover:bg-gray-100 transition-colors duration-200">chat</NavLink>
            <NavLink to="/saved" className="px-2 m-3 py-2 rounded-xl border-3 border-solid
        hover:bg-gray-100 transition-colors duration-200">saved</NavLink>
        </div>
    )
}