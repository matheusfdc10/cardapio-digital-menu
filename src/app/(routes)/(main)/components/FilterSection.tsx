"use client"

import { Menu } from "@/types"
import { Link } from 'react-scroll/modules'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from "react";

interface FilterSectionProps {
    menu: Menu[];
    detailsColor: string;
}

const FilterSection: React.FC<FilterSectionProps> = ({
    menu,
    detailsColor
}) => {
    const myRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0)

    useEffect(() => {
        if(myRef?.current?.scrollWidth && myRef?.current?.offsetWidth) {
            setWidth(myRef?.current?.scrollWidth - myRef?.current?.offsetWidth)
        }
    }, [myRef.current?.offsetWidth, myRef?.current?.scrollWidth])
    
    return (
        <div className="sticky top-0 px-4 py-5 bg-neutral-50 w-full z-50 border-b overflow-hidden mx-auto max-w-screen-2xl">
            <motion.div ref={myRef}>
                <motion.div
                    className="font-semibold text-lg flex items-center gap-5 h-full uppercase"
                    drag="x"
                    dragConstraints={{ right: 0, left: -width }}
                    initial={{ x: 0 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 1 }}
                >
                    {menu.map((item) => (
                        <motion.div
                            key={item.id}
                            className="transition-all cursor-pointer whitespace-nowrap"
                        >
                            <Link
                                activeClass='scale-110'
                                activeStyle={{ color: detailsColor}}
                                to={item.name}
                                offset={-84}
                                spy={true} 
                                smooth={true} 
                                duration={500}
                            >
                                {item.name}
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
            {/* <ul className="font-semibold text-lg flex items-center gap-5 h-full uppercase">
                {menu.map((item) => (
                    <li
                        key={item.id}
                        className="transition-all cursor-pointer whitespace-nowrap"
                    >
                        <Link
                            activeClass='scale-110'
                            activeStyle={{ color: detailsColor}}
                            to={item.name}
                            offset={-84}
                            spy={true} 
                            smooth={true} 
                            duration={500}
                        >
                            {item.name}
                        </Link>
                    </li>
                ))}
                </ul> */}
        </div>
    )
}

export default FilterSection;