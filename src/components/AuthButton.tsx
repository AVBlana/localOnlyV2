"use client";

import { useCallback } from "react";
import styled from "styled-components";
import { signIn, signOut, useSession } from "next-auth/react";

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s ease, color 0.2s ease, border 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.cardBackground};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Label = styled.span`
  font-weight: 500;
`;

const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.cardBackground};
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export default function AuthButton() {
  const { data: session, status } = useSession();

  const handleSignIn = useCallback(() => {
    signIn("google");
  }, []);

  const handleSignOut = useCallback(() => {
    signOut();
  }, []);

  if (status === "loading") {
    return <Button type="button" disabled>Loading...</Button>;
  }

  if (!session?.user) {
    return (
      <Button type="button" onClick={handleSignIn}>
        <Label>Sign in</Label>
      </Button>
    );
  }

  return (
    <Button type="button" onClick={handleSignOut}>
      <Label>{session.user.name ?? "Account"}</Label>
      <RoleBadge>{session.user.role}</RoleBadge>
    </Button>
  );
}


