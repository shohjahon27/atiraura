import { sanityFetch } from "../live";

// function to get all categories
export const getAllCategories = async () => {
  const ALL_CATEGORIES_QUERY = `
    *[_type == "category"] | order(name asc)
  `;

  try {
    const categories = await sanityFetch({
      query: ALL_CATEGORIES_QUERY,
    });
    return categories.data || [];
  } catch (error) {
    console.error("error fetching all categories", error);
    return [];
  }
};
