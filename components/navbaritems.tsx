import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface NavBarItemProps {
    label: string;
    active?: boolean;
    href: string;
}

const NavBarItems: React.FC<NavBarItemProps> = ({
    label,
    active,
    href
}) => {
    return(
        <Link 
        href={href}
        className={twMerge(`
        cursor-pointer 
        hover:scale-125 
        transition 
        text-gray-600
        hover:text-white
        `,
        active && "text-white")}>
            <p className="truncate">{label}</p>
        </Link>
    )
}
export default NavBarItems;
