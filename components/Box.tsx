import { twMerge } from "tailwind-merge";

interface BoxProps {
    children: React.ReactNode;
    className?: string;
}

const Box: React.FC<BoxProps> = ({
    children,
    className
}) => {
    return(
        <div className={twMerge(`
        px-2
        h-full
        `, className
        )}>
            {children}
        </div>
    )
}

export default Box