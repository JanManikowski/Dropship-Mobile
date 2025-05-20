import React from 'react';

const TopBanner = () => {
  return (
    <div className="bg-danger text-white text-center small">
      <div
        id="topBannerCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="5000"
      >
        <div className="carousel-inner py-2 px-3" style={{ minHeight: '52px' }}>
          <div className="carousel-item active">
            <div>
              <strong>⭐️⭐️⭐️⭐️⭐️ 4.9/5 Klanttevredenheid</strong><br />
              <span className="small">Gebaseerd op duizenden positieve reviews</span>
            </div>
          </div>
          <div className="carousel-item">
            <div>
              <strong>🎁 Persoonlijke Sieraden</strong><br />
              <span className="small">Handgemaakt met liefde voor speciale momenten</span>
            </div>
          </div>
          <div className="carousel-item">
            <div>
              <strong>💌 Het Perfecte Cadeau</strong><br />
              <span className="small">Maak iemand blij met een betekenisvol gebaar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBanner;
