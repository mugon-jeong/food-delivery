import React from 'react';
import {Avatar} from "@nextui-org/avatar";
import {Button} from "@nextui-org/button";
import styles from "@/src/utils/styles";
import NavItems from "@/src/components/NavItems";
const Header = () => {
    return (
        <header className={"w-full h-[80px] bg-[#0F1524] flex items-center justify-between"}>
            <div className={"w-[90%] m-auto"}>
                <h1 className={`${styles.logo}`}>
                    becodemy
                </h1>
                <NavItems />
            </div>
        </header>
    );
};

export default Header;