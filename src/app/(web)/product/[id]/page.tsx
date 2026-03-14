import React from "react";
import ProductsDetails from "../_components/ProductsDetails";
import DynamicHeroSection from "@/components/MenhrtHero";

function page() {
  return (
    <div>
      <DynamicHeroSection
        bgImage="/images/product.jpg"
        title={`Product details`}
        description=""
      />
      <ProductsDetails />
    </div>
  );
}

export default page;
 