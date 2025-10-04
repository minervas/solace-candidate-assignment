interface TitleProps {
  children: React.ReactNode;
}

export function Title({ children }: TitleProps) {
  return (
    <h1 className="text-3xl font-bold text-gray-900 mb-6">
      {children}
    </h1>
  );
}
