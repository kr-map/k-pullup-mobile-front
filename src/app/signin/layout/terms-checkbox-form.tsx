import { Button } from "@/components/button/button";
import { useFullPageModalStore } from "@/store/use-full-page-modal.store";
import cn from "@/utils/cn";
import { useState } from "react";
import { BsChevronRight } from "react-icons/bs";
import LocationTerms from "./location-terms";
import PrivacyPolicy from "./privacy-policy";
import Terms from "./terms";

const TermsCheckboxForm = ({
  next,
  os = "Windows",
}: {
  next: VoidFunction;
  os?: string;
}) => {
  const [termsChecked, setTermsChecked] = useState(false);
  const [ageChecked, setAgeChecked] = useState(false);
  const [marketingChecked, setMarketingChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [locationChecked, setLocationChecked] = useState(false);

  const allChecked =
    termsChecked &&
    ageChecked &&
    marketingChecked &&
    privacyChecked &&
    locationChecked;

  const requiredAllChecked =
    termsChecked && ageChecked && privacyChecked && locationChecked;

  const toggleAll = () => {
    const newState = !allChecked;
    setTermsChecked(newState);
    setAgeChecked(newState);
    setMarketingChecked(newState);
    setPrivacyChecked(newState);
    setLocationChecked(newState);
  };

  return (
    <div className="p-2">
      {/* 마케팅 약관 상세 */}
      <Terms os={os} />
      <PrivacyPolicy os={os} />
      <LocationTerms os={os} />

      {/* 전체 동의  */}
      <div
        className="flex items-center mb-4 cursor-pointer"
        onClick={toggleAll}
      >
        <img
          src={allChecked ? "/allCheckedIcon.svg" : "/allCheckIcon.svg"}
          alt={"전체 동의"}
          className="w-5 h-5 mr-2"
        />
        <label className="font-bold">전체 동의</label>
      </div>

      <hr className="mb-4" />

      {/* 필수 동의 항목 */}
      <RequiredConsentList
        termsChecked={termsChecked}
        toggleTerms={() => setTermsChecked((prev) => !prev)}
        ageChecked={ageChecked}
        toggleAge={() => setAgeChecked((prev) => !prev)}
        privacyChecked={privacyChecked}
        togglePrivacy={() => setPrivacyChecked((prev) => !prev)}
        locationChecked={locationChecked}
        toggleLocation={() => setLocationChecked((prev) => !prev)}
      />

      {/* 선택 동의 항목 */}
      <OptionalConsentList
        marketingChecked={marketingChecked}
        toggleMarketing={() => setMarketingChecked((prev) => !prev)}
      />

      <Button
        className="bg-primary active:scale-90 disabled:bg-grey dark:disabled:bg-grey-dark"
        disabled={!requiredAllChecked}
        onClick={next}
        fullWidth
        clickAction
      >
        동의하고 계속하기
      </Button>
    </div>
  );
};

interface RequiredConsentListProps {
  termsChecked: boolean;
  toggleTerms: VoidFunction;
  ageChecked: boolean;
  toggleAge: VoidFunction;
  privacyChecked: boolean;
  togglePrivacy: VoidFunction;
  locationChecked: boolean;
  toggleLocation: VoidFunction;
}

const RequiredConsentList = ({
  termsChecked,
  toggleTerms,
  ageChecked,
  toggleAge,
  privacyChecked,
  togglePrivacy,
  locationChecked,
  toggleLocation,
}: RequiredConsentListProps) => {
  const { show } = useFullPageModalStore();

  return (
    <div className="mb-4">
      <h3 className="font-bold mb-2">필수 동의</h3>
      <CheckboxItem
        label="이용약관 동의"
        checked={termsChecked}
        onToggle={toggleTerms}
        checkedIcon="/checkedIcon.svg"
        uncheckedIcon="/checkIcon.svg"
        linkClick={() => {
          show("term");
        }}
      />
      <CheckboxItem
        label="14세 이용 동의"
        checked={ageChecked}
        onToggle={toggleAge}
        checkedIcon="/checkedIcon.svg"
        uncheckedIcon="/checkIcon.svg"
      />
      <CheckboxItem
        label="개인정보 수집 및 이용 동의"
        checked={privacyChecked}
        onToggle={togglePrivacy}
        checkedIcon="/checkedIcon.svg"
        uncheckedIcon="/checkIcon.svg"
        linkClick={() => {
          show("privacy-policy");
        }}
      />
      <CheckboxItem
        label="위치정보 이용약관 동의"
        checked={locationChecked}
        onToggle={toggleLocation}
        checkedIcon="/checkedIcon.svg"
        uncheckedIcon="/checkIcon.svg"
        linkClick={() => {
          show("location-terms");
        }}
      />
    </div>
  );
};

interface OptionalConsentListProps {
  marketingChecked: boolean;
  toggleMarketing: VoidFunction;
}

const OptionalConsentList = ({
  marketingChecked,
  toggleMarketing,
}: OptionalConsentListProps) => {
  return (
    <div className="mb-4">
      <h3 className="font-bold mb-2">선택 동의</h3>
      <CheckboxItem
        label="마케팅 수신 동의"
        checked={marketingChecked}
        onToggle={toggleMarketing}
        checkedIcon="/checkedIcon.svg"
        uncheckedIcon="/checkIcon.svg"
        subText="대한민국 철봉 지도가 제공하는 이벤트 및 혜택 등 정보를 이메일, 앱 푸시 알림 등으로 받을 수 있으며 내정보 관리에서 확인 가능합니다."
      />
    </div>
  );
};

interface CheckboxItemProps {
  checked: boolean;
  onToggle: VoidFunction;
  label: string;
  checkedIcon: string;
  uncheckedIcon: string;
  linkClick?: VoidFunction;
  subText?: string;
}

const CheckboxItem = ({
  checked,
  onToggle,
  label,
  checkedIcon,
  uncheckedIcon,
  linkClick,
  subText,
}: CheckboxItemProps) => {
  return (
    <div
      className={cn(
        "flex items-center mb-1 cursor-pointer",
        linkClick ? "py-0" : "py-2",
        subText ? "items-start" : "items-center"
      )}
      onClick={onToggle}
    >
      <img
        src={checked ? checkedIcon : uncheckedIcon}
        alt={checked ? `${label} 동의됨` : `${label} 동의`}
        className={cn("w-5 h-5 mr-2", subText ? "mt-[3px]" : "mt-0")}
      />
      <div>
        <label className="text-sm">{label}</label>
        {subText && <div className="text-xs text-grey">{subText}</div>}
      </div>

      <div className="grow" />
      {linkClick && (
        <Button
          className="bg-transparent dark:bg-transparent"
          icon={
            <BsChevronRight
              className="text-grey-dark dark:text-white"
              size={14}
            />
          }
          onClick={(e) => {
            e.stopPropagation();
            linkClick();
          }}
          clickAction
        />
      )}
    </div>
  );
};

export default TermsCheckboxForm;
