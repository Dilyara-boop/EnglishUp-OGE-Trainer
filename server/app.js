import express from "express";

const app = express();

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
              content:
                "Ты дружелюбный ИИ-помощник EnglishUp OGE Trainer. Помогай школьникам готовиться к ОГЭ по английскому языку. Объясняй понятно и кратко. Не выполняй экзаменационное задание полностью вместо ученика: сначала помоги разобраться, дай подсказку и пример."
            },
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
