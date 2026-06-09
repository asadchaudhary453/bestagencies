"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Upload, X, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onUpload?: (url: string) => void
  onRemove?: () => void
  uploadedUrl?: string
  onFileSelect?: (file: File | null) => void
  onUploadComplete?: (url: string) => void
  value?: string
  accept?: string
  maxSize?: number
  className?: string
  error?: string
  label?: string
}

export function FileUpload({
  onUpload,
  onRemove,
  uploadedUrl,
  onFileSelect,
  onUploadComplete,
  value,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024,
  className,
  error,
  label = "Upload Image",
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(uploadedUrl || value || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const currentUrl = uploadedUrl || value
    if (currentUrl && currentUrl !== preview) {
      setPreview(currentUrl)
    }
  }, [uploadedUrl, value])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleFile = async (file: File) => {
    setUploadError(null)

    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file")
      return
    }

    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024)
      setUploadError(`File size must be less than ${maxSizeMB}MB`)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    onFileSelect?.(file)

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Upload failed")
      }

      const data = await response.json()
      onUploadComplete?.(data.url)
      onUpload?.(data.url)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed")
      setPreview(null)
      onFileSelect?.(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveClick = () => {
    setPreview(null)
    setUploadError(null)
    onFileSelect?.(null)
    onUploadComplete?.("")
    onRemove?.()
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const isUploadComplete = !!(uploadedUrl || value)

  return (
    <div className={cn("space-y-2", className)}>
      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 cursor-pointer",
            "flex flex-col items-center justify-center gap-3 min-h-[150px]",
            isDragging
              ? "border-[#ecb41a] bg-[#ecb41a]/10"
              : "border-[#262626] bg-[#1a1a1a] hover:border-[#ecb41a]/60 hover:bg-[#ecb41a]/5",
            error && "border-red-500/60",
          )}
        >
          <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileInput} className="hidden" />

          <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-[#ecb41a]/20 via-[#d4a017]/15 to-[#ecb41a]/20 flex items-center justify-center border border-[#ecb41a]/20">
            {isUploading ? (
              <div className="w-6 h-6 border-2 border-[#ecb41a]/30 border-t-[#ecb41a] rounded-full animate-spin" />
            ) : (
              <Upload className="w-6 h-6 text-[#ecb41a]" />
            )}
          </div>

          <div className="text-center">
            <p className="text-sm font-semibold text-white">{isUploading ? "Uploading..." : label}</p>
            <p className="text-xs text-neutral-400 mt-1">Drag & drop or click to browse</p>
            <p className="text-xs text-neutral-500 mt-0.5">Max size: {maxSize / (1024 * 1024)}MB</p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border-2 border-[#262626] bg-[#1a1a1a]">
          <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-40 object-contain bg-[#0d0d0d]"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="h-8 w-8 rounded-full cursor-pointer"
              onClick={handleRemoveClick}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-[#0a0a0a]/80 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#ecb41a]/30 border-t-[#ecb41a] rounded-full animate-spin" />
            </div>
          )}
          {!isUploading && isUploadComplete && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Uploaded</span>
            </div>
          )}
        </div>
      )}

      {(uploadError || error) && (
        <p className="text-xs text-red-400 font-semibold flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {uploadError || error}
        </p>
      )}
    </div>
  )
}
