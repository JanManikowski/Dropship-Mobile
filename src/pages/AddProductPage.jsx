import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const AddProductPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState('');
  const [video, setVideo] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [linkMain, setLinkMain] = useState('');
  const [linkBackup, setLinkBackup] = useState('');
  const [linkExtra, setLinkExtra] = useState('');
  const [stock, setStock] = useState('');
  const [bestseller, setBestseller] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = async () => {
    const urls = [];
    for (const image of images) {
      const storageRef = ref(storage, `product-images/${uuidv4()}-${image.name}`);
      await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(storageRef);
      urls.push(downloadURL);
    }
    return urls;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrls = await handleImageUpload();

      await addDoc(collection(db, 'products'), {
        title,
        description,
        images: imageUrls,
        video: video.trim(),
        price: parseFloat(price),
        discountPrice: parseFloat(discountPrice),
        stock: parseInt(stock),
        aliexpress: {
          main: linkMain.trim(),
          backup: linkBackup.trim(),
          extra: linkExtra.trim()
        },
        purchased: 0,
        bestseller,
      });

      navigate('/admin/manage');
    } catch (err) {
      console.error('Upload failed:', err);
    }

    setLoading(false);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="bg-white shadow p-4 rounded-4" style={{ width: '100%', maxWidth: 700 }}>
        <h2 className="fw-bold mb-4 text-center">Nieuw Product Toevoegen</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Titel</label>
            <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Beschrijving</label>
            <textarea className="form-control" rows={3} value={description} onChange={e => setDescription(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Afbeeldingen uploaden (.jpg, .png, meerdere mogelijk)</label>
            <input
              type="file"
              className="form-control"
              multiple
              accept="image/*"
              onChange={e => setImages(Array.from(e.target.files))}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Video Link (optioneel)</label>
            <input className="form-control" value={video} onChange={e => setVideo(e.target.value)} />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Normale Prijs (€)</label>
              <input type="number" step="0.01" className="form-control" value={price} onChange={e => setPrice(e.target.value)} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Korting Prijs (€)</label>
              <input type="number" step="0.01" className="form-control" value={discountPrice} onChange={e => setDiscountPrice(e.target.value)} required />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">AliExpress Link (main)</label>
            <input className="form-control" value={linkMain} onChange={e => setLinkMain(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label">AliExpress Link (backup)</label>
            <input className="form-control" value={linkBackup} onChange={e => setLinkBackup(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">AliExpress Link (extra)</label>
            <input className="form-control" value={linkExtra} onChange={e => setLinkExtra(e.target.value)} />
          </div>

          <div className="mb-4">
            <label className="form-label">Aantal op voorraad</label>
            <input type="number" className="form-control" value={stock} onChange={e => setStock(e.target.value)} required />
          </div>

          <div className="form-check mb-4">
            <input
              className="form-check-input"
              type="checkbox"
              checked={bestseller}
              onChange={e => setBestseller(e.target.checked)}
              id="bestsellerCheck"
            />
            <label className="form-check-label" htmlFor="bestsellerCheck">
              Markeer als Bestseller
            </label>
          </div>

          <button className="btn btn-danger w-100 fw-semibold rounded-pill" type="submit" disabled={loading}>
            {loading ? 'Opslaan...' : 'Opslaan & Terug'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
