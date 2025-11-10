"use client";

import styled from "styled-components";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import AuthButton from "@/components/AuthButton";
import UploadExperienceButton from "@/components/UploadExperienceButton";
import { useExperiencesQuery } from "@/hooks/useExperiencesQuery";
import ExperienceGrid from "@/components/ExperienceGrid";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BackLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Error = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.colors.accent};
  font-size: 1.2rem;
`;

const Empty = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.2rem;
`;

const GridWrapper = styled.div`
  margin-top: 2rem;
`;

export default function ExperiencesPage() {
  const { data: experiences, isLoading, error } = useExperiencesQuery();

  if (isLoading) {
    return (
      <Container>
        <Header>
          <Title>Experiences</Title>
          <Actions>
            <BackLink href="/">← Home</BackLink>
            <ThemeToggle />
            <UploadExperienceButton />
            <AuthButton />
          </Actions>
        </Header>
        <Loading>Loading experiences...</Loading>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <Title>Experiences</Title>
          <Actions>
            <BackLink href="/">← Home</BackLink>
            <ThemeToggle />
            <UploadExperienceButton />
            <AuthButton />
          </Actions>
        </Header>
        <Error>Error loading experiences. Please try again later.</Error>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Experiences</Title>
        <Actions>
          <BackLink href="/">← Home</BackLink>
          <ThemeToggle />
            <UploadExperienceButton />
            <AuthButton />
        </Actions>
      </Header>
      {experiences && experiences.length > 0 ? (
        <GridWrapper>
          <ExperienceGrid experiences={experiences} />
        </GridWrapper>
      ) : (
        <Empty>No experiences found.</Empty>
      )}
    </Container>
  );
}

