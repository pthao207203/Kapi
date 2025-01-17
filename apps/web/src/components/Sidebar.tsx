'use client';
import React, { Dispatch, SetStateAction, useState } from "react";
import { IconType } from "react-icons";
import { FiChevronDown, FiChevronsRight, FiLogOut, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";
import Image from "next/image";
import logo from '../../public/images/Capy.png';
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useHandleTranslations } from "@/lib/handleTranslations";
import { AdminSidebar, getIconByKey } from "@/lib/admin.type";
import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";
import { Language, useLanguage } from "@/lib/useLanguage";

const Sidebar = () => {
    const [open, setOpen] = useState(true);
    const t = useHandleTranslations("Sidebar");
    const { selected, setSelected } = useSidebar();
    const options = Object.keys(AdminSidebar).map((key) => ({
        Icon: getIconByKey(key as keyof typeof AdminSidebar),
        key,
    }));

    return (
        <motion.nav
            layout
            className="sticky top-0 h-screen shrink-0 border-r border-slate-300 bg-white p-2"
            style={{
                width: open ? "225px" : "fit-content",
            }}
        >
            <TitleSection open={open} />
            <div className="space-y-1">
                {options.map((option) => (
                    <Option
                        key={option.key}
                        Icon={option.Icon}
                        path={option.key}
                        title={t[option.key]}
                        selected={selected}
                        setSelected={setSelected}
                        open={open}
                    />
                ))}
            </div>
            <ToggleClose open={open} setOpen={setOpen} />
        </motion.nav>
    );
};

export const Option = (props: {
    Icon: IconType;
    title: string;
    selected: keyof typeof AdminSidebar | undefined;
    setSelected: Dispatch<SetStateAction<keyof typeof AdminSidebar>>;
    open: boolean;
    path: string;
    notifs?: number;
}) => {
    const { Icon, title, selected, setSelected, open, path, notifs } = props;
    const pathname = usePathname();
    const langSegment = pathname.split('/')[1];
    return (
        <Link href={`/${langSegment}/admin/${path.toLowerCase()}`}>
            <motion.button
                layout
                onClick={() => setSelected(path as keyof typeof AdminSidebar)}
                className={`relative flex h-10 w-full items-center rounded-md transition-colors ${
                    selected === path ? "bg-indigo-100 text-indigo-800" : "text-slate-500 hover:bg-slate-100"
                }`}
            >
                <motion.div layout className="grid h-full w-10 place-content-center text-lg">
                    <Icon />
                </motion.div>
                {open && (
                    <motion.span
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.125 }}
                        className="text-xs font-medium"
                    >
                        {title}
                    </motion.span>
                )}
                {notifs && open && (
                    <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ y: "-50%" }}
                        transition={{ delay: 0.5 }}
                        className="absolute right-2 top-1/2 size-4 rounded bg-indigo-500 text-xs text-white"
                    >
                        {notifs}
                    </motion.span>
                )}
            </motion.button>
        </Link>
    );
};

const TitleSection = ({ open }: { open: boolean }) => {
    const [openDropdown, setOpenDropdown] = useState(false);
    const { profile } = useAuth();
    const pathname = usePathname();
    const adminPath = pathname.split('/').slice(2).join('/');
    const { language, handleLanguageChange } = useLanguage();

    return (    
        <div className="mb-3 border-b border-slate-300 pb-3 relative" onClick={() => setOpenDropdown(prev => !prev)}>
            <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors hover:bg-slate-100">
                <div className="flex items-center gap-2">
                    <Logo />
                    {open && (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.125 }}
                        >
                            <span className="block text-base font-semibold">{profile?.name}</span>
                        </motion.div>
                    )}
                </div>
                {open && <FiChevronDown className="mr-2" />}
            </div>

            {open && openDropdown && (
                <motion.div
                    className="absolute z-10 mt-2 w-52 bg-white border border-slate-300 rounded-lg shadow-lg p-2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="pb-2 border-b border-slate-200 flex justify-center items-center">
                        {(['VI', 'EN', 'JP'] as Language[]).map((lang) => (
                            <Link
                                key={lang}
                                href={`/${lang.toLowerCase()}/${adminPath}`}
                                passHref
                            >
                                <button
                                    onClick={() => handleLanguageChange(lang)}
                                    className={`px-3 py-1 rounded-full transition-colors text-sm font-medium ${
                                        language === lang 
                                           ? 'bg-black text-white border-2' 
                                            : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    {lang}
                                </button>
                            </Link>
                        ))}
                    </div>
                    <div className="pt-2">
                        <div className="flex items-center p-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer">
                            <FiUser className="mr-2" /> Profile
                        </div>
                        <div className="flex items-center p-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer">
                            <FiLogOut className="mr-2" /> Logout
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

const Logo = () => {
    return (
        <motion.div
            layout
            className="grid size-10 shrink-0 place-content-center rounded-md bg-indigo-600 relative"
        >
            <Image 
                src={logo}
                width={50}
                height={150}
                alt="logo"
                className="object-contain"
            />
        </motion.div>
    );
};

const ToggleClose = ({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    return (
        <motion.button
            layout
            onClick={() => setOpen((pv) => !pv)}
            className="absolute bottom-0 left-0 right-0 border-t border-slate-300 transition-colors hover:bg-slate-100"
        >
            <div className="flex items-center p-2">
                <motion.div layout className="grid size-10 place-content-center text-lg">
                    <FiChevronsRight className={`transition-transform ${open && "rotate-180"}`} />
                </motion.div>
                {open && (
                    <motion.span
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.125 }}
                        className="text-xs font-medium"
                    >
                        Hide
                    </motion.span>
                )}
            </div>
        </motion.button>
    );
};

export default Sidebar;
