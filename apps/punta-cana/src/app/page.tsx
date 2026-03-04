"use client";

import { useState } from "react";

const FLIGHT_PP = 710;
const MEMBERSHIP = 660;

const OLD_PRICES: Record<string, { total: number; pp: number }> = {
  "1a": { total: 3024, pp: 3024 },
  "2a": { total: 4285, pp: 2142.5 },
  "2a2k": { total: 6778, pp: 1694.5 },
  "3a": { total: 6129, pp: 2043 },
};

const GROUPS_TYPE: Record<
  string,
  { label: string; people: number; sub?: string }
> = {
  "1a": { label: "1 Adulto", people: 1 },
  "2a": { label: "2 Adultos", people: 2 },
  "2a2k": { label: "2 Adultos + 2 Ninos", people: 4, sub: "(15 y 6 anos)" },
  "3a": { label: "3 Adultos", people: 3 },
};

const TRAVEL_GROUPS = [
  {
    id: 1,
    name: "Sebastian",
    members: ["Sebastian"],
    type: "1a",
    color: "#c9a84c",
    hotel: 1347.76,
    room: "Junior Suite Garden View",
  },
  {
    id: 2,
    name: "Daniel y Silvia",
    members: ["Daniel", "Silvia"],
    type: "2a",
    color: "#6ba3d6",
    hotel: 1797.01,
    room: "Junior Suite Garden View",
  },
  {
    id: 3,
    name: "Omar, Adriana y Flor",
    members: ["Omar", "Adriana", "Flor"],
    type: "3a",
    color: "#e07a5f",
    hotel: 2536.86,
    room: "Superior Junior Suite Garden View",
  },
  {
    id: 4,
    name: "Sandra y Alejandro",
    members: ["Sandra", "Alejandro"],
    type: "2a",
    color: "#81b29a",
    hotel: 1797.01,
    room: "Junior Suite Garden View",
  },
  {
    id: 5,
    name: "Pichi y Stella",
    members: ["Pichi", "Stella"],
    type: "2a",
    color: "#f4a261",
    hotel: 1797.01,
    room: "Junior Suite Garden View",
  },
  {
    id: 6,
    name: "Flia. Bruno",
    members: ["Bruno", "Pamela", "Francesca", "Valentino"],
    type: "2a2k",
    color: "#b88fcc",
    detail: "2 adultos + 2 ninos",
    hotel: 2425.97,
    room: "Junior Suite Garden View",
  },
  {
    id: 7,
    name: "Flia. Vanesa",
    members: ["Vanesa", "Nani", "Sofi", "Juli"],
    type: "2a2k",
    color: "#e6c75a",
    detail: "2 adultos + 2 ninos",
    hotel: 2425.97,
    room: "Junior Suite Garden View",
  },
  {
    id: 8,
    name: "Roque",
    members: ["Roque"],
    type: "1a",
    color: "#7ec8a0",
    detail: "Papa de Bruno",
    hotel: 1347.76,
    room: "Junior Suite Garden View",
  },
];

const fmt = (n: number) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const fmtInt = (n: number) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

export default function PalladiumTrip() {
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);

  const totalExpedition = TRAVEL_GROUPS.reduce((s, tg) => {
    const gt = GROUPS_TYPE[tg.type];
    return s + tg.hotel + MEMBERSHIP + gt.people * FLIGHT_PP;
  }, 0);

  return (
    <div
      style={{
        fontFamily: "'Libre Franklin', 'Helvetica Neue', sans-serif",
        background:
          "linear-gradient(175deg, #0c1a2e 0%, #143049 35%, #1a4a5e 55%, #1f6068 75%, #2a7a6e 100%)",
        minHeight: "100vh",
        color: "#e8e0d4",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap"
        rel="stylesheet"
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(202,169,104,0.06) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "-5%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(42,122,110,0.1) 0%, transparent 70%)",
          }}
        />
      </div>

      <div
        className="trip-container"
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "960px",
          margin: "0 auto",
          padding: "32px 20px 60px",
        }}
      >
        {/* HEADER */}
        <header style={{ textAlign: "center", marginBottom: "36px" }}>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "#c9a84c",
              marginBottom: "12px",
              fontWeight: 500,
            }}
          >
            Grand Palladium · Select Bavaro
          </p>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(28px, 5vw, 44px)",
              fontWeight: 400,
              margin: "0 0 8px",
              lineHeight: 1.15,
              color: "#fff",
            }}
          >
            Punta Cana 2026
          </h1>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(16px, 3vw, 22px)",
              fontStyle: "italic",
              color: "#c9a84c",
              margin: "0 0 16px",
              fontWeight: 400,
            }}
          >
            27 oct — 5 nov · 9 noches all-inclusive
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              flexWrap: "wrap",
              fontSize: "12px",
              color: "rgba(232,224,212,0.55)",
              letterSpacing: "0.5px",
            }}
          >
            <span>8 habitaciones</span>
            <span style={{ color: "rgba(232,224,212,0.25)" }}>·</span>
            <span>19 viajeros</span>
            <span style={{ color: "rgba(232,224,212,0.25)" }}>·</span>
            <span>Promo BIGDAYS −13.33%</span>
          </div>
        </header>

        {/* GROUPS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {TRAVEL_GROUPS.map((tg, idx) => {
            const gt = GROUPS_TYPE[tg.type];
            const hotelMembership = tg.hotel + MEMBERSHIP;
            const flights = gt.people * FLIGHT_PP;
            const tripTotal = hotelMembership + flights;
            const oldTrip = OLD_PRICES[tg.type].total;
            const saving = oldTrip - tripTotal;
            const pct = (saving / oldTrip) * 100;
            const isOpen = selectedGroup === idx;

            // Payment schedule
            const halfHotel = Math.floor(hotelMembership / 2 / 100) * 100;
            const remainder = hotelMembership - halfHotel;

            return (
              <div
                key={tg.id}
                style={{
                  background: isOpen
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(255,255,255,0.025)",
                  border: isOpen
                    ? "1px solid " + tg.color + "40"
                    : "1px solid rgba(232,224,212,0.06)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "all 0.2s",
                }}
              >
                {/* Collapsed row */}
                <div
                  className="group-row"
                  onClick={() => {
                    setSelectedGroup(isOpen ? null : idx);
                  }}
                  style={{ padding: "16px 20px", cursor: "pointer" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        flex: 1,
                        minWidth: "180px",
                      }}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background: tg.color + "20",
                          border: "1.5px solid " + tg.color + "50",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          fontWeight: 700,
                          color: tg.color,
                          flexShrink: 0,
                        }}
                      >
                        {tg.id}
                      </div>
                      <div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "15px",
                            fontWeight: 600,
                            color: "#fff",
                          }}
                        >
                          {tg.name}
                        </p>
                        <p
                          style={{
                            margin: "2px 0 0",
                            fontSize: "11px",
                            color: "rgba(232,224,212,0.4)",
                          }}
                        >
                          {tg.detail || gt.label}
                        </p>
                      </div>
                    </div>
                    <div
                      className="price-section"
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ textAlign: "right" }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "10px",
                            color: "rgba(232,224,212,0.3)",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Hotel + VIP
                        </p>
                        <p
                          className="price-sub"
                          style={{
                            margin: 0,
                            fontSize: "15px",
                            fontWeight: 600,
                            color: "rgba(232,224,212,0.75)",
                          }}
                        >
                          ${fmt(hotelMembership)}
                        </p>
                      </div>
                      <div
                        className="price-separator"
                        style={{
                          width: "1px",
                          height: "24px",
                          background: "rgba(232,224,212,0.08)",
                        }}
                      />
                      <div style={{ textAlign: "right" }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "10px",
                            color: "rgba(232,224,212,0.3)",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Vuelos
                        </p>
                        <p
                          className="price-sub"
                          style={{
                            margin: 0,
                            fontSize: "15px",
                            fontWeight: 600,
                            color: "rgba(232,224,212,0.75)",
                          }}
                        >
                          ${fmt(flights)}
                        </p>
                      </div>
                      <div
                        className="price-separator"
                        style={{
                          width: "1px",
                          height: "24px",
                          background: "rgba(232,224,212,0.08)",
                        }}
                      />
                      <div style={{ textAlign: "right" }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "10px",
                            color: "#5cbf8a",
                            letterSpacing: "0.5px",
                            fontWeight: 500,
                          }}
                        >
                          Total
                        </p>
                        <p
                          className="price-total-value"
                          style={{
                            margin: 0,
                            fontSize: "18px",
                            fontWeight: 700,
                            color: "#fff",
                            fontFamily: "'Playfair Display', serif",
                          }}
                        >
                          ${fmt(tripTotal)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded content */}
                {isOpen && (
                  <div
                    style={{
                      borderTop: "1px solid rgba(232,224,212,0.06)",
                    }}
                  >
                    {/* Members */}
                    <div
                      style={{
                        padding: "16px 20px 0",
                        display: "flex",
                        gap: "6px",
                        flexWrap: "wrap",
                      }}
                    >
                      {tg.members.map((m, i) => (
                        <span
                          key={i}
                          style={{
                            background: tg.color + "18",
                            color: tg.color,
                            fontSize: "11px",
                            padding: "4px 12px",
                            borderRadius: "12px",
                            fontWeight: 500,
                          }}
                        >
                          {m}
                        </span>
                      ))}
                    </div>

                    {/* Before vs After mini */}
                    {saving > 0 && (
                      <div
                        style={{
                          margin: "16px 20px 0",
                          padding: "12px 16px",
                          background: "rgba(45,106,79,0.1)",
                          borderRadius: "10px",
                          border: "1px solid rgba(92,191,138,0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "13px",
                              color: "rgba(232,224,212,0.4)",
                              textDecoration: "line-through",
                              textDecorationColor: "rgba(232,224,212,0.2)",
                            }}
                          >
                            ${fmt(oldTrip)}
                          </span>
                          <span
                            style={{ fontSize: "16px", color: "#fff" }}
                          >
                            →
                          </span>
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: 700,
                              color: "#fff",
                            }}
                          >
                            ${fmt(tripTotal)}
                          </span>
                        </div>
                        <div
                          style={{
                            background: "rgba(45,106,79,0.25)",
                            padding: "4px 12px",
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "14px",
                              fontWeight: 700,
                              color: "#5cbf8a",
                            }}
                          >
                            −${fmt(saving)}
                          </span>
                          <span
                            style={{
                              fontSize: "11px",
                              color: "rgba(92,191,138,0.6)",
                            }}
                          >
                            ({Math.abs(pct).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    )}
                    {saving > 0 && (
                      <p
                        style={{
                          margin: "6px 20px 0",
                          fontSize: "11px",
                          color: "rgba(232,224,212,0.3)",
                        }}
                      >
                        vs cotizacion original (Palace · Junior Suite · sin
                        promo)
                      </p>
                    )}

                    {/* Room info */}
                    <div style={{ margin: "16px 20px 0" }}>
                      <p
                        style={{
                          fontSize: "10px",
                          letterSpacing: "2px",
                          textTransform: "uppercase",
                          color: "#5cbf8a",
                          margin: "0 0 4px",
                          fontWeight: 600,
                        }}
                      >
                        Tu habitacion
                      </p>
                      <p
                        style={{
                          fontSize: "16px",
                          fontWeight: 500,
                          color: "#fff",
                          margin: "0 0 2px",
                          fontFamily: "'Playfair Display', serif",
                        }}
                      >
                        {tg.room}
                      </p>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "rgba(232,224,212,0.4)",
                          margin: "0 0 12px",
                        }}
                      >
                        Select Bavaro · All-inclusive · 9 noches
                      </p>
                    </div>

                    {/* PAYMENT SCHEDULE */}
                    <div style={{ margin: "20px 20px 0" }}>
                      <p
                        style={{
                          fontSize: "10px",
                          letterSpacing: "2px",
                          textTransform: "uppercase",
                          color: "#c9a84c",
                          margin: "0 0 12px",
                          fontWeight: 600,
                        }}
                      >
                        Esquema de pagos
                      </p>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0",
                        }}
                      >
                        {/* Step 1 */}
                        <div style={{ display: "flex", gap: "12px" }}>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              flexShrink: 0,
                            }}
                          >
                            <div
                              style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                background: "rgba(201,168,76,0.2)",
                                border: "1.5px solid #c9a84c",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                fontWeight: 700,
                                color: "#c9a84c",
                              }}
                            >
                              1
                            </div>
                            <div
                              style={{
                                width: "1.5px",
                                flex: 1,
                                background: "rgba(232,224,212,0.1)",
                                margin: "4px 0",
                              }}
                            />
                          </div>
                          <div style={{ paddingBottom: "16px", flex: 1 }}>
                            <p
                              style={{
                                margin: "0 0 2px",
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#fff",
                              }}
                            >
                              Sena del hotel
                            </p>
                            <p
                              style={{
                                margin: "0 0 6px",
                                fontSize: "11px",
                                color: "rgba(232,224,212,0.4)",
                              }}
                            >
                              Antes del{" "}
                              <span
                                style={{
                                  color: "#c9a84c",
                                  fontWeight: 600,
                                }}
                              >
                                10 de marzo
                              </span>
                            </p>
                            <div
                              className="payment-box"
                              style={{
                                background: "rgba(201,168,76,0.1)",
                                border:
                                  "1px solid rgba(201,168,76,0.15)",
                                borderRadius: "8px",
                                padding: "10px 14px",
                                display: "inline-flex",
                                alignItems: "baseline",
                                gap: "6px",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "20px",
                                  fontWeight: 700,
                                  color: "#c9a84c",
                                  fontFamily:
                                    "'Playfair Display', serif",
                                }}
                              >
                                ${fmtInt(halfHotel)}
                              </span>
                              <span
                                style={{
                                  fontSize: "11px",
                                  color: "rgba(232,224,212,0.4)",
                                }}
                              >
                                ~50% hotel + membresia VIP
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Step 2 */}
                        <div style={{ display: "flex", gap: "12px" }}>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              flexShrink: 0,
                            }}
                          >
                            <div
                              style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                background: "rgba(92,191,138,0.2)",
                                border: "1.5px solid #5cbf8a",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                fontWeight: 700,
                                color: "#5cbf8a",
                              }}
                            >
                              2
                            </div>
                            <div
                              style={{
                                width: "1.5px",
                                flex: 1,
                                background: "rgba(232,224,212,0.1)",
                                margin: "4px 0",
                              }}
                            />
                          </div>
                          <div style={{ paddingBottom: "16px", flex: 1 }}>
                            <p
                              style={{
                                margin: "0 0 2px",
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#fff",
                              }}
                            >
                              Vuelos
                            </p>
                            <p
                              style={{
                                margin: "0 0 6px",
                                fontSize: "11px",
                                color: "rgba(232,224,212,0.4)",
                              }}
                            >
                              Sacar entre el{" "}
                              <span
                                style={{
                                  color: "#5cbf8a",
                                  fontWeight: 600,
                                }}
                              >
                                15 y 30 de marzo
                              </span>
                            </p>
                            <div
                              className="payment-box"
                              style={{
                                background: "rgba(92,191,138,0.1)",
                                border:
                                  "1px solid rgba(92,191,138,0.15)",
                                borderRadius: "8px",
                                padding: "10px 14px",
                                display: "inline-flex",
                                alignItems: "baseline",
                                gap: "6px",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "20px",
                                  fontWeight: 700,
                                  color: "#5cbf8a",
                                  fontFamily:
                                    "'Playfair Display', serif",
                                }}
                              >
                                ${fmt(flights)}
                              </span>
                              <span
                                style={{
                                  fontSize: "11px",
                                  color: "rgba(232,224,212,0.4)",
                                }}
                              >
                                {gt.people} persona
                                {gt.people > 1 ? "s" : ""} × $
                                {fmtInt(FLIGHT_PP)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Step 3 */}
                        <div style={{ display: "flex", gap: "12px" }}>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              flexShrink: 0,
                            }}
                          >
                            <div
                              style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                background: "rgba(107,163,214,0.2)",
                                border: "1.5px solid #6ba3d6",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                fontWeight: 700,
                                color: "#6ba3d6",
                              }}
                            >
                              3
                            </div>
                          </div>
                          <div style={{ flex: 1 }}>
                            <p
                              style={{
                                margin: "0 0 2px",
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#fff",
                              }}
                            >
                              Saldo del hotel
                            </p>
                            <p
                              style={{
                                margin: "0 0 6px",
                                fontSize: "11px",
                                color: "rgba(232,224,212,0.4)",
                              }}
                            >
                              Antes del{" "}
                              <span
                                style={{
                                  color: "#6ba3d6",
                                  fontWeight: 600,
                                }}
                              >
                                27 de septiembre
                              </span>{" "}
                              (30 dias antes)
                            </p>
                            <div
                              className="payment-box"
                              style={{
                                background: "rgba(107,163,214,0.1)",
                                border:
                                  "1px solid rgba(107,163,214,0.15)",
                                borderRadius: "8px",
                                padding: "10px 14px",
                                display: "inline-flex",
                                alignItems: "baseline",
                                gap: "6px",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "20px",
                                  fontWeight: 700,
                                  color: "#6ba3d6",
                                  fontFamily:
                                    "'Playfair Display', serif",
                                }}
                              >
                                ${fmt(remainder)}
                              </span>
                              <span
                                style={{
                                  fontSize: "11px",
                                  color: "rgba(232,224,212,0.4)",
                                }}
                              >
                                saldo restante
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Per person if group */}
                    {gt.people > 1 && (
                      <div
                        style={{
                          margin: "16px 20px 0",
                          padding: "10px 16px",
                          background: "rgba(0,0,0,0.12)",
                          borderRadius: "8px",
                          textAlign: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "12px",
                            color: "rgba(232,224,212,0.4)",
                          }}
                        >
                          Promedio por persona:{" "}
                        </span>
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "rgba(232,224,212,0.7)",
                          }}
                        >
                          ${fmt(tripTotal / gt.people)}
                        </span>
                      </div>
                    )}

                    <div style={{ height: "20px" }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* TOTALS */}
        <div
          style={{
            marginTop: "20px",
            background:
              "linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(201,168,76,0.03) 100%)",
            border: "1px solid rgba(201,168,76,0.2)",
            borderRadius: "14px",
            padding: "20px 24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 2px",
                  fontSize: "11px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "#c9a84c",
                  fontWeight: 600,
                }}
              >
                Total expedicion
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  color: "rgba(232,224,212,0.4)",
                }}
              >
                8 habitaciones · 19 personas · todo incluido
              </p>
            </div>
            <p
              className="expedition-total"
              style={{
                margin: 0,
                fontSize: "28px",
                fontWeight: 700,
                color: "#fff",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              ${fmt(totalExpedition)}
            </p>
          </div>
        </div>

        {/* NOTES */}
        <div
          style={{
            marginTop: "16px",
            padding: "16px 20px",
            background: "rgba(0,0,0,0.15)",
            borderRadius: "10px",
            border: "1px solid rgba(232,224,212,0.06)",
            fontSize: "12px",
            lineHeight: 1.7,
            color: "rgba(232,224,212,0.45)",
          }}
        >
          <p style={{ margin: "0 0 4px" }}>
            ✦ Transporte privado aeropuerto ↔ hotel incluido
          </p>
          <p style={{ margin: "0 0 4px" }}>
            ✦ Check-in VIP en lounge privado
          </p>
          <p style={{ margin: "0 0 4px" }}>
            ✦ Hidroterapia gratuita en Zentropia Spa + 20% dto en
            tratamientos
          </p>
          <p style={{ margin: "0 0 4px" }}>✦ Concierge personalizado</p>
          <p
            style={{
              margin: "10px 0 0",
              fontSize: "11px",
              color: "rgba(232,224,212,0.3)",
            }}
          >
            Tarifa no reembolsable con promo BIGDAYS −13.33% · Precios en
            USD · Impuestos 24% incluidos
          </p>
        </div>

        <footer
          style={{
            marginTop: "40px",
            textAlign: "center",
            fontSize: "11px",
            color: "rgba(232,224,212,0.2)",
            letterSpacing: "1px",
          }}
        >
          Grand Palladium Select Bavaro · Punta Cana · Oct–Nov 2026
        </footer>
      </div>
    </div>
  );
}
