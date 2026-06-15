import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const StethoscopeIcon: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M4.8 2.3A4.5 4.5 0 0 0 2 6.5v3a6.5 6.5 0 0 0 11.2 4.5" />
    <path d="M22 6.5V3a4.5 4.5 0 0 0-7.8-3.1" />
    <path d="M11.2 14v5a3 3 0 0 0 6 0v-5" />
    <circle cx="17.2" cy="19" r="2" fill="currentColor" />
    <path d="M8 10h8" />
  </svg>
);

export const DnaIcon: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M4.5 10.5C4.5 5.5 9.5 4.5 9.5 4.5S14.5 5.5 14.5 10.5c0 5-5 6-5 6s-5-1-5-6Z" />
    <path d="M9.5 16.5c0 3 5 3 5 3s5 0 5-3-5-6-5-6" />
    <path d="M6 8h7" />
    <path d="M5.5 13h8" />
    <path d="M10.5 18h7.5" />
  </svg>
);

export const MicroscopeIcon: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M6 18h8" />
    <path d="M3 22h18" />
    <path d="M14 22V12" />
    <path d="M12 2v8a4 4 0 0 1-4 4H6" />
    <circle cx="12" cy="5" r="1" />
    <path d="M9 14h2" />
  </svg>
);

export const BrainIcon: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.9-.5H7a3 3 0 0 1-3-3v-2a3 3 0 0 1 .4-1.5 2.5 2.5 0 0 1 .6-4.5 3 3 0 0 1 4.5-3" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.9-.5H17a3 3 0 0 0 3-3v-2a3 3 0 0 0-.4-1.5 2.5 2.5 0 0 0-.6-4.5 3 3 0 0 0-4.5-3" />
  </svg>
);

export const HeartEcgIcon: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <path d="M6 10h2.5l1.5-3 2 6.5 1.5-5.5 1.5 2h3" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const KidneyIcon: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M16 3c-2 0-3.5 1.5-4 3.5C11.5 4.5 10 3 8 3 5 3 3 5.5 3 9.5c0 5 4 8.5 7.5 11.5.5.5 1 .5 1.5 0C15.5 18 21 14.5 21 9.5 21 5.5 19 3 16 3Z" />
    <path d="M12 11c-1.5 0-2 .5-2 1s.5 1 2 1" />
  </svg>
);

export const PillIcon: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="m10.5 13.5 3-3" />
    <path d="M17 7c2.8 2.8 2.8 7.2 0 10l-3 3a7.07 7.07 0 0 1-10-10l3-3c2.8-2.8 7.2-2.8 10 0Z" />
  </svg>
);

export const LungsIcon: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 3v17" />
    <path d="M12 8c-1.5-2.5-4-3-6-3s-3.5 1.5-3.5 4.5c0 5 2.5 8 6 9.5.5.5 1 .5 1.5 0" />
    <path d="M12 8c1.5-2.5 4-3 6-3s3.5 1.5 3.5 4.5c0 5-2.5 8-6 9.5-.5.5-1 .5-1.5 0" />
  </svg>
);

export const RedCellsIcon: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="7" cy="7" r="4" />
    <circle cx="7" cy="7" r="1.5" strokeDasharray="2" />
    <circle cx="17" cy="15" r="5" />
    <circle cx="17" cy="15" r="2" strokeDasharray="2" />
    <circle cx="15" cy="5" r="3" />
  </svg>
);

export const BoneIcon: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M17 3a2.5 2.5 0 0 0-4.9.5l-.6.5c-.5.5-.5 1.5 0 2l.5.6a2.5 2.5 0 0 0-.5 4.9l-4 4a2.5 2.5 0 0 0-4.9-.5l-.6.5c-.5.5-.5 1.5 0 2l.5.6c-.7 1-1.3.8-1.5 0a2.5 2.5 0 0 0 4.9-.5l4-4a2.5 2.5 0 0 0 .5-4.9l.6-.5c.5-.5.5-1.5 0-2l-.5-.6a2.5 2.5 0 0 0 .5-4.9Z" />
  </svg>
);

export const SyringeIcon: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="m18 2 4 4" />
    <path d="m17 7 3-3" />
    <path d="M19 9 9 19H5v-4L15 5l4 4Z" />
    <path d="m9 11 4 4" />
    <path d="m5 19-3 3" />
    <path d="m14 4 6 6" />
  </svg>
);

export const AnimatedEcgWaveform: React.FC<IconProps> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 600 100"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path
      d="M 0 50 L 150 50 L 170 30 L 190 70 L 210 50 L 250 50 L 265 10 L 280 90 L 295 50 L 330 50 L 340 40 L 350 50 L 450 50 L 470 30 L 490 70 L 510 50 L 600 50"
      strokeDasharray="1200"
      strokeDashoffset="1200"
    >
      <animate
        attributeName="stroke-dashoffset"
        values="1200;0"
        dur="4s"
        repeatCount="indefinite"
      />
    </path>
  </svg>
);

export const MedicalIconMap: Record<string, React.FC<IconProps>> = {
  Cardiologie: HeartEcgIcon,
  Anatomie: BoneIcon,
  Biochemistry: DnaIcon,
  Physiology: BrainIcon,
  Neurology: BrainIcon,
  Haematology: RedCellsIcon,
  Nephrology: KidneyIcon,
  Pharmacology: PillIcon,
  Microbiology: MicroscopeIcon,
  Pathology: SyringeIcon
};
