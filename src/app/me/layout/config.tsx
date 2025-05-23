"use client";

import ResetPasswordForm from "@/app/layout/reset-password-form";
import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";
import Switch from "@/components/switch/switch";
import { useSignout } from "@/hooks/api/auth/use-signout";
import { useDeleteUser } from "@/hooks/api/user/use-delete-user";
import useDarkMode from "@/hooks/use-dark-mode";
import useAlertStore from "@/store/use-alert-store";
import { useUserStore } from "@/store/use-user-store";
import { useState } from "react";
import { BsChevronRight } from "react-icons/bs";
import Inquiry from "./inquiry";

interface MyInfoProps {
  os?: string;
  close?: VoidFunction;
}

const Config = ({ os = "Windows", close }: MyInfoProps) => {
  const { setLoading, user } = useUserStore();
  const { openAlert } = useAlertStore();

  const { mutateAsync: signout, isPending } = useSignout();
  const { mutateAsync: deleteUser, isPending: deleteUserLoading } =
    useDeleteUser();
  const { isDark, toggleTheme } = useDarkMode();

  const [viewResetPasswordPage, setViewResetPasswordPage] = useState(false);
  const [viewInquiry, setViewInquiry] = useState(false);

  const handleDeleteUser = async () => {
    try {
      setLoading(true);
      await deleteUser();
    } catch {
      setLoading(false);
    } finally {
      close?.();
    }
  };

  return (
    <SwipeClosePage
      os={os}
      close={close}
      headerTitle="설정"
      slideType="horizontal"
      className="bg-grey-light"
    >
      {viewResetPasswordPage && (
        <ResetPasswordForm
          os={os}
          close={() => setViewResetPasswordPage(false)}
        />
      )}
      {viewInquiry && <Inquiry close={() => setViewInquiry(false)} />}

      <ConfigList title="앱 설정">
        <ConfigListItem
          title="다크모드"
          type="toggle"
          onToggleChange={toggleTheme}
          initToggleValue={isDark}
        />
      </ConfigList>

      {user && (
        <ConfigList title="사용자 설정">
          <ConfigListItem
            title="로그아웃"
            onClick={async () => {
              try {
                setLoading(true);
                await signout();
              } catch {
                setLoading(false);
              } finally {
                close?.();
              }
            }}
            disabled={isPending}
          />
          <ConfigListItem
            title="비밀번호 초기화"
            onClick={() => setViewResetPasswordPage(true)}
          />
          <ConfigListItem
            title="회원 탈퇴"
            onClick={() => {
              openAlert({
                title: "정말 탈퇴하시겠습니까?",
                description:
                  "추가하신 마커는 유지되고, 작성한 댓글 밑 사진은 모두 삭제됩니다!",
                onClickAsync: handleDeleteUser,
                cancel: true,
                buttonLabel: "탈퇴",
              });
            }}
            disabled={deleteUserLoading}
          />
        </ConfigList>
      )}

      <ConfigList title="기타">
        <ConfigListItem title="문의" onClick={() => setViewInquiry(true)} />
      </ConfigList>
    </SwipeClosePage>
  );
};

const ConfigList = ({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) => {
  return (
    <div className="mb-3">
      <div className="p-2">{title}</div>
      <ul className="bg-white dark:bg-black-light">{children}</ul>
    </div>
  );
};

interface ListItemProps {
  title: string;
  description?: string;
  type?: "toggle" | "link";
  initToggleValue?: boolean;
  disabled?: boolean;
  onClick?: VoidFunction;
  onToggleChange?: VoidFunction;
}

const ConfigListItem = ({
  title,
  description,
  type = "link",
  initToggleValue,
  disabled,
  onClick,
  onToggleChange,
}: ListItemProps) => {
  const Container = onClick ? "button" : "li";
  return (
    <Container
      className={`flex justify-between items-center ${
        type === "link" || onClick ? "cursor-pointer w-full" : "cursor-default"
      } p-2 border-b border-solid border-grey-light dark:border-grey-dark`}
      onClick={onClick}
      disabled={disabled}
    >
      <div>
        <div>{title}</div>
        <div className="text-grey-dark text-xs">{description}</div>
      </div>

      {type === "link" && (
        <div>
          <BsChevronRight />
        </div>
      )}
      {type === "toggle" && (
        <Switch onChange={onToggleChange} checked={initToggleValue} />
      )}
    </Container>
  );
};

export default Config;
