import { myInfo } from "@/api/user";
import AlertProvider from "@/provider/alert-provider";
import CheckFirstVisitProvider from "@/provider/check-first-visit-provider";
import CidProvider from "@/provider/cid-provider";
import GPSProvider from "@/provider/gps-provider";
import MapProvider from "@/provider/map-provider";
import PageTransitionProvider from "@/provider/page-transition-provider";
import RQProvider from "@/provider/rq-provider";
import ThemeProvider from "@/provider/theme-provider";
import UserProvider from "@/provider/user-provider";
import cn from "@/utils/cn";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import { ToastContainer, Zoom } from "react-toastify";

import GoogleAdsense from "@/provider/google-adsense";
import GoogleAnalytics from "@/provider/google-analytics";
import "./globals.css";

declare global {
  interface Window {
    kakao: any;
    adsbygoogle: any;
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

const pretendard = localFont({
  src: [
    {
      path: "./assets/Pretendard-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "./assets/Pretendard-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./assets/Pretendard-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./assets/Pretendard-Bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "./assets/Pretendard-ExtraBold.woff",
      weight: "800",
      style: "normal",
    },
  ],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.k-pullup.com"),
  title: "대한민국 철봉 지도",
  keywords: "철봉지도,위치등록,철봉정보,채팅,위치검색,관리,철봉찾기",
  description:
    "대한민국 철봉 지도에서 전국 공원의 철봉 위치를 직접 등록하고 조회하세요.",
  openGraph: {
    type: "website",
    url: "https://www.k-pullup.com",
    title: "대한민국 철봉 지도",
    description:
      "대한민국 철봉 지도에서 전국 공원의 철봉 위치를 직접 등록하고 조회하세요.",
    images: "/metaimg.webp",
  },
  twitter: {
    card: "summary_large_image",
    title: "대한민국 철봉 지도",
    description:
      "대한민국 철봉 지도에서 전국 공원의 철봉 위치를 직접 등록하고 조회하세요.",
    images: "/metaimg.webp",
  },
  verification: {
    google: "xsTAtA1ny-_9QoSKUsxC7zk_LljW5KBbcWULaNl2gt8",
    other: { naver: "d1ba940a668490789711101918c8b1f7e221a178" },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent((await cookieStore).toString());

  const theme = (await cookieStore).get("theme")?.value;
  const isDark = theme === "dark";

  const user = await myInfo(decodeCookie);

  return (
    <html
      lang="ko"
      className={`${pretendard.className} ${isDark ? "dark" : ""}`}
    >
      <body>
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
        ) : null}
        <GoogleAdsense />
        <ThemeProvider>
          <RQProvider>
            <GPSProvider>
              <UserProvider user={user}>
                <CidProvider>
                  <AlertProvider>
                    <MapProvider>
                      <CheckFirstVisitProvider>
                        <div className="relative h-dvh bg-white max-w-[600px] mx-auto overflow-hidden">
                          <PageTransitionProvider>
                            {children}
                          </PageTransitionProvider>
                        </div>
                      </CheckFirstVisitProvider>
                    </MapProvider>
                  </AlertProvider>
                </CidProvider>
              </UserProvider>
            </GPSProvider>
          </RQProvider>
          <ToastContainer
            position="top-center"
            autoClose={1000}
            hideProgressBar
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={false}
            transition={Zoom}
            className={cn("sm:left-1/2 sm:-translate-x-1/2 sm:w-[90%]")}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
