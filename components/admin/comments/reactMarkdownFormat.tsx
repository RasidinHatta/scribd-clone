import React from 'react'
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { PrismAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { CommentType } from '@/types';

interface ReactMarkdownProps {
    content: string
}

const ReactMarkdownFormat = ({
    content
}: ReactMarkdownProps) => {
    return (
        <div className="col-span-3 text-sm prose max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    code({ node, className, children, ...props }) {
                        const isInline = (props as any).inline;
                        const match = /language-(\w+)/.exec(className || "");
                        return !isInline && match ? (
                            <SyntaxHighlighter
                                language={match[1]}
                                // @ts-ignore
                                style={oneDark}
                                customStyle={{ backgroundColor: "transparent" }}
                                PreTag="div"
                                className="rounded-md text-sm my-2"
                                {...props}
                            >
                                {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                        ) : (
                            <code className="bg-muted px-1 py-0.5 rounded text-sm">
                                {children}
                            </code>
                        );
                    },
                    a({ node, href, children, ...props }) {
                        return (
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                                {...props}
                            >
                                {children}
                            </a>
                        );
                    },
                    blockquote({ node, children, ...props }) {
                        return (
                            <blockquote className="border-l-4 border-muted-foreground pl-3 italic my-2">
                                {children}
                            </blockquote>
                        );
                    },
                    ul({ node, children, ...props }) {
                        return (
                            <ul className="list-disc pl-5 my-2" {...props}>
                                {children}
                            </ul>
                        );
                    },
                    ol({ node, children, ...props }) {
                        return (
                            <ol className="list-decimal pl-5 my-2" {...props}>
                                {children}
                            </ol>
                        );
                    },
                    h1({ node, children, ...props }) {
                        return (
                            <h1 className="text-xl font-bold my-2" {...props}>
                                {children}
                            </h1>
                        );
                    },
                    h2({ node, children, ...props }) {
                        return (
                            <h2 className="text-lg font-bold my-2" {...props}>
                                {children}
                            </h2>
                        );
                    },
                    h3({ node, children, ...props }) {
                        return (
                            <h3 className="text-base font-bold my-2" {...props}>
                                {children}
                            </h3>
                        );
                    },
                    strong({ node, children, ...props }) {
                        return (
                            <strong className="font-semibold" {...props}>
                                {children}
                            </strong>
                        );
                    },
                    em({ node, children, ...props }) {
                        return (
                            <em className="italic" {...props}>
                                {children}
                            </em>
                        );
                    },
                    table({ node, children, ...props }) {
                        return (
                            <div className="overflow-x-auto my-2">
                                <table
                                    className="w-full border-collapse border border-muted-foreground/20"
                                    {...props}  // Spread props here
                                >
                                    {children}
                                </table>
                            </div>
                        );
                    },
                    thead({ node, children, ...props }) {
                        return (
                            <thead
                                className="bg-muted/50"
                                {...props}  // Spread props here
                            >
                                {children}
                            </thead>
                        );
                    },
                    tbody({ node, children, ...props }) {
                        return (
                            <tbody {...props}>
                                {children}
                            </tbody>
                        );
                    },
                    tr({ node, children, ...props }) {
                        return (
                            <tr
                                className="border-b border-muted-foreground/20"
                                {...props}  // Spread props here
                            >
                                {children}
                            </tr>
                        );
                    },
                    th({ node, children, ...props }) {
                        return (
                            <th
                                className="p-2 text-left font-semibold border-r border-muted-foreground/20 last:border-r-0"
                                {...props}
                            >
                                {children}
                            </th>
                        );
                    },
                    td({ node, children, ...props }) {
                        return (
                            <td
                                className="p-2 border-r border-muted-foreground/20 last:border-r-0"
                                {...props}
                            >
                                {children}
                            </td>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}

export default ReactMarkdownFormat