
import "./globals.css";
import SessionWrapper from "../components/ui/SessionWrapper"
import ToastaerContext from "@/context/ToastaerContext";


export const metadata = {
  title: "Canva Clone",
  description: "A clone of Canva",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <SessionWrapper>
          <ToastaerContext />
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
