const Loader = () => {
  return (
    <div
      className="inline-block animate-spin rounded-full border-2 border-[#2a2a2e] border-t-pink-500"
      style={{ width: "1.25rem", height: "1.25rem" }}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Loader;
