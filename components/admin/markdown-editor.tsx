"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Eye,
  Edit,
  FileText,
  Code,
  Bold,
  Italic,
  LinkIcon,
  ImageIcon,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Upload,
} from "lucide-react";
import { marked } from "marked";
import TurndownService from "turndown";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  label?: string;
  required?: boolean;
  mode: "html" | "markdown";
  onModeChange: (mode: "html" | "markdown") => void;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your content...",
  rows = 12,
  className = "",
  label = "Content",
  required = false,
  mode,
  onModeChange,
}: MarkdownEditorProps) {
  const [previewHtml, setPreviewHtml] = useState("");
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkError, setLinkError] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [originalContent, setOriginalContent] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const htmlTextareaRef = useRef<HTMLTextAreaElement>(null);
  const markdownTextareaRef = useRef<HTMLTextAreaElement>(null);
  const turndownService = useRef<TurndownService | null>(null);

  useEffect(() => {
    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    turndownService.current = new TurndownService({
      headingStyle: "atx",
      bulletListMarker: "-",
      codeBlockStyle: "fenced",
      fence: "```",
      emDelimiter: "*",
      strongDelimiter: "**",
      linkStyle: "inlined",
      linkReferenceStyle: "full",
    });

    // Configure TurndownService rules for better conversion
    if (turndownService.current) {
      // Handle line breaks properly
      turndownService.current.addRule("lineBreak", {
        filter: "br",
        replacement: () => "\n",
      });

      // Handle paragraphs with proper spacing
      turndownService.current.addRule("paragraph", {
        filter: "p",
        replacement: (content) => "\n\n" + content + "\n\n",
      });
    }
  }, []);

  useEffect(() => {
    if (value) {
      try {
        if (mode === "markdown") {
          const html = marked(value);
          setPreviewHtml(html as string);
        } else {
          // For HTML mode, use the content directly for preview
          setPreviewHtml(value);
        }
      } catch (error) {
        setPreviewHtml("<p>Error parsing content</p>");
      }
    } else {
      setPreviewHtml("");
    }
  }, [value, mode]);

  const handleModeToggle = async (newMode: "html" | "markdown") => {
    if (newMode === mode) return;

    setIsConverting(true);

    try {
      if (newMode === "markdown" && mode === "html" && value.trim()) {
        // Convert HTML to Markdown when switching to markdown mode
        if (turndownService.current) {
          const markdownContent = turndownService.current.turndown(value);
          onChange(markdownContent);
        }
      } else if (newMode === "html" && mode === "markdown" && value.trim()) {
        // Convert Markdown to HTML when switching to HTML mode
        const htmlContent = marked(value);
        onChange(htmlContent);
      }
    } catch (error) {
      console.error("Error converting content:", error);
      // If conversion fails, keep the original content
    } finally {
      setIsConverting(false);
      onModeChange(newMode);
    }
  };

  const getCurrentTextarea = () => {
    const textarea =
      mode === "html" ? htmlTextareaRef.current : markdownTextareaRef.current;

    // Fallback: try to find textarea by DOM query if ref is null
    if (!textarea) {
      const domTextarea = document.querySelector(
        'textarea[id="content"]'
      ) as HTMLTextAreaElement;
      return domTextarea;
    }

    return textarea;
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleTextareaSelect = (
    e: React.SyntheticEvent<HTMLTextAreaElement>
  ) => {
    // No changes needed here
  };

  const insertAtCursor = (text: string, selectText = false) => {
    const textarea = getCurrentTextarea();
    if (!textarea) {
      return;
    }

    textarea.focus();

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newValue = value.substring(0, start) + text + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      if (selectText) {
        const selectStart = start + text.indexOf(selectText);
        const selectEnd = selectStart + selectText.length;
        textarea.setSelectionRange(selectStart, selectEnd);
      } else {
        const newCursorPos = start + text.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const wrapSelectedText = (before: string, after: string = before) => {
    const textarea = getCurrentTextarea();
    if (!textarea) {
      return;
    }

    textarea.focus();

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    if (selectedText) {
      const newText = before + selectedText + after;
      const newValue =
        value.substring(0, start) + newText + value.substring(end);
      onChange(newValue);

      setTimeout(() => {
        textarea.setSelectionRange(start + before.length, end + before.length);
      }, 0);
    } else {
      const placeholder = "text";
      const newText = before + placeholder + after;
      const newValue =
        value.substring(0, start) + newText + value.substring(end);
      onChange(newValue);

      setTimeout(() => {
        textarea.setSelectionRange(
          start + before.length,
          start + before.length + placeholder.length
        );
      }, 0);
    }
  };

  const getSelectedText = () => {
    const textarea = getCurrentTextarea();
    if (!textarea) return "";

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    return value.substring(start, end);
  };

  const openLinkDialog = () => {
    const selectedText = getSelectedText();
    setLinkText(selectedText);
    setLinkUrl("");
    setLinkError("");
    setLinkDialogOpen(true);
  };

  const formatBold = () => {
    if (mode === "html") {
      wrapSelectedText("<strong>", "</strong>");
    } else {
      wrapSelectedText("**", "**");
    }
  };

  const formatItalic = () => {
    if (mode === "html") {
      wrapSelectedText("<em>", "</em>");
    } else {
      wrapSelectedText("*", "*");
    }
  };

  const formatCode = () => {
    if (mode === "html") {
      wrapSelectedText("<code>", "</code>");
    } else {
      wrapSelectedText("`", "`");
    }
  };

  const formatQuote = () => {
    const textarea = getCurrentTextarea();
    if (!textarea) {
      return;
    }

    textarea.focus();

    if (mode === "html") {
      wrapSelectedText("<blockquote>", "</blockquote>");
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const lines = value.split("\n");
    const startLine = value.substring(0, start - 1).split("\n").length - 1;
    const endLine = value.substring(0, end).split("\n").length - 1;

    for (let i = startLine; i <= endLine; i++) {
      if (lines[i] !== undefined && !lines[i].startsWith("> ")) {
        lines[i] = "> " + lines[i];
      }
    }

    onChange(lines.join("\n"));
    setTimeout(() => {
      textarea.focus();
    }, 0);
  };

  const formatHeading = (level: number) => {
    const textarea = getCurrentTextarea();
    if (!textarea) {
      return;
    }

    textarea.focus();

    if (mode === "html") {
      wrapSelectedText(`<h${level}>`, `</h${level}>`);
      return;
    }

    const start = textarea.selectionStart;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const lineEnd = value.indexOf("\n", start);
    const actualLineEnd = lineEnd === -1 ? value.length : lineEnd;
    const currentLine = value.substring(lineStart, actualLineEnd);

    const cleanLine = currentLine.replace(/^#{1,6}\s*/, "");
    const headingPrefix = "#".repeat(level) + " ";
    const newLine = headingPrefix + cleanLine;
    const newValue =
      value.substring(0, lineStart) + newLine + value.substring(actualLineEnd);

    onChange(newValue);
    setTimeout(() => {
      const newCursorPos = lineStart + headingPrefix.length + cleanLine.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const formatH1 = () => formatHeading(1);
  const formatH2 = () => formatHeading(2);
  const formatH3 = () => formatHeading(3);

  const formatBulletList = () => {
    const textarea = getCurrentTextarea();
    if (!textarea) {
      return;
    }

    textarea.focus();

    if (mode === "html") {
      wrapSelectedText("<ul><li>", "</li></ul>");
      return;
    }

    const start = textarea.selectionStart;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const lineEnd = value.indexOf("\n", start);
    const actualLineEnd = lineEnd === -1 ? value.length : lineEnd;
    const currentLine = value.substring(lineStart, actualLineEnd);

    if (currentLine.startsWith("- ")) return;

    const newValue =
      value.substring(0, lineStart) + "- " + value.substring(lineStart);
    onChange(newValue);
    setTimeout(() => {
      const newCursorPos = lineStart + 2;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const formatNumberedList = () => {
    const textarea = getCurrentTextarea();
    if (!textarea) {
      return;
    }

    textarea.focus();

    if (mode === "html") {
      wrapSelectedText("<ol><li>", "</li></ol>");
      return;
    }

    const start = textarea.selectionStart;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const lineEnd = value.indexOf("\n", start);
    const actualLineEnd = lineEnd === -1 ? value.length : lineEnd;
    const currentLine = value.substring(lineStart, actualLineEnd);

    if (/^\d+\.\s/.test(currentLine)) return;

    const newValue =
      value.substring(0, lineStart) + "1. " + value.substring(lineStart);
    onChange(newValue);
    setTimeout(() => {
      const newCursorPos = lineStart + 3;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertLink = () => {
    if (linkText && linkUrl) {
      // Validate URL format - trim whitespace and check protocol
      const trimmedUrl = linkUrl.trim();
      if (
        !trimmedUrl.startsWith("http://") &&
        !trimmedUrl.startsWith("https://")
      ) {
        setLinkError(
          "Please enter a valid URL that starts with http:// or https://"
        );
        return;
      }

      setLinkError("");
      if (mode === "html") {
        insertAtCursor(`<a href="${trimmedUrl}">${linkText}</a>`);
      } else {
        insertAtCursor(`[${linkText}](${trimmedUrl})`);
      }
      setLinkText("");
      setLinkUrl("");
      setLinkDialogOpen(false);
    }
  };

  const insertImage = () => {
    if (imageAlt && imageUrl) {
      if (mode === "html") {
        insertAtCursor(`<img src="${imageUrl}" alt="${imageAlt}" />`);
      } else {
        insertAtCursor(`![${imageAlt}](${imageUrl})`);
      }
      setImageAlt("");
      setImageUrl("");
      setImageDialogOpen(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const result = await response.json();

      // Set the uploaded image URL and auto-generate alt text from filename
      setImageUrl(result.url);
      setImageAlt(file.name.split(".")[0].replace(/[-_]/g, " "));
    } catch (error) {
      console.error("Error uploading image:", error);
      // Fallback to local URL for preview
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setImageAlt(file.name.split(".")[0].replace(/[-_]/g, " "));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="content" className="text-sm font-medium text-muted-foreground">
          {label} {required && <span className="text-primary">*</span>}
        </Label>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs border-primary/40 text-primary bg-primary/10">
            {mode === "html" ? "HTML Mode" : "Markdown Mode"}
          </Badge>
          {isConverting && (
            <Badge variant="secondary" className="text-xs animate-pulse bg-muted text-muted-foreground">
              Converting...
            </Badge>
          )}
          <div className="flex rounded-lg border border-border bg-card p-1">
            <Button
              type="button"
              variant={mode === "html" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleModeToggle("html")}
              className={`h-7 px-2 text-xs ${mode === "html" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-primary/15"}`}
              disabled={isConverting}
            >
              <Code className="h-3 w-3 mr-1" />
              HTML
            </Button>
            <Button
              type="button"
              variant={mode === "markdown" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleModeToggle("markdown")}
              className={`h-7 px-2 text-xs ${mode === "markdown" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-primary/15"}`}
              disabled={isConverting}
            >
              <FileText className="h-3 w-3 mr-1" />
              Markdown
            </Button>
          </div>
        </div>
      </div>

      {mode === "html" ? (
        <Tabs defaultValue="write" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-card border border-border">
            <TabsTrigger value="write" className="flex items-center space-x-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground">
              <Edit className="h-3 w-3" />
              <span>Write HTML</span>
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="flex items-center space-x-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
            >
              <Eye className="h-3 w-3" />
              <span>Preview</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="write" className="mt-4">
            <div className="sticky top-0 z-50 border border-border rounded-t-md p-3 bg-card/95 backdrop-blur-sm shadow-sm">
              <div className="flex flex-wrap gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={formatBold}
                  className="h-8 px-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  title="Bold"
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={formatItalic}
                  className="h-8 px-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  title="Italic"
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={formatCode}
                  className="h-8 px-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  title="Inline Code"
                >
                  <Code className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-muted mx-1" />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={formatH1}
                  className="h-8 px-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  title="Heading 1"
                >
                  <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={formatH2}
                  className="h-8 px-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  title="Heading 2"
                >
                  <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={formatH3}
                  className="h-8 px-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  title="Heading 3"
                >
                  <Heading3 className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-muted mx-1" />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={formatBulletList}
                  className="h-8 px-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  title="Bullet List"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={formatNumberedList}
                  className="h-8 px-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  title="Numbered List"
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={formatQuote}
                  className="h-8 px-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  title="Quote"
                >
                  <Quote className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-muted mx-1" />

                <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={openLinkDialog}
                      className="h-8 px-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                      title="Insert Link"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-card border-border">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">Insert Link</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="link-text" className="text-muted-foreground">Link Text</Label>
                        <Input
                          id="link-text"
                          value={linkText}
                          onChange={(e) => setLinkText(e.target.value)}
                          placeholder="Enter link text"
                          className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                      <div>
                        <Label htmlFor="link-url" className="text-muted-foreground">URL</Label>
                        <Input
                          id="link-url"
                          value={linkUrl}
                          onChange={(e) => {
                            setLinkUrl(e.target.value);
                            if (linkError) setLinkError("");
                          }}
                          placeholder="https://example.com"
                          className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                        />
                        {linkError && (
                          <p className="text-destructive text-sm mt-1">{linkError}</p>
                        )}
                      </div>
                      <Button
                        onClick={insertLink}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Insert Link
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                      title="Insert Image"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-card border-border">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">Insert Image</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="image-upload" className="text-muted-foreground">Upload Image</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="flex-1 bg-muted border-border text-foreground"
                            disabled={isUploading}
                          />
                          {isUploading ? (
                            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                          ) : (
                            <Upload className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        {isUploading && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Uploading image...
                          </p>
                        )}
                      </div>
                      <div className="text-center text-sm text-muted-foreground">
                        or
                      </div>
                      <div>
                        <Label htmlFor="image-url" className="text-muted-foreground">Image URL</Label>
                        <Input
                          id="image-url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                      <div>
                        <Label htmlFor="image-alt" className="text-muted-foreground">Alt Text</Label>
                        <Input
                          id="image-alt"
                          value={imageAlt}
                          onChange={(e) => setImageAlt(e.target.value)}
                          placeholder="Describe the image"
                          className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                      <Button
                        onClick={insertImage}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        disabled={isUploading}
                      >
                        Insert Image
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <Textarea
              ref={htmlTextareaRef}
              id="content"
              value={value}
              onChange={handleTextareaChange}
              placeholder="Write your blog post content in HTML format..."
              rows={rows}
              className={`font-mono text-sm rounded-t-none border-t-0 bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 ${className}`}
              required={required}
            />
            <p className="text-xs text-muted-foreground mt-1 font-sans">
              You can use HTML tags for formatting. Content will be rendered as
              HTML on the blog page.
            </p>
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            <Card className="bg-card/80 border-border">
              <CardContent className="p-6">
                {value ? (
                  <div
                    className="admin-preview-prose"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                ) : (
                  <p className="text-muted-foreground text-sm italic font-sans">
                    Start writing in the Write tab to see a preview here...
                  </p>
                )}
              </CardContent>
            </Card>
            <p className="text-xs text-muted-foreground mt-2 font-sans">
              This is how your HTML content will appear on the blog page.
            </p>
          </TabsContent>
        </Tabs>
      ) : (
        <Tabs defaultValue="write" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-card border border-border">
            <TabsTrigger value="write" className="flex items-center space-x-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground">
              <Edit className="h-3 w-3" />
              <span>Write</span>
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="flex items-center space-x-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
            >
              <Eye className="h-3 w-3" />
              <span>Preview</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="write" className="mt-4">
            <div className="sticky top-0 z-50 border border-border rounded-t-md p-3 bg-card/95 backdrop-blur-sm shadow-sm">
              <div className="flex flex-wrap gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={formatBold}
                  className="h-8 px-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  title="Bold (Ctrl+B)"
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={formatItalic}
                  className="h-8 px-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  title="Italic (Ctrl+I)"
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={formatCode}
                  className="h-8 px-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  title="Inline Code"
                >
                  <Code className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-muted mx-1" />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={formatH1}
                  className="h-8 px-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  title="Heading 1"
                >
                  <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={formatH2}
                  className="h-8 px-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  title="Heading 2"
                >
                  <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={formatH3}
                  className="h-8 px-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  title="Heading 3"
                >
                  <Heading3 className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-muted mx-1" />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={formatBulletList}
                  className="h-8 px-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  title="Bullet List"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={formatNumberedList}
                  className="h-8 px-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  title="Numbered List"
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={formatQuote}
                  className="h-8 px-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  title="Quote"
                >
                  <Quote className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-muted mx-1" />

                <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={openLinkDialog}
                      className="h-8 px-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                      title="Insert Link"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-card border-border">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">Insert Link</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="link-text" className="text-muted-foreground">Link Text</Label>
                        <Input
                          id="link-text"
                          value={linkText}
                          onChange={(e) => setLinkText(e.target.value)}
                          placeholder="Enter link text"
                          className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                      <div>
                        <Label htmlFor="link-url" className="text-muted-foreground">URL</Label>
                        <Input
                          id="link-url"
                          value={linkUrl}
                          onChange={(e) => {
                            setLinkUrl(e.target.value);
                            if (linkError) setLinkError("");
                          }}
                          placeholder="https://example.com"
                          className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                        />
                        {linkError && (
                          <p className="text-destructive text-sm mt-1">
                            {linkError}
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={insertLink}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Insert Link
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={imageDialogOpen}
                  onOpenChange={setImageDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                      title="Insert Image"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-card border-border">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">Insert Image</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="image-upload" className="text-muted-foreground">Upload Image</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="flex-1 bg-muted border-border text-foreground"
                            disabled={isUploading}
                          />
                          {isUploading ? (
                            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                          ) : (
                            <Upload className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        {isUploading && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Uploading image...
                          </p>
                        )}
                      </div>
                      <div className="text-center text-sm text-muted-foreground">
                        or
                      </div>
                      <div>
                        <Label htmlFor="image-url" className="text-muted-foreground">Image URL</Label>
                        <Input
                          id="image-url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                      <div>
                        <Label htmlFor="image-alt" className="text-muted-foreground">Alt Text</Label>
                        <Input
                          id="image-alt"
                          value={imageAlt}
                          onChange={(e) => setImageAlt(e.target.value)}
                          placeholder="Describe the image"
                          className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                      <Button
                        onClick={insertImage}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        disabled={isUploading}
                      >
                        Insert Image
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Textarea
              ref={markdownTextareaRef}
              id="content"
              value={value}
              onChange={handleTextareaChange}
              placeholder="Write your blog post content in Markdown format..."
              rows={rows}
              className={`font-mono text-sm rounded-t-none border-t-0 bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 ${className}`}
              required={required}
            />
            <div className="mt-2 text-xs text-muted-foreground space-y-1 font-sans">
              <p>
                Use the toolbar above for easy formatting, or write in Markdown
                format directly.
              </p>
              <p className="font-medium text-primary">
                Quick reference: **bold**, *italic*, [link](url), ![image](url),
                `code`, &lt;blockquote&gt;
              </p>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            <Card className="bg-card/80 border-border">
              <CardContent className="p-6">
                {value ? (
                  <div
                    className="admin-preview-prose"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                ) : (
                  <p className="text-muted-foreground text-sm italic font-sans">
                    Start writing in the Write tab to see a preview here...
                  </p>
                )}
              </CardContent>
            </Card>
            <p className="text-xs text-muted-foreground mt-2 font-sans">
              This is how your content will appear when converted to HTML and
              displayed on the blog.
            </p>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
