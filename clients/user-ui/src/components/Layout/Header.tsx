import React from 'react';
import {Avatar} from "@nextui-org/avatar";
import {Button} from "@nextui-org/button";
import styles from "@/src/utils/styles";
import NavItems from "@/src/components/NavItems";
import ProfileDropDown from "@/src/components/ProfileDropDown";
const Header = () => {
    return (
        <header className={"w-full bg-[#0F1524]"}>
            <div className={"w-[90%] h-[80px] m-auto flex items-center justify-between"}>
                <h1 className={`${styles.logo}`}>
                    becodemy
                </h1>
                <NavItems />
                <ProfileDropDown />
            </div>
        </header>
    );
};

export default Header;