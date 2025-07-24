import Container from "./container";
import Logo from "./logo";

const Header = () => {
  return (
    <header className="header w-full">
      <Container parentClassName="flex items-center justify-center">
        <Logo />
      </Container>
    </header>
  );
};

export default Header;
