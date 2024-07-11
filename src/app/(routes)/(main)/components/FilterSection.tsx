"use client"

import { Menu } from "@/types";
import { Link } from 'react-scroll/modules';
import { useRef, useState, useCallback, useEffect } from "react";

function debounce(func: (...args: any[]) => void, wait: number) {
    let timeout: NodeJS.Timeout;
    return function(...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

interface FilterSectionProps {
    menu: Menu[];
    detailsColor: string;
}

const FilterSection: React.FC<FilterSectionProps> = ({
    menu,
    detailsColor
}) => {
    const listRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const scrollToActive = useCallback((index: number) => {
        if (listRef.current) {
            const activeItem = listRef.current.children[index] as HTMLElement;
            const activeItemCenter = activeItem.offsetLeft + activeItem.offsetWidth / 2;
            const scrollOffset = activeItemCenter - listRef.current.offsetWidth / 2;
            listRef.current.scrollTo({ left: scrollOffset, behavior: 'smooth' });
        }
    }, []);

    const debouncedScrollToActive = useCallback(debounce(scrollToActive, 200), [scrollToActive]);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        setStartX(e.pageX - (listRef.current?.offsetLeft || 0));
        setStartY(e.pageY - (listRef.current?.offsetTop || 0));
        setScrollLeft(listRef.current?.scrollLeft || 0);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        const touch = e.touches[0];
        setStartX(touch.pageX - (listRef.current?.offsetLeft || 0));
        setStartY(touch.pageY - (listRef.current?.offsetTop || 0));
        setScrollLeft(listRef.current?.scrollLeft || 0);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - (listRef.current?.offsetLeft || 0);
        const y = e.pageY - (listRef.current?.offsetTop || 0);
        const walkX = x - startX;
        const walkY = y - startY;
        listRef.current!.scrollLeft = scrollLeft - walkX;
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        const x = touch.pageX - (listRef.current?.offsetLeft || 0);
        const y = touch.pageY - (listRef.current?.offsetTop || 0);
        const walkX = x - startX;
        const walkY = y - startY;
        listRef.current!.scrollLeft = scrollLeft - walkX;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        const ref = listRef.current;

        if (ref) {
            ref.addEventListener('touchmove', handleTouchMove, { passive: false });

            return () => {
                ref.removeEventListener('touchmove', handleTouchMove);
            };
        }
    }, [handleTouchMove]);

    return (
        <div className="sticky top-0 h-16 bg-neutral-50 w-full z-50 border-b overflow-hidden mx-auto max-w-screen-2xl">
            <div
                ref={listRef}
                className="font-semibold text-lg flex items-center gap-2 h-full uppercase overflow-hidden px-3 cursor-grab"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{ userSelect: 'none' }}
            >
                {menu.map((item, index) => (
                    <Link
                        key={item.id}
                        className="whitespace-nowrap border-b border-b-transparent cursor-pointer transition p-2 h-full flex justify-center items-center"
                        activeClass='border-b-2'
                        activeStyle={{ 
                            color: detailsColor,
                            borderColor: detailsColor
                        }}
                        to={item.name}
                        offset={-82}
                        spy={true}
                        smooth={true} 
                        duration={400}
                        onSetActive={(to, element) => {
                            debouncedScrollToActive(index)
                        }}
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default FilterSection;
