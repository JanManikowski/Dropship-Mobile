const Hero = () => (
  <section className="relative">
    <img src="/hero.jpg" alt="Couple" className="w-full h-96 object-cover" />
    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-white text-3xl font-bold mb-4">
        Cadeaus die onvergetelijke momenten creëren
      </h1>
      <button className="bg-red-600 text-white py-2 px-6 rounded-full font-semibold">
        SHOP BESTSELLERS
      </button>
    </div>
  </section>
);
