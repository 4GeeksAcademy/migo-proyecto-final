import { useState } from 'react';


export const Chatbot = () => {
  const url = import.meta.env.VITE_BACKEND_URL;

  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  async function askVet() {
    if (!question.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(`${url}/ask-vet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      if (data.response) {
        const cleanedResponse = data.response.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
        setResponse(cleanedResponse);
      } else {
        setResponse("Error : " + data.error);
      }
    } catch (error) {
      setResponse("Error de red : " + error.message);
    }

    setLoading(false);
  };

return (
  <div className="d-flex justify-content-center align-items-center py-5">
    <div className="green-light rounded shadow p-4 back-login w-100">
      <h2 className="text-center mb-4">Asistente Veterinario</h2>

      <div className="mb-3">
        <textarea
          id="questionTextarea"
          rows={4}
          placeholder="¿Qué quieres saber?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              askVet();
            }
          }}
          className="form-control"
          style={{ resize: "none" }}
        />
      </div>

      <button
        onClick={askVet}
        className="btn w-100 text-white fw-bold bg-secondary mb-3"
        disabled={loading}
      >
        {loading ? 'Cargando...' : 'Preguntar'}
      </button>

      {response && (
        <div className="bg-white p-3 rounded border">
          <p className="mb-0">{response}</p>
        </div>
      )}
    </div>
  </div>
);

}