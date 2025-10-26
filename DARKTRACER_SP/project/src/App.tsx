import { useState } from 'react';
import { Send, Trash2, Copy, Download } from 'lucide-react';

interface RequestHistory {
  id: string;
  method: string;
  url: string;
  timestamp: string;
  status?: number;
  response?: string;
}

function App() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState('');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [history, setHistory] = useState<RequestHistory[]>([]);

  const sendRequest = async () => {
    if (!url) {
      alert('Please enter a URL');
      return;
    }

    setLoading(true);
    setResponse('');
    setStatusCode(null);

    try {
      const options: RequestInit = {
        method: method,
      };

      // Parse headers
      if (headers.trim()) {
        try {
          const headersObj = JSON.parse(headers);
          options.headers = headersObj;
        } catch (e) {
          alert('Invalid JSON in headers');
          setLoading(false);
          return;
        }
      }

      // Add body for POST/PUT/PATCH
      if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
        options.body = body;
        if (!options.headers) {
          options.headers = {};
        }
        (options.headers as Record<string, string>)['Content-Type'] = 'application/json';
      }

      const res = await fetch(url, options);
      const data = await res.text();

      setStatusCode(res.status);
      setResponse(data);

      // Add to history
      const historyItem: RequestHistory = {
        id: Date.now().toString(),
        method,
        url,
        timestamp: new Date().toLocaleString(),
        status: res.status,
        response: data,
      };
      setHistory([historyItem, ...history]);

    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const copyResponse = () => {
    navigator.clipboard.writeText(response);
  };

  const downloadResponse = () => {
    const blob = new Blob([response], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `response-${Date.now()}.json`;
    a.click();
  };

  const loadFromHistory = (item: RequestHistory) => {
    setMethod(item.method);
    setUrl(item.url);
    if (item.response) {
      setResponse(item.response);
      setStatusCode(item.status || null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">API Tester</h1>
            <p className="text-slate-600">Send HTTP requests and test APIs</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Request Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Request Builder */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Request</h2>

                {/* Method and URL */}
                <div className="flex gap-3 mb-4">
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                    <option value="DELETE">DELETE</option>
                  </select>

                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://api.example.com/endpoint"
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    onClick={sendRequest}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                  >
                    <Send size={18} />
                    Send
                  </button>
                </div>

                {/* Headers */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Headers (JSON)
                  </label>
                  <textarea
                    value={headers}
                    onChange={(e) => setHeaders(e.target.value)}
                    placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    rows={3}
                  />
                </div>

                {/* Body */}
                {['POST', 'PUT', 'PATCH'].includes(method) && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Body (JSON)
                    </label>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder='{"key": "value"}'
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      rows={6}
                    />
                  </div>
                )}
              </div>

              {/* Response Panel */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-slate-800">Response</h2>
                    {statusCode && (
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          statusCode >= 200 && statusCode < 300
                            ? 'bg-green-100 text-green-800'
                            : statusCode >= 400
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {statusCode}
                      </span>
                    )}
                  </div>
                  {response && (
                    <div className="flex gap-2">
                      <button
                        onClick={copyResponse}
                        className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Copy response"
                      >
                        <Copy size={18} />
                      </button>
                      <button
                        onClick={downloadResponse}
                        className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Download response"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  )}
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : response ? (
                  <pre className="bg-slate-50 p-4 rounded-lg overflow-auto max-h-96 text-sm font-mono border border-slate-200">
                    {response}
                  </pre>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    No response yet. Send a request to see the response here.
                  </div>
                )}
              </div>
            </div>

            {/* History Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-800">History</h2>
                  {history.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Clear history"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                {history.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-8">
                    No requests yet
                  </p>
                ) : (
                  <div className="space-y-2 max-h-[calc(100vh-12rem)] overflow-y-auto">
                    {history.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => loadFromHistory(item)}
                        className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                            {item.method}
                          </span>
                          {item.status && (
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                item.status >= 200 && item.status < 300
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {item.status}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 truncate mb-1">
                          {item.url}
                        </p>
                        <p className="text-xs text-slate-400">{item.timestamp}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
