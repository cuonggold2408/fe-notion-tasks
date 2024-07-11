import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main";

export default function Home() {
  return (
    <div
      className="grid h-dvh"
      style={{
        gridTemplateRows: "50px 1fr 50px",
      }}
    >
      <Header />
      <Main />
      <Footer />
    </div>
  );
}
