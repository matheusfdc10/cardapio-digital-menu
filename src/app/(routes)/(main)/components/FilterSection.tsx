"use client"

import { Menu } from "@/types";
import { Link } from 'react-scroll/modules';
// import { motion } from 'framer-motion';
import { useRef, useState } from "react";

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

    const scrollToActive = (index: number) => {
        if (listRef.current) {
            const activeItem = listRef.current.children[index] as HTMLElement;
            const activeItemCenter = activeItem.offsetLeft + activeItem.offsetWidth / 2;
            const scrollOffset = activeItemCenter - listRef.current.offsetWidth / 2;
            listRef.current.scrollTo({ left: scrollOffset, behavior: 'smooth' });
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        setStartX(e.pageX - (listRef.current?.offsetLeft || 0));
        setStartY(e.pageY - (listRef.current?.offsetTop || 0));
        setScrollLeft(listRef.current?.scrollLeft || 0);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
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

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        e.preventDefault();
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

    return (
        <div className="sticky top-0 h-16 bg-neutral-50 w-full z-50 border-b overflow-hidden mx-auto max-w-screen-2xl cursor-grab">
            <div
                ref={listRef}
                className="font-semibold text-lg flex items-center gap-2 h-full uppercase overflow-hidden px-3"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ userSelect: 'none' }}
            >
                {menu.map((item, index) => (
                    <Link
                        key={item.id}
                        className="whitespace-nowrap cursor-pointer transition p-2"
                        activeClass='scale-105'
                        activeStyle={{ color: detailsColor }}
                        to={item.name}
                        offset={-82}
                        spy={true} 
                        smooth={true} 
                        duration={500}
                        onSetActive={(to, element) => {
                            scrollToActive(index)
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
