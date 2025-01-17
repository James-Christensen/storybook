interface BookCoverProps {
  title: string;
  onStart: () => void;
}

export default function BookCover({ title, onStart }: BookCoverProps) {
  return (
    <div 
      className="
        relative aspect-[16/9] 
        bg-gradient-to-br from-blue-500 to-purple-600 
        rounded-xl 
        shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]
        p-12 
        flex flex-col items-center justify-center 
        text-white
      "
    >
      <h1 className="text-5xl font-bold mb-8 text-center text-white">
        {title}
      </h1>
      <p className="text-2xl mb-12 italic text-blue-100">
        A magical adventure story
      </p>
      <button
        onClick={onStart}
        className="
          px-8 py-3 
          bg-white text-blue-600 
          rounded-lg 
          hover:bg-blue-50 
          font-bold text-xl 
          transition-all
          transform hover:scale-105
          shadow-lg
        "
      >
        Open Book
      </button>
    </div>
  );
} 