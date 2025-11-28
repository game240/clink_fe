import clsx from "clsx";

const PageBlock = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <main
      className={clsx(
        "rounded-[20px] border-1 border-gray-01 bg-white",
        className
      )}
      {...props}
    ></main>
  );
};

export default PageBlock;
