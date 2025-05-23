import useScroll from "@/hooks/use-scroll";
import cn from "@/utils/cn";
import { useEffect, useRef, useState } from "react";
import { BsArrowLeftShort } from "react-icons/bs";

const DRAG_THRESHOLD = 30;
const CLOSE_OPACITY_THRESHOLD = 0.4;
const MIN_OPACITY = 0.3;
const OPACITY_STEP = 0.005;
const RESET_OPACITY_DELAY = 250;
const OVERSCROLL_LIMIT = 100;
const EDGE_SWIPE_THRESHOLD = 20;

interface SwipeClosePageProps {
  slideType?: "vertical" | "horizontal" | "none";
  close?: VoidFunction;
  dragClose?: boolean;
  headerTitle?: string;
  icon?: React.ReactNode;
  iconClick?: VoidFunction;
  os?: string;
  className?: React.ComponentProps<"div">["className"];
  onPrevClick?: VoidFunction;
  headerStyleClass?: string;
}

const SwipeClosePage = ({
  slideType = "vertical",
  close,
  dragClose = true,
  headerTitle,
  icon,
  iconClick,
  onPrevClick,
  os = "Windows",
  className,
  headerStyleClass,
  children,
}: React.PropsWithChildren<SwipeClosePageProps>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isTop, scrollTop } = useScroll(containerRef.current);

  const isDragging = useRef(false);

  const isEdgeSwipeZone = useRef(false);

  const startY = useRef<number | null>(null);
  const startX = useRef<number | null>(null);

  const [translateY, setTranslateY] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  const [opacity, setOpacity] = useState(1);

  const [active, setActive] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setActive(true);
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    if (translateY > DRAG_THRESHOLD) {
      containerRef.current.style.overflow = "hidden";
    } else {
      containerRef.current.style.overflow = "auto";
      containerRef.current.style.overflowX = "hidden";
    }
  }, [translateY]);

  const handleDragStart = (clientY: number, clientX: number) => {
    if (!dragClose) return;
    isDragging.current = true;
    if (slideType === "vertical") {
      if (!isTop) return;
      startY.current = clientY;
    } else {
      startX.current = clientX;

      if (clientX < EDGE_SWIPE_THRESHOLD) {
        isEdgeSwipeZone.current = true;
      }
    }
  };

  const handleDragMove = (clientY: number, clientX: number) => {
    if (!dragClose) return;

    if (startY.current && slideType === "vertical") {
      if (!isTop) return;
      const deltaY = clientY - startY.current;
      const newOpacity = Math.max(
        MIN_OPACITY,
        1 - Math.abs(deltaY) * OPACITY_STEP
      );
      if (deltaY - DRAG_THRESHOLD >= 0 && Math.abs(deltaY) > DRAG_THRESHOLD) {
        setTranslateY(Math.floor(deltaY - DRAG_THRESHOLD));
        setOpacity(newOpacity);
      }
    } else if (startX.current && slideType === "horizontal") {
      if (!isEdgeSwipeZone.current) return;
      const deltaX = clientX - startX.current;
      const newOpacity = Math.max(
        MIN_OPACITY,
        1 - Math.abs(deltaX) * OPACITY_STEP
      );
      if (deltaX - DRAG_THRESHOLD >= 0 && Math.abs(deltaX) > DRAG_THRESHOLD) {
        setTranslateX(Math.floor(deltaX - DRAG_THRESHOLD));
        setOpacity(newOpacity);
      }
    }
  };

  const handleDragEnd = () => {
    if (!dragClose) return;

    if (startY.current && slideType === "vertical" && isTop) {
      if (opacity < CLOSE_OPACITY_THRESHOLD) {
        close?.();
        setOpacity(0);
        setTimeout(() => setOpacity(1), RESET_OPACITY_DELAY);
      } else {
        setOpacity(1);
      }

      setTranslateY(0);
      startY.current = null;
    } else {
      if (!isEdgeSwipeZone.current) return;

      if (opacity < CLOSE_OPACITY_THRESHOLD) {
        close?.();
        setOpacity(0);
        setTimeout(() => setOpacity(1), RESET_OPACITY_DELAY);
      } else {
        setOpacity(1);
      }

      setTranslateX(0);
      startX.current = null;
    }
    isEdgeSwipeZone.current = false;
    isDragging.current = false;
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    handleDragStart(e.clientY, e.clientX);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    handleDragMove(e.clientY, e.clientX);
  };

  const onMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    handleDragEnd();
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    handleDragStart(e.touches[0].clientY, e.touches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    handleDragMove(e.touches[0].clientY, e.touches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    handleDragEnd();
  };

  const computedTransformY = active
    ? isDragging.current
      ? `translateY(${translateY}px) translateX(-50%)`
      : `translateY(0) translateX(-50%)`
    : `translateY(100%) translateX(-50%)`;

  const computedTransformX = active
    ? isDragging.current
      ? `translateX(calc(-50% + ${translateX}px))`
      : `translateX(-50%)`
    : `translateX(100%)`;

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed top-0 w-full h-full left-1/2 bg-white z-30 max-w-[600px] dark:bg-black overflow-auto overflow-x-hidden",
        active ? "translate-y-0" : "translate-y-full",
        !isDragging.current ? "duration-150" : "duration-0",
        scrollTop < OVERSCROLL_LIMIT ? "overscroll-none" : "",
        className
      )}
      style={{
        transform:
          slideType === "none"
            ? "translateX(-50%)"
            : slideType === "vertical"
            ? computedTransformY
            : computedTransformX,
        opacity: opacity,
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {headerTitle && (
        <header
          className={cn(
            `p-3 sticky top-0 left-0 w-full bg-white z-10 shadow-sm flex items-center
        dark:bg-black dark:shadow-full`,
            os === "iOS" ? "pt-12" : os === "Android" ? "pt-8" : "",
            headerStyleClass
          )}
        >
          <button className="mr-4" onClick={onPrevClick ? onPrevClick : close}>
            <BsArrowLeftShort size={26} />
          </button>
          <span className="truncate grow">{headerTitle}</span>
          {icon && (
            <button className="mr-4" onClick={iconClick}>
              {icon}
            </button>
          )}
        </header>
      )}

      {children}
    </div>
  );
};

export default SwipeClosePage;
