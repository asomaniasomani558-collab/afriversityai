import React, { useState, useMemo } from "react";
import { Copy, Check, Terminal, FileCode, Code2, WrapText, Cpu } from "lucide-react";
import Prism from "prismjs";

// Import common Prism syntax grammars
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-java";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-go";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-latex";
import "prismjs/components/prism-matlab";

interface CodeBlockProps {
  language?: string;
  code: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  language = "text",
  code,
  className = "",
}) => {
  const [copied, setCopied] = useState(false);
  const [wrapLines, setWrapLines] = useState(false);

  // Normalize language alias
  const normalizedLang = useMemo(() => {
    const raw = (language || "").toLowerCase().trim();
    if (["py", "python3"].includes(raw)) return "python";
    if (["js", "node"].includes(raw)) return "javascript";
    if (["ts"].includes(raw)) return "typescript";
    if (["cpp", "c++", "cc", "cxx"].includes(raw)) return "cpp";
    if (["c#", "cs"].includes(raw)) return "csharp";
    if (["rs"].includes(raw)) return "rust";
    if (["golang"].includes(raw)) return "go";
    if (["sh", "zsh", "shell", "terminal"].includes(raw)) return "bash";
    if (["yml"].includes(raw)) return "yaml";
    if (["md"].includes(raw)) return "markdown";
    if (["m", "octave"].includes(raw)) return "matlab";
    return raw || "text";
  }, [language]);

  // Highlight code safely with Prism
  const highlightedHtml = useMemo(() => {
    const cleanCode = code.replace(/\n$/, "");
    try {
      const grammar = Prism.languages[normalizedLang] || Prism.languages.text;
      if (grammar) {
        return Prism.highlight(cleanCode, grammar, normalizedLang);
      }
    } catch {
      // fallback to plain escape
    }
    return cleanCode
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }, [code, normalizedLang]);

  const lineCount = useMemo(() => {
    return code.trim().split("\n").length;
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.replace(/\n$/, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguageLabel = (lang: string) => {
    switch (lang) {
      case "python":
        return "Python (STEM / AI)";
      case "typescript":
      case "ts":
        return "TypeScript";
      case "javascript":
      case "js":
        return "JavaScript";
      case "cpp":
        return "C++ (Embedded / VLSI)";
      case "c":
        return "C (Systems)";
      case "rust":
        return "Rust (High Perf)";
      case "go":
        return "Go (Microservices)";
      case "java":
        return "Java (Enterprise)";
      case "sql":
        return "SQL (Analytics)";
      case "bash":
        return "Terminal / Shell";
      case "matlab":
        return "MATLAB / Simulation";
      case "latex":
        return "LaTeX Formula";
      case "json":
        return "JSON Data";
      default:
        return lang ? lang.toUpperCase() : "CODE";
    }
  };

  const getLanguageIcon = (lang: string) => {
    if (["bash", "sh", "shell", "terminal"].includes(lang)) {
      return <Terminal size={13} className="text-[#a855f7]" />;
    }
    if (["cpp", "c", "rust"].includes(lang)) {
      return <Cpu size={13} className="text-[#38bdf8]" />;
    }
    return <Code2 size={13} className="text-[#f59e0b]" />;
  };

  return (
    <div
      className={`my-3 rounded-2xl overflow-hidden border border-[#3b2d54]/70 bg-[#0d0914] shadow-[0_8px_25px_rgba(0,0,0,0.6)] group/code ${className}`}
    >
      {/* Code Header Bar */}
      <div className="bg-[#171026] px-3.5 sm:px-4 py-2 flex items-center justify-between border-b border-[#3b2d54]/60 text-xs text-[#e9d5ff]">
        {/* Left: Language badge & line count */}
        <div className="flex items-center gap-2 font-mono">
          <span className="p-1 rounded-lg bg-[#27173e] border border-[#6b21a8]/40 flex items-center justify-center">
            {getLanguageIcon(normalizedLang)}
          </span>
          <span className="font-bold text-[#f5f3ff] text-[11px] sm:text-xs tracking-wide">
            {getLanguageLabel(normalizedLang)}
          </span>
          <span className="hidden sm:inline-block text-[10px] text-[#a78bfa]/70 bg-[#25173c] px-2 py-0.5 rounded-full border border-[#4c1d95]/40 font-sans">
            {lineCount} {lineCount === 1 ? "line" : "lines"}
          </span>
        </div>

        {/* Right: Actions (Wrap toggle + Copy Code Button) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Wrap lines toggle */}
          <button
            type="button"
            onClick={() => setWrapLines(!wrapLines)}
            className={`p-1.5 rounded-lg text-xs transition-colors hidden sm:flex items-center gap-1 ${
              wrapLines
                ? "bg-[#6b21a8]/40 text-[#f5f3ff] border border-[#a855f7]/50"
                : "text-[#a78bfa]/70 hover:text-[#f5f3ff] hover:bg-[#25173c]"
            }`}
            title={wrapLines ? "Disable wrap" : "Enable word wrap"}
          >
            <WrapText size={13} />
          </button>

          {/* Copy Code Button */}
          <button
            type="button"
            onClick={handleCopy}
            id="copy-code-btn"
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              copied
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                : "bg-[#25173c] hover:bg-[#3b1b63] text-[#e9d5ff] hover:text-white border border-[#6b21a8]/50 hover:border-[#a855f7]/70"
            }`}
            title="Copy Code snippet to clipboard"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-400" />
                <span className="text-[11px] font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={13} className="text-[#c084fc]" />
                <span className="text-[11px]">Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="relative">
        <pre
          className={`p-4 text-xs font-mono leading-relaxed overflow-x-auto selection:bg-[#7c3aed]/40 ${
            wrapLines ? "whitespace-pre-wrap break-words" : "whitespace-pre"
          }`}
          tabIndex={0}
        >
          <code
            className={`language-${normalizedLang}`}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </pre>
      </div>
    </div>
  );
};
