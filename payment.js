
const API = "https://api.deltamarket.store";
const VALID_REFERRALS = ["RIEO50", "SUE50", "FLASH50"];

let cache = {};

/* ======================
   REFERRAL APPLY LOGIC
====================== */

let referralApplied = false;

const referralInput = document.getElementById("referralCode");
const applyReferralBtn = document.getElementById("applyReferral");
const discountPopup = document.getElementById("discountPopup");

if (applyReferralBtn && referralInput && discountPopup) {
  applyReferralBtn.addEventListener("click", function (e) {
    e.stopPropagation();

    if (referralApplied) {
      discountPopup.innerText = "⚠️ Discount already applied";
      discountPopup.style.display = "block";
      return;
    }

    const code = referralInput.value.trim().toUpperCase();

    if (!code) {
      alert("Please enter referral code");
      return;
    }

    if (!VALID_REFERRALS.includes(code)) {
      alert("Invalid referral code");
      return;
    }

    referralApplied = true;
    referralInput.value = code;
    referralInput.disabled = true;
    applyReferralBtn.disabled = true;
    applyReferralBtn.style.opacity = "0.6";

    discountPopup.innerText = "✅ 5% discount applied to your product";
    discountPopup.style.display = "block";
  });

  // Hide popup when clicking anywhere else
  document.addEventListener("click", function () {
    discountPopup.style.display = "none";
  });

  // Prevent popup click from closing itself
  discountPopup.addEventListener("click", function (e) {
    e.stopPropagation();
  });
}

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

  cache.referral = (document.getElementById("referralCode")?.value || "")
    .trim()
    .toUpperCase();

  // Optional but must be valid if entered
  if (cache.referral && !VALID_REFERRALS.includes(cache.referral)) {
    alert("Invalid referral code.");
    return;
  }

  document.getElementById("otpBox").style.display = "none";
  document.getElementById("successBox").style.display = "none";

  document.getElementById("loadingBox").style.display = "flex";

  fetch(API + "/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: cache.email })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("loadingBox").style.display = "none";

      if (!data.success) {
        alert("Failed to send OTP");
        return;
      }

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
      document.getElementById("orderIdText").innerText =
        "Order ID: " + data.orderId;
      document.getElementById("successBox").style.display = "flex";
    })
    .catch(() => alert("Server error"));
}

/* ======================
   REDIRECT
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

  window.location.href =
    `https://t.me/${TELEGRAM_USERNAME}?text=` + encodeURIComponent(msg);
}
