import { ImageResponse } from "@takumi-rs/image-response";
import { db } from "@/db";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const result = (await db.execute(
    `SELECT 
      r.score::numeric as score,
      r.feedback,
      s.language,
      LENGTH(s.code) - LENGTH(REPLACE(s.code, E'\n', '')) + 1 as lines
    FROM roasts r
    JOIN submissions s ON r.submission_id = s.id
    WHERE r.id = '${id}'`,
  )) as { score: number; feedback: string; language: string; lines: number }[];

  const row = result[0];

  if (!row) {
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0c0c0c",
          fontFamily: "JetBrains Mono, monospace",
          color: "#fafafa",
        }}
      >
        <span style={{ fontSize: 32 }}>Roast not found</span>
      </div>,
      { width: 1200, height: 630 },
    );
  }

  const score = row.score.toString();
  const feedback = row.feedback;
  const language = row.language;
  const lines = row.lines;

  const scoreNum = Number(score);
  let verdict = "decent_code";
  if (scoreNum < 4) verdict = "needs_serious_help";
  else if (scoreNum < 7) verdict = "room_for_improvement";

  const getScoreColor = () => {
    if (scoreNum < 4) return "#ef4444";
    if (scoreNum < 7) return "#f59e0b";
    return "#10b981";
  };

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: "#0c0c0c",
        backgroundImage: "linear-gradient(to bottom right, #0c0c0c, #1a0a0a)",
        fontFamily: "JetBrains Mono, monospace",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 60,
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 40,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: "50%",
              border: "4px solid #1f1f1f",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background:
                "conic-gradient(from 0deg at 50% 50%, #ef4444, #f59e0b, #10b981, #ef4444)",
              backgroundClip: "padding-box",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                backgroundColor: "#0c0c0c",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: 64,
                  fontWeight: 700,
                  color: getScoreColor(),
                }}
              >
                {score}
              </span>
              <span
                style={{
                  fontSize: 20,
                  color: "#4b5563",
                }}
              >
                /10
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              flex: 1,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: getScoreColor(),
                }}
              />
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: getScoreColor(),
                  textTransform: "uppercase",
                  letterSpacing: 2,
                }}
              >
                {verdict.replace(/_/g, " ")}
              </span>
            </div>

            <p
              style={{
                fontSize: 28,
                color: "#fafafa",
                lineHeight: 1.4,
                margin: 0,
                fontStyle: "italic",
              }}
            >
              "{feedback}"
            </p>

            <div
              style={{
                display: "flex",
                gap: 16,
                color: "#4b5563",
                fontSize: 16,
              }}
            >
              <span>{language}</span>
              <span>·</span>
              <span>{lines} lines</span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: 30,
            borderTop: "1px solid #1f1f1f",
          }}
        >
          <span style={{ color: "#ff8400", fontSize: 24, fontWeight: 700 }}>
            DevRoast
          </span>
          <span style={{ color: "#4b5563", fontSize: 18 }}>
            Get roasted. Improve your code.
          </span>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
