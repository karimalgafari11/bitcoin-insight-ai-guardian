
import * as React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

export const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "li";
  
  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-item"
      className={cn("group relative", className)}
      {...props}
    />
  );
});

SidebarMenuSubItem.displayName = "SidebarMenuSubItem";
