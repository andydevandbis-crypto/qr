"use client";

import { useEffect, useState } from "react";
import * as QRCode from "qrcode";
import { jsPDF } from "jspdf";

type Section =
  | "appearance"
  | "logo"
  | "settings"
  | "output"
  | "type"
  | null;

type QRType =
  | "URL"
  | "Text"
  | "Wi-Fi"
  | "Email"
  | "Phone"
  | "SMS"
  | "vCard"
  | "Location"
  | "Calendar";

export default function Home() {
  const [text, setText] = useState("https://example.com");
  const [qr, setQr] = useState("");
  const [svg, setSvg] = useState("");
  const [advanced, setAdvanced] = useState(false);
  const [section, setSection] = useState<Section>(null);

  const [size, setSize] = useState(400);
  const [qrColor, setQrColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [titleFont, setTitleFont] = useState("Arial");
  const [titleSize, setTitleSize] = useState(28);
  const [titleColor, setTitleColor] = useState("#000000");
  const [subtitleFont, setSubtitleFont] = useState("Arial");
  const [subtitleSize, setSubtitleSize] = useState(18);
  const [subtitleColor, setSubtitleColor] = useState("#64748b");
  const [margin, setMargin] = useState(2);
  const [errorCorrection, setErrorCorrection] =
    useState<"L" | "M" | "Q" | "H">("H");

  const [qrType, setQrType] = useState<QRType>("URL");

  const [logo, setLogo] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(25);
  const [logoBackground, setLogoBackground] = useState(true);

  const [wifiSSID, setWifiSSID] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiSecurity, setWifiSecurity] = useState("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);

  const [email, setEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  const [phone, setPhone] = useState("");

  const [smsPhone, setSmsPhone] = useState("");
  const [smsMessage, setSmsMessage] = useState("");

  const [vcardName, setVcardName] = useState("");
  const [vcardPhone, setVcardPhone] = useState("");
  const [vcardEmail, setVcardEmail] = useState("");
  const [vcardWebsite, setVcardWebsite] = useState("");

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [eventTitle, setEventTitle] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");

  const buildQRData = () => {
    switch (qrType) {
      case "URL":
        return text;

      case "Text":
        return text;

      case "Wi-Fi":
        return `WIFI:T:${wifiSecurity};S:${wifiSSID};P:${wifiPassword};H:${wifiHidden ? "true" : "false"};;`;

      case "Email":
        return `mailto:${email}?subject=${encodeURIComponent(
          emailSubject
        )}&body=${encodeURIComponent(emailBody)}`;

      case "Phone":
        return `tel:${phone}`;

      case "SMS":
        return `SMSTO:${smsPhone}:${smsMessage}`;

      case "vCard":
        return `BEGIN:VCARD
VERSION:3.0
FN:${vcardName}
TEL:${vcardPhone}
EMAIL:${vcardEmail}
URL:${vcardWebsite}
END:VCARD`;

      case "Location":
        return `geo:${latitude},${longitude}`;

      case "Calendar":
        return `BEGIN:VEVENT
SUMMARY:${eventTitle}
LOCATION:${eventLocation}
DTSTART:${eventStart.replace(/[-:]/g, "")}
DTEND:${eventEnd.replace(/[-:]/g, "")}
END:VEVENT`;

      default:
        return text;
    }
  };

  useEffect(() => {
    const data = buildQRData();

    if (!data.trim()) {
      setQr("");
      setSvg("");
      return;
    }

    const options = {
      width: size,
      margin,
      errorCorrectionLevel: logo ? "H" : errorCorrection,
      color: {
        dark: qrColor,
        light: backgroundColor,
      },
    };

    QRCode.toDataURL(data, options)
      .then(async (dataUrl) => {
        QRCode.toString(data, {
          type: "svg",
          margin,
          errorCorrectionLevel: logo ? "H" : errorCorrection,
          color: {
            dark: qrColor,
            light: backgroundColor,
          },
        })
          .then(setSvg)
          .catch(() => setSvg(""));

        if (!logo) {
          setQr(dataUrl);
          return;
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          setQr(dataUrl);
          return;
        }

        canvas.width = size;
        canvas.height = size;

        const qrImage = new Image();

        qrImage.onload = () => {
          ctx.drawImage(qrImage, 0, 0, size, size);

          const logoImage = new Image();

          logoImage.onload = () => {
            const logoPixels = size * (logoSize / 100);
            const x = (size - logoPixels) / 2;
            const y = (size - logoPixels) / 2;

            if (logoBackground) {
              const padding = logoPixels * 0.18;

              ctx.fillStyle = "#ffffff";
              ctx.beginPath();
              ctx.roundRect(
                x - padding,
                y - padding,
                logoPixels + padding * 2,
                logoPixels + padding * 2,
                padding * 0.4
              );
              ctx.fill();
            }

            ctx.drawImage(
              logoImage,
              x,
              y,
              logoPixels,
              logoPixels
            );

            setQr(canvas.toDataURL("image/png"));
          };

          logoImage.src = logo;
        };

        qrImage.src = dataUrl;
      })
      .catch(() => {
        setQr("");
        setSvg("");
      });
  }, [
    text,
    qrType,
    size,
    margin,
    qrColor,
    backgroundColor,
    errorCorrection,
    logo,
    logoSize,
    logoBackground,
    wifiSSID,
    wifiPassword,
    wifiSecurity,
    wifiHidden,
    email,
    emailSubject,
    emailBody,
    phone,
    smsPhone,
    smsMessage,
    vcardName,
    vcardPhone,
    vcardEmail,
    vcardWebsite,
    latitude,
    longitude,
    eventTitle,
    eventLocation,
    eventStart,
    eventEnd,
    title,
    subtitle,
    titleFont,
    titleSize,
    titleColor,
    subtitleFont,
    subtitleSize,
    subtitleColor,
  ]);

  const downloadPNG = () => {
    if (!qr) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const padding = 40;
    const titleHeight = title ? 50 : 0;
    const subtitleHeight = subtitle ? 35 : 0;
    const textSpacing = title || subtitle ? 25 : 0;

    canvas.width = size + padding * 2;
    canvas.height =
      size +
      padding * 2 +
      titleHeight +
      subtitleHeight +
      textSpacing;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let y = padding;

    ctx.textAlign = "center";

    if (title) {
      ctx.fillStyle = titleColor || qrColor;
      ctx.font = `bold ${titleSize}px ${titleFont}`;
      ctx.fillText(title, canvas.width / 2, y + titleSize);
      y += titleHeight;
    }

    if (subtitle) {
      ctx.fillStyle = subtitleColor || "#64748b";
      ctx.font = `${subtitleSize}px ${subtitleFont}`;
      ctx.fillText(subtitle, canvas.width / 2, y + subtitleSize);
      y += subtitleHeight;
    }

    if (title || subtitle) {
      y += textSpacing;
    }

    const qrImage = new Image();

    qrImage.onload = () => {
      ctx.drawImage(
        qrImage,
        padding,
        y,
        size,
        size
      );

      const finalImage = canvas.toDataURL("image/png");

      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as any).MSStream;

      if (isIOS) {
        const newWindow = window.open();

        if (!newWindow) {
          alert("Tillåt popup-fönster för att spara QR-koden.");
          return;
        }

        newWindow.document.write(`
          <html>
            <head>
              <title>${title || "QR Code"}</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body style="
              margin:0;
              min-height:100vh;
              display:flex;
              align-items:center;
              justify-content:center;
              background:#0f172a;
            ">
              <img
                src="${finalImage}"
                alt="QR Code"
                style="
                  max-width:90vw;
                  max-height:90vh;
                  height:auto;
                  background:white;
                  padding:12px;
                  box-sizing:border-box;
                  border-radius:20px;
                "
              />
            </body>
          </html>
        `);

        newWindow.document.close();
        return;
      }

      const link = document.createElement("a");
      link.download = "qr-code.png";
      link.href = finalImage;

      document.body.appendChild(link);
      link.click();
      link.remove();
    };

    qrImage.src = qr;
  };

  const downloadSVG = () => {
    if (!svg) return;

    const blob = new Blob([svg], {
      type: "image/svg+xml",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.download = "qr-code.svg";
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    if (!qr) return;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const qrSize = 80;
    const x = (pageWidth - qrSize) / 2;

    if (title) {
      pdf.setFontSize(24);
      pdf.setTextColor(titleColor);
      pdf.text(title, pageWidth / 2, 40, { align: "center" });
    }

    if (subtitle) {
      pdf.setFontSize(16);
      pdf.setTextColor(subtitleColor);
      pdf.text(subtitle, pageWidth / 2, 55, { align: "center" });
    }

    const y = title || subtitle ? 70 : 50;
    pdf.addImage(qr, "PNG", x, y, qrSize, qrSize);
    pdf.save("qr-code.pdf");
  };

  const resetAll = () => {
    setText("https://example.com");
    setQr("");
    setSvg("");
    setAdvanced(false);
    setSection(null);

    setSize(400);
    setQrColor("#000000");
    setBackgroundColor("#ffffff");
    setTitle("");
    setSubtitle("");
    setTitleFont("Arial");
    setTitleSize(28);
    setTitleColor("#000000");
    setSubtitleFont("Arial");
    setSubtitleSize(18);
    setSubtitleColor("#64748b");
    setMargin(2);
    setErrorCorrection("H");

    setQrType("URL");

    setLogo(null);
    setLogoSize(25);
    setLogoBackground(true);

    setWifiSSID("");
    setWifiPassword("");
    setWifiSecurity("WPA");
    setWifiHidden(false);

    setEmail("");
    setEmailSubject("");
    setEmailBody("");

    setPhone("");
    setSmsPhone("");
    setSmsMessage("");

    setVcardName("");
    setVcardPhone("");
    setVcardEmail("");
    setVcardWebsite("");

    setLatitude("");
    setLongitude("");

    setEventTitle("");
    setEventLocation("");
    setEventStart("");
    setEventEnd("");
  };

  const handleLogo = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();

    reader.onload = () => {
      setLogo(reader.result as string);
      setErrorCorrection("H");
    };

    reader.readAsDataURL(file);
  };

  const toggleSection = (name: Section) => {
    setSection(section === name ? null : name);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500";

  const labelClass = "mb-2 block text-sm text-slate-300";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10">

        <header className="flex items-center justify-between">
          <div className="text-2xl font-bold">
            QR<span className="text-blue-500">Generator</span>
          </div>
          <div className="text-sm text-slate-400">
            Free QR Code Generator
          </div>
        </header>

        <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
          Simple • Fast • Private
        </p>

        <section className="grid flex-1 items-center gap-12 py-16 md:grid-cols-2">

          <div className="text-center md:text-left">

            <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
              Create your QR code
            </h1>

            <div className="mt-10">

              {qrType === "URL" || qrType === "Text" ? (
                <>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="h-32 w-full resize-none rounded-2xl border border-slate-700 bg-slate-900 p-5 text-white outline-none transition focus:border-blue-500"
                    placeholder={
                      qrType === "URL"
                        ? "https://example.com"
                        : "Enter your text..."
                    }
                  />
                </>
              ) : (
                <div className="space-y-4">

                  {qrType === "Wi-Fi" && (
                    <>
                      <div>
                        <label className={labelClass}>
                          Network name
                        </label>
                        <input
                          value={wifiSSID}
                          onChange={(e) => setWifiSSID(e.target.value)}
                          className={inputClass}
                          placeholder="My Wi-Fi"
                        />
                      </div>

                      <div>
                        <label className={labelClass}>
                          Password
                        </label>
                        <input
                          type="password"
                          value={wifiPassword}
                          onChange={(e) =>
                            setWifiPassword(e.target.value)
                          }
                          className={inputClass}
                          placeholder="Password"
                        />
                      </div>

                      <div>
                        <label className={labelClass}>
                          Security
                        </label>
                        <select
                          value={wifiSecurity}
                          onChange={(e) =>
                            setWifiSecurity(e.target.value)
                          }
                          className={inputClass}
                        >
                          <option value="WPA">WPA/WPA2</option>
                          <option value="WEP">WEP</option>
                          <option value="nopass">None</option>
                        </select>
                      </div>

                      <label className="flex items-center gap-3 text-sm text-slate-300">
                        <input
                          type="checkbox"
                          checked={wifiHidden}
                          onChange={(e) =>
                            setWifiHidden(e.target.checked)
                          }
                          className="h-4 w-4 accent-blue-600"
                        />
                        Hidden network
                      </label>
                    </>
                  )}

                  {qrType === "Email" && (
                    <>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                        placeholder="Email address"
                      />

                      <input
                        value={emailSubject}
                        onChange={(e) =>
                          setEmailSubject(e.target.value)
                        }
                        className={inputClass}
                        placeholder="Subject"
                      />

                      <textarea
                        value={emailBody}
                        onChange={(e) =>
                          setEmailBody(e.target.value)
                        }
                        className={`${inputClass} h-28`}
                        placeholder="Message"
                      />
                    </>
                  )}

                  {qrType === "Phone" && (
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={inputClass}
                      placeholder="+46 70 123 45 67"
                    />
                  )}

                  {qrType === "SMS" && (
                    <>
                      <input
                        value={smsPhone}
                        onChange={(e) => setSmsPhone(e.target.value)}
                        className={inputClass}
                        placeholder="+46 70 123 45 67"
                      />

                      <textarea
                        value={smsMessage}
                        onChange={(e) =>
                          setSmsMessage(e.target.value)
                        }
                        className={`${inputClass} h-28`}
                        placeholder="SMS message"
                      />
                    </>
                  )}

                  {qrType === "vCard" && (
                    <>
                      <input
                        value={vcardName}
                        onChange={(e) =>
                          setVcardName(e.target.value)
                        }
                        className={inputClass}
                        placeholder="Full name"
                      />

                      <input
                        value={vcardPhone}
                        onChange={(e) =>
                          setVcardPhone(e.target.value)
                        }
                        className={inputClass}
                        placeholder="Phone"
                      />

                      <input
                        value={vcardEmail}
                        onChange={(e) =>
                          setVcardEmail(e.target.value)
                        }
                        className={inputClass}
                        placeholder="Email"
                      />

                      <input
                        value={vcardWebsite}
                        onChange={(e) =>
                          setVcardWebsite(e.target.value)
                        }
                        className={inputClass}
                        placeholder="Website"
                      />
                    </>
                  )}

                  {qrType === "Location" && (
                    <>
                      <input
                        value={latitude}
                        onChange={(e) =>
                          setLatitude(e.target.value)
                        }
                        className={inputClass}
                        placeholder="Latitude"
                      />

                      <input
                        value={longitude}
                        onChange={(e) =>
                          setLongitude(e.target.value)
                        }
                        className={inputClass}
                        placeholder="Longitude"
                      />
                    </>
                  )}

                  {qrType === "Calendar" && (
                    <>
                      <input
                        value={eventTitle}
                        onChange={(e) =>
                          setEventTitle(e.target.value)
                        }
                        className={inputClass}
                        placeholder="Event title"
                      />

                      <input
                        value={eventLocation}
                        onChange={(e) =>
                          setEventLocation(e.target.value)
                        }
                        className={inputClass}
                        placeholder="Location"
                      />

                      <input
                        type="datetime-local"
                        value={eventStart}
                        onChange={(e) =>
                          setEventStart(e.target.value)
                        }
                        className={inputClass}
                      />

                      <input
                        type="datetime-local"
                        value={eventEnd}
                        onChange={(e) =>
                          setEventEnd(e.target.value)
                        }
                        className={inputClass}
                      />
                    </>
                  )}

                </div>
              )}

              <button
                onClick={downloadPNG}
                disabled={!qr}
                className="mt-4 w-full rounded-2xl bg-blue-600 px-6 py-4 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Download PNG
              </button>

              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">

                <button
                  onClick={() => setAdvanced(!advanced)}
                  className="flex w-full items-center justify-between px-5 py-4 font-medium transition hover:bg-slate-800/60"
                >
                  <span>Advanced</span>

                  <span
                    className={`text-slate-400 transition-transform duration-200 ${
                      advanced ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {advanced && (
                  <div className="border-t border-slate-800">

                    <button
                      onClick={() => toggleSection("type")}
                      className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-slate-800/50"
                    >
                      <span>QR Type</span>
                      <span className="text-slate-500">
                        {section === "type" ? "−" : "+"}
                      </span>
                    </button>

                    {section === "type" && (
                      <div className="space-y-2 p-5">

                        {[
                          "URL",
                          "Text",
                          "Wi-Fi",
                          "Email",
                          "Phone",
                          "SMS",
                          "vCard",
                          "Location",
                          "Calendar",
                        ].map((type) => (
                          <button
                            key={type}
                            onClick={() => {
                              setQrType(type as QRType);
                              setSection(null);
                            }}
                            className={`w-full rounded-xl px-4 py-3 text-left transition ${
                              qrType === type
                                ? "bg-blue-600 text-white"
                                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                            }`}
                          >
                            {type}
                          </button>
                        ))}

                      </div>
                    )}

                    <button
                      onClick={() => toggleSection("appearance")}
                      className="flex w-full items-center justify-between border-b border-slate-800 px-5 py-4 text-left hover:bg-slate-800/50"
                    >
                      <span>Appearance</span>
                      <span className="text-slate-500">
                        {section === "appearance" ? "−" : "+"}
                      </span>
                    </button>

                    {section === "appearance" && (
                      <div className="space-y-5 border-b border-slate-800 p-5">

                        <div>
                          <label className="mb-2 block text-sm text-slate-300">
                            Title
                          </label>

                          <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Subject"
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm text-slate-300">
                            Subtitle
                          </label>

                          <input
                            type="text"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            placeholder="Description"
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <div className="mb-2 flex justify-between">
                            <label className="text-sm text-slate-300">
                              Size
                            </label>
                            <span className="text-sm text-slate-500">
                              {size}px
                            </span>
                          </div>

                          <input
                            type="range"
                            min="200"
                            max="1000"
                            step="10"
                            value={size}
                            onChange={(e) =>
                              setSize(Number(e.target.value))
                            }
                            className="w-full accent-blue-600"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm text-slate-300">
                            Title font
                          </label>

                          <select
                            value={titleFont}
                            onChange={(e) => setTitleFont(e.target.value)}
                            className={inputClass}
                          >
                            <option value="Arial">Arial</option>
                            <option value="Helvetica">Helvetica</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Courier New">Courier New</option>
                            <option value="Verdana">Verdana</option>
                          </select>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm text-slate-300">
                            Title size
                          </label>

                          <input
                            type="range"
                            min="12"
                            max="60"
                            value={titleSize}
                            onChange={(e) => setTitleSize(Number(e.target.value))}
                            className="w-full accent-blue-600"
                          />

                          <div className="mt-1 text-sm text-slate-500">
                            {titleSize}px
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>
                            Title color
                          </label>

                          <input
                            type="color"
                            value={titleColor}
                            onChange={(e) => setTitleColor(e.target.value)}
                            className="h-10 w-16 cursor-pointer rounded-lg border border-slate-700 bg-transparent"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm text-slate-300">
                            Subtitle font
                          </label>

                          <select
                            value={subtitleFont}
                            onChange={(e) => setSubtitleFont(e.target.value)}
                            className={inputClass}
                          >
                            <option value="Arial">Arial</option>
                            <option value="Helvetica">Helvetica</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Courier New">Courier New</option>
                            <option value="Verdana">Verdana</option>
                          </select>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm text-slate-300">
                            Subtitle size
                          </label>

                          <input
                            type="range"
                            min="10"
                            max="40"
                            value={subtitleSize}
                            onChange={(e) => setSubtitleSize(Number(e.target.value))}
                            className="w-full accent-blue-600"
                          />

                          <div className="mt-1 text-sm text-slate-500">
                            {subtitleSize}px
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>
                            Subtitle color
                          </label>

                          <input
                            type="color"
                            value={subtitleColor}
                            onChange={(e) => setSubtitleColor(e.target.value)}
                            className="h-10 w-16 cursor-pointer rounded-lg border border-slate-700 bg-transparent"
                          />
                        </div>

                        <div>
                          <label className={labelClass}>
                            QR Color
                          </label>

                          <input
                            type="color"
                            value={qrColor}
                            onChange={(e) =>
                              setQrColor(e.target.value)
                            }
                            className="h-10 w-16 cursor-pointer rounded-lg border border-slate-700 bg-transparent"
                          />
                        </div>

                        <div>
                          <label className={labelClass}>
                            Background
                          </label>

                          <input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) =>
                              setBackgroundColor(e.target.value)
                            }
                            className="h-10 w-16 cursor-pointer rounded-lg border border-slate-700 bg-transparent"
                          />
                        </div>

                        <div>
                          <div className="mb-2 flex justify-between">
                            <label className="text-sm text-slate-300">
                              Margin
                            </label>
                            <span className="text-sm text-slate-500">
                              {margin}
                            </span>
                          </div>

                          <input
                            type="range"
                            min="0"
                            max="10"
                            value={margin}
                            onChange={(e) =>
                              setMargin(Number(e.target.value))
                            }
                            className="w-full accent-blue-600"
                          />
                        </div>

                      </div>
                    )}

                    <button
                      onClick={() => toggleSection("logo")}
                      className="flex w-full items-center justify-between border-b border-slate-800 px-5 py-4 text-left hover:bg-slate-800/50"
                    >
                      <span>Logo</span>
                      <span className="text-slate-500">
                        {section === "logo" ? "−" : "+"}
                      </span>
                    </button>

                    {section === "logo" && (
                      <div className="space-y-5 border-b border-slate-800 p-5">

                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/svg+xml"
                          onChange={(e) =>
                            handleLogo(e.target.files?.[0])
                          }
                          className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:font-medium file:text-white"
                        />

                        {logo && (
                          <>
                            <div className="flex items-center gap-4">
                              <div className="rounded-xl bg-white p-2">
                                <img
                                  src={logo}
                                  alt="Logo preview"
                                  className="h-16 w-16 object-contain"
                                />
                              </div>

                              <button
                                onClick={() => setLogo(null)}
                                className="rounded-xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
                              >
                                Remove logo
                              </button>
                            </div>

                            <div>
                              <div className="mb-2 flex justify-between">
                                <label className="text-sm text-slate-300">
                                  Logo size
                                </label>

                                <span className="text-sm text-slate-500">
                                  {logoSize}%
                                </span>
                              </div>

                              <input
                                type="range"
                                min="10"
                                max="35"
                                value={logoSize}
                                onChange={(e) =>
                                  setLogoSize(Number(e.target.value))
                                }
                                className="w-full accent-blue-600"
                              />
                            </div>

                            <label className="flex items-center gap-3 text-sm text-slate-300">
                              <input
                                type="checkbox"
                                checked={logoBackground}
                                onChange={(e) =>
                                  setLogoBackground(e.target.checked)
                                }
                                className="h-4 w-4 accent-blue-600"
                              />
                              White background behind logo
                            </label>
                          </>
                        )}

                      </div>
                    )}

                    <button
                      onClick={() => toggleSection("settings")}
                      className="flex w-full items-center justify-between border-b border-slate-800 px-5 py-4 text-left hover:bg-slate-800/50"
                    >
                      <span>QR Settings</span>
                      <span className="text-slate-500">
                        {section === "settings" ? "−" : "+"}
                      </span>
                    </button>

                    {section === "settings" && (
                      <div className="border-b border-slate-800 p-5">

                        <label className={labelClass}>
                          Error Correction
                        </label>

                        <select
                          value={logo ? "H" : errorCorrection}
                          disabled={!!logo}
                          onChange={(e) =>
                            setErrorCorrection(
                              e.target.value as "L" | "M" | "Q" | "H"
                            )
                          }
                          className={`${inputClass} disabled:opacity-50`}
                        >
                          <option value="L">Low — 7%</option>
                          <option value="M">Medium — 15%</option>
                          <option value="Q">Quartile — 25%</option>
                          <option value="H">High — 30%</option>
                        </select>

                      </div>
                    )}

                    <button
                      onClick={() => toggleSection("output")}
                      className="flex w-full items-center justify-between border-b border-slate-800 px-5 py-4 text-left hover:bg-slate-800/50"
                    >
                      <span>Output</span>
                      <span className="text-slate-500">
                        {section === "output" ? "−" : "+"}
                      </span>
                    </button>

                    {section === "output" && (
                      <div className="space-y-3 border-b border-slate-800 p-5">

                        <button
                          onClick={downloadPNG}
                          disabled={!qr}
                          className="w-full rounded-xl bg-slate-800 px-4 py-3 text-left hover:bg-slate-700 disabled:opacity-40"
                        >
                          PNG
                        </button>

                        <button
                          onClick={downloadSVG}
                          disabled={!svg}
                          className="w-full rounded-xl bg-slate-800 px-4 py-3 text-left hover:bg-slate-700 disabled:opacity-40"
                        >
                          SVG
                        </button>

                        <button
                          onClick={downloadPDF}
                          disabled={!qr}
                          className="w-full rounded-xl bg-slate-800 px-4 py-3 text-left hover:bg-slate-700 disabled:opacity-40"
                        >
                          PDF
                        </button>

                      </div>
                    )}

                  </div>
                )}

              </div>

            </div>
          </div>

          <div className="flex justify-center lg:sticky lg:top-4 lg:self-start">
            <div className="rounded-3xl bg-white p-8 shadow-2xl shadow-blue-950/30 text-center">
              {title && (
                <div
                  style={{
                    fontFamily: titleFont,
                    fontSize: `${titleSize}px`,
                    color: titleColor,
                    fontWeight: "bold",
                    marginBottom: "8px",
                    wordBreak: "break-word"
                  }}
                >
                  {title}
                </div>
              )}
              {subtitle && (
                <div
                  style={{
                    fontFamily: subtitleFont,
                    fontSize: `${subtitleSize}px`,
                    color: subtitleColor,
                    marginBottom: "16px",
                    wordBreak: "break-word"
                  }}
                >
                  {subtitle}
                </div>
              )}
              {qr ? (
                <img
                  src={qr}
                  alt="Generated QR code"
                  className="h-72 w-72 md:h-96 md:w-96"
                />
              ) : (
                <div className="flex h-72 w-72 items-center justify-center text-slate-400 md:h-96 md:w-96">
                  Enter information to generate QR
                </div>
              )}
            </div>
          </div>

        </section>

        <button
          type="button"
          onClick={() => {
            setText("https://example.com");
            setQrType("URL");

            setWifiSSID("");
            setWifiPassword("");
            setWifiSecurity("WPA");
            setWifiHidden(false);

            setEmail("");
            setEmailSubject("");
            setEmailBody("");

            setPhone("");

            setSmsPhone("");
            setSmsMessage("");

            setVcardName("");
            setVcardPhone("");
            setVcardEmail("");
            setVcardWebsite("");

            setLatitude("");
            setLongitude("");

            setEventTitle("");
            setEventLocation("");
            setEventStart("");
            setEventEnd("");

            setTitle("");
            setSubtitle("");
            setTitleFont("Arial");
            setTitleSize(28);
            setTitleColor("#000000");
            setSubtitleFont("Arial");
            setSubtitleSize(18);
            setSubtitleColor("#64748b");

            setSize(400);
            setQrColor("#000000");
            setBackgroundColor("#ffffff");
            setMargin(2);
            setErrorCorrection("H");

            setLogo(null);
            setLogoSize(25);
            setLogoBackground(true);

            setSection(null);
            setAdvanced(false);
          }}
          className="mt-8 w-full rounded-2xl border border-slate-700 px-6 py-4 font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          Reset
        </button>
        <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
          No account required • No permanent storage
        </footer>

      </div>
    </main>
  );
}