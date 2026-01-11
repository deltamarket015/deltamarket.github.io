let selectedPlatform = "";
let redirectOrderId = "";

/* =========================
   SEND ORDER
========================= */
function sendOrder(platform) {
  const name = document.getElementById("name").value.trim();
  const product = document.getElementById("product").value.trim();
  const payment = document.getElementById("payment").value;

  if (!name || !product) {
    alert("Please fill all details");
    return;
  }

  selectedPlatform = platform;

  /* 🔴 TELEGRAM CONFIG */
  const BOT_TOKEN = "8318720033:AAGEmSwAXk1BANwB4kivRX7ceqRudvzHrdc";

  const CHAT_IDS = [
    "7549804367", // Admin 1
    "8227965230", // Admin 2
    "6195305681", // Admin 3
    "6133084298"  // Admin 4
  ];

  /* AUTO ORDER ID */
  redirectOrderId =
    "DMS-" + Math.random().toString(36).substring(2, 8).toUpperCase();

  /* DATE & TIME */
  const dateTime = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

  /* MESSAGE */
  const message = `
🛒 NEW ORDER

🆔 Order ID: ${redirectOrderId}
👤 Name: ${name}
📦 Product: ${product}
💳 Payment: ${payment}
🧭 Buy Via: ${platform.toUpperCase()}
🕒 Date & Time: ${dateTime}
`;

  /* SHOW LOADER */
  document.getElementById("loading").style.display = "flex";

  /* SEND TO ALL ADMINS (NON-BLOCKING) */
  CHAT_IDS.forEach(chatId => {
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message
      })
    }).catch(err =>
      console.warn("Telegram send failed for", chatId, err)
    );
  });

  /* FORCE UI SUCCESS (NEVER STUCK) */
  setTimeout(() => {
    document.getElementById("loading").style.display = "none";

    document.getElementById("successSound").play();
    if (navigator.vibrate) navigator.vibrate(200);

    document.getElementById("popupOrderId").innerText =
      "Order ID: " + redirectOrderId;

    document.getElementById("popup").style.display = "flex";
  }, 1200);
}

/* =========================
   COPY ORDER ID
========================= */
function copyOrderId() {
  navigator.clipboard.writeText(redirectOrderId);
}

/* =========================
   CONFIRM REDIRECT
========================= */
function confirmRedirect() {
  const TELEGRAM_USERNAME = "Delta_Market_Owner";
  const DISCORD_USER_ID = "YOUR_DISCORD_ID";

  /* TELEGRAM */
  if (selectedPlatform === "telegram") {
    const msg =
      "Hello, I placed an order.\nOrder ID: " + redirectOrderId;

    window.location.href =
      "tg://resolve?domain=Delta_Market_Owner&text=" +
      encodeURIComponent(msg);

    setTimeout(() => {
      window.location.href =
        "https://t.me/Delta_Market_Owner?text=" +
        encodeURIComponent(msg);
    }, 1000);
  }

  /* DISCORD */
  if (selectedPlatform === "discord") {
    window.location.href =
      `https://discord.gg/UT2wZZWvUA`;
  }

  /* INSTAGRAM → CUSTOM POPUP */
  if (selectedPlatform === "instagram") {
    document.getElementById("popup").style.display = "none";

    document.getElementById("instaOrderId").innerText =
      "🆔 Order ID: " + redirectOrderId;

    document.getElementById("instaPopup").style.display = "flex";
  }
}

/* =========================
   INSTAGRAM FINAL REDIRECT
========================= */
function goToInstagram() {
  const INSTAGRAM_USERNAME = "deltamarket015";

  navigator.clipboard.writeText(
    "Hello, I placed an order.\nOrder ID: " + redirectOrderId
  );

  window.location.href =
    "https://ig.me/m/" + INSTAGRAM_USERNAME;
}
