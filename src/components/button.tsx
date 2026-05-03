import { ensureStyles } from "@api/css";
import { classNameFactory, clsx } from "@api/utils/classes";
import { IconSizes, type Icons } from "@assets/icons";
import styles from "./button.css";
import { Flex } from "./flex";
import { Icon } from "./icon";

type ButtonSize = "lg" | "md" | "sm" | "xs";
type ButtonVariant =
    | "primary"
    | "secondary"
    | "tertiary"
    | "plain"
    | "brand"
    | "success"
    | "destructive"
    | "bordered";

const buttonClass = classNameFactory("button-");

const buttonSizeMap: Record<ButtonSize, string> = {
    lg: "large",
    md: "medium",
    sm: "small",
    xs: "x-small",
};

const commonButtonClasses = clsx(
    "button",
    "p-[calc(var(--rem12)-var(--button-border-width,0px))]" /* padding around button contents */,
    "items-center",
    "justify-center",
    "inline-flex",
);

export function Button({
    size = "md",
    variant = "primary",
    onClick,
    children,
    className,
    ...rawProps
}: {
    size?: ButtonSize;
    variant?: ButtonVariant;
    onClick: () => void;
    children: any;
    className?: string;
    [key: string]: any;
}) {
    return (
        <button
            attr:class={clsx(
                className,
                commonButtonClasses,
                buttonClass(buttonSizeMap[size], variant),
            )}
            on:click={onClick}
            {...rawProps}
        >
            {children}
        </button>
    );
}

ensureStyles(styles);

const iconSizeMap: Record<ButtonSize, number> = {
    lg: IconSizes.Large,
    md: IconSizes.Medium,
    sm: IconSizes.Small,
    xs: 16,
};

export function IconButton(props: {
    size?: ButtonSize;
    variant?: ButtonVariant;
    onClick: () => void;
    children?: any;
    className?: string;
    icon: keyof typeof Icons;
    [key: string]: any;
}) {
    const { icon, children, ...otherProps } = props;

    return (
        <Button
            {...otherProps}
            className={clsx("readit-icon-button", {
                "readit-icon-button-no-children": !children,
            })}
        >
            <Flex direction="row" justify="center" align="center" gap={8}>
                <Icon size={iconSizeMap[props.size ?? "md"]} icon={icon} />
                {children}
            </Flex>
        </Button>
    );
}
