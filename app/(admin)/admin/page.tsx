"use client"

import { useState, useEffect } from "react"
import { fetchUserStats } from "@/actions/admin/user"
import { fetchDocumentStats, fetchMostCommentedDocument } from "@/actions/admin/document"
import { fetchCommentStats } from "@/actions/admin/comment"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, FileText, MessageSquare, Crown } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboard() {
  const [mode, setMode] = useState<"month" | "all">("month")
  const [userStats, setUserStats] = useState<any>(null)
  const [docStats, setDocStats] = useState<any>(null)
  const [commentStats, setCommentStats] = useState<any>(null)
  const [mostCommented, setMostCommented] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      const [users, docs, comments, most] = await Promise.all([
        fetchUserStats(mode),
        fetchDocumentStats(mode),
        fetchCommentStats(mode),
        fetchMostCommentedDocument(),
      ])
      setUserStats(users)
      setDocStats(docs)
      setCommentStats(comments)
      setMostCommented(most)
    }
    load()
  }, [mode])

  const isLoading = !userStats || !docStats || !commentStats || !mostCommented

  return (
    <div className="p-6 space-y-10">
      {/* Global Tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="ml-auto">
          <Tabs value={mode} onValueChange={(val) => setMode(val as "month" | "all")}>
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="all">All Time</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Stats Grid (Top 3) */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {/* Users */}
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <Skeleton className="h-6 w-20 mb-2" />
                <Skeleton className="h-4 w-32" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{userStats.totalUsers}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {userStats.percentageChange >= 0 ? (
                    <span className="text-green-500">▲ {userStats.percentageChange}%</span>
                  ) : (
                    <span className="text-red-500">▼ {Math.abs(userStats.percentageChange)}%</span>
                  )}
                  <span className="text-muted-foreground">
                    compared to {mode === "month" ? "last month" : "all time"}
                  </span>
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Documents */}
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <Skeleton className="h-6 w-20 mb-2" />
                <Skeleton className="h-4 w-32" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{docStats.totalDocuments}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {docStats.percentageChange >= 0 ? (
                    <span className="text-green-500">▲ {docStats.percentageChange}%</span>
                  ) : (
                    <span className="text-red-500">▼ {Math.abs(docStats.percentageChange)}%</span>
                  )}
                  <span className="text-muted-foreground">
                    compared to {mode === "month" ? "last month" : "all time"}
                  </span>
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Comments */}
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <Skeleton className="h-6 w-20 mb-2" />
                <Skeleton className="h-4 w-32" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{commentStats.totalComments}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {commentStats.percentageChange >= 0 ? (
                    <span className="text-green-500">▲ {commentStats.percentageChange}%</span>
                  ) : (
                    <span className="text-red-500">▼ {Math.abs(commentStats.percentageChange)}%</span>
                  )}
                  <span className="text-muted-foreground">
                    compared to {mode === "month" ? "last month" : "all time"}
                  </span>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Most Commented Document (Bottom) */}
      <div className="grid gap-6 grid-cols-1">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Document</CardTitle>
            <Crown className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-24" />
              </>
            ) : (
              <>
                <div className="text-lg font-semibold truncate">{mostCommented.title}</div>
                <p className="text-xs text-muted-foreground">
                  {mostCommented.commentCount} comments
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}