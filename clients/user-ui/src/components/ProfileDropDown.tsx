"use client";
import React, {useEffect, useState} from 'react';
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/react";
import {Avatar} from "@nextui-org/avatar";
import {CgProfile} from "react-icons/cg";
import AuthScreen from "@/src/screens/AuthScreen";
import useUser from '../hooks/useUser';
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import {signOut, useSession} from "next-auth/react";
import {registerUser} from "@/src/actions/register-user";

const ProfileDropDown = () => {
    const [signedIn, setSignedIn] = useState(false);
    const [open, setOpen] = useState(false);
    const {user, loading} = useUser();
    const {data} = useSession();
    useEffect(() => {
        if (!loading) {
            setSignedIn(!!user);
        }
        if(data?.user){
            setSignedIn(true);
            addUser(data?.user);
        }
    }, [loading, user, open, data]);

    const logoutHandler = () => {
        if (data?.user) {
            signOut();
        } else {
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
            toast.success("Log out successful!");
            window.location.reload();
        }
    };
    const addUser = async (user: any) => {
        await registerUser(user);
    };
    return (
        <div className="flex items-center gap-4">
            {
                signedIn ? (
                    <Dropdown placement={"bottom-end"}>
                        <DropdownTrigger>
                            <Avatar
                                as="button"
                                className="transition-transform"
                                src={data?.user ? data.user.image : user.image}
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label={'Profile Action'} variant={'flat'}>
                            <DropdownItem key={'profile'} className={'h-14 gap-2'}>
                                <p className={'font-semibold'}>
                                    Signed in as
                                </p>
                                <p className={'font-semibold'}>
                                    {data?.user ? data.user.email : user.email}
                                </p>
                            </DropdownItem>
                            <DropdownItem key={'settings'}>
                                My Profile
                            </DropdownItem>
                            <DropdownItem key={'all_orders'}>
                                All Orders
                            </DropdownItem>
                            <DropdownItem key={'team_settings'}>
                                Apply for seller account
                            </DropdownItem>
                            <DropdownItem
                                key="logout"
                                color="danger"
                                onClick={() => logoutHandler()}
                            >
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                ) : (
                    <CgProfile
                        className="text-2xl cursor-pointer"
                        onClick={() => setOpen(!open)}
                    />
                )
            }
            {
                open && <AuthScreen setOpen={setOpen}/>
            }
        </div>
    );
};

export default ProfileDropDown;