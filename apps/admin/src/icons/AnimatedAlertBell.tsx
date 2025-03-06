import { SvgIcon, SvgIconProps } from '@mui/material';

// ----------

export default function AnimatedAlertBell({ viewBox = '0 0 24 24', ...props }: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox={viewBox}>
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <g>
          <path strokeDasharray="4" strokeDashoffset="4" d="M12 3v2">
            <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="4;0" />
          </path>
          <path
            fill="currentColor"
            fillOpacity="0"
            strokeDasharray="28"
            strokeDashoffset="28"
            d="M12 5c-3.31 0 -6 2.69 -6 6l0 6c-1 0 -2 1 -2 2h8M12 5c3.31 0 6 2.69 6 6l0 6c1 0 2 1 2 2h-8"
          >
            <animate
              fill="freeze"
              attributeName="fill-opacity"
              begin="0.9s"
              dur="0.15s"
              values="0;0.3"
            />
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              begin="0.2s"
              dur="0.4s"
              values="28;0"
            />
          </path>
          <animateTransform
            fill="freeze"
            attributeName="transform"
            begin="0.9s"
            dur="6s"
            keyTimes="0;0.05;0.15;0.2;1"
            type="rotate"
            values="0 12 3;3 12 3;-3 12 3;0 12 3;0 12 3"
          />
        </g>
        <path strokeDasharray="8" strokeDashoffset="8" d="M10 20c0 1.1 0.9 2 2 2c1.1 0 2 -0.9 2 -2">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.6s"
            dur="0.2s"
            values="8;0"
          />
          <animateTransform
            fill="freeze"
            attributeName="transform"
            begin="1.1s"
            dur="6s"
            keyTimes="0;0.05;0.15;0.2;1"
            type="rotate"
            values="0 12 8;6 12 8;-6 12 8;0 12 8;0 12 8"
          />
        </path>
        <path strokeDasharray="6" strokeDashoffset="6" d="M22 6v4">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="1.05s"
            dur="0.2s"
            values="6;0"
          />
          <animate
            attributeName="stroke-width"
            begin="1.95s"
            dur="3s"
            keyTimes="0;0.1;0.2;0.3;1"
            repeatCount="indefinite"
            values="2;3;3;2;2"
          />
        </path>
        <path strokeDasharray="2" strokeDashoffset="2" d="M22 14v0.01">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="1.25s"
            dur="0.2s"
            values="2;0"
          />
          <animate
            attributeName="stroke-width"
            begin="2.25s"
            dur="3s"
            keyTimes="0;0.1;0.2;0.3;1"
            repeatCount="indefinite"
            values="2;3;3;2;2"
          />
        </path>
      </g>
    </SvgIcon>
  );
}
