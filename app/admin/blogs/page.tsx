"use client"

import type React from "react"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  FileText,
  Globe,
  Clock,
  Upload,
  ExternalLink,
  Save,
  X,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { MarkdownEditor } from "@/components/admin/markdown-editor"
import { marked } from "marked"

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
})

// Function to detect if content is HTML or Markdown
function isHtmlContent(content: string): boolean {
  const htmlPattern = /<\/?(?:p|div|span|h[1-6]|ul|ol|li|a|img|table|tr|td|th|thead|tbody|strong|em|br|hr|blockquote|pre|code)[^>]*>/i
  return htmlPattern.test(content)
}

// Function to parse content for preview
function parseContentForPreview(content: string): string {
  if (!content) return ""
  
  // If content looks like HTML, return as-is
  if (isHtmlContent(content)) {
    return content
  }
  
  // Otherwise, parse as Markdown
  try {
    return marked(content) as string
  } catch (error) {
    console.error("Error parsing markdown:", error)
    return content
  }
}

interface BlogPost {
  _id: string
  title: string
  url: string
  excerpt: string
  content: string
  category: string
  imageUrl: string
  status: "draft" | "published"
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export default function BlogPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  
  // Check for ?new=true query parameter to auto-open create modal
  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setShowCreateModal(true)
      // Remove the query parameter from URL
      router.replace("/admin/blogs", { scroll: false })
    }
  }, [searchParams, router])
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null)
  const { toast } = useToast()
  const [editorMode, setEditorMode] = useState<"html" | "markdown">("markdown")

  type PaginationInfo = {
    currentPage: number
    totalPages: number
    totalCount: number
    limit: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }

  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 25,
    hasNextPage: false,
    hasPrevPage: false,
  })

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      if (searchTerm !== debouncedSearchTerm) {
        setPagination((p) => ({ ...p, currentPage: 1 }))
      }
    }, 500)
    return () => clearTimeout(t)
  }, [searchTerm, debouncedSearchTerm])

  const [formData, setFormData] = useState({
    title: "",
    url: "",
    excerpt: "",
    content: "",
    category: "",
    imageUrl: "",
    status: "draft" as "draft" | "published",
  })

  const generateUrlFromTitle = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
  }

  const handleTitleChange = (newTitle: string) => {
    const newUrl = generateUrlFromTitle(newTitle)
    const currentAutoUrl = generateUrlFromTitle(formData.title)

    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      url: prev.url === "" || prev.url === currentAutoUrl ? newUrl : prev.url,
    }))
  }

  const fetchBlogPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        status: statusFilter,
        category: categoryFilter,
        search: debouncedSearchTerm,
        page: String(pagination.currentPage),
        limit: String(pagination.limit),
      })

      const response = await fetch(`/api/admin/blog?${params.toString()}`)
      if (!response.ok) throw new Error("Failed to fetch blog posts")

      const data = await response.json()
      setBlogPosts(data.blogs || [])

      if (data.pagination) {
        const { page, pages, limit, total } = data.pagination
        setPagination({
          currentPage: page,
          totalPages: pages,
          totalCount: total,
          limit,
          hasNextPage: page < pages,
          hasPrevPage: page > 1,
        })
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error)
      toast({
        title: "Error",
        description: "Failed to fetch blog posts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(blogPosts.map((p) => p.category).filter(Boolean))]
    return uniqueCategories.sort()
  }, [blogPosts])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }))
    }
  }

  const handleLimitChange = (newLimit: string) => {
    setPagination((prev) => ({
      ...prev,
      limit: Number.parseInt(newLimit),
      currentPage: 1,
    }))
  }

  useEffect(() => {
    fetchBlogPosts()
  }, [statusFilter, categoryFilter, debouncedSearchTerm, pagination.currentPage, pagination.limit])

  const handleStatusChange = async (postId: string, newStatus: "published" | "draft") => {
    try {
      const updateData: Record<string, unknown> = {
        status: newStatus,
        publishedAt: newStatus === "published" ? new Date().toISOString() : undefined,
      }

      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) throw new Error("Failed to update status")

      await fetchBlogPosts()
      toast({
        title: "Success",
        description: `Post ${newStatus === "published" ? "published" : "unpublished"} successfully`,
      })
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update post status",
        variant: "destructive",
      })
    }
  }

  const handleDeleteClick = (post: BlogPost) => {
    setPostToDelete(post)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return

    try {
      const response = await fetch(`/api/admin/blog/${postToDelete._id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete post")

      await fetchBlogPosts()
      setShowDeleteModal(false)
      setPostToDelete(null)
      toast({
        title: "Success",
        description: "Post deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      })
    }
  }

  const handleImageUpload = async (file: File) => {
    try {
      setImageUploading(true)
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      if (!response.ok) throw new Error("Failed to upload image")

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      })
      return null
    } finally {
      setImageUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.title ||
      !formData.url ||
      !formData.excerpt ||
      !formData.content ||
      !formData.category ||
      !formData.imageUrl
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const url = editingPost ? `/api/admin/blog/${editingPost._id}` : "/api/admin/blog"
      const method = editingPost ? "PUT" : "POST"

      let contentToSave = formData.content
      if (editorMode === "markdown") {
        try {
          contentToSave = await marked(formData.content)
        } catch (error) {
          console.error("Error converting markdown to HTML:", error)
          toast({
            title: "Error",
            description: "Failed to convert markdown to HTML",
            variant: "destructive",
          })
          return
        }
      }

      const submitData: Record<string, unknown> = {
        ...formData,
        content: contentToSave,
        publishedAt: formData.status === "published" ? new Date().toISOString() : undefined,
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) throw new Error(`Failed to ${editingPost ? "update" : "create"} post`)

      await fetchBlogPosts()
      setShowCreateModal(false)
      setShowEditModal(false)
      setEditingPost(null)
      resetForm()

      toast({
        title: "Success",
        description: `Post ${editingPost ? "updated" : "created"} successfully`,
      })
    } catch (error) {
      console.error(`Error ${editingPost ? "updating" : "creating"} post:`, error)
      toast({
        title: "Error",
        description: `Failed to ${editingPost ? "update" : "create"} post`,
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      url: "",
      excerpt: "",
      content: "",
      category: "",
      imageUrl: "",
      status: "draft",
    })
    setEditorMode("markdown")
  }

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      url: post.url,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      imageUrl: post.imageUrl,
      status: post.status,
    })
    // Auto-detect content type: if it looks like HTML, use HTML mode; otherwise use markdown mode
    // This properly handles Strapi Markdown content
    const contentIsHtml = isHtmlContent(post.content || "")
    setEditorMode(contentIsHtml ? "html" : "markdown")
    setShowEditModal(true)
  }

  const handleViewPost = (post: BlogPost) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
    window.open(`${baseUrl}/${post.url}`, "_blank")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge className="bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-500/30">
            Published
          </Badge>
        )
      case "draft":
        return (
          <Badge variant="secondary" className="bg-muted text-muted-foreground border border-border">
            Draft
          </Badge>
        )
      default:
        return <Badge variant="outline" className="border-border text-muted-foreground">Unknown</Badge>
    }
  }

  const draftCount = blogPosts.filter((p) => p.status === "draft").length
  const publishedCount = blogPosts.filter((p) => p.status === "published").length

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Blog Management</h1>
            <p className="text-muted-foreground">Create and manage blog posts</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-foreground shadow-lg shadow-primary/30 transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-muted/40 border-border backdrop-blur-sm hover:bg-muted/40 transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-primary/20 border border-primary/20">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
                  <p className="text-2xl font-bold text-foreground">{pagination.totalCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-muted/40 border-border backdrop-blur-sm hover:bg-muted/40 transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/20">
                  <Globe className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Published</p>
                  <p className="text-2xl font-bold text-emerald-600">{publishedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-muted/40 border-border backdrop-blur-sm hover:bg-muted/40 transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-primary/20 border border-primary/20">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Drafts</p>
                  <p className="text-2xl font-bold text-primary">{draftCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters Card */}
        <Card className="bg-muted/40 border-border backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              Filters
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Filter blog posts by search, status, and category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v)
                  setPagination((p) => ({ ...p, currentPage: 1 }))
                }}
              >
                <SelectTrigger className="bg-muted border-border text-foreground">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all" className="text-muted-foreground focus:bg-muted focus:text-foreground">All Statuses</SelectItem>
                  <SelectItem value="published" className="text-muted-foreground focus:bg-muted focus:text-foreground">Published</SelectItem>
                  <SelectItem value="draft" className="text-muted-foreground focus:bg-muted focus:text-foreground">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={categoryFilter}
                onValueChange={(v) => {
                  setCategoryFilter(v)
                  setPagination((p) => ({ ...p, currentPage: 1 }))
                }}
              >
                <SelectTrigger className="bg-muted border-border text-foreground">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all" className="text-muted-foreground focus:bg-muted focus:text-foreground">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="text-muted-foreground focus:bg-muted focus:text-foreground">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Blog Table */}
        <Card className="bg-muted/40 border-border backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Blog Posts ({pagination.totalCount.toLocaleString()})
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of{" "}
                  {pagination.totalCount.toLocaleString()} posts
                </CardDescription>
              </div>
              <Select value={pagination.limit.toString()} onValueChange={handleLimitChange}>
                <SelectTrigger className="w-32 border-border bg-muted text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="25" className="text-muted-foreground focus:bg-muted focus:text-foreground">25 per page</SelectItem>
                  <SelectItem value="50" className="text-muted-foreground focus:bg-muted focus:text-foreground">50 per page</SelectItem>
                  <SelectItem value="75" className="text-muted-foreground focus:bg-muted focus:text-foreground">75 per page</SelectItem>
                  <SelectItem value="100" className="text-muted-foreground focus:bg-muted focus:text-foreground">100 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted border-b border-border hover:bg-muted">
                      <TableHead className="text-muted-foreground font-semibold">Post</TableHead>
                      <TableHead className="text-muted-foreground font-semibold">Category</TableHead>
                      <TableHead className="text-muted-foreground font-semibold">Status</TableHead>
                      <TableHead className="text-muted-foreground font-semibold">Published</TableHead>
                      <TableHead className="text-right text-muted-foreground font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogPosts.map((post) => (
                      <TableRow key={post._id} className="border-b border-border hover:bg-muted/40 transition-colors duration-200">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={post.imageUrl || "/placeholder.svg"}
                              alt={post.title}
                              className="w-12 h-8 rounded object-cover ring-1 ring-border"
                            />
                            <div className="max-w-md">
                              <a 
                                href={`/${post.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium line-clamp-1 text-foreground hover:text-primary transition-colors cursor-pointer"
                              >
                                {post.title}
                              </a>
                              <div className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
                            {post.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(post.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 text-primary" />
                            <span>
                              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Not published"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {post.status === "draft" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(post._id, "published")}
                                className="cursor-pointer bg-gradient-to-r from-emerald-500 to-emerald-600 text-foreground border-emerald-500/50 hover:from-emerald-600 hover:to-emerald-700 shadow-md shadow-emerald-500/25"
                              >
                                Publish
                              </Button>
                            )}
                            {post.status === "published" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(post._id, "draft")}
                                className="cursor-pointer text-primary border-border bg-transparent hover:text-primary hover:bg-primary/10"
                              >
                                Unpublish
                              </Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-card border-border">
                                {post.status === "published" && (
                                  <DropdownMenuItem
                                    onClick={() => handleViewPost(post)}
                                    className="cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground"
                                  >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View Post
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => setSelectedPost(post)}
                                  className="cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleEditPost(post)}
                                  className="cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Post
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteClick(post)}
                                  className="cursor-pointer text-destructive hover:bg-red-500/10 hover:text-destructive focus:bg-red-500/10 focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {!loading && blogPosts.length > 0 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    disabled={!pagination.hasPrevPage}
                    className="cursor-pointer border-border text-muted-foreground bg-transparent hover:bg-muted hover:text-foreground disabled:opacity-40"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="cursor-pointer border-border text-muted-foreground bg-transparent hover:bg-muted hover:text-foreground disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="cursor-pointer border-border text-muted-foreground bg-transparent hover:bg-muted hover:text-foreground disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.totalPages)}
                    disabled={!pagination.hasNextPage}
                    className="cursor-pointer border-border text-muted-foreground bg-transparent hover:bg-muted hover:text-foreground disabled:opacity-40"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {!loading && blogPosts.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground">No blog posts found</h3>
                <p className="text-muted-foreground mt-1">
                  {debouncedSearchTerm || statusFilter !== "all" || categoryFilter !== "all"
                    ? "No posts match your current filters. Try adjusting your search or filter criteria."
                    : "Get started by creating your first blog post."}
                </p>
                {!debouncedSearchTerm && statusFilter === "all" && categoryFilter === "all" && (
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="mt-4 bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-foreground"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <span>Delete Blog Post</span>
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Are you sure you want to delete this blog post? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            {postToDelete && (
              <div className="py-4">
                <div className="flex items-center space-x-3 p-3 bg-muted border border-border rounded-lg">
                  <img
                    src={postToDelete.imageUrl || "/placeholder.svg"}
                    alt={postToDelete.title}
                    className="w-12 h-8 rounded object-cover ring-1 ring-border"
                  />
                  <div>
                    <div className="font-medium text-sm line-clamp-1 text-foreground">{postToDelete.title}</div>
                    <div className="text-xs text-muted-foreground">{postToDelete.category}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false)
                  setPostToDelete(null)
                }}
                className="cursor-pointer border-border text-muted-foreground bg-transparent hover:bg-muted hover:text-foreground"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                className="cursor-pointer bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-foreground border-0 shadow-md shadow-red-500/30"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Post
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Post Details Modal */}
        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="!max-w-6xl !max-h-[80vh] overflow-y-auto bg-card border-border">
            {selectedPost && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between text-foreground">
                    <span className="line-clamp-1">{selectedPost.title}</span>
                    {getStatusBadge(selectedPost.status)}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    {selectedPost.category} - URL: /{selectedPost.url}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-muted border border-border">
                        <h3 className="font-semibold mb-3 text-primary">Post Information</h3>
                        <div className="space-y-3 text-sm">
                          <div>
                            <strong className="block mb-1 text-muted-foreground">Title:</strong>
                            <span className="text-foreground">{selectedPost.title}</span>
                          </div>
                          <div>
                            <strong className="block mb-1 text-muted-foreground">URL:</strong>
                            <span className="text-foreground">{selectedPost.url}</span>
                          </div>
                          <div>
                            <strong className="block mb-1 text-muted-foreground">Category:</strong>
                            <span className="text-foreground">{selectedPost.category}</span>
                          </div>
                          <div>
                            <strong className="block mb-1 text-muted-foreground">Status:</strong>
                            {getStatusBadge(selectedPost.status)}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-muted border border-border">
                        <h3 className="font-semibold mb-3 text-primary">Dates</h3>
                        <div className="space-y-3 text-sm">
                          <div>
                            <strong className="block mb-1 text-muted-foreground">Created:</strong>
                            <span className="text-foreground">{new Date(selectedPost.createdAt).toLocaleString()}</span>
                          </div>
                          <div>
                            <strong className="block mb-1 text-muted-foreground">Updated:</strong>
                            <span className="text-foreground">
                              {selectedPost.updatedAt ? new Date(selectedPost.updatedAt).toLocaleString() : "Never"}
                            </span>
                          </div>
                          <div>
                            <strong className="block mb-1 text-muted-foreground">Published:</strong>
                            <span className="text-foreground">
                              {selectedPost.publishedAt
                                ? new Date(selectedPost.publishedAt).toLocaleString()
                                : "Not published"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-muted border border-border">
                        <h3 className="font-semibold mb-3 text-primary">Featured Image</h3>
                        <img
                          src={selectedPost.imageUrl || "/placeholder.svg"}
                          alt={selectedPost.title}
                          className="w-full h-48 object-cover rounded-lg border border-border"
                        />
                      </div>

                      <div className="p-4 rounded-lg bg-muted border border-border">
                        <h3 className="font-semibold mb-3 text-primary">Excerpt</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{selectedPost.excerpt}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted border border-border">
                    <h3 className="font-semibold mb-3 text-primary">Content Preview</h3>
                    <div className="p-4 bg-card/50 rounded-lg max-h-96 overflow-y-auto border border-border">
                      <div 
                        className="admin-preview-prose"
                        dangerouslySetInnerHTML={{ __html: parseContentForPreview(selectedPost.content) }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedPost(null)}
                      className="cursor-pointer border-border text-muted-foreground bg-transparent hover:bg-muted hover:text-foreground"
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedPost(null)
                        handleEditPost(selectedPost)
                      }}
                      className="bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-foreground shadow-lg shadow-primary/30"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Post
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Create/Edit Post Modal */}
        <Dialog
          open={showCreateModal || showEditModal}
          onOpenChange={(open) => {
            if (!open) {
              setShowCreateModal(false)
              setShowEditModal(false)
              setEditingPost(null)
              resetForm()
            }
          }}
        >
          <DialogContent className="!max-w-6xl !max-h-[90vh] overflow-y-auto bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">{editingPost ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {editingPost
                  ? "Update your blog post with the latest information"
                  : "Create a comprehensive blog post for your website"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="title" className="block mb-2 text-muted-foreground">
                      Title *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Enter post title..."
                      required
                      className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="url" className="block mb-2 text-muted-foreground">
                      URL *
                    </Label>
                    <Input
                      id="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="post-url-slug"
                      required
                      className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Auto-generated from title, but you can customize it
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="category" className="block mb-2 text-muted-foreground">
                      Category *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger className="bg-muted border-border text-foreground">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="SEO" className="text-muted-foreground focus:bg-muted focus:text-foreground">SEO</SelectItem>
                        <SelectItem value="Marketing" className="text-muted-foreground focus:bg-muted focus:text-foreground">Marketing</SelectItem>
                        <SelectItem value="Web Development" className="text-muted-foreground focus:bg-muted focus:text-foreground">Web Development</SelectItem>
                        <SelectItem value="Business" className="text-muted-foreground focus:bg-muted focus:text-foreground">Business</SelectItem>
                        <SelectItem value="Content Writing" className="text-muted-foreground focus:bg-muted focus:text-foreground">Content Writing</SelectItem>
                        <SelectItem value="Graphic Design" className="text-muted-foreground focus:bg-muted focus:text-foreground">Graphic Design</SelectItem>
                        <SelectItem value="Others" className="text-muted-foreground focus:bg-muted focus:text-foreground">Others</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status" className="block mb-2 text-muted-foreground">
                      Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: "draft" | "published") => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger className="bg-muted border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="draft" className="text-muted-foreground focus:bg-muted focus:text-foreground">Draft</SelectItem>
                        <SelectItem value="published" className="text-muted-foreground focus:bg-muted focus:text-foreground">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="imageUrl" className="block mb-2 text-muted-foreground">
                      Featured Image *
                    </Label>
                    <div className="space-y-2">
                      <Input
                        id="imageUrl"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="Image URL or upload below..."
                        required
                        className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50"
                      />
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const url = await handleImageUpload(file)
                              if (url) {
                                setFormData({ ...formData, imageUrl: url })
                              }
                            }
                          }}
                          className="hidden"
                          id="image-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById("image-upload")?.click()}
                          disabled={imageUploading}
                          className="border-border text-muted-foreground bg-transparent hover:bg-primary/20 hover:text-primary hover:border-primary/30"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {imageUploading ? "Uploading..." : "Upload Image"}
                        </Button>
                      </div>
                      {formData.imageUrl && (
                        <img
                          src={formData.imageUrl || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border border-border"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt" className="block mb-2 text-muted-foreground">
                  Excerpt *
                </Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief description of the post..."
                  rows={3}
                  required
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50"
                />
                <p className="text-xs text-muted-foreground mt-1">This will be used as the meta description for SEO</p>
              </div>

              <div>
                <MarkdownEditor
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  mode={editorMode}
                  onModeChange={setEditorMode}
                  label="Content"
                  required
                  rows={12}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false)
                    setShowEditModal(false)
                    setEditingPost(null)
                    resetForm()
                  }}
                  className="border-border text-muted-foreground bg-transparent hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-foreground shadow-lg shadow-primary/30"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingPost ? "Update Post" : "Create Post"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
