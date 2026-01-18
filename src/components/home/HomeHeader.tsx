"use client";

import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import { Globe, Menu } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import AuthButton from "@/components/AuthButton";

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem clamp(24px, 5vw, 80px);
  background: rgba(15, 17, 22, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
`;

const Logo = styled(Image)`
  width: 48px;
  height: auto;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavItem = styled.button`
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const IconBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  border-radius: 8px;
  transition: color 0.2s, background 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    background: rgba(255, 255, 255, 0.06);
  }
`;

export default function HomeHeader() {
  return (
    <Header>
      <LogoLink href="/">
        <Logo
          src="/localsOnlyLogoV4.7Tryangle.png"
          alt="Locals Only"
          width={48}
          height={48}
          priority
        />
      </LogoLink>
      <Nav>
        <NavItem type="button">EUR</NavItem>
        <IconBtn type="button" aria-label="Language / Region">
          <Globe size={20} />
        </IconBtn>
        <ThemeToggle />
        <AuthButton />
        <IconBtn type="button" aria-label="Menu">
          <Menu size={22} />
        </IconBtn>
      </Nav>
    </Header>
  );
}
