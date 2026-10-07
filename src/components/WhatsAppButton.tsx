'use client';

import { useState } from 'react';

const WhatsAppButton = () => {
  const [hovered, setHovered] = useState(false);

  const phoneNumber = '971569672392';
  const message = encodeURIComponent('Hi Anvarsha! I visited your portfolio and would like to connect.');

  const handleClick = () => {
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <>
      <style>{`
        .whatsapp-float {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 999;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
        }

        /* Tooltip above button */
        .whatsapp-tooltip {
          position: absolute;
          bottom: calc(100% + 14px);
          right: 0;
          background: linear-gradient(135deg, rgba(37, 211, 102, 0.15), rgba(15, 15, 25, 0.95));
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(37, 211, 102, 0.25);
          color: #fff;
          padding: 12px 18px;
          border-radius: 14px;
          font-size: 0.85rem;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          white-space: nowrap;
          pointer-events: none;
          box-shadow: 0 10px 35px rgba(0, 0, 0, 0.4), 0 0 20px rgba(37, 211, 102, 0.1);
          opacity: 0;
          transform: translateY(8px) scale(0.95);
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .whatsapp-tooltip.show {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* Arrow pointing down */
        .whatsapp-tooltip::after {
          content: '';
          position: absolute;
          bottom: -7px;
          right: 22px;
          width: 14px;
          height: 14px;
          background: rgba(15, 15, 25, 0.95);
          border-right: 1px solid rgba(37, 211, 102, 0.25);
          border-bottom: 1px solid rgba(37, 211, 102, 0.25);
          transform: rotate(45deg);
          border-radius: 0 0 3px 0;
        }

        .whatsapp-tooltip span {
          color: #25d366;
        }

        .whatsapp-btn-wrap {
          position: relative;
          width: 60px;
          height: 60px;
        }

        /* Pulse rings */
        .whatsapp-pulse {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid rgba(37, 211, 102, 0.25);
          animation: wa-pulse 2.5s ease-out infinite;
        }

        .whatsapp-pulse:nth-child(2) {
          animation-delay: 0.8s;
        }

        .whatsapp-pulse:nth-child(3) {
          animation-delay: 1.6s;
        }

        @keyframes wa-pulse {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2); opacity: 0; }
        }

        /* 3D Button */
        .whatsapp-btn {
          position: relative;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          outline: none;
          background: linear-gradient(145deg, #2bd96f, #25d366, #1ebe5d);
          box-shadow:
            0 4px 15px rgba(37, 211, 102, 0.4),
            0 8px 30px rgba(37, 211, 102, 0.15),
            inset 0 2px 3px rgba(255, 255, 255, 0.2),
            inset 0 -2px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
          animation: wa-float 3s ease-in-out infinite;
        }

        @keyframes wa-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        .whatsapp-btn:hover {
          animation: none;
          transform: scale(1.12) rotateX(8deg) rotateY(-8deg);
          box-shadow:
            0 8px 25px rgba(37, 211, 102, 0.5),
            0 15px 45px rgba(37, 211, 102, 0.2),
            inset 0 2px 4px rgba(255, 255, 255, 0.25),
            inset 0 -2px 4px rgba(0, 0, 0, 0.15);
        }

        .whatsapp-btn:active {
          transform: scale(0.95);
          box-shadow:
            0 2px 10px rgba(37, 211, 102, 0.3),
            inset 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        /* Shine effect (kept inside the circle) */
        .whatsapp-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          pointer-events: none;
          background: linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.35) 50%, transparent 65%);
          background-size: 250% 100%;
          background-position: 150% 0;
          transition: background-position 0.6s;
        }

        .whatsapp-btn:hover::before {
          background-position: -50% 0;
        }

        .whatsapp-icon {
          width: 30px;
          height: 30px;
          fill: white;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
          transition: transform 0.3s ease;
          position: relative;
          z-index: 1;
        }

        .whatsapp-btn:hover .whatsapp-icon {
          transform: scale(1.08);
        }

        /* Notification badge */
        .whatsapp-badge {
          position: absolute;
          top: -3px;
          right: -3px;
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #ff4757, #ff3b3b);
          border-radius: 50%;
          border: 2.5px solid #0a0a0f;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6rem;
          font-weight: 700;
          color: white;
          font-family: 'Inter', sans-serif;
          animation: wa-badge 2s ease-in-out infinite;
          box-shadow: 0 2px 10px rgba(255, 59, 59, 0.5);
          z-index: 2;
        }

        @keyframes wa-badge {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        @media (max-width: 768px) {
          .whatsapp-float {
            bottom: 20px;
            right: 20px;
          }
          .whatsapp-btn, .whatsapp-btn-wrap {
            width: 54px;
            height: 54px;
          }
          .whatsapp-icon {
            width: 26px;
            height: 26px;
          }
          .whatsapp-tooltip {
            display: none;
          }
        }
      `}</style>

      <div
        className="whatsapp-float"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleClick}
      >
        <div className={`whatsapp-tooltip ${hovered ? 'show' : ''}`}>
          👋 <span>Chat</span> with me on WhatsApp!
        </div>
        <div className="whatsapp-btn-wrap">
          <div className="whatsapp-pulse"></div>
          <div className="whatsapp-pulse"></div>
          <div className="whatsapp-pulse"></div>
          <button className="whatsapp-btn" aria-label="Chat on WhatsApp">
            <svg className="whatsapp-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="whatsapp-badge">1</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default WhatsAppButton;
