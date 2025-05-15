
import * as React from "react";
import { cn } from "@/lib/utils";

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, onClick, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    onClick={(e) => {
      if (onClick) {
        onClick(e);
      }
    }}
    {...props}
  />
));
SidebarMenuItem.displayName = "SidebarMenuItem";
