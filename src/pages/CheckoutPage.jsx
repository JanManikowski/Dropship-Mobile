import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { sendOrderConfirmation } from '../services/emailService';

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);

  const [userData, setUserData] = useState({
    email: '',
    name: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Nederland',
    phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('klarna');
  const [addInsurance, setAddInsurance] = useState(false);

  const getTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    return (subtotal + (addInsurance ? 2.95 : 0)).toFixed(2);
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      ...userData,
      cart,
      total: getTotal(),
      insurance: addInsurance,
      paymentMethod,
      createdAt: Timestamp.now(),
    };

    try {
      await addDoc(collection(db, 'orders'), orderData);
      alert("Bestelling opgeslagen. Je kunt nu betalen via PayPal.");
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Er ging iets mis met het opslaan van je bestelling.");
    }
  };

const renderPayPal = () => {
  if (window.paypal) {
    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal', // Only PayPal button
        tagline: false   // Removes "Powered by PayPal"
      },
      fundingSource: window.paypal.FUNDING.PAYPAL, // Force only PayPal
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: { value: getTotal() },
            description: 'Order via Quick Checkout'
          }]
        });
      },
      onApprove: async (data, actions) => {
  try {
    const details = await actions.order.capture();

    const shipping = details.purchase_units?.[0]?.shipping?.address;
    const name = details.purchase_units?.[0]?.shipping?.name?.full_name;
    const email = details.payer?.email_address;

    const orderData = {
      name,
      email,
      cart,
      total: getTotal(),
      insurance: addInsurance,
      paymentMethod: 'paypal',
      createdAt: Timestamp.now(),
      paypalOrderID: data.orderID,
      shippingAddress: {
        address: `${shipping?.address_line_1 || ''} ${shipping?.address_line_2 || ''}`,
        city: shipping?.admin_area_2 || '',
        postalCode: shipping?.postal_code || '',
        country: shipping?.country_code || ''
      }
    };

    await addDoc(collection(db, 'orders'), orderData);
    await sendOrderConfirmation(orderData);
    clearCart();
    navigateRef.current('/thankyou');
  } catch (error) {
    console.error("PayPal capture or saving failed:", error);
    alert("Er ging iets mis bij het verwerken van je PayPal betaling.");
  }
}


    }).render('#paypal-button-container');
  }
};



  useEffect(() => {
    const existingScript = document.getElementById('paypal-script');
    const container = document.getElementById('paypal-button-container');
    if (container) container.innerHTML = '';

    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'paypal-script';
      script.src = 'https://www.paypal.com/sdk/js?client-id=AQGUD0FFHTbSuuoKebh8E8Vshdi7lu-EWRFNpAcCPUuQcsX6rE0bnnt1c5SPDoYk3dFWfqOMk81Tvxol&currency=EUR';
      script.onload = () => renderPayPal();
      document.body.appendChild(script);
    } else {
      renderPayPal();
    }
  }, []); // run once on page load

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="bg-white p-4 rounded-4 shadow mb-4">
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <span className="me-2">⚠️</span>
            <div>Jouw bestelling is gereserveerd voor 10:00 minuten! Haast je, de artikelen in de sale verkopen snel.</div>
          </div>
          <h5 className="fw-bold mb-3">Besteloverzicht</h5>
                {cart.map((item, index) => (
                  <div key={index} className="d-flex align-items-center mb-3 border-bottom pb-2">
                    <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover' }} className="me-3 rounded" />
                    <div>
                      <p className="mb-1 fw-semibold">{item.name}</p>
                      <p className="mb-0 text-muted">Aantal: {item.quantity || 1}</p>
                    </div>
                    <div className="ms-auto fw-bold">€{(item.price * (item.quantity || 1)).toFixed(2)}</div>
                  </div>
                ))}
                <div className="d-flex justify-content-between fw-bold mb-2">
                  <span>Totaal</span>
                  <span>€{getTotal()}</span>
                </div>
          <h5 className="text-center text-muted mb-2">Snel Afrekenen met PayPal (test)</h5>
          <div id="paypal-button-container" className="d-flex justify-content-center"></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="bg-white p-4 rounded-4 shadow">
                <h4 className="fw-bold mb-3">Contact</h4>
                <input type="email" name="email" className="form-control mb-3" placeholder="E-mail" value={userData.email} onChange={handleChange} required />

                <h4 className="fw-bold mb-3">Bezorging</h4>
                <input type="text" name="name" className="form-control mb-2" placeholder="Voornaam" value={userData.name} onChange={handleChange} required />
                <input type="text" name="lastName" className="form-control mb-2" placeholder="Achternaam" value={userData.lastName} onChange={handleChange} required />
                <input type="text" name="address" className="form-control mb-2" placeholder="Straat en huisnummer" value={userData.address} onChange={handleChange} required />
                <input type="text" name="postalCode" className="form-control mb-2" placeholder="Postcode" value={userData.postalCode} onChange={handleChange} required />
                <input type="text" name="city" className="form-control mb-2" placeholder="Stad" value={userData.city} onChange={handleChange} required />
                <input type="text" name="phone" className="form-control mb-3" placeholder="Telefoon" value={userData.phone} onChange={handleChange} />

                <label className="form-label">Land/regio</label>
                <select className="form-select mb-3" name="country" value={userData.country} onChange={handleChange}>
                  <option value="Nederland">Nederland</option>
                </select>

                <div className="form-check mb-3">
                  <input type="checkbox" className="form-check-input" id="insuranceCheck" checked={addInsurance} onChange={() => setAddInsurance(!addInsurance)} />
                  <label className="form-check-label" htmlFor="insuranceCheck">
                    Leveringsgarantie toevoegen voor €2,95 (tegen schade, verlies of diefstal)
                  </label>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="bg-white p-4 rounded-4 shadow">
                

                <div className="mt-3">
                  <h5 className="fw-bold mb-3">Kies je betaalmethode</h5>
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="radio" value="creditcard" checked={paymentMethod === 'creditcard'} onChange={() => setPaymentMethod('creditcard')} />
                    <label className="form-check-label">Creditcard</label>
                  </div>
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="radio" value="paypal" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} />
                    <label className="form-check-label">PayPal</label>
                  </div>
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="radio" value="klarna" checked={paymentMethod === 'klarna'} onChange={() => setPaymentMethod('klarna')} />
                    <label className="form-check-label">Klarna - Betaal nu of later</label>
                  </div>
                  <div className="form-check mb-4">
                    <input className="form-check-input" type="radio" value="ideal" checked={paymentMethod === 'ideal'} onChange={() => setPaymentMethod('ideal')} />
                    <label className="form-check-label">iDEAL</label>
                  </div>
                </div>

                <div className="d-flex justify-content-between fw-bold mb-2">
                  <span>Totaal</span>
                  <span>€{getTotal()}</span>
                </div>
                <button type="submit" className="btn btn-danger w-100 rounded-pill fw-semibold mt-3">
                  Bestelling Afrekenen
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
