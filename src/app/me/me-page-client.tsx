"use client";

import { Button } from "@/components/button/button";
import Main from "@/components/main/main";
import Section from "@/components/section/section";
import usePageTransition from "@/hooks/use-page-transition";
import BookmarkIcon from "@/icons/bookmark-icon";
import MylocateIcon from "@/icons/mylocation-icon";
import ProposalIcon from "@/icons/proposal-icon";
import ReceivedIcon from "@/icons/received-icon";
import { useEffect, useState } from "react";
import { BsChevronRight } from "react-icons/bs";
import { useSessionStore } from "../../store/use-session-store";
import Signin from "../layout/signin";
import Config from "./layout/config";
import MyInfo from "./layout/my-info";

const MePageClient = ({ os }: { os: string }) => {
  const user = {
    username: "도토리",
    email: "yonghuni484@gmail.com",
    provider: "kakao",
    contributionLevel: "초보 운동자",
    userId: 50,
    contributionCount: 70,
  };

  const { isFirstVisit } = useSessionStore();
  const { slideIn } = usePageTransition();

  const [viewSingin, setViewSignin] = useState(false);
  const [viewMyInfo, setViewMyInfo] = useState(false);
  const [viewConfig, setViewConfig] = useState(false);

  useEffect(() => {
    if (isFirstVisit) return;
    slideIn();
  }, []);

  return (
    <Main
      os={os}
      headerTitle={!user ? ["오늘도 와주셔서", "감사해요!"] : undefined}
    >
      {viewSingin && <Signin os={os} close={() => setViewSignin(false)} />}
      {viewMyInfo && <MyInfo os={os} close={() => setViewMyInfo(false)} />}
      {viewConfig && <Config os={os} close={() => setViewConfig(false)} />}

      {!user ? (
        <Section className="pb-0">
          <div className="active:bg-primary active:bg-opacity-20 rounded font-bold text-lg">
            <Button
              icon={<BsChevronRight />}
              onClick={() => setViewSignin(true)}
              className="flex-row-reverse justify-between active:scale-90 px-0 text-primary dark:text-primary bg-transparent dark:bg-transparent"
              appearance="borderless"
              clickAction
              fullWidth
            >
              로그인 및 회원가입하기
            </Button>
          </div>
        </Section>
      ) : (
        <Section className="pb-0">
          <div className="flex flex-col text-lg">
            <span>
              <span className="font-bold text-xl mr-1">{user.username}</span>
              <span>님</span>
            </span>
            <span>안녕하세요!</span>
          </div>
        </Section>
      )}

      {/* 내 정보, 설정 */}
      <Section>
        <div className="relative shadow-full rounded p-1 flex dark:border dark:border-solid dark:border-grey-dark">
          <button
            className="w-1/2 text-center active:bg-grey-light p-1 rounded dark:active:bg-grey-dark"
            onClick={() => setViewMyInfo(true)}
          >
            내 정보 관리
          </button>
          <div className="mx-3 w-[0.5px] bg-[#ddd]" />
          <button
            className="w-1/2 text-center active:bg-grey-light p-1 rounded dark:active:bg-grey-dark"
            onClick={() => setViewConfig(true)}
          >
            설정
          </button>
        </div>
      </Section>

      {/* 유저 등급 */}
      {user && (
        <Section>
          <div className="flex justify-center items-center p-4 bg-white shadow-full rounded dark:border dark:border-solid dark:border-grey-dark dark:bg-black">
            <div className="flex flex-col justify-center items-center relative w-2/5">
              <div className="w-20 mb-2">
                <img src="/ranking1.png" alt="등급" />
              </div>
              <div className="mb-2 font-bold text-xl">
                {user.contributionLevel}
              </div>
              <div>
                정보 기여 총{" "}
                <span className="text-primary font-bold">
                  {user.contributionCount}
                </span>
                회
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* 버튼 링크 */}
      {user && (
        <div className="mt-4">
          <IconLinkButton icon={<BookmarkIcon size={30} />}>
            저장한 장소
          </IconLinkButton>
          <IconLinkButton icon={<MylocateIcon size={28} />}>
            등록한 장소
          </IconLinkButton>
          <IconLinkButton icon={<ProposalIcon size={28} />}>
            내가 요청한 수정 목록
          </IconLinkButton>
          <IconLinkButton icon={<ReceivedIcon size={30} />}>
            받은 수정 요청 목록
          </IconLinkButton>
        </div>
      )}

      <div className="pb-10" />
    </Main>
  );
};

const IconLinkButton = ({
  icon,
  children,
}: React.PropsWithChildren<{ icon: React.ReactElement }>) => {
  return (
    <Button
      className="px-4 py-2 flex items-center bg-transparent dark:text-white text-black active:scale-95 active:bg-grey-light dark:bg-black"
      fullWidth
      clickAction
    >
      <span className="mr-4">{icon}</span>
      <span>{children}</span>
      <div className="grow" />
      <span>
        <BsChevronRight />
      </span>
    </Button>
  );
};
export default MePageClient;
