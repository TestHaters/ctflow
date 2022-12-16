import { memo, useRef } from "react";
import { Panel } from "reactflow";
import { v4 as uuid } from "uuid";
import { RFNode } from "./nodeFactory";
import { useOnClickOutside } from "./useClickOutside";

function CompilePanel({ onClick }) {
  // TODO: loading state when onClick running
  return (
    <Panel
      className="rounded !text-white font-semibold py-2 px-5 bg-green-500	"
      position="top-left"
      // style={{ top: 50 }}
      onClick={onClick}>
      Compile{" "}
      <span className="ml-1">
        <i className="fa-solid fa-play"></i>
      </span>
    </Panel>
  );
}

export default memo(CompilePanel);
