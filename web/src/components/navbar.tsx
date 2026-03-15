import { NavLink } from "react-router";

export function Navbar() {
    return (
        <div className="navbar bg-base-100">
            <NavLink to="/" className="px-3 py-2">closet</NavLink>
            <NavLink to="/chat" className="px-3 py-2">chat</NavLink>
            <NavLink to="/saved" className="px-3 py-2">saved</NavLink>
        </div>
    )
}