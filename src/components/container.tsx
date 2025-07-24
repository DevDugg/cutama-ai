import { CSSProperties } from "react";

interface ContainerProps {
  children: React.ReactNode;
  childContainerStyle?: CSSProperties;
  parentContainerStyle?: CSSProperties;
}

const Container = ({
  children,
  childContainerStyle,
  parentContainerStyle,
}: ContainerProps) => {
  return (
    <div className="container" style={parentContainerStyle}>
      {childContainerStyle ? (
        <div className="child-container" style={childContainerStyle}>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default Container;
