import express from "express";

const app = express();

app.use(express.json({ limit: "1mb" }));

// Разрешаем запросы с сайта OGE Trainer
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://dilyara-boop.github.io");
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

// Supabase publishable key: public key, not service_role.
const SUPABASE_URL = 'https://hwggubjyeavxgyoqqelw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_6EzzcMnrKlFWXkVaSP3jzA_gV9Eq5tT';

async function getAssistantMode(req) {
  const bearer = /^Bearer (.+)$/i.exec(req.get('Authorization') || '');
  if (bearer) {
    const response = await fetch(SUPABASE_URL + '/auth/v1/user', {
      headers: {apikey: SUPABASE_KEY, Authorization: 'Bearer ' + bearer[1]}
    });
    if (!response.ok) return null;
    const profile = await response.json();
    return profile?.user_metadata?.role === 'teacher' ? 'teacher' : 'student';
  }
  const code = String(req.body?.student_code || '').trim().toUpperCase();
  if (!/^[A-Z2-9]{1,20}$/.test(code)) return null;
  const response = await fetch(SUPABASE_URL + '/rest/v1/rpc/student_login', {
    method: 'POST',
    headers: {apikey: SUPABASE_KEY, 'Content-Type': 'application/json'},
    body: JSON.stringify({input_code: code})
  });
  if (!response.ok) return null;
  const students = await response.json();
  return Array.isArray(students) && students.length > 0 ? 'student' : null;
}

const teacherPrompt = `Ты ИИ-методист EnglishUp OGE Trainer для преподавателя английского языка.
Помогай составлять задания и планы уроков, анализировать ошибки, объяснять критерии ОГЭ.
При проверке письма и говорения указывай предварительный характер оценки; не выдумывай
ответы ученика или результаты. Если материалов недостаточно, попроси их предоставить.
Не запрашивай имена, контакты и другие персональные данные учеников.`;
const studentPrompt = `Ты доброжелательный ИИ-репетитор EnglishUp OGE Trainer для школьника.
Помогай готовиться к ОГЭ по английскому: объясняй грамматику, переводи слова,
давай подсказки и упражнения. Не выполняй экзаменационное задание полностью
вместо ученика: сначала помоги разобраться, дай пример и попроси попробовать.`;

// ИИ-помощник
app.post("/api/assistant", async (req, res) => {
  try {
    const question = String(req.body?.message || req.body?.question || "").trim();
    if (!question || question.length > 2000) return res.status(400).json({error: 'Введите вопрос до 2000 символов'});
    const mode = await getAssistantMode(req);
    if (!mode) return res.status(401).json({error: 'Войди в аккаунт, чтобы пользоваться помощником'});

    const authKey = process.env.GIGACHAT_AUTH_KEY;
    if (!authKey) return res.status(500).json({error: 'GIGACHAT_AUTH_KEY не настроен'});
    const tokenResponse = await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
      method: 'POST',
      headers: {Authorization: `Basic ${authKey}`, 'Content-Type': 'application/x-www-form-urlencoded', RqUID: crypto.randomUUID()},
      body: 'scope=GIGACHAT_API_PERS'
    });
    if (!tokenResponse.ok) {
      console.error('GigaChat OAuth error:', tokenResponse.status);
      return res.status(502).json({error: 'Не удалось авторизоваться в GigaChat'});
    }
    const tokenData = await tokenResponse.json();
    const gigaResponse = await fetch('https://gigachat.devices.sberbank.ru/api/v1/chat/completions', {
      method: 'POST',
      headers: {Authorization: `Bearer ${tokenData.access_token}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({
        model: 'GigaChat',
        messages: [{role:'system', content: mode === 'teacher' ? teacherPrompt : studentPrompt}, {role:'user', content:question}],
        temperature: 0.7
      })
    });
    if (!gigaResponse.ok) {
      console.error('GigaChat API error:', gigaResponse.status);
      return res.status(502).json({error: 'GigaChat временно не ответил'});
    }
    const data = await gigaResponse.json();
    const answer = data?.choices?.[0]?.message?.content;
    if (!answer) return res.status(502).json({error: 'GigaChat вернул пустой ответ'});
    return res.json({answer});
  } catch (error) {
    console.error('Assistant error:', error);
    return res.status(500).json({error: 'Ошибка ИИ-помощника'});
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`EnglishUp OGE AI server started on port ${PORT}`);
});
