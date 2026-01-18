"use client";

import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";

const Footer = styled.footer`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding: 3rem clamp(24px, 5vw, 80px);
  margin-top: 4rem;

  @media (max-width: 768px) {
    padding: 2rem clamp(24px, 5vw, 80px);
    margin-top: 2rem;
  }
`;

const FooterInner = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-sizing: border-box;

  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 2fr 1fr 1fr;
    gap: 2rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const FooterLogoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
  }
`;

const FooterLogoLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const FooterLogo = styled(Image)`
  width: 120px;
  height: auto;
  filter: brightness(0.95);
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const FooterText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.6;
`;

const FooterBottom = styled.div`
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Copyright = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
  margin: 0;
`;

export default function AppFooter() {
  return (
    <Footer>
      <FooterInner>
        <FooterContent>
          <FooterSection>
            <FooterTitle>Locals Only</FooterTitle>
            <FooterText>
              Discover unique local experiences and connect with authentic hosts around the world.
            </FooterText>
          </FooterSection>
          <FooterSection>
            <FooterTitle>Explore</FooterTitle>
            <FooterLink href="/experiences">Browse Experiences</FooterLink>
            <FooterLink href="/experiences/new">Host an Experience</FooterLink>
            <FooterLink href="/">Home</FooterLink>
          </FooterSection>
          <FooterSection>
            <FooterTitle>About</FooterTitle>
            <FooterLink href="#">How it works</FooterLink>
            <FooterLink href="#">Safety</FooterLink>
            <FooterLink href="#">Contact Us</FooterLink>
          </FooterSection>
          <FooterLogoSection>
            <FooterLogoLink href="/">
              <FooterLogo
                src="/localsOnlyLogoV4.7Tryangle.png"
                alt="Locals Only"
                width={120}
                height={120}
              />
            </FooterLogoLink>
          </FooterLogoSection>
        </FooterContent>
        <FooterBottom>
          <Copyright>© {new Date().getFullYear()} Locals Only. All rights reserved.</Copyright>
        </FooterBottom>
      </FooterInner>
    </Footer>
  );
}
