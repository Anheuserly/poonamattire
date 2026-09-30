import React from "react";

type IconProps = {
  size?: number;
  className?: string;
  color?: string;
};

export function YoutubeIcon({ size = 20, className = "", color = "currentColor" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96c1.71.46 8.59.46 8.59.46s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58Z"
        fill={color === "currentColor" ? "currentColor" : color}
      />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#ffffff" />
    </svg>
  );
}

export function InstagramIcon({ size = 20, className = "", color = "currentColor" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function FacebookIcon({ size = 20, className = "", color = "currentColor" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function WhatsAppIcon({ size = 20, className = "", color = "currentColor" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.477-.15-.678.15-.201.301-.779.98-.955 1.18-.176.2-.352.226-.653.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.786-1.677-2.087-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.151-.176.201-.301.301-.502.1-.2.05-.377-.025-.527-.075-.15-.678-1.635-.93-2.24-.245-.589-.494-.509-.678-.518-.176-.009-.377-.01-.578-.01-.201 0-.528.075-.804.377-.276.301-1.055 1.03-1.055 2.512 0 1.482 1.08 2.912 1.231 3.113.151.201 2.125 3.245 5.15 4.551.72.311 1.282.497 1.72.636.724.23 1.383.197 1.904.12.58-.087 1.78-.728 2.03-1.431.25-.703.25-1.305.176-1.431-.075-.126-.276-.201-.577-.351zm-5.42 7.618h-.005a10.026 10.026 0 0 1-5.111-1.396l-.367-.218-3.799.996 1.014-3.703-.239-.38a10.038 10.038 0 0 1-1.542-5.3c0-5.541 4.509-10.05 10.054-10.05a10.007 10.007 0 0 1 7.106 2.946 10.008 10.008 0 0 1 2.941 7.107c-.001 5.543-4.51 10.054-10.052 10.054zm8.527-18.577A11.933 11.933 0 0 0 12.046 0C5.405 0 .007 5.398.005 12.04a11.986 11.986 0 0 0 1.636 6.03L0 24l6.094-1.599a11.97 11.97 0 0 0 5.952 1.583h.005c6.64 0 12.04-5.399 12.043-12.043a11.96 11.96 0 0 0-3.515-8.523z" />
    </svg>
  );
}
