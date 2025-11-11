"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import ThemeToggle from "@/components/ThemeToggle";
import AuthButton from "@/components/AuthButton";
import UploadExperienceButton from "@/components/UploadExperienceButton";
import { useExperiencesQuery } from "@/hooks/useExperiencesQuery";
import ExperienceGrid from "@/components/ExperienceGrid";

const Container = styled.div`
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem 0;
  background: ${({ theme }) => theme.colors.background};
  z-index: 10;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;

const LogoImage = styled(Image)`
  width: 64px;
  height: auto;
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

const Content = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
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
  flex: 1;
  padding-top: 2rem;
`;

const LoadMoreSentinel = styled.div`
  height: 1px;
`;

const LoadingMore = styled.div`
  text-align: center;
  padding: 2rem 0;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export default function ExperiencesPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useExperiencesQuery();

  const experiences = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    const sentinel = loadMoreRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.find((item) => item.isIntersecting);

        if (entry && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <Container>
        <Header>
          <HeaderLeft>
            <LogoLink href="/">
              <LogoImage
                src="/localsOnlyLogoV4.7Tryangle.png"
                alt="Locals Only"
                width={64}
                height={64}
                priority
              />
            </LogoLink>
            <Title>Experiences</Title>
          </HeaderLeft>
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

  if (isError) {
    return (
      <Container>
        <Header>
          <HeaderLeft>
            <LogoLink href="/">
              <LogoImage
                src="/localsOnlyLogoV4.7Tryangle.png"
                alt="Locals Only"
                width={64}
                height={64}
              />
            </LogoLink>
            <Title>Experiences</Title>
          </HeaderLeft>
          <Actions>
            <BackLink href="/">← Home</BackLink>
            <ThemeToggle />
            <UploadExperienceButton />
            <AuthButton />
          </Actions>
        </Header>
        <Error>
          {error instanceof Error
            ? error.message
            : "Error loading experiences. Please try again later."}
        </Error>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <LogoLink href="/">
            <LogoImage
              src="/localsOnlyLogoV4.7Tryangle.png"
              alt="Locals Only"
              width={64}
              height={64}
            />
          </LogoLink>
          <Title>Experiences</Title>
        </HeaderLeft>
        <Actions>
          <BackLink href="/">← Home</BackLink>
          <ThemeToggle />
          <UploadExperienceButton />
          <AuthButton />
        </Actions>
      </Header>
      <Content>
        {experiences.length > 0 ? (
          <>
            <GridWrapper>
              <ExperienceGrid experiences={experiences} />
            </GridWrapper>
            <LoadMoreSentinel ref={loadMoreRef} />
            {isFetchingNextPage && <LoadingMore>Loading more experiences...</LoadingMore>}
            {!hasNextPage && !isFetchingNextPage && (
              <LoadingMore>All experiences loaded.</LoadingMore>
            )}
          </>
        ) : (
          <Empty>No experiences found.</Empty>
        )}
      </Content>
    </Container>
  );
}

