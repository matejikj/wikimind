import { NavLink } from "react-router-dom";
import { TiThMenu, TiThMenuOutline, TiTag, TiVendorAndroid, TiLockOpenOutline } from 'react-icons/ti';
import styles from "./Sidenav.module.css"
import { useContext, useState } from "react";
import { handleIncomingRedirect, onSessionRestore, logout } from "@inrupt/solid-client-authn-browser";
import { SessionContext, UserData } from "../sessionContext";

export const navData = [
    {
        id: 0,
        text: "Home",
        link: "/",
        icon: <TiTag />
    },
    {
        id: 1,
        text: "Visualisation",
        link: "/visualisation",
        icon: <TiVendorAndroid />
    },
]

type AppProps = { message: string };

const Sidenav: React.FC<{ props: AppProps }> = ({ props }) => {

    const [open, setopen] = useState(true)
    const toggleOpen = () => {
        setopen(!open)
    }

    const theme = useContext(SessionContext);

    const a = async () => {
        console.log('fdsafs')
        console.log(theme.userData)
        const logged = await logout()
        console.log(logged)
        theme.setUserData({
            name: 'fdasfas',
            isLogged: false,
            session: null
        })
        console.log(theme.userData)
    }

    return (
        <div className={open ? styles.sidenav : styles.sidenavClosed}>
            <div>{props.message}</div>
            <button className={styles.menuBtn} onClick={toggleOpen}>
                {open ? (<TiThMenuOutline />) : (<TiThMenu />)}
            </button>
            {navData.map(item => {
                return (
                    <NavLink key={item.id} className={styles.sideitem} to={item.link}>
                        {item.icon}
                        {open ? (<span className={styles.linkText}>{item.text}</span>) : (<span />)}
                    </NavLink>)
            })}
            <button className={styles.menuBtn} onClick={a}>
                <TiLockOpenOutline />
            </button>
        </div>

    );
};

export default Sidenav;
