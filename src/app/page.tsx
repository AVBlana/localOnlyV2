"use client";

import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
`;

const Logo = styled(Image)`
  width: 4 00px;
  height: auto;
  margin-bottom: 1.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 2rem;
  max-width: 32rem;
`;

const Button = styled(Link)`
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
  }
`;

export default function Home() {
  return (
    <Container>
      <Logo
        src="/localsOnlyLogoV4.7Tryangle.png"
        alt="Locals Only"
        width={600}
        height={600}
        priority
      />
      <Subtitle>Discover unique local experiences</Subtitle>
      <Button href="/experiences">Browse Experiences</Button>
    </Container>
  );
}
