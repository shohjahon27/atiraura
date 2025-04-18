import { groq } from "next-sanity"; // Import groq for query syntax
import { sanityFetch } from "../live"; // Assuming sanityFetch is a custom fetch function

export const getProductBySlug = async (slug: string) => {
    // Define the query directly
    const PRODUCT_BY_SLUG_QUERY = groq`
        *[
            _type == "product" && slug.current == $slug
        ] | order(name asc) [0]
    `;

    try {
        // Call sanityFetch with the query and parameters
        const product = await sanityFetch({
            query: PRODUCT_BY_SLUG_QUERY,
            params: { slug },
        });

        // Return the product or null if not found
        return product.data || null;
    } catch (error) {
        console.error("Error fetching product by slug:", error);
        return null;
    }
};
