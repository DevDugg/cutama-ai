import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  parentClassName?: string;
}

const Container = ({
  children,
  className,
  parentClassName,
}: ContainerProps) => {
  return (
    <div
      className={cn("container mx-auto max-w-[1440px] px-4", parentClassName)}
    >
      {className ? (
        <div className={cn("child-container", className)}>{children}</div>
      ) : (
        children
      )}
    </div>
  );
};

export default Container;
