// Razorpay Payment Integration Helper
export const initRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const createPaymentOrder = async (amount) => {
  try {
    const res = await fetch("http://localhost:5000/api/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        currency: "INR",
        receipt: "order_" + Date.now(),
      }),
    });
    return await res.json();
  } catch (err) {
    console.error("Error creating order:", err);
    throw err;
  }
};

export const verifyPayment = async (paymentData) => {
  try {
    const res = await fetch("http://localhost:5000/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    });
    return await res.json();
  } catch (err) {
    console.error("Error verifying payment:", err);
    throw err;
  }
};

export const openRazorpayCheckout = async (amount, userEmail, userName, callback) => {
  const res = await initRazorpay();
  if (!res) {
    alert("Razorpay failed to initialize");
    return;
  }

  try {
    const orderData = await createPaymentOrder(amount);
    
    const options = {
      key: "rzp_test_your_key_id", // Get from environment
      amount: Math.round(amount * 100), // in paise
      currency: "INR",
      name: "BulkBuy",
      description: "Bulk Purchase Payment",
      order_id: orderData.order.id,
      prefill: {
        email: userEmail,
        name: userName,
      },
      theme: {
        color: "#4f7cff",
      },
      handler: async (response) => {
        try {
          const verified = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verified.success) {
            callback(true, response.razorpay_payment_id);
          } else {
            callback(false, "Payment verification failed");
          }
        } catch (err) {
          callback(false, err.message);
        }
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (err) {
    callback(false, err.message);
  }
};
