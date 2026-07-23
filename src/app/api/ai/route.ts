import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt, context } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Falta el prompt o idea inicial.' }, { status: 400 });
    }

    const openAiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!openAiKey && !geminiKey) {
      return NextResponse.json(
        { error: 'No se encontraron las credenciales de IA. Agrega OPENAI_API_KEY o GEMINI_API_KEY en tu archivo .env.local' },
        { status: 500 }
      );
    }

    const systemPrompt = `Eres un experto redactor publicitario especializado en marketing de florerías premium (Chileflor). 
Tu trabajo es escribir textos emotivos, persuasivos y elegantes. 
Contexto del texto a escribir: ${context}.
Debes generar exactamente 3 opciones separadas por un triple guion (---) y NADA MÁS. No incluyas explicaciones adicionales, ni números, solo los textos puros.
Ejemplo de formato:
Texto opción 1
---
Texto opción 2
---
Texto opción 3`;

    let generatedText = '';
    let success = false;
    let errorMessage = '';

    if (openAiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Escribe sobre: ${prompt}` }
            ],
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`OpenAI Error: ${errorData.error?.message || 'Error desconocido'}`);
        }

        const data = await response.json();
        generatedText = data.choices[0].message.content;
        success = true;
      } catch (err: any) {
        console.error('Fallo OpenAI:', err.message);
        errorMessage = err.message;
      }
    }

    if (!success && geminiKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${systemPrompt}\n\nEscribe sobre: ${prompt}`
              }]
            }]
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Gemini Error: ${errorData.error?.message || 'Error desconocido'}`);
        }

        const data = await response.json();
        generatedText = data.candidates[0].content.parts[0].text;
        success = true;
      } catch (err: any) {
        console.error('Fallo Gemini:', err.message);
        errorMessage = err.message || errorMessage;
      }
    }

    if (!success) {
      throw new Error(`No se pudo generar texto con ninguna API. Último error: ${errorMessage}`);
    }

    // Limpiar y separar opciones
    const options = generatedText.split('---').map(o => o.trim()).filter(o => o.length > 0);

    return NextResponse.json({ options });
  } catch (error: any) {
    console.error('Error generando IA:', error);
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
  }
}
