import { useState, useCallback } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  className?: string;
  children?: React.ReactNode;
  node?: any;
}

// Arabic Unicode ranges: Arabic, Arabic Supplement, Arabic Extended-A, Presentation Forms-A/B
const ARABIC_RE = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;
const STRONG_CHAR_RE = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿A-Za-z]/;

function detectCodeDir(code: string): 'rtl' | 'ltr' {
    const match = code.match(STRONG_CHAR_RE);
    if (match && ARABIC_RE.test(match[0])) return 'rtl';
    return 'ltr';
}

export const CodeBlock = ({ className, children }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const language = className?.replace(/^language-/, '') || '';
  const codeString = typeof children === 'string'
    ? children
    : String(children || '');

  const isInline = !className && !codeString.includes('\n');

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(codeString.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [codeString]);

  if (isInline) {
    return <code className={className}>{children}</code>;
  }

  const displayLang = language || 'text';

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header" dir="ltr">
        <span className="code-lang">{displayLang}</span>
        <button
          onClick={handleCopy}
          className="copy-btn"
          type="button"
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? (
            <>
              <Check size={12} />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre dir={detectCodeDir(codeString)}>
        <code className={className}>
          {children}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
