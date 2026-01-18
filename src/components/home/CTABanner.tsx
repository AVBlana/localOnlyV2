"use client";

import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";

const Section = styled.section`
  width: 100%;
  padding: 2rem clamp(24px, 5vw, 80px);
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Inner = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 1.25rem;
  }
`;

const LogoWrap = styled.div`
  flex-shrink: 0;
  position: relative;
  width: clamp(120px, 16vw, 180px);
  height: clamp(150px, 20vw, 220px);

  @media (max-width: 900px) {
    width: 140px;
    height: 170px;
  }
`;

const RightRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  flex: 1;
  min-width: 0;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`;

const Frame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0;
  width: 100%;
  max-width: 520px;
  flex-grow: 1;
`;

const MainText = styled.div`
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.25;
`;

const Small = styled.span`
  font-size: clamp(0.9rem, 1.2vw, 1.05rem);
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Emph = styled.span`
  font-size: clamp(1.5rem, 2.8vw, 2rem);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SubText = styled.p`
  margin: 0;
  font-size: clamp(0.85rem, 1.2vw, 0.95rem);
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.4;
`;

const CtaButton = styled(Link)`
  display: inline-block;
  margin-top: 0.25rem;
  padding: 0.7rem 1.4rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-decoration: none;
  text-align: center;
  white-space: nowrap;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.onAccent};
  transition: background 0.2s, transform 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    transform: scale(1.02);
  }
`;

const Tags = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  flex-shrink: 0;

  @media (max-width: 900px) {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
  }
`;

const Tag = styled(Link)`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  text-decoration: none;
  text-align: center;
  white-space: nowrap;
  background: #ffffff;
  color: #1f1f1f;
  transition: opacity 0.2s, transform 0.2s;

  &:hover {
    opacity: 0.9;
    transform: scale(1.02);
  }
`;

export default function CTABanner() {
  return (
    <Section>
      <Inner>
        <LogoWrap>
          <Image
            src="/logoSample.png"
            alt="Locals Only"
            fill
            style={{ objectFit: "contain" }}
          />
        </LogoWrap>
        <RightRow>
          <Frame>
            <MainText>
              <Small>Not just an </Small>
              <Emph>experience,</Emph>
              <br />
              <Small>but the way of </Small>
              <Emph>local living</Emph>
            </MainText>
            <SubText>Travel and experience the local activities</SubText>
            <CtaButton href="/experiences">All experiences</CtaButton>
          </Frame>
          <Tags>
            <Tag href="/experiences">Extreme Adventures</Tag>
            <Tag href="/experiences">Sports</Tag>
            <Tag href="/experiences">Foraging</Tag>
          </Tags>
        </RightRow>
      </Inner>
    </Section>
  );
}
