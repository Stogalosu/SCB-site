import React, { useState, useRef, useEffect } from 'react';
import styles from "./Popover.module.css";

export default function Popover({ children, content, translateX = "-50%" }: { children: React.ReactElement, content: React.ReactNode }) {
    const [isVisible, setIsVisible] = useState(false);
    const popoverRef = useRef(null);
    const triggerRef = useRef(null);

    function toggleVisibility() {
        setIsVisible(!isVisible);
    };

    const trigger = React.cloneElement(children, {
        ref: triggerRef,
        onClick: (e) => {
            children.props.onClick?.(e);
            toggleVisibility();
        }
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target) &&
                !triggerRef.current.contains(event.target)
            ) {
                setIsVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.popoverContainer}>
            {trigger}

            {isVisible && (
                <div
                    ref={popoverRef}
                    className={styles.popoverContent}
                    style={
                        {"--popover-translate-x": translateX} as React.CSSProperties
                    }
                >
                    {content}
                </div>
            )}
        </div>
    );
};