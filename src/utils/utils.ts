export const animationCreate = () => {
  if (typeof window !== "undefined") {
    let wowInstance: any = null;
    
    try {
      import("wowjs").then((module) => {
        const WOW = module.default;
        wowInstance = new WOW.WOW({ live: false });
        wowInstance.init();
      }).catch((error) => {
        console.warn('Failed to initialize WOW.js:', error);
      });
    } catch (error) {
      console.warn('Failed to load WOW.js:', error);
    }

    // Cleanup function
    return () => {
      if (wowInstance && typeof wowInstance.destroy === 'function') {
        wowInstance.destroy();
      }
    };
  }
  return () => {};
};
