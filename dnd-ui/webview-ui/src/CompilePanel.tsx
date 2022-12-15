import { memo, useRef } from "react";
import { Panel } from "reactflow";
import { v4 as uuid } from "uuid";
import { RFNode } from "./nodeFactory";
import { useOnClickOutside } from "./useClickOutside";

function CompilePanel({ onClick }) {

	return (
		<Panel position="top-left" style={{ top: 100 }} onClick={onClick}>
			Compile
		</Panel>
	);
}

export default memo(CompilePanel);
