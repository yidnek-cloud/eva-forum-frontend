import Header from "../Header/Header1"
import Footer from "../Footer/Footer"
function LayOut({ children }) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default LayOut;
