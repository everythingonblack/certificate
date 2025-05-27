import React, { useEffect, useRef, useState } from "react";
import styles from "./CertificateModal.module.css";
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import axios from "axios";

const CertificateModal = ({ isOpen, onClose, certificateDetails }) => {
  const certificateRef = useRef(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const downloadAsImage = () => {
    if (!certificateRef.current) return;

    html2canvas(certificateRef.current, {
      backgroundColor: "#fff", // ✅ agar hasil tidak transparan/gelap
      scale: 2,
    }).then((canvas) => {
      const link = document.createElement("a");
      link.download = `${certificateDetails.recipient_name || "certificate"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  if (!isOpen || !certificateDetails) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div
          ref={certificateRef}
          className={styles.certificateContainer}
          style={{ backgroundColor: "white" }} // ✅ latar putih bersih
        >
          <div className={styles.header}>
            <img
              className={styles.logo}
              alt="Logo"
              src="kediritechnopark.jpg"
            />
            <h1 className={styles.title}>Certificate of Participation</h1>
            <p className={styles.subtitle}>This is to certify that</p>
            <p className={styles.name}>{certificateDetails.recipient_name}</p>
            <div className={styles.nameUnderline}></div>
            <p className={styles.description}>
              {certificateDetails.course_description}
            </p>
            <p className={styles.bodyText}>{certificateDetails.course_title}</p>

            <div className={styles.footer}>
              <div className={styles.signatureBlock}>
                <p className={styles.signatureName}>SAMSUDIN B. TAUFIK</p>
                <p className={styles.signatureTitle}>Founder</p>
              </div>

              <img
                className={styles.signatureImage}
                src="/signature.png"
                alt="Signature"
              />
              <div className={styles.dateQR}>
                <QRCodeSVG
                  value={`https://certification.kediritechnopark.com/${certificateDetails.certificate_id}`}
                  size={64}
                />
                <p className={styles.date}>{certificateDetails.issue_date}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Tombol download */}
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <button onClick={downloadAsImage} className={styles.downloadBtn}>
            Download as PNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
