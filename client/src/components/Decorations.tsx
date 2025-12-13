import {
  CandySvg,
  CupcakeSvg,
  DonutPatternSvg,
  LollipopSvg,
  SparkleSvg,
  WavePatternSvg,
} from '../assets/icons';

export const FloatingCandy = ({
  delay = '0s',
  size = 'w-8 h-8',
}: {
  delay?: string;
  size?: string;
}) => (
  <div
    className={`absolute ${size} opacity-20`}
    style={{
      animation: `float 6s ease-in-out infinite`,
      animationDelay: delay,
    }}
  >
    <CandySvg className="text-rose-400" />
  </div>
);

export const Sparkle = ({
  delay = '0s',
  left = '10%',
  top = '20%',
}: {
  delay?: string;
  left?: string;
  top?: string;
}) => (
  <div
    className="absolute opacity-0"
    style={{
      left,
      top,
      animation: `sparkle 3s ease-in-out infinite`,
      animationDelay: delay,
    }}
  >
    <SparkleSvg className="h-4 w-4 text-amber-400" />
  </div>
);

export const CupcakeIcon = ({ className = 'h-12 w-12' }: { className?: string }) => (
  <CupcakeSvg className={className} />
);

export const LollipopIcon = ({ className = 'h-10 w-10' }: { className?: string }) => (
  <LollipopSvg className={className} />
);

export const DonutPattern = () => (
  <div className="absolute inset-0 overflow-hidden opacity-5">
    <DonutPatternSvg className="h-full w-full" />
  </div>
);

export const WavePattern = () => (
  <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
    <WavePatternSvg className="w-full" style={{ height: '120px' }} />
  </div>
);
