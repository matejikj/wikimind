import { NavLink } from "react-router-dom";
import { TiThMenu, TiThMenuOutline, TiTag, TiVendorAndroid } from 'react-icons/ti';
import styles from "./Sidenav.module.css"
import { useState } from "react";

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
        </div>

    );
};

export default Sidenav;
