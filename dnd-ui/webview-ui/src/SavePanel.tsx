import { memo, useRef } from "react";
import { Panel } from "reactflow";

function SavePanel({ onClick }) {
  // TODO: loading state when onClick running
  return (
    <Panel
      className="rounded !text-white font-semibold py-2 px-5 bg-red-500	"
      position="top-right"
      style={{ right: 30 }}
      onClick={onClick}>
      Save{" "}
    </Panel>
  );
}

export default memo(SavePanel);
