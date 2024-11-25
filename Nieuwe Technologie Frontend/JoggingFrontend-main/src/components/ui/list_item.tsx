import React from 'react';
import { Link } from 'react-router-dom';
import { NavigationMenuLink } from "@/components/ui/navigation_menu"; // Adjust import path as necessary

interface ListItemProps extends React.ComponentPropsWithoutRef<'a'> {
  href: string;
  title?: string;
}

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
  ({ href, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            ref={ref}
            to={href}
            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
            {...props}
          >
            {title && <div className="text-sm font-medium leading-none">{title}</div>}
            {children && <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>}
          </Link>
        </NavigationMenuLink>
      </li>
    );
  }
);

ListItem.displayName = 'ListItem';

export default ListItem;
