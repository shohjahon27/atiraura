// app/(store)/order-tracking/page.tsx
'use client';

import { client } from '@/sanity/lib/client';
import Image from 'next/image';
import { formatCurrency } from '@/lib/formatCurrency';
import { useState, useEffect } from 'react';
import { Check, Package, Truck, Home, Search, User, Phone, Mail, MapPin, Download, MessageCircle, Calendar, AlertCircle } from 'lucide-react';
import './order-tracking-styles.css';

// Safe formatCurrency function
function safeFormatCurrency(amount: number | null | undefined, currency: string | null | undefined) {
  if (!amount && amount !== 0) return '0 UZS';
  const safeCurrency = currency || 'UZS';
  try {
    return formatCurrency(amount, safeCurrency);
  } catch (error) {
    return `${amount?.toLocaleString('uz-UZ')} ${safeCurrency}`;
  }
}

async function getOrders({ orderNumber, phone }: { orderNumber?: string; phone?: string }) {
  let filter = '';
  const params: Record<string, string> = {};

  if (orderNumber) {
    filter += 'orderNumber == $orderNumber';
    params.orderNumber = orderNumber;
  }

  if (phone) {
    const cleanedPhone = phone.replace(/[^0-9]/g, '');
    if (filter) filter += ' && ';
    filter += 'customer.phone match $phonePattern';
    params.phonePattern = `*${cleanedPhone}*`;
  }

  if (!filter) return [];

  const query = `*[_type == "order" && ${filter}] | order(createdAt desc) {
    _id,
    orderNumber,
    createdAt,
    total,
    currency,
    status,
    "paymentStatus": payment.status,
    customer,
    items[] {
      quantity,
      "product": product-> {
        _id,
        name,
        price,
        "image": image.asset->url
      }
    }
  }`;

  try {
    const orders = await client.fetch(query, params);
    return orders || [];
  } catch (fetchError: unknown) {
    console.error('Error fetching orders:', fetchError);
    return [];
  }
}

function OrderStatusTimeline({ currentStatus }: { currentStatus: string }) {
  const statusSteps = [
    {
      key: 'processing',
      label: 'Qayta ishlanmoqda',
      icon: <Package className="w-5 h-5 md:w-6 md:h-6" />,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500',
      mobileLabel: 'Qayta ishlash'
    },
    {
      key: 'shipped',
      label: 'Yuborildi',
      icon: <Truck className="w-5 h-5 md:w-6 md:h-6" />,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500',
      mobileLabel: 'Yuborish'
    },
    {
      key: 'delivered',
      label: 'Yetkazib berildi',
      icon: <Home className="w-5 h-5 md:w-6 md:h-6" />,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500',
      mobileLabel: 'Yetkazish'
    },
  ];

  const currentStepIndex = statusSteps.findIndex(step => step.key === currentStatus);
  const stepProgress = Math.max(currentStepIndex + 1, 1);

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl md:rounded-2xl shadow-lg">
      <h3 className="text-lg md:text-2xl font-bold mb-6 md:mb-10 text-center text-gray-800 dark:text-white">
        Buyurtma holati
      </h3>
      
      <div className="relative">
        <div className="hidden md:block absolute top-6 left-0 w-full h-1.5 md:h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-500 via-blue-500 to-green-500 transition-all duration-1000 ease-out"
            style={{ width: `${(stepProgress / statusSteps.length) * 100}%` }}
          />
        </div>

        <div className="md:hidden space-y-8 relative">
          {statusSteps.map((step, index) => {
            const isCompleted = index < stepProgress;
            const isCurrent = index === currentStepIndex;
            const isActive = index <= currentStepIndex;

            return (
              <div key={step.key} className="flex items-start gap-4 relative">
                {index < statusSteps.length - 1 && (
                  <div className="absolute left-5 top-10 w-0.5 h-12 bg-gray-200 dark:bg-gray-700" />
                )}
                
                <div className="relative z-10">
                  <div className={`
                    w-10 h-10 md:w-16 md:h-16 rounded-full flex items-center justify-center
                    ${isActive 
                      ? `bg-gradient-to-br ${step.color} shadow-lg` 
                      : 'bg-gray-300 dark:bg-gray-600'
                    }
                    transition-all duration-500
                  `}>
                    {isCompleted ? (
                      <div className="ping-once-animation">
                        <Check className="w-5 h-5 md:w-8 md:h-8 text-white" />
                      </div>
                    ) : (
                      <div className={`transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                        {step.icon}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 pt-2">
                  <p className={`font-semibold text-base md:text-lg transition-colors duration-300 ${
                    isActive 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    <span className="hidden md:inline">{step.label}</span>
                    <span className="md:hidden">{step.mobileLabel}</span>
                  </p>
                  <p className={`text-xs md:text-sm mt-0.5 transition-colors duration-300 ${
                    isActive 
                      ? 'text-gray-600 dark:text-gray-300' 
                      : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {isCompleted ? '✅ Bajarildi' : isCurrent ? '🔄 Jarayonda' : '⏳ Kutilmoqda'}
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {index === 0 && 'Buyurtma qabul qilindi va qayta ishlanmoqda.'}
                      {index === 1 && 'Buyurtmangiz yuborildi, tez orada sizga yetib boradi.'}
                      {index === 2 && 'Buyurtmangiz muvaffaqiyatli yetkazib berildi!'}
                    </p>
                  )}
                </div>

                <div className={`
                  absolute top-0 left-7 md:-top-2 md:-right-2 w-5 h-5 md:w-8 md:h-8 
                  rounded-full flex items-center justify-center text-white font-bold 
                  text-xs md:text-sm shadow-md transition-all duration-300
                  ${isActive ? step.bgColor : 'bg-gray-400'}
                `}>
                  {index + 1}
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden md:flex justify-between relative z-10">
          {statusSteps.map((step, index) => {
            const isCompleted = index < stepProgress;
            const isCurrent = index === currentStepIndex;
            const isActive = index <= currentStepIndex;

            return (
              <div key={step.key} className="flex flex-col items-center relative">
                <div className={`relative mb-4 transition-all duration-500 ${
                  isActive ? 'scale-110' : 'scale-100'
                }`}>
                  <div className={`
                    w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center
                    ${isActive 
                      ? `bg-gradient-to-br ${step.color} shadow-lg` 
                      : 'bg-gray-300 dark:bg-gray-600'
                    }
                    transition-all duration-500
                  `}>
                    {isCompleted ? (
                      <div className="ping-once-animation">
                        <Check className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                    ) : (
                      <div className={`transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                        {step.icon}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <p className={`font-semibold text-sm md:text-lg transition-colors duration-300 ${
                    isActive 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.label}
                  </p>
                  <p className={`text-xs md:text-sm mt-0.5 transition-colors duration-300 ${
                    isActive 
                      ? 'text-gray-600 dark:text-gray-300' 
                      : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {isCompleted ? 'Bajarildi' : isCurrent ? 'Jarayonda' : 'Kutilmoqda'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 md:mt-12 p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg md:rounded-xl shadow-inner md:hidden">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm md:text-xl font-bold text-gray-800 dark:text-white">
              Joriy holat: {statusSteps[currentStepIndex]?.label || 'Qayta ishlanmoqda'}
            </h4>
            <p className="text-xs md:text-gray-600 md:dark:text-gray-300 mt-1">
              {currentStepIndex === 0 && 'Buyurtmangiz qabul qilindi.'}
              {currentStepIndex === 1 && 'Buyurtmangiz yuborildi.'}
              {currentStepIndex === 2 && 'Buyurtmangiz yetkazib berildi!'}
            </p>
          </div>
          <div className={`px-3 py-1.5 md:px-6 md:py-3 rounded-full font-bold text-white text-xs md:text-base ${
            statusSteps[currentStepIndex]?.bgColor || 'bg-gray-400'
          }`}>
            {stepProgress}/{statusSteps.length}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersList({ orderNumber, phone }: { orderNumber?: string; phone?: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setFetchError(null);
      try {
        const fetchedOrders = await getOrders({ orderNumber, phone });
        setOrders(fetchedOrders);
      } catch (error: unknown) {
        console.error('Error fetching orders:', error);
        setFetchError('Buyurtmalarni yuklashda xatolik yuz berdi.');
      } finally {
        setLoading(false);
      }
    }

    if (orderNumber || phone) {
      fetchOrders();
    } else {
      setLoading(false);
      setOrders([]);
    }
  }, [orderNumber, phone]);

  if (loading) {
    return (
      <div className="text-center py-12 md:py-32">
        <div className="relative inline-block">
          <div className="w-16 h-16 md:w-32 md:h-32 border-4 border-gray-300 dark:border-gray-600 rounded-full" />
          <div className="absolute top-0 left-0 w-16 h-16 md:w-32 md:h-32 border-4 border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        </div>
        <p className="text-lg md:text-3xl mt-6 md:mt-12 text-gray-700 dark:text-gray-300 font-semibold">
          Yuklanmoqda...
        </p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="text-center py-12 md:py-24 fade-in-animation">
        <div className="max-w-md mx-auto bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-gray-900 rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-2xl">
          <div className="w-12 h-12 md:w-24 md:h-24 mx-auto mb-4 md:mb-8 bg-gradient-to-br from-red-300 to-red-400 dark:from-red-600 dark:to-red-700 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 md:w-12 md:h-12 text-white" />
          </div>
          <p className="text-xl md:text-3xl font-bold text-red-700 dark:text-red-300">Xatolik</p>
          <p className="text-gray-600 dark:text-gray-400 mt-2 md:mt-6 text-sm md:text-lg">
            {fetchError}
          </p>
        </div>
      </div>
    );
  }

  if (orders.length === 0 && (orderNumber || phone)) {
    return (
      <div className="text-center py-12 md:py-24 fade-in-animation">
        <div className="max-w-md mx-auto bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
          <div className="w-12 h-12 md:w-24 md:h-24 mx-auto mb-4 md:mb-8 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center">
            <Package className="w-6 h-6 md:w-12 md:h-12 text-gray-500 dark:text-gray-400" />
          </div>
          <p className="text-xl md:text-3xl font-bold text-gray-700 dark:text-gray-300">Buyurtma topilmadi</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2 md:mt-6 text-sm md:text-lg">
            Kiritilgan ma&apos;lumotlar bilan buyurtma topilmadi.
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs md:text-base mt-4">
            ✅ Buyurtma raqami: {orderNumber || "Kiritilmagan"}<br/>
            📱 Telefon: {phone || "Kiritilmagan"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-16 mt-8 md:mt-12 fade-in-up-animation">
      {orders.map((order) => (
        <div key={order._id} className="group">
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl md:hover:shadow-3xl hover:-translate-y-1 md:hover:-translate-y-2">
            
            <div className="relative bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 text-white p-4 md:p-10 overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-8">
                <div className="flex-1">
                  <h2 className="text-2xl md:text-5xl font-black tracking-tight break-all">
                    #{order.orderNumber}
                  </h2>
                  <p className="text-sm md:text-xl mt-2 md:mt-4 opacity-90 backdrop-blur-sm bg-white/10 rounded-full px-3 py-1.5 md:px-6 md:py-3 inline-flex items-center gap-2">
                    <Calendar className="w-3 h-3 md:w-5 md:h-5" />
                    {new Date(order.createdAt).toLocaleDateString('uz-UZ', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                
                <div className="text-right space-y-3 md:space-y-6">
                  <p className="text-2xl md:text-6xl font-black drop-shadow-lg">
                    {safeFormatCurrency(order.total || 0, order.currency || 'UZS')}
                  </p>
                  <div className={`
                    inline-flex items-center gap-2 md:gap-3 px-4 py-2 md:px-8 md:py-4 
                    rounded-full text-sm md:text-2xl font-bold backdrop-blur-md 
                    shadow-lg md:shadow-xl transition-all duration-300
                    ${order.paymentStatus === 'paid' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                      : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                    }
                  `}>
                    <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full animate-pulse ${
                      order.paymentStatus === 'paid' ? 'bg-green-300' : 'bg-yellow-300'
                    }`} />
                    {order.paymentStatus === 'paid' ? "To&apos;landi" : 'Kutilmoqda'}
                  </div>
                </div>
              </div>
            </div>

            <OrderStatusTimeline currentStatus={order.status || 'processing'} />

            <div className="p-4 md:p-10 grid lg:grid-cols-2 gap-6 md:gap-10">
              
              <div className="lg:col-span-2 md:lg:col-span-1">
                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl md:rounded-2xl shadow-inner p-4 md:p-8">
                  <h3 className="text-lg md:text-3xl font-bold mb-4 md:mb-8 text-gray-800 dark:text-white flex items-center gap-2 md:gap-3">
                    <div className="w-2 h-6 md:w-3 md:h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full" />
                    Yetkazib berish ma&apos;lumotlari
                  </h3>
                  <div className="space-y-3 md:space-y-6">
                    <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg md:rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-colors">
                      <User className="w-4 h-4 md:w-6 md:h-6 text-orange-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Ism</p>
                        <p className="text-sm md:text-lg font-semibold text-gray-800 dark:text-white truncate">
                          {order.customer?.name || 'Noma&apos;lum'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg md:rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-colors">
                      <Phone className="w-4 h-4 md:w-6 md:h-6 text-blue-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Telefon</p>
                        <p className="text-sm md:text-lg font-semibold text-gray-800 dark:text-white truncate">
                          {order.customer?.phone || 'Noma&apos;lum'}
                        </p>
                      </div>
                    </div>
                    
                    {order.customer?.email && (
                      <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg md:rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-colors">
                        <Mail className="w-4 h-4 md:w-6 md:h-6 text-green-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Email</p>
                          <p className="text-sm md:text-lg font-semibold text-gray-800 dark:text-white truncate">
                            {order.customer.email}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {order.customer?.address && (
                      <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg md:rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-colors">
                        <MapPin className="w-4 h-4 md:w-6 md:h-6 text-red-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Manzil</p>
                          <p className="text-sm md:text-lg font-semibold text-gray-800 dark:text-white truncate">
                            {order.customer.address}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 md:lg:col-span-1">
                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl md:rounded-2xl shadow-inner p-4 md:p-8">
                  <h3 className="text-lg md:text-3xl font-bold mb-4 md:mb-8 text-gray-800 dark:text-white flex items-center gap-2 md:gap-3">
                    <div className="w-2 h-6 md:w-3 md:h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
                    Mahsulotlar ({order.items?.length || 0})
                  </h3>
                  
                  <div className="space-y-4 md:space-y-6">
                    {order.items?.map((item: Record<string, any>, idx: number) => (
                      <div 
                        key={item.product?._id || idx}
                        className="group/item bg-white dark:bg-gray-800 p-3 md:p-6 rounded-lg md:rounded-2xl shadow hover:shadow-lg md:hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 md:hover:-translate-y-1"
                      >
                        <div className="flex items-start md:items-center gap-3 md:gap-6">
                          <div className="relative flex-shrink-0">
                            {item.product?.image ? (
                              <div className="relative overflow-hidden rounded-lg md:rounded-xl shadow">
                                <Image
                                  src={item.product.image}
                                  alt={item.product.name || 'Mahsulot'}
                                  width={80}
                                  height={80}
                                  className="rounded-lg md:rounded-xl object-cover transition-transform duration-500 group-hover/item:scale-105"
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-16 md:w-32 md:h-32 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg md:rounded-2xl flex items-center justify-center">
                                <Package className="w-6 h-6 md:w-12 md:h-12 text-gray-400 dark:text-gray-500" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm md:text-2xl font-bold text-gray-800 dark:text-white truncate">
                              {item.product?.name || 'Noma&apos;lum mahsulot'}
                            </p>
                            <p className="text-xs md:text-lg text-gray-600 dark:text-gray-400 mt-1 md:mt-3">
                              {item.quantity || 0} dona × {safeFormatCurrency(item.product?.price || 0, 'UZS')}
                            </p>
                            
                            <div className="flex flex-col md:flex-row md:items-center justify-between mt-3 md:mt-6 gap-2">
                              <p className="text-lg md:text-3xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                {safeFormatCurrency(
                                  (item.product?.price || 0) * (item.quantity || 1), 
                                  'UZS'
                                )}
                              </p>
                              {item.product?._id && (
                                <div className="px-2 py-1 md:px-4 md:py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full text-xs md:text-sm font-semibold">
                                  ID: {item.product._id.slice(-6)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center gap-4">
                <p className="text-sm md:text-lg text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                  Savollar bo&apos;lsa biz bilan bog&apos;laning
                </p>
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                  <button className="flex-1 px-4 py-3 md:px-8 md:py-4 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 text-white rounded-lg md:rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-sm md:text-base">Savol berish</span>
                  </button>
                  <button className="flex-1 px-4 py-3 md:px-8 md:py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg md:rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                    <Download className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-sm md:text-base">PDF yuklash</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SearchForm({ onSubmit }: { onSubmit: (data: { order: string; phone: string }) => void }) {
  const [formData, setFormData] = useState({ order: '', phone: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.order || formData.phone) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 md:gap-10">
      <div className="space-y-4">
        <label className="block">
          <span className="text-lg md:text-2xl font-bold text-gray-800 dark:text-white mb-2 md:mb-4 block">
            Buyurtma raqami
          </span>
          <input
            type="text"
            name="order"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: e.target.value })}
            placeholder="ORD-123456789"
            className="w-full p-4 md:p-6 text-base md:text-xl border-2 md:border-3 border-gray-300 dark:border-gray-600 rounded-xl md:rounded-2xl focus:border-orange-500 focus:outline-none transition-all bg-white dark:bg-gray-700 shadow"
          />
        </label>
        <div className="text-sm md:text-lg text-gray-500 dark:text-gray-400 flex items-start gap-2">
          <span className="text-lg">💡</span>
          <span>Buyurtma raqami elektron pochta yoki chekda ko&apos;rsatilgan</span>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-lg md:text-2xl font-bold text-gray-800 dark:text-white mb-2 md:mb-4 block">
            Telefon raqam
          </span>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+998 90 123 45 67"
            className="w-full p-4 md:p-6 text-base md:text-xl border-2 md:border-3 border-gray-300 dark:border-gray-600 rounded-xl md:rounded-2xl focus:border-orange-500 focus:outline-none transition-all bg-white dark:bg-gray-700 shadow"
          />
        </label>
        <div className="text-sm md:text-lg text-gray-500 dark:text-gray-400 flex items-start gap-2">
          <span className="text-lg">📞</span>
          <span>Buyurtma berishda kiritilgan raqam</span>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={!formData.order && !formData.phone}
          className={`relative w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-4 md:py-8 rounded-xl md:rounded-2xl text-xl md:text-4xl transition-all duration-500 shadow-lg md:shadow-2xl hover:shadow-xl md:hover:shadow-3xl group overflow-hidden ${
            !formData.order && !formData.phone 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:scale-[1.02]'
          }`}
        >
          <span className="relative z-10 flex items-center justify-center gap-2 md:gap-4">
            <Search className="w-5 h-5 md:w-8 md:h-8" />
            Qidirish
          </span>
        </button>
      </div>
    </form>
  );
}

export default function OrderTrackingPage() {
  const [searchParams, setSearchParams] = useState<{ order?: string; phone?: string }>({});

  const handleSearch = (data: { order: string; phone: string }) => {
    setSearchParams({
      order: data.order.trim() || undefined,
      phone: data.phone.trim() || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-16">
        <div className="text-center mb-8 md:mb-20">
          <h1 className="text-3xl md:text-7xl font-black mb-4 md:mb-8 bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 bg-clip-text text-transparent">
            Buyurtmalarni kuzatish
          </h1>
          <p className="text-base md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Har bir bosqichni jonli ravishda kuzating. Statuslar Sanity-da belgilanganda ranglanadi.
          </p>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl md:rounded-3xl shadow-xl md:shadow-3xl p-6 md:p-12 mb-12 md:mb-20 max-w-5xl mx-auto transform transition-all duration-500">
          <div className="text-center mb-6 md:mb-12">
            <div className="inline-flex items-center gap-2 md:gap-4 px-4 py-2 md:px-8 md:py-4 rounded-full bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 mb-4 md:mb-6">
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 animate-pulse" />
              <p className="text-sm md:text-xl font-semibold text-gray-700 dark:text-gray-300">
                Buyurtma holatini tekshirish
              </p>
            </div>
            <h2 className="text-xl md:text-4xl font-bold text-gray-800 dark:text-white">
              Ma&apos;lumotlaringizni kiriting
            </h2>
          </div>

          <SearchForm onSubmit={handleSearch} />

          <p className="text-center text-sm md:text-xl text-gray-500 dark:text-gray-400 mt-6 md:mt-12 pt-4 md:pt-8 border-t border-gray-200 dark:border-gray-700">
            Kamida bitta maydonni to&apos;ldiring
          </p>
        </div>

        {(searchParams.order || searchParams.phone) ? (
          <OrdersList orderNumber={searchParams.order} phone={searchParams.phone} />
        ) : (
          <div className="text-center py-8 md:py-20 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl md:rounded-3xl p-6 md:p-16 shadow-lg md:shadow-xl">
              <div className="w-20 h-20 md:w-40 md:h-40 mx-auto mb-6 md:mb-12 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center">
                <div className="text-4xl md:text-6xl">📦</div>
              </div>
              <h3 className="text-xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4 md:mb-8">
                Buyurtma holatini ko&apos;rish uchun qidiruvni boshlang
              </h3>
              <p className="text-sm md:text-2xl text-gray-600 dark:text-gray-400 mb-6 md:mb-12">
                Yuqoridagi formani to&apos;ldiring va buyurtmangizning joriy holatini ko&apos;ring.
              </p>
              <div className="inline-flex items-center gap-2 md:gap-4 px-4 py-2 md:px-8 md:py-4 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse" />
                <p className="text-sm md:text-xl font-semibold text-gray-700 dark:text-gray-300">
                  Har qanday vaqtda buyurtmangizni kuzatishingiz mumkin
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}