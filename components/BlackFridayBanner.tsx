import { COUPON_CODES } from "@/lib/sales/couponCodes";
import { getActiveSaleByCouponCode } from "@/lib/sales/getActiveSaleByCouponCode";

async function BlackFridayBanner() {
    const sale = await getActiveSaleByCouponCode(COUPON_CODES.BFRIDAY);

    if (!sale?.isActive) {
        return null;
    }
    
    return( 
    <div className="bg-gradient-to-r from-red-500 to-black text-white text-center py-6 px-4"
    >
        <div className="container mx-auto flex items-center justify-between">
            <div className="flex-1">
                <h2 className="text-3xl sm:text-5xl font-extrabold text-left mb-4">
                    {sale.title}
                </h2>
                <p className="text-left text-xl sm:text-3xl font-semibold mb-6">
                    {sale.description}
                </p>

                {/* banner button */}
                <div className="flex">
                    <div className="bg-white text-black py-4 px-6 rounded-full shadow-md transform hover:scale-105 transition duration-300">
                        <span className="font-bold text-base sm:text-xl">
                              Promo Code: {""}
                            <span className="text-red-600">{sale.couponCode}</span>
                        </span>
                        <span className="ml-2 font-bold text-base sm:text-xl">
                             {sale.discountAmount}% chegirma
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default BlackFridayBanner;