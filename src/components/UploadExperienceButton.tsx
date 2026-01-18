"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import styled from "styled-components";
import { Upload } from "lucide-react";

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.onAccent};
  border: none;
  cursor: pointer;
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
    <Button
      type="button"
      onClick={handleClick}
      aria-label="Upload experience"
      title="Upload experience"
    >
      <Upload size={18} strokeWidth={2} />
    </Button>
  );
}


