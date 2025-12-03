export function ImageModal({ imageSrc, onClose }) {
  if (!imageSrc) return null;

  return (
    <div className="fixed inset-0 z-50 w-full h-full bg-black/90 flex flex-col justify-center items-center" onClick={onClose}>
      <img src={imageSrc} className="max-w-[90%] max-h-[80vh] rounded-lg shadow-[0_0_20px_rgba(255,69,0,0.5)]" alt="Proof" />
      <button className="mt-5 bg-[#333] border border-[#555] w-auto px-5 py-2 text-white rounded hover:bg-[#444]" onClick={onClose}>Close</button>
    </div>
  );
}
