import { useState } from "react";
import { Box, Menu, Typography, Button, Divider, Grid } from "@mui/material";
import Link from "next/link";
import { IconBuildingStore, IconUsers, IconUserShield } from "@tabler/icons-react";
import AppLinks from "./AppLinks";
import QuickLinks from "./QuickLinks";
import NavItem from "../sidebar/NavItem";
import { MenuitemsType } from "../sidebar/MenuItems";
import { uniqueId } from "lodash";
import { usePathname } from "next/navigation";

const AppDD = () => {
  // const [anchorEl2, setAnchorEl2] = useState('');

  // const handleClick2 = (event: any) => {
  //   setAnchorEl2(event.currentTarget);
  // };

  // const handleClose2 = () => {
  //   setAnchorEl2(null);
  // };
  const pathname = usePathname();
  const pathDirect = pathname;
  const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf('/'));
  console.log("pathName", pathname);
  console.log("pathDirect", pathWithoutLastPart);



  // const Menuitems: MenuitemsType[] = [
  //   {
  //     navlabel: true,
  //     subheader: "Home",
  //   },

  //   {
  //     id: uniqueId(),
  //     title: "Modern",
  //     icon: IconAperture,
  //     href: "/",
  //     chip: "New",
  //     chipColor: "secondary",
  //   },
  // ];

  return (
    <Box sx={{
      display: 'flex',

      gap: 2
    }}>
      {/* <Box sx={{
        gap: 2
      }}> */}

      {/* </Box> */}
      {/* {Menuitems.map((item) => {
        <NavItem item={item} key={item.id} pathDirect={pathDirect} hideMenu={hideMenu} onClick={() => dispatch(toggleMobileSidebar())} />
      })
      } */}
      <Button
        color="inherit"
        // sx={{ color: (theme) => theme.palette.text.secondary }}
        variant="text"
        href="/apps/stores/list"
        sx={{
          bgcolor: pathname.startsWith("/apps/stores/") ? (theme) => theme.palette.primary.main : "",
          color: pathname.startsWith("/apps/stores/")
            ? "white"
            : (theme) => theme.palette.text.secondary,
        }}
        component={Link}
        startIcon={
          <IconBuildingStore size="15"
          //     style={{ marginLeft: "-5px", marginTop: "2px" }}
          />
        }
      >
        STORE
      </Button>
      <Button
        color="inherit"
        // sx={{ color: (theme) => theme.palette.text.secondary }}
        variant="text"
        href="/apps/users/list"

        sx={{

          bgcolor: pathname.startsWith("/apps/users/") ? "primary.main" : "",
          color: pathname.startsWith("/apps/users/")
            ? "white"
            : (theme) => theme.palette.text.secondary,
        }}
        component={Link}
        startIcon={
          <IconUsers size="15"
          //     style={{ marginLeft: "-5px", marginTop: "2px" }}
          />
        }
      >
        USER
      </Button>
      <Button
        color="inherit"
        // sx={{ color: (theme) => theme.palette.text.secondary }}
        variant="text"
        href="/apps/admins/list"
        sx={{

          bgcolor: pathname.startsWith("/apps/admins/") ? "primary.main" : "",
          color: pathname.startsWith("/apps/admins/")
            ? "white"
            : (theme) => theme.palette.text.secondary,
        }}
        component={Link}
        startIcon={
          <IconUserShield size="15"
          //     style={{ marginLeft: "-5px", marginTop: "2px" }}
          />
        }
      >
        ADMIN
      </Button>
    </Box>
  );
};

export default AppDD;
