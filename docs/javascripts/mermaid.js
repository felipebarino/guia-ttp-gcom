/* Initialize Mermaid for initial load and Material's instant navigation. */
(function () {
  function renderMermaid() {
    if (typeof mermaid === "undefined") {
      return;
    }

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose"
    });

    mermaid.run({
      querySelector: ".mermaid"
    });
  }

  if (typeof document$ !== "undefined" && document$.subscribe) {
    document$.subscribe(function () {
      renderMermaid();
    });
  } else {
    window.addEventListener("load", function () {
      renderMermaid();
    });
  }
})();
