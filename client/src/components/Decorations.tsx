export const FloatingCandy = ({ delay = "0s", size = "w-8 h-8" }: { delay?: string; size?: string }) => (
  <div
    className={`absolute ${size} opacity-20`}
    style={{
      animation: `float 6s ease-in-out infinite`,
      animationDelay: delay,
    }}
  >
    <svg viewBox="0 0 24 24" fill="currentColor" className="text-rose-400">
      <path d="M12 2C10.34 2 9 3.34 9 5c0 .35.07.69.18 1H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3zm0 2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
    </svg>
  </div>
);

export const Sparkle = ({ delay = "0s", left = "10%", top = "20%" }: { delay?: string; left?: string; top?: string }) => (
  <div
    className="absolute opacity-0"
    style={{
      left,
      top,
      animation: `sparkle 3s ease-in-out infinite`,
      animationDelay: delay,
    }}
  >
    <svg className="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0l2.5 7.5L22 10l-7.5 2.5L12 20l-2.5-7.5L2 10l7.5-2.5L12 0z" />
    </svg>
  </div>
);

export const CupcakeIcon = ({ className = "h-12 w-12" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm7 8h-1.35c-.25-.73-.75-1.35-1.39-1.77.64-.47 1.05-1.23 1.05-2.1C17.31 5.51 15.8 4 14 4c-.93 0-1.77.38-2.38 1-.61-.62-1.45-1-2.38-1-1.8 0-3.31 1.51-3.31 3.13 0 .87.41 1.63 1.05 2.1-.64.42-1.14 1.04-1.39 1.77H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2z" />
  </svg>
);

export const LollipopIcon = ({ className = "h-10 w-10" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <circle cx="12" cy="9" r="6" />
    <rect x="11" y="13" width="2" height="8" rx="1" />
  </svg>
);

export const DonutPattern = () => (
  <div className="absolute inset-0 overflow-hidden opacity-5">
    <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="donut-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <circle cx="25" cy="25" r="15" fill="none" stroke="currentColor" strokeWidth="6" className="text-rose-500" />
          <circle cx="75" cy="75" r="15" fill="none" stroke="currentColor" strokeWidth="6" className="text-amber-500" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#donut-pattern)" />
    </svg>
  </div>
);

export const WavePattern = () => (
  <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
    <svg className="w-full" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ height: "120px" }}>
      <path
        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
        opacity=".25"
        className="fill-amber-200"
      />
      <path
        d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
        opacity=".5"
        className="fill-rose-200"
      />
      <path
        d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
        className="fill-amber-100"
      />
    </svg>
  </div>
);
