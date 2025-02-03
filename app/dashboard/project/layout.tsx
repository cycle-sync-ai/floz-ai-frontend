import Footer from "@components/Footer";

export const metadata = {
  title: "FLOZ Cost",
  description: "Cost Estimator Web App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-full flex flex-col">
      <div className="grow p-6 bg-slate-300 bg-opacity-20 overflow-auto">
        {children}  
      </div>
      <Footer />
    </main>
  );
}
