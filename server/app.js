import express from "express";
const app = express();
const SUPABASE_URL = 'https://hwggubjyeavxgyoqqelw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_6EzzcMnrKlFWXkVaSP3jzA_gV9Eq5tT';
const studentPrompt = 'Ты дружелюбный ИИ-помощник EnglishUp OGE Trainer. Помогай школьникам готовиться к ОГЭ по английскому языку. Объясняй понятно и кратко. Не выполняй экзаменационное задание полностью вместо ученика: сначала помоги разобраться, дай подсказку и пример.';

const teacherPrompt = `Ты — профессиональный эксперт и методист по подготовке к ОГЭ по английскому языку.

Твоя задача — помогать преподавателю проверять работы учеников, создавать задания и анализировать ошибки.

ПРИ ПРОВЕРКЕ ЭЛЕКТРОННОГО ПИСЬМА (задание 35) используй критерии ФИПИ ОГЭ 2026.

МАКСИМУМ — 10 БАЛЛОВ:

К1. Решение коммуникативной задачи — 0–3 балла.
Проверь ответы на все три вопроса, полноту и точность ответов, соблюдение норм вежливости, правильность обращения, заключительной фразы и подписи.

К2. Организация текста — 0–2 балла.
Проверь логичность, деление на абзацы, средства связи, структуру и оформление личного письма.

К3. Лексико-грамматическое оформление — 0–3 балла.
Проверь грамматику, лексику, правильность конструкций и соответствие языковых средств уровню задания.

К4. Орфография и пунктуация — 0–2 балла.
Отдельно посчитай орфографические и пунктуационные ошибки.

ВАЖНЫЕ ПРАВИЛА:
1. Нормативный объём письма — 100–120 слов.
2. Если менее 90 слов — 0 баллов по всем критериям.
3. Если более 132 слов — проверяй только первые 120 слов.
4. Считай обращение и подпись.
5. Если К1 получает 0 баллов, итог по всем критериям — 0.
6. Не придумывай ошибки и не снижай баллы за допустимые варианты английского языка.
7. Не путай стилистические предпочтения с реальными ошибками.
8. Если не предоставлено условие задания с тремя вопросами, не выставляй окончательный балл за К1. Попроси условие.
9. Для каждой найденной ошибки приводи исходный фрагмент, исправление и краткое объяснение.
10. Обосновывай каждый выставленный балл.

ФОРМАТ ОТВЕТА:

1. ОБЩИЙ РЕЗУЛЬТАТ
Итог: X/10 баллов.
Количество слов: X.
Предварительный уровень выполнения.

2. ОЦЕНКА ПО КРИТЕРИЯМ
К1 — X/3: обоснование.
К2 — X/2: обоснование.
К3 — X/3: обоснование.
К4 — X/2: обоснование.

3. РАЗБОР ОШИБОК
Таблица:
Исходный фрагмент | Исправление | Объяснение.

4. ЧТО ПОЛУЧИЛОСЬ ХОРОШО
Отметь сильные стороны письма.

5. ЧТО НУЖНО УЛУЧШИТЬ
Дай конкретные рекомендации ученику.

6. УЛУЧШЕННЫЙ ВАРИАНТ
Покажи исправленное письмо, сохранив первоначальный смысл и индивидуальный стиль ученика.

Отвечай по-русски, примеры и исправления давай на английском.
Будь доброжелательным, но объективным. Не завышай и не занижай оценки.
Всегда указывай, что оценка ИИ предварительная и окончательное решение принимает преподаватель.

При других запросах преподавателя выполняй методические задачи, создавай оригинальные задания ОГЭ, планы уроков и объяснения.`;


async function verifiedMode(req) {
  const header = req.get('Authorization') || '';
  const match = /^Bearer\s+(.+)$/i.exec(header);
  if (!match) return 'student';
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${match[1]}` }
  });
  if (!response.ok) return 'student';
  const user = await response.json();
  return user?.user_metadata?.role === 'teacher' ? 'teacher' : 'student';
}


app.use(express.json({ limit: "1mb" }));

// Разрешаем запросы с сайта OGE Trainer
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// Проверка, что сервер работает
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "EnglishUp OGE AI" });
});

// ИИ-помощник
app.post("/api/assistant", async (req, res) => {
  try {
    const question = String(
      req.body?.message || req.body?.question || ""
    ).trim();

    if (!question) {
      return res.status(400).json({
        error: "Введите вопрос"
      });
    }

    const authKey = process.env.GIGACHAT_AUTH_KEY;

    if (!authKey) {
      return res.status(500).json({
        error: "GIGACHAT_AUTH_KEY не настроен"
      });
    }

    const mode = await verifiedMode(req);

    // Получаем access token GigaChat
    const tokenResponse = await fetch(
      "https://ngw.devices.sberbank.ru:9443/api/v2/oauth",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${authKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
          RqUID: crypto.randomUUID()
        },
        body: "scope=GIGACHAT_API_PERS"
      }
    );

    if (!tokenResponse.ok) {
      const details = await tokenResponse.text();

      console.error("GigaChat OAuth error:", details);

      return res.status(502).json({
        error: "Не удалось авторизоваться в GigaChat"
      });
    }

    const tokenData = await tokenResponse.json();

    // Отправляем вопрос в GigaChat
    const gigaResponse = await fetch(
      "https://gigachat.devices.sberbank.ru/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "GigaChat",
         
messages: [
  {
    role: "system",
    content: mode === 'teacher' ? teacherPrompt : studentPrompt
  },
  ...(Array.isArray(req.body?.history) ? req.body.history : [])
    .filter(item =>
      item &&
      ['user', 'assistant'].includes(item.role) &&
      typeof item.text === 'string'
    )
    .slice(-6)
    .map(item => ({
      role: item.role,
      content: item.text.slice(0, 6000)
    })),
  {
    role: "user",
    content: question
  }
],

          temperature: 0.7
        })
      }
    );

    if (!gigaResponse.ok) {
      const details = await gigaResponse.text();

      console.error("GigaChat API error:", details);

      return res.status(502).json({
        error: "GigaChat временно не ответил"
      });
    }

    const data = await gigaResponse.json();
    const answer = data?.choices?.[0]?.message?.content;

    if (!answer) {
      return res.status(502).json({
        error: "GigaChat вернул пустой ответ"
      });
    }

    res.json({ answer });
  } catch (error) {
    console.error("Assistant error:", error);

    res.status(500).json({
      error: "Ошибка ИИ-помощника"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`EnglishUp OGE AI server started on port ${PORT}`);
});
