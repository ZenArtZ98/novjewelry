import './PageEffects.css';

export function PageEffects() {
  return (
    <>
      <div
        className="pageeffects__seeds"
        id="nv-seeds"
        aria-hidden="true"
      ></div>
      <span
        className="nv-mask nv-mask-bird pageeffects__cursor"
        id="nv-cursor"
        aria-hidden="true"
      ></span>
      <div className="pageeffects__progress" aria-hidden="true">
        <span className="nv-mask nv-mask-flower pageeffects__flower"></span>
        <span className="pageeffects__stem" id="nv-stem"></span>
      </div>
    </>
  );
}
