import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <svg
                viewBox="0 0 300 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-2xl"
            >
                <defs>
                    <linearGradient id="blue_grad" x1="50" y1="250" x2="250" y2="50" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#1e3a8a" />
                        <stop offset="40%" stopColor="#1d4ed8" />
                        <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                    <linearGradient id="orange_grad" x1="180" y1="100" x2="180" y2="200" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#ea580c" />
                    </linearGradient>

                    <mask id="logo-mask">
                        {/* Start with everything visible */}
                        <rect width="300" height="300" fill="white" />

                        {/* Top gap in frame */}
                        <rect x="165" y="30" width="18" height="40" fill="black" />

                        {/* Bottom gap in frame */}
                        <rect x="117" y="230" width="18" height="40" fill="black" />

                        {/* Pen nib halo cutout */}
                        <g transform="translate(180, 150) rotate(11.31)">
                            {/* Draw enlarged pen nib body in black to cut a hole */}
                            <path d="M -12,-30 L 12,-30 L 22,-5 Q 22,10 0,45 Q -22,10 -22,-5 Z"
                                fill="black" stroke="black" strokeWidth="12" strokeLinejoin="round" strokeLinecap="round" />
                            {/* Restore the top part to white, so the gap doesn't cut upwards into the blue diagonal */}
                            <rect x="-30" y="-45" width="60" height="15" fill="white" />
                        </g>
                    </mask>
                </defs>

                {/* The Blue Hash & Frame */}
                <g mask="url(#logo-mask)" stroke="url(#blue_grad)" strokeWidth="25" strokeLinecap="butt" strokeLinejoin="round">
                    {/* Outer Frame */}
                    <rect x="50" y="50" width="200" height="200" rx="35" fill="none" />

                    {/* Left Diagonal */}
                    <line x1="100" y1="250" x2="140" y2="50" />

                    {/* Right Diagonal */}
                    <line x1="160" y1="250" x2="200" y2="50" />

                    {/* Upper Horizontal Bar */}
                    <line x1="85" y1="110" x2="215" y2="110" />

                    {/* Lower Horizontal Bar */}
                    <line x1="85" y1="190" x2="215" y2="190" />
                </g>

                {/* The Orange Pen Nib */}
                <g transform="translate(180, 150) rotate(11.31)">
                    <path d="M -12,-30 L 12,-30 L 22,-5 Q 22,10 0,45 Q -22,10 -22,-5 Z"
                        fill="url(#orange_grad)" />

                    {/* Inner slit and hole */}
                    <circle cx="0" cy="10" r="4" fill="var(--bg-primary, white)" />
                    <line x1="0" y1="14" x2="0" y2="40" stroke="var(--bg-primary, white)" strokeWidth="3" strokeLinecap="round" />
                </g>

            </svg>
        </div>
    );
};
