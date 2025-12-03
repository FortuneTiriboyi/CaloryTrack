import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { submitEntry } from '../api';
import { resizeImage } from '../utils';

export const EntryForm = forwardRef(function EntryForm({ onSubmitSuccess }, ref) {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  useImperativeHandle(ref, () => ({
    setFormValues: (newName, newCalories) => {
      setName(newName);
      setCalories(newCalories.toString());
    },
    scrollIntoView: () => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageBase64 = null;
      const file = fileInputRef.current?.files?.[0];

      if (file) {
        try {
          imageBase64 = await resizeImage(file);
        } catch (err) {
          alert('Error processing image. Try a smaller file.');
          console.error(err);
          setIsSubmitting(false);
          return;
        }
      }

      const res = await submitEntry(name.trim(), parseInt(calories), imageBase64);

      if (res.ok) {
        setCalories('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onSubmitSuccess?.();
      } else {
        alert('Error saving entry');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-card-bg rounded-2xl p-5 mb-5 shadow-md border border-input-border" ref={formRef}>
      <h2 className="mb-4 text-secondary text-2xl font-bold">Add Daily Burn</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-1 text-accent font-bold">Name / Nickname</label>
          <input
            type="text"
            id="username"
            required
            placeholder="e.g. Iron Mike"
            maxLength={20}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-input-border bg-input-bg text-text text-base focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="calories" className="block mb-1 text-accent font-bold">Calories Burned</label>
          <input
            type="number"
            id="calories"
            required
            placeholder="e.g. 500"
            min={1}
            max={10000}
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-input-border bg-input-bg text-text text-base focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="proof" className="block mb-1 text-accent font-bold">Proof (Optional Screenshot)</label>
          <input
            type="file"
            id="proof"
            accept="image/png, image/jpeg"
            ref={fileInputRef}
            className="w-full p-2.5 rounded-lg border border-input-border bg-input-bg text-text text-base focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-gray-400 text-xs mt-1">Only visible to participants. Max 5MB.</p>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-primary to-secondary text-white border-none py-3 px-6 rounded-full text-lg cursor-pointer w-full font-bold transition-transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : '💪 Log It!'}
        </button>
      </form>
    </section>
  );
});
