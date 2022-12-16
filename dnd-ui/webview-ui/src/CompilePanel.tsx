import { memo, useRef } from "react";
import { Panel } from "reactflow";
import { v4 as uuid } from "uuid";
import { RFNode } from "./nodeFactory";
import { useOnClickOutside } from "./useClickOutside";

function CompilePanel({ onClick }) {
  return (
    <Panel
      className="rounded !text-black font-semibold py-2 px-5"
      position="top-left"
      style={{ top: 50 }}
      onClick={onClick}>
      Compile
    </Panel>
  );
}

export default memo(CompilePanel);
