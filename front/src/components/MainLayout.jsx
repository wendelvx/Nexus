import Header from './Header';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-nexus-dark">
      <Header />
      <main className="max-w-7xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
}