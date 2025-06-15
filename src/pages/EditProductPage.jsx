import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { v4 as uuidv4 } from 'uuid';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState('');
  const [video, setVideo] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('');
  const [linkMain, setLinkMain] = useState('');
  const [linkBackup, setLinkBackup] = useState('');
  const [linkExtra, setLinkExtra] = useState('');
  const [bestseller, setBestseller] = useState(false);
  const [newImageFiles, setNewImageFiles] = useState([]);


  useEffect(() => {
    const fetchProduct = async () => {
      const ref = doc(db, 'products', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setTitle(data.title || '');
        setDescription(data.description || '');
        setImages(data.images || []);
        setVideo(data.video || '');
        setPrice(data.price || '');
        setDiscountPrice(data.discountPrice || '');
        setStock(data.stock || '');
        setLinkMain(data.aliexpress?.main || '');
        setLinkBackup(data.aliexpress?.backup || '');
        setLinkExtra(data.aliexpress?.extra || '');
        setBestseller(data.bestseller || false);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const uploadNewImages = async () => {
  const urls = [];
  for (const file of newImageFiles) {
    const storageRef = ref(storage, `product-images/${uuidv4()}-${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    urls.push(downloadURL);
  }
  return urls;
};

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const uploadedImageUrls = await uploadNewImages();

    const ref = doc(db, 'products', id);
    await updateDoc(ref, {
      title,
      description,
      images: [...images, ...uploadedImageUrls],
      video: video.trim(),
      price: parseFloat(price),
      discountPrice: parseFloat(discountPrice),
      stock: parseInt(stock),
      bestseller,
      aliexpress: {
        main: linkMain.trim(),
        backup: linkBackup.trim(),
        extra: linkExtra.trim()
      }
    });

    setSaving(false);
    navigate('/admin/manage');
  };

  if (loading) {
    return <p className="text-center mt-5">Laden...</p>;
  }

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="bg-white shadow p-4 rounded-4" style={{ width: '100%', maxWidth: 700 }}>
        <h2 className="fw-bold mb-4 text-center">Product Bewerken</h2>

        <form onSubmit={handleSave}>
          <div className="mb-3">
            <label className="form-label">Titel</label>
            <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Beschrijving</label>
            <textarea className="form-control" rows={3} value={description} onChange={e => setDescription(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Afbeeldingen</label>

            {/* Existing thumbnails */}
            <div className="d-flex flex-wrap gap-3 mb-2">
              {images.map((url, index) => (
                <div key={index} className="position-relative" style={{ width: '100px' }}>
                  <img
                    src={url}
                    alt={`Afbeelding ${index + 1}`}
                    className="img-thumbnail"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                  <button
                    type="button"
                    className="btn-close position-absolute top-0 end-0"
                    onClick={() => {
                      const updated = [...images];
                      updated.splice(index, 1);
                      setImages(updated);
                    }}
                  ></button>
                </div>
              ))}
            </div>

            {/* Upload new images */}
            <input
              type="file"
              accept="image/*"
              multiple
              className="form-control"
              onChange={e => setNewImageFiles(Array.from(e.target.files))}
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

          <button className="btn btn-danger w-100 fw-semibold rounded-pill" type="submit" disabled={saving}>
            {saving ? 'Opslaan...' : 'Wijzigingen Opslaan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProductPage;
