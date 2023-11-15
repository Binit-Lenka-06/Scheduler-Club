import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
    className,
    disabled,
    ...props
}, ref) => {
    return(
        <select 
        className={twMerge(`
        bg-neutral-800
        disabled:cursor-not-allowed
        disabled:opacity-50
        focus:outline-none
        `,
        className)}
        disabled={disabled}
        ref={ref}
        {...props}
        />
    )
})

Select.displayName = "Select";

export default Select;
