const API = "https://api.deltamarket.store";
const VALID_REFERRALS = ["RIO50", "SUE50", "FLASH50"];

let cache = {};

/* ======================
   START ORDER (SEND OTP)
====================== */
function startOrder(platform) {
  cache.platform = platform;
  cache.name = document.getElementById("name").value.trim();
  cache.product = document.getElementById("product").value.trim();
  cache.email = document.getElementById("email").value.trim();
  cache.payment = document.getElementById("payment").value;

  if (!cache.name || !cache.product || !cache.email) {
    alert("Please fill all fields");
    return;
  }

  cache.referral = (document.getElementById("referral")?.value || "")
    .trim()
    .toUpperCase();

  if (cache.referral && !VALID_REFERRALS.includes(cache.referral)) {
    alert("Invalid referral code.");
    return;
  }

  document.getElementById("otpBox").style.display = "none";
  document.getElementById("successBox").style.display = "none";
  document.getElementById("loadingBox").style.display = "flex";

  /* 🔥 SEND OTP THROUGH /send-order */
  fetch(API + "/send-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "SEND_OTP",
      email: cache.email
    })
  })
    .then(res => res.json())
    .then(() => {
      document.getElementById("loadingBox").style.display = "none";
      document.getElementById("otp").value = "";
      document.getElementById("otpBox").style.display = "flex";
    })
    .catch(() => {
      document.getElementById("loadingBox").style.display = "none";
      alert("Server error");
    });
}

/* ======================
   VERIFY OTP + PLACE ORDER
====================== */
function verifyOtp() {
  const otp = document.getElementById("otp").value.trim();

  if (!otp) {
    alert("Please enter OTP");
    return;
  }

  document.getElementById("loadingBox").style.display = "flex";

  /* 🔥 VERIFY + CREATE ORDER THROUGH /send-order */
  fetch(API + "/send-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "VERIFY_OTP",
      otp: otp,
      orderData: {
        name: cache.name,
        product: cache.product,
        email: cache.email,
        payment: cache.payment,
        platform: cache.platform,
        referral: cache.referral || "None"
      }
    })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("loadingBox").style.display = "none";

      /* fallback if backend doesn’t send orderId */
      cache.orderId =
        data.orderId ||
        "DMS-" + Math.random().toString(36).substring(2, 8).toUpperCase();

      document.getElementById("otpBox").style.display = "none";
      document.getElementById("orderIdText").innerText =
        "Order ID: " + cache.orderId;
      document.getElementById("successBox").style.display = "flex";
    })
    .catch(() => {
      document.getElementById("loadingBox").style.display = "none";
      alert("Server error");
    });
}

/* ======================
   REDIRECT (Telegram / Discord / Instagram)
====================== */
function goPlatform() {
  if (!cache.orderId) {
    alert("Order ID not found. Please try again.");
    return;
  }

  const msg =
    `Order ID: ${cache.orderId}\n` +
    `Name: ${cache.name}\n` +
    `Product: ${cache.product}\n` +
    `Payment: ${cache.payment}\n` +
    `Referral: ${cache.referral || "None"}\n` +
    `Platform: ${cache.platform}`;

  const TELEGRAM_USERNAME = "Delta_Market_Owner";
  const DISCORD_LINK = "https://discord.gg/mWK5Kt6WRt";
  const INSTAGRAM_LINK = "https://instagram.com/YOUR_USERNAME";

  if (cache.platform === "Telegram") {
    window.location.href =
      `https://t.me/${TELEGRAM_USERNAME}?text=` +
      encodeURIComponent(msg);
    return;
  }

  if (cache.platform === "Discord") {
    window.location.href = DISCORD_LINK;
    return;
  }

  if (cache.platform === "Instagram") {
    window.location.href = INSTAGRAM_LINK;
    return;
  }

  window.location.href =
    `https://t.me/${TELEGRAM_USERNAME}?text=` +
    encodeURIComponent(msg);
}
