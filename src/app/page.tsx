import Container from "@/components/container";
import Upload from "@/components/upload";

export default function Home() {
  return (
    <main className="main min-h-dvh flex flex-col justify-center items-center">
      <Container parentClassName="h-full w-fit">
        <Upload />
      </Container>
    </main>
  );
}
