import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import { CodeBlock } from './CodeBlock';
import '../../styles/preview.css';

interface PreviewPaneProps {
    content: string;
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({ content }) => {
    return (
        <div className="w-full h-full overflow-y-auto bg-bg-primary">
            <div className="preview-content max-w-3xl mx-auto pb-24">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSanitize, rehypeHighlight]}
                    components={{
                        code({ node, ...props }) {
                            return <CodeBlock {...props} />;
                        }
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
};
