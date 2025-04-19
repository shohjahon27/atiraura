import { formatCurrency } from "@/lib/formatCurrency";
import { imageUrl } from "@/lib/imageUrl";
import { getMyOrders } from "@/lib/orders/getMyOrders";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

export const metadata = {
  title: "My Orders",
  description: "View your recent orders",
};

// Define type for Order and ProductItem
interface ProductItem {
  product: {
    _id: string;
    name: string;
    image: string;
    price: number;
  };
  quantity: number;
}

interface Order {
  orderNumber: string;
  orderDate: string;
  status: string;
  totalPrice: number;
  currency: string;
  amountDiscount?: number;
  products?: ProductItem[];
}

async function Orders() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  let orders: Order[] = [];

  try {
    orders = await getMyOrders(userId);
    // Debug: Log the orders to inspect the data
    console.log("Fetched orders:", JSON.stringify(orders, null, 2));
  } catch (err) {
    console.error("Failed to fetch orders:", err);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-4 sm:p-8 rounded-xl shadow-lg w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-8">
          Buyurtmalaringiz
        </h1>

        {orders.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>Sizda hech qanaqa buyurtma yuq.</p>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {orders.map((order) => (
              <div
                key={order.orderNumber}
                className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1 font-bold">
                        Buyurtma raqami
                      </p>
                      <p className="font-mono text-sm text-green-600 break-all">
                        {order.orderNumber}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-sm text-gray-600 mb-1">Buyurtma sanasi</p>
                      <p className="font-medium">
                        {order.orderDate
                          ? `${new Date(order.orderDate).toLocaleDateString()} at ${new Date(
                              order.orderDate
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}`
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-between p-4 sm:p-6">
                    <div className="flex items-center">
                      <span className="text-sm mr-2">Holati:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          order.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-sm text-gray-600 mb-1">umumiy summasi</p>
                      <p className="font-bold text-lg">
                        {formatCurrency(order.totalPrice ?? 0, order.currency)}
                      </p>
                    </div>
                  </div>

                  {order.amountDiscount ? (
                    <div className="mt-4 p-3 sm:p-4 bg-red-50 rounded-lg">
                      <p className="text-red-600 font-medium mb-1 text-sm sm:text-base">
                        Discount Applied: {" "}
                        {formatCurrency(order.amountDiscount, order.currency)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Original Subtotal: {" "}
                        {formatCurrency(
                          (order.totalPrice ?? 0) + order.amountDiscount,
                          order.currency
                        )}
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="px-4 py-3 sm:px-6 sm:py-4">
                  <h2 className="text-sm font-semibold text-gray-600 mb-3 sm:mb-4">
                    Sotib olingan narsalar
                  </h2>

                  <div className="space-y-3 sm:space-y-4">
                    {(!order.products || order.products.length === 0) ? (
                      <p className="text-sm text-gray-600">No items in this order.</p>
                    ) : (
                      order.products.map((item) => {
                        const product = item?.product;
                        if (!product || !product._id) {
                          return (
                            <div
                              key={Math.random()} // Use a unique key if product._id is unavailable
                              className="text-sm text-gray-600"
                            >
                              Product information unavailable
                            </div>
                          );
                        }

                        return (
                          <div
                            key={product._id}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-2 border-b last:border-b-0"
                          >
                            <div className="flex items-center gap-3 sm:gap-4">
                              {product.image ? (
                                <div className="relative h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 rounded-md overflow-hidden">
                                 <Image
                                                     src={item.product.image ? imageUrl(item.product.image).url() : ""}
                                                     alt={item.product.name ?? "Product image"}
                                                     className="w-full h-full object-cover rounded-lg border"
                                                     width={96}
                                                     height={96}
                                                   />
                                </div>
                              ) : (
                                <div className="h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 rounded-md bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-500 text-sm">No Image</span>
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-sm sm:text-base">
                                  {product.name ?? "Unknown Product"}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Quantity: {item.quantity ?? "N/A"}
                                </p>
                              </div>
                            </div>
                            <p className="font-medium text-right">
                              {product.price && item.quantity
                                ? formatCurrency(
                                    product.price * item.quantity,
                                    order.currency
                                  )
                                : "N/A"}
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;