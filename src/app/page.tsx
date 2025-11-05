"use client";

import styled from "styled-components";
import Link from "next/link";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
  text-align: center;
`;

const Button = styled(Link)`
  background: #e91e63;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: #c2185b;
  }
`;

export default function Home() {
  return (
    <Container>
      <Title>Locals Only</Title>
      <Subtitle>Discover unique local experiences</Subtitle>
      <Button href="/experiences">Browse Experiences</Button>
    </Container>
  );
}
