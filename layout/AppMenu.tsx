/* eslint-disable @next/next/no-img-element */

import React, { useContext } from "react";
import AppMenuitem from "./AppMenuitem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";
import Link from "next/link";
import { AppMenuItem } from "../types/types";

const AppMenu = () => {
  const { layoutConfig } = useContext(LayoutContext);

  const model: AppMenuItem[] = [
    {
      label: "Home",
      items: [{ label: "Dashboard", icon: "pi pi-fw pi-home", to: "/" }],
    },
    {
      label: "Management Categories",
      items: [
        {
          label: "ผู้ใช้",
          icon: "pi pi-fw pi-users",
          to: "/uikit/users",
        },
        {
          label: "จัดการแพ็คเกจ",
          icon: "pi pi-fw pi-images",
          to: "/uikit/formlayout",
        },
        {
          label: "จัดการที่พัก",
          icon: "pi pi-fw pi-home",
          to: "/uikit/manage-hotels",
        },
        {
          label: "จัดการคำสั่งซื้อ",
          icon: "pi pi-fw pi-shopping-cart",
          to: "/uikit/floatlabel",
        },
        {
          label: "รีวิวทั้งหมด",
          icon: "pi pi-fw pi-comments",
          to: "/uikit/message-reviews",
        },
        {
          label: "แจ้งเตือน",
          icon: "pi pi-fw pi-bell",
          to: "/uikit/notification",
        
        },
        {
          label: "จัดการประชาสัมพันธ์",
          icon: "pi pi-fw pi-megaphone",
          to: "/uikit/public-relations",
         
        },

      ],
    },

  ];

  return (
    <MenuProvider>
      <ul className="layout-menu">
        {model.map((item, i) => {
          return !item?.seperator ? (
            <AppMenuitem item={item} root={true} index={i} key={item.label} />
          ) : (
            <li className="menu-separator"></li>
          );
        })}

        <Link
          href="https://blocks.primereact.org"
          target="_blank"
          style={{ cursor: "pointer" }}
        ></Link>
      </ul>
    </MenuProvider>
  );
};

export default AppMenu;
