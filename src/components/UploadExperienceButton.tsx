"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import styled from "styled-components";

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.accent};
  color: #ffffff;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
    background: ${({ theme }) => theme.colors.accentHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.onAccent};
    outline-offset: 2px;
  }
`;

export default function UploadExperienceButton() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleClick = useCallback(() => {
    router.push("/experiences/new");
  }, [router]);

  if (session?.user?.role !== "HOST") {
    return null;
  }

  return (
    <Button type="button" onClick={handleClick}>
      Upload Experience
    </Button>
  );
}


