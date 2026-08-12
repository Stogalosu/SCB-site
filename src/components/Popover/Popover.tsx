import React, { useState, useRef, useEffect } from 'react';
import styles from "./Popover.module.css";

export default function Popover({ children, content, translateX = "-50%" }: { children: React.ReactElement, content: React.ReactNode, translateX?: string }) {
    const [isVisible, setIsVisible] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event:MouseEvent) => {
            const target = event.target as Node;
            if (
                popoverRef.current &&
                !popoverRef.current?.contains(target) &&
                !triggerRef.current?.contains(target)
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
            <div
                ref={triggerRef}
                onClick={() => setIsVisible(prev => !prev)}
            >
                {children}
            </div>

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