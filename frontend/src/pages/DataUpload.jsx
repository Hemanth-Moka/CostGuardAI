import { useState } from 'react';
import { dataAPI, insightsAPI } from '../services/api';
import Papa from 'papaparse';
import { Upload, FileJson, Play, Info, AlertCircle, CheckCircle, Database, Server, Cloud, Boxes, Network } from 'lucide-react';

const DataUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setMessage('');

    if (selectedFile.name.endsWith('.csv')) {
      Papa.parse(selectedFile, {
        header: true,
        preview: 5,
        complete: (results) => {
          setPreview(results.data);
        },
      });
    } else if (selectedFile.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setPreview(Array.isArray(data) ? data.slice(0, 5) : [data]);
        } catch (error) {
          setMessage('Invalid JSON file');
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await dataAPI.upload(formData);
      setMessage(`Success! Uploaded ${response.data.count} records.`);
      setFile(null);
      setPreview([]);
      
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setMessage('');

    try {
      const response = await insightsAPI.analyze();
      setMessage(`Analysis complete! Found ${response.data.insightsCount} insights.`);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 relative z-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-glow flex items-center gap-3">
          <Upload className="text-primary" />
          Data Upload
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Upload your cost data for analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { name: 'AWS Cost Explorer', icon: Cloud, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
          { name: 'Azure Billing', icon: Server, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
          { name: 'ServiceNow', icon: Network, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { name: 'SAP Concur', icon: Database, color: 'text-blue-600', bg: 'bg-blue-600/10 border-blue-600/20' },
          { name: 'Jira Software', icon: Boxes, color: 'text-indigo-500', bg: 'bg-indigo-500/10 border-indigo-500/20' },
        ].map((integration, idx) => (
          <div key={idx} className={`glass-card rounded-2xl p-4 border ${integration.bg} flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform cursor-pointer relative overflow-hidden group`}>
            <div className={`absolute inset-0 bg-gradient-to-t from-black/20 dark:from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
            <integration.icon className={`${integration.color} mb-3`} size={32} />
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{integration.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Connected
            </span>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-2xl p-8 shadow-[0_0_20px_rgba(59,130,246,0.05)] border border-primary/20">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Manual Override Upload (CSV/JSON)</h2>
        
        <div className="border-2 border-dashed border-primary/30 bg-blue-50/50 dark:bg-primary/5 rounded-xl p-10 text-center hover:bg-blue-50 dark:hover:bg-primary/10 transition-colors duration-300">
          <input
            type="file"
            accept=".csv,.json"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-blue-600 text-white rounded-lg transition-colors font-medium shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          >
            <FileJson size={20} />
            Choose File
          </label>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Supported formats: <span className="text-primary">CSV, JSON</span>
          </p>
          {file && (
            <p className="text-sm text-emerald-400 mt-3 font-medium flex items-center justify-center gap-2">
              <CheckCircle size={16} />
              Selected: {file.name}
            </p>
          )}
        </div>

        {preview.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
               Preview <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">(First 5 rows)</span>
            </h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-white/10">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
                <thead className="bg-gray-50 dark:bg-white/5 backdrop-blur-sm">
                  <tr>
                    {Object.keys(preview[0]).map((key) => (
                      <th key={key} className="px-4 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-white/10">
                  {preview.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      {Object.values(row).map((val, i) => (
                        <td key={i} className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                          {String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {message && (
          <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 backdrop-blur-md border ${
            message.includes('Success') || message.includes('complete') 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
              : 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
          }`}>
            {message.includes('Success') || message.includes('complete') ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {message}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-4 justify-between border-t border-gray-200 dark:border-white/10 pt-6">
          <div className="flex gap-4">
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-blue-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
            >
              {uploading ? <Upload className="animate-bounce" size={18} /> : <Upload size={18} />}
              {uploading ? 'Uploading...' : 'Upload Manual Data'}
            </button>
          </div>
          
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="flex items-center gap-2 px-8 py-4 bg-secondary hover:bg-purple-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:-translate-y-1"
          >
            {analyzing ? <Play className="animate-spin" size={24} /> : <Play size={24} />}
            {analyzing ? 'Agents Scanning Data...' : 'Run Autonomous Agents'}
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 border-l-4 border-l-secondary bg-gradient-to-r from-secondary/5 dark:from-secondary/10 to-transparent">
        <h3 className="text-sm font-semibold text-secondary mb-3 flex items-center gap-2">
          <Info size={18} />
          Expected Data Format
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Your CSV/JSON should include these fields:</p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-secondary mt-1 text-xs">◆</span>
            <span><strong className="text-gray-900 dark:text-white">name</strong>: Tool/service name <span className="text-xs text-red-500 dark:text-red-400">(required)</span></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-secondary mt-1 text-xs">◆</span>
            <span><strong className="text-gray-900 dark:text-white">cost</strong>: Monthly cost in ₹ <span className="text-xs text-red-500 dark:text-red-400">(required)</span></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-secondary mt-1 text-xs">◆</span>
            <span><strong className="text-gray-900 dark:text-white">type</strong>: saas, vendor, or cloud</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-secondary mt-1 text-xs">◆</span>
            <span><strong className="text-gray-900 dark:text-white">vendor</strong>: Vendor name</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-secondary mt-1 text-xs">◆</span>
            <span><strong className="text-gray-900 dark:text-white">licenses</strong>: Number of licenses</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-secondary mt-1 text-xs">◆</span>
            <span><strong className="text-gray-900 dark:text-white">activeUsers</strong>: Number of active users</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-secondary mt-1 text-xs">◆</span>
            <span><strong className="text-gray-900 dark:text-white">department</strong>: Department name</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-secondary mt-1 text-xs">◆</span>
            <span><strong className="text-gray-900 dark:text-white">frequency</strong>: monthly, yearly, or one-time</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DataUpload;
