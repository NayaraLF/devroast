import Link from "next/link";
import { forwardRef, type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export function NavbarRoot({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadElement>) {
  return (
    <header
      className={twMerge(
        "flex h-14 w-full items-center justify-between border-b border-border-primary bg-bg-page px-10",
        className,
      )}
      {...props}
    >
      {children}
    </header>
  );
}

interface NavbarLogoProps extends HTMLAttributes<HTMLAnchorElement> {
  href?: string;
}

export const NavbarLogo = forwardRef<HTMLAnchorElement, NavbarLogoProps>(
  ({ className, href = "/", ...props }, ref) => {
    return (
      <Link
        ref={ref}
        href={href}
        className={twMerge("flex items-center gap-2 font-mono", className)}
        {...props}
      >
        <span className="text-xl font-bold text-accent-green">&gt;</span>
        <span className="text-lg font-medium text-text-primary">devroast</span>
      </Link>
    );
  },
);

NavbarLogo.displayName = "NavbarLogo";

interface NavbarLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export const NavbarLink = forwardRef<HTMLAnchorElement, NavbarLinkProps>(
  ({ className, href, children, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        href={href}
        className={twMerge(
          "font-mono text-sm text-text-secondary hover:text-text-primary",
          className,
        )}
        {...props}
      >
        {children}
      </Link>
    );
  },
);

NavbarLink.displayName = "NavbarLink";

export function Navbar({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadElement>) {
  return (
    <NavbarRoot className={className} {...props}>
      <nav className="flex items-center gap-6">{children}</nav>
    </NavbarRoot>
  );
}

Navbar.displayName = "Navbar";
