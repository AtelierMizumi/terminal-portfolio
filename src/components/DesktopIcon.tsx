import React from 'react';
import { motion } from 'framer-motion';

interface DesktopIconProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    x: number;
    y: number;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ icon, label, onClick, x, y }) => {
    return (
        <motion.div
            drag
            dragMomentum={false}
            initial={{ x, y }}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            className="w-20 flex flex-col items-center gap-1 p-2 rounded-lg cursor-pointer text-center z-0"
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            // Use onPointerDown to support both mouse and touch tap for scale animation
            onPointerDown={(e) => e.stopPropagation()}
        >
            <div className="w-12 h-12 flex items-center justify-center bg-[#1e1e2e]/60 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg drop-shadow-md text-[#cba6f7]">
                {icon}
            </div>
            <span className="text-white text-xs font-medium drop-shadow-md select-none w-full truncate px-1">
                {label}
            </span>
        </motion.div>
    );
};
