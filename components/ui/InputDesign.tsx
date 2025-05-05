
"use client";

import * as React from "react";

/**
 * InputDesign Component
 *
 * A visual design component that displays two overlapping images
 */
function InputDesign() {
  return (
    <div className="flex overflow-hidden relative flex-col max-w-[945px]">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/7bc7967695bc4d5bad39081817fd7285/159040375b42cc4fc41297853765dcefea0064b1?placeholderIfAbsent=true"
        alt="Design element top"
        className="object-contain z-0 self-end w-full aspect-[1.25]"
      />
      <img
        src="https://cdn.builder.io/api/v1/image/assets/7bc7967695bc4d5bad39081817fd7285/b7fc60d03798c2653c83ca56dd57308733d63dbd?placeholderIfAbsent=true"
        alt="Design element bottom"
        className="object-contain absolute z-0 max-w-full aspect-[1.11] bottom-[31px] left-[-45px] right-[5px] top-[149px] w-[890px]"
      />
    </div>
  );
}

export default InputDesign;
