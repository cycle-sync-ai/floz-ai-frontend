import Header from "@components/Header/Header";

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
    <>
      <main>
        <div className="p-6 bg-slate-300 bg-opacity-20">
          {children}  
        </div>
      </main>
    </>
  );
}
