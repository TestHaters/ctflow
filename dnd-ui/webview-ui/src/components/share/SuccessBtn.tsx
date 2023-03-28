export default function SuccessBtn({
  onClick,
  children,
  ...rest
}: {
  onClick?: () => void;
  children: React.ReactNode;
  [key: string]: unknown;
}) {
  return (
    <button
      className="bg-green-500 rounded-md text-white p-2 block mx-auto"
      onClick={onClick}
      {...rest}
    >
      {children}{' '}
    </button>
  );
}
