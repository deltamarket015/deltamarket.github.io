const API = "https://backend-production-2cbc.up.railway.app";
const VALID_REFERRALS = ["REIO50", "SHU50", "FLASH50"];

let cache = {};

/* ======================
   START ORDER
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

  // Optional but must be valid if entered
  if (cache.referral && !VALID_REFERRALS.includes(cache.referral)) {
    alert("Invalid referral code.");
    return;
  }

  // Close old popups if open
  document.getElementById("otpBox").style.display = "none";
  document.getElementById("successBox").style.display = "none";

  // ✅ SHOW LOADING INSTANTLY (no delay)
  document.getElementById("loadingBox").style.display = "flex";

  fetch(API + "/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: cache.email })
  })
    .then(res => res.json())
    .then(data => {
      // Hide loading
      document.getElementById("loadingBox").style.display = "none";

      if (!data.success) {
        alert("Failed to send OTP");
        return;
      }

      // ✅ Show OTP popup instantly after success
      document.getElementById("otp").value = "";
      document.getElementById("otpBox").style.display = "flex";
    })
    .catch(() => {
      document.getElementById("loadingBox").style.display = "none";
      alert("Server error");
    });
}

/* ======================
   VERIFY OTP
====================== */
function verifyOtp() {
  const otp = document.getElementById("otp").value.trim();

  if (!otp) {
    alert("Please enter OTP");
    return;
  }

  fetch(API + "/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: cache.email,
      otp: otp,
      orderData: {
        name: cache.name,
        product: cache.product,
        payment: cache.payment,
        platform: cache.platform,
        referral: cache.referral || "None"
      }
    })
  })
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        alert("Invalid OTP");
        return;
      }

      cache.orderId = data.orderId;

      document.getElementById("otpBox").style.display = "none";
      document.getElementById("orderIdText").innerText = "Order ID: " + data.orderId;
      document.getElementById("successBox").style.display = "flex";
    })
    .catch(() => alert("Server error"));
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

  // ✅ CHANGE THESE LINKS
  const TELEGRAM_USERNAME = "Delta_Market_Owner"; // only username
  const DISCORD_LINK = "https://discord.gg/mWK5Kt6WRt";
  const INSTAGRAM_LINK = "https://instagram.com/YOUR_USERNAME";

  if (cache.platform === "Telegram") {
    window.location.href =
      `https://t.me/${TELEGRAM_USERNAME}?text=` + encodeURIComponent(msg);
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

  // fallback
  window.location.href =
    `https://t.me/${TELEGRAM_USERNAME}?text=` + encodeURIComponent(msg);
}
