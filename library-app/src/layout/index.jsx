import React from 'react'
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import { Logo } from '../icons/Logo';


const GlobalLayout = ({children}) => {
  return (
    <>
    <Navbar position="static">
      <NavbarBrand>
        <Logo />
        <p className="font-bold text-inherit">App Library</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/">
            All Books
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
    <div className="container mx-auto p-8">
        {children}
    </div>
    </>
  )
}

export default GlobalLayout