'use client'

import { useCallback, useEffect, useState } from "react";
// import { IoMdClose } from 'react-icons/io'
// import Button from "../Button";

interface ModalProps {
    isOpen?: boolean;
    onClose: () => void;
    onSubmit?: () => void;
    title?: string;
    body?: React.ReactElement;
    footer?: React.ReactElement;
    actionLabel?: string;
    disabled?: boolean;
    secondaryAction?: () => void;
    secondaryActionLabel?: string;
    children: React.ReactNode;
}


const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    body,
    footer,
    actionLabel,
    disabled,
    secondaryAction,
    secondaryActionLabel,
    children
}) => {
    const [showModal, setShowModal] = useState(isOpen)

    useEffect(() => {
        setShowModal(isOpen)
    }, [isOpen])

    const handleClose = useCallback(() => {
        if (disabled) {
            return;
        }

        setShowModal(false)
        setTimeout(() => {
            onClose();
        }, 300)
    }, [disabled, onClose])

    const handleSubmit = useCallback(() => {
        if (disabled) {
            return;
        }

        // onSubmit()
    }, [disabled, onSubmit])

    const handleSecondaryAction = useCallback(() => {
        if (disabled || !secondaryAction) {
            return;
        }

        secondaryAction()
    }, [disabled, secondaryAction])

    if (!isOpen) {
        return null;
    }

    return (
        <>
            <div
                className="
                    flex
                    justify-center
                    items-center
                    overflow-x-hidden
                    overflow-y-auto
                    fixed
                    inset-0
                    z-50
                    outline-none
                    focus:outline-none
                    bg-background/80
                    backdrop-blur-sm
                "
            >
                <div
                    className="
                        relative
                        w-full
                        md:w-4/6
                        lg:w-4/6
                        xl:w-2/4
                        my-6
                        mx-auto
                        h-full
                        md:py-6
                        flex
                        justify-center
                        items-center
                    "
                >
                    {/* CONTENT */}
                    <div
                        className={`
                            border
                            rounded-lg
                            w-full
                            translate
                            duration-300
                            h-auto
                            ${showModal ? 'translate-y-0' : 'translate-y-full'}
                            ${showModal ? 'opacity-100' : 'opacity-0'}
                        `}
                    >
                        <div
                            className="
                                translate
                                h-full
                                lg:h-auto
                                md:h-auto
                                border-0
                                rounded-lg
                                shadow-lg
                                relative
                                flex
                                flex-col
                                w-full
                                bg-white
                                outline-none
                                focus:outline-none
                            "   
                        >
                            {/* {HEADER} */}
                            <div 
                                className="
                                    flex
                                    items-center
                                    p-6
                                    rounded-lg
                                    justify-center
                                    relative
                                    border-b-[1px]
                                "
                            >
                                <button
                                    onClick={handleClose}
                                    className="
                                       p-1
                                       border-0
                                       hover:opacity-70
                                       transition
                                       absolute
                                       right-9 
                                    "
                                >
                                    X
                                    {/* <IoMdClose size={18}/> */}
                                </button>
                                <div className="text-lg font-semibold">
                                    {title}
                                </div>
                            </div>
                            {/* {BODY} */}
                            <div className="relative p-6 flex-auto">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Modal;