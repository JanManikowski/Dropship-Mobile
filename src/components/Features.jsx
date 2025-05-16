const Features = () => (
  <section className="py-8 text-center bg-white">
    <h2 className="text-xl font-bold mb-6">Wat Ons Speciaal Maakt</h2>
    <div className="grid grid-cols-2 gap-6 px-6">
      {features.map(({ icon, title }) => (
        <div key={title} className="flex flex-col items-center">
          <img src={icon} alt={title} className="w-10 h-10 mb-2" />
          <p className="text-sm">{title}</p>
        </div>
      ))}
    </div>
  </section>
);
