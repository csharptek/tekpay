type Props = { className?: string };

export default function Logo({ className }: Props) {
  return (
    <div className={className}>
      <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-brand/10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 text-brand"
          aria-hidden
        >
          <path d="M12 3a9 9 0 100 18 9 9 0 000-18zm.75 4.5a.75.75 0 00-1.5 0v5.19l-2.22-2.22a.75.75 0 10-1.06 1.06l3.5 3.5a.75.75 0 001.06 0l3.5-3.5a.75.75 0 00-1.06-1.06l-2.22 2.22V7.5z" />
        </svg>
      </div>
      <div className="mt-2 font-semibold text-lg">TekPay</div>
    </div>
  );
}

