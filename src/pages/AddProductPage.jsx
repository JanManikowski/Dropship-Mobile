import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const AddProductPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState('');
  const [link, setLink] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'products'), {
      title,
      description,
      images: images.split(',').map(s => s.trim()).filter(Boolean),
      link,
      purchased: 0,
    });
    setTitle('');
    setDescription('');
    setImages('');
    setLink('');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="container py-4" style={{ maxWidth: 600 }}>
      <h2 className="mb-4">Add Product</h2>
      {saved && <div className="alert alert-success">Saved!</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Image URLs (comma separated)</label>
          <input className="form-control" value={images} onChange={e => setImages(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">AliExpress Link</label>
          <input className="form-control" value={link} onChange={e => setLink(e.target.value)} required />
        </div>
        <button className="btn btn-primary" type="submit">Save</button>
      </form>
    </div>
  );
};

export default AddProductPage;
