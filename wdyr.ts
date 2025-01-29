import React from "react";

if (__DEV__) {
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    logOnDifferentValues: true, // Show why a component re-rendered
    trackHooks: true
  });
}
