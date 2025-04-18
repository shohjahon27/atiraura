import { CouponCode } from "./couponCodes";
import { sanityFetch } from "@/sanity/lib/live";

export const getActiveSaleByCouponCode = async (couponCode: CouponCode) => {

    // Directly define the query string with parameterized value
    const ACTIVE_SALE_BY_COUPON_QUERY = `
        *[
        _type == "sale"
        && isActive == true
        && couponCode == $couponCode
        ] | order(validFrom desc)[0]
    `;

    try {
        // Fetch the data using sanityFetch
        const activeSale = await sanityFetch({
            query: ACTIVE_SALE_BY_COUPON_QUERY,
            params: {
                couponCode,  // Pass the couponCode dynamically as a parameter
            },
        });

        // Return the data if found, otherwise return null
        return activeSale ? activeSale.data : null;
    } catch (error) {
        console.error("Error fetching active sale by coupon code:", error);
        return null;
    }
}
