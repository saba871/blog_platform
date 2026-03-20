import React, { useState } from 'react';
import { LuCheck, LuCode, LuCopy } from 'react-icons/lu';
import ReactMarkDown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkDownContent = ({ content }) => {
  if (!content) return null;

  return (
    <div className="w-full max-w-none">
      <div className="text-[15.5px] leading-[1.85] text-gray-700">
        <ReactMarkDown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : '';
              const isInLine = !className;

              return !isInLine ? (
                <CodeBlock
                  code={String(children).replace(/\n$/, '')}
                  language={language}
                />
              ) : (
                <code
                  className="bg-violet-50 text-violet-700 text-[13px] font-mono px-1.5 py-0.5 rounded-md border border-violet-100"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            p({ children }) {
              return (
                <p className="mb-5 text-gray-700 leading-[1.85] tracking-[0.01em]">
                  {children}
                </p>
              );
            },
            strong({ children }) {
              return (
                <strong className="font-semibold text-gray-900">
                  {children}
                </strong>
              );
            },
            em({ children }) {
              return <em className="italic text-gray-600">{children}</em>;
            },
            ul({ children }) {
              return (
                <ul className="mb-5 pl-6 space-y-1.5 list-none">{children}</ul>
              );
            },
            ol({ children }) {
              return (
                <ol className="mb-5 pl-6 space-y-1.5 list-decimal marker:text-violet-400 marker:font-semibold">
                  {children}
                </ol>
              );
            },
            li({ children }) {
              return (
                <li className="relative pl-2 text-gray-700 before:content-[''] before:absolute before:-left-3 before:top-[0.6em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-violet-300">
                  {children}
                </li>
              );
            },
            blockquote({ children }) {
              return (
                <blockquote className="my-6 pl-5 border-l-[3px] border-violet-400 bg-violet-50/50 py-3 pr-4 rounded-r-lg text-gray-600 italic">
                  {children}
                </blockquote>
              );
            },
            h1({ children }) {
              return (
                <h1 className="text-2xl font-bold text-gray-900 mt-10 mb-4 pb-3 border-b border-gray-100 tracking-tight leading-tight">
                  {children}
                </h1>
              );
            },
            h2({ children }) {
              return (
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3 tracking-tight leading-snug">
                  {children}
                </h2>
              );
            },
            h3({ children }) {
              return (
                <h3 className="text-base font-semibold text-violet-700 uppercase tracking-widest mt-7 mb-2">
                  {children}
                </h3>
              );
            },
            h4({ children }) {
              return (
                <h4 className="text-base font-semibold text-gray-800 mt-5 mb-2">
                  {children}
                </h4>
              );
            },
            a({ children, href }) {
              return (
                <a
                  href={href}
                  className="text-violet-600 underline underline-offset-2 decoration-violet-300 hover:text-violet-800 hover:decoration-violet-500 transition-colors duration-150"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              );
            },
            table({ children }) {
              return (
                <div className="my-6 overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full text-sm text-left">{children}</table>
                </div>
              );
            },
            thead({ children }) {
              return (
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  {children}
                </thead>
              );
            },
            tbody({ children }) {
              return (
                <tbody className="divide-y divide-gray-100 bg-white">
                  {children}
                </tbody>
              );
            },
            tr({ children }) {
              return (
                <tr className="hover:bg-gray-50 transition-colors duration-100">
                  {children}
                </tr>
              );
            },
            th({ children }) {
              return (
                <th className="px-4 py-3 font-semibold text-gray-600">
                  {children}
                </th>
              );
            },
            td({ children }) {
              return <td className="px-4 py-3 text-gray-700">{children}</td>;
            },
            hr() {
              return (
                <hr className="my-8 border-none h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              );
            },
            img({ src, alt }) {
              return (
                <img
                  src={src}
                  alt={alt}
                  className="w-full rounded-xl my-6 object-cover shadow-md border border-gray-100"
                />
              );
            },
          }}
        >
          {content}
        </ReactMarkDown>
      </div>
    </div>
  );
};

export default MarkDownContent;

const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-6 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          {/* Traffic lights */}
          <span className="w-3 h-3 rounded-full bg-red-400 opacity-80" />
          <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-80" />
          <span className="w-3 h-3 rounded-full bg-green-400 opacity-80" />
          <span className="ml-3 flex items-center gap-1.5 text-xs font-mono font-medium text-gray-400 uppercase tracking-widest">
            <LuCode size={13} />
            {language || 'code'}
          </span>
        </div>

        <button
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors duration-150 focus:outline-none"
          onClick={copyCode}
          aria-label="Copy Code"
        >
          {copied ? (
            <>
              <LuCheck size={14} className="text-green-500" />
              <span className="text-green-500 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <LuCopy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <SyntaxHighlighter
        language={language}
        style={oneLight}
        customStyle={{
          fontSize: 13,
          margin: 0,
          padding: '1.1rem 1.25rem',
          background: 'transparent',
          lineHeight: 1.7,
        }}
        showLineNumbers={code.split('\n').length > 5}
        lineNumberStyle={{ color: '#d1d5db', fontSize: 11, minWidth: '2rem' }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};
