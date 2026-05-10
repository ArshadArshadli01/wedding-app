import postgres from "postgres";

let schemaPromise;
let sqlTag;

async function initSchema() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  const countRows = await sql`
    SELECT COUNT(*)::int AS c FROM messages
  `;
  if (Number(countRows[0].c) === 0) {
    for (const [name, message] of SEED_ROWS) {
      await sql`
        INSERT INTO messages (name, message) VALUES (${name}, ${message})
      `;
    }
  }
}

const SEED_ROWS = [
  ["Vezok", "Be happy baby 💍💋"],
  [
    "Fidan Nəcəfova",
    "Əziz Madina xanım, bu gözəl günün hər anı sizin üçün unudulmaz olsun! Yeni qurduğunuz yuvanızdan sevgi, bərəkət və gülüş heç vaxt əskik olmasın. Bir ömür boyu əl-ələ, xoşbəxt yaşamağınızı arzu edirəm. Təbriklər!",
  ],
  [
    "Gülşən Ayaz",
    "Mədinəm, bu gün sənin ən gözəl günündür. Arzu edirəm ki, üzündəki bu təbəssüm heç vaxt əskik olmasın. Ömür boyu əl-ələ, xoşbəxt yaşamağınızı diləyirəm.",
  ],
  [
    "KONUL TEACHER",
    "Əzizim Mədinə və Abdulla! Sizi bu gözəl və mənalı gün münasibətilə ürəkdən təbrik edirəm! Bu günü görmək mənim üçün də çox xüsusi və sevindiricidir. Sizi tanıyan bir müəllim kimi, həyatınızın bu yeni mərhələsinə addım atdığınızı görmək qürurverici və çox xoşdur. Həyat uzun bir yoldur — bu yolda ən vacibi bir-birinizə dayaq olmaq, anlayışlı və səbirli davranmaqdır. İnanıram ki, siz bunu bacaracaqsınız. Sevginiz sizi hər zaman qoruyacaq, ən çətin anlarda belə yol göstərəcək. Qoy evinizdən sevinc, gülüş və istilik heç vaxt əskik olmasın. Bir-birinizə hər zaman hörmətlə yanaşın, kiçik anların belə qədrini bilin. Unutmayın, xoşbəxtlik böyük şeylərdə deyil, birlikdə paylaşdığınız sadə anlarda gizlidir. Sizə ürəkdən xoşbəxt, uzun və mənalı bir ailə həyatı arzulayıram. Hər zaman üzünüz gülsün, yolunuz açıq olsun. Sizi sevən müəlliminiz 🤍 KONUL TEACHER",
  ],
  [
    "Гюнель",
    "Родная, с твоим счастливым днём! Желаю вам мира и счастья в доме. Пусть Аллах хранит ваш союз. Твоё счастье — моя радость💗🫶🏻",
  ],
];

function connectionString() {
  return process.env.POSTGRES_URL || process.env.DATABASE_URL;
}

/** Railway public proxy + most cloud hosts require TLS; local Postgres usually does not. */
function sslOption(url) {
  if (!url) return false;
  if (/sslmode=disable/i.test(url)) return false;
  if (/sslmode=require/i.test(url)) return "require";
  try {
    const normalized = url.replace(/^postgresql:/, "postgres:");
    const { hostname } = new URL(normalized);
    if (hostname === "localhost" || hostname === "127.0.0.1") return false;
  } catch {
    /* fall through */
  }
  if (/railway\.app|rlwy\.net|neon\.tech|supabase\.co|pooler/i.test(url)) {
    return "require";
  }
  return "prefer";
}

/** Attach in development so API responses explain connection / SSL / hostname issues. */
export function devErrorFields(err) {
  if (process.env.NODE_ENV !== "development") return {};
  const detail = err?.message ?? String(err);
  const fields = { detail };
  if (err?.code) fields.pgCode = err.code;
  return fields;
}

export function assertDatabaseConfigured() {
  if (!connectionString()) {
    const err = new Error(
      "POSTGRES_URL or DATABASE_URL is not set. Use Railway’s DATABASE_URL, or build a URL (see .env.example)."
    );
    err.code = "NO_DATABASE";
    throw err;
  }
}

export function getSql() {
  assertDatabaseConfigured();
  if (!sqlTag) {
    const url = connectionString();
    sqlTag = postgres(url, {
      max: 5,
      idle_timeout: 60,
      connect_timeout: 12,
      ssl: sslOption(url),
      prepare: false,
    });
  }
  return sqlTag;
}

export async function ensureSchema() {
  assertDatabaseConfigured();
  schemaPromise ??= initSchema();
  try {
    await schemaPromise;
  } catch (e) {
    schemaPromise = null;
    sqlTag = null;
    throw e;
  }
}
