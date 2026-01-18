"use client";

import { useState } from "react";
import Image from "next/image";
import styled from "styled-components";

const CardWrap = styled.div`
  perspective: 800px;
  flex-shrink: 0;
  width: 260px;
  height: 320px;
`;

const CardInner = styled.div<{ $flipped: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform: rotateY(${({ $flipped }) => ($flipped ? "180deg" : "0deg")});
  transition: transform 0.5s ease;
`;

const Face = styled.div`
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 28px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  /* glassmorphism */
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
`;

const FaceFront = styled(Face)`
  /* Face base has glass; TopBar/BottomBar overlay their own bg */
`;

const FaceBack = styled(Face)`
  transform: rotateY(180deg);
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`;

const TopBar = styled.div<{ $complete: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  background: ${({ $complete, theme }) => ($complete ? theme.colors.accent : "rgba(30, 32, 38, 0.9)")};
  color: ${({ $complete, theme }) => ($complete ? theme.colors.onAccent : "#fff")};
`;

const Icon = styled.div`
  font-size: 1.5rem;
  line-height: 1;
  flex-shrink: 0;
`;

const TopTitle = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const Middle = styled.div`
  flex: 1;
  min-height: 100px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Desc = styled.p`
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
`;

const BadgeImage = styled.div`
  position: relative;
  width: 140px;
  height: 140px;
  flex-shrink: 0;
`;

const BottomBar = styled.div<{ $complete: boolean }>`
  padding: 0.6rem 1rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: center;
  background: ${({ $complete, theme }) => ($complete ? theme.colors.accent : "rgba(255, 255, 255, 0.95)")};
  color: #1f1f1f;
`;

const BackTitle = styled.span`
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-top: 1rem;
  text-align: center;
`;

export interface ChallengeBadgeCardProps {
  title: string;
  description: string;
  icon: string;
  complete: boolean;
  badgeSrc?: string;
}

export default function ChallengeBadgeCard({
  title,
  description,
  icon,
  complete,
  badgeSrc = "/badge.png",
}: ChallengeBadgeCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <CardWrap
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <CardInner $flipped={flipped}>
        <FaceFront>
          <TopBar $complete={complete}>
            <Icon>{icon}</Icon>
            <TopTitle>{title}</TopTitle>
          </TopBar>
          <Middle>
            {complete ? (
              <BadgeImage>
                <Image src={badgeSrc} alt={title} fill style={{ objectFit: "contain" }} />
              </BadgeImage>
            ) : (
              <Desc>{description}</Desc>
            )}
          </Middle>
          <BottomBar $complete={complete}>
            {complete ? "BADGE COMPLETED" : "BADGE INCOMPLETE"}
          </BottomBar>
        </FaceFront>
        <FaceBack>
          <BadgeImage>
            <Image src={badgeSrc} alt={title} fill style={{ objectFit: "contain" }} />
          </BadgeImage>
          <BackTitle>{title}</BackTitle>
        </FaceBack>
      </CardInner>
    </CardWrap>
  );
}
