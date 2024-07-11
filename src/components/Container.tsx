export const Container = ({
    children 
}: {
    children: React.ReactNode 
}) => {
  return (
    <div className="w-full">
      <div className="w-full max-w-screen-2xl mx-auto pt-4 pb-4 px-4 sm:pt-6 sm:px-8">
        {children}
      </div>
    </div>
  );
};
