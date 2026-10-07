import "./Toolbar.css";

export default function Toolbar() {
  return (
    <header className="toolbar">

      <div className="tool-group">
        <button className="tool-btn">□</button>
        <button className="tool-btn">○</button>
        <button className="tool-btn">◇</button>
      </div>

      <button className="tool-btn">
        Text
      </button>

      <button className="tool-btn">
        Link
      </button>

      <button className="tool-btn">
        Image
      </button>

    </header>
  );
}