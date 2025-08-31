"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

const HelpPage = () => {
  const [search, setSearch] = useState("")

  return (
    <div className="container max-w-4xl mx-auto py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground">
          Find answers to common questions or reach out for assistance.
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 max-w-md mx-auto">
        <Input
          placeholder="Search help topics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="secondary">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Help Topics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Learn how to set up your account and begin using the app.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm">Read Guide</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Update your personal info, email, and security options.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm">Manage Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing & Payments</CardTitle>
            <CardDescription>
              Learn about invoices, payment methods, and refunds.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm">View Billing Help</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Troubleshooting</CardTitle>
            <CardDescription>
              Fix common problems and learn how to get support.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm">Fix Issues</Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I reset my password?</AccordionTrigger>
            <AccordionContent>
              Go to your account settings, click on "Security", and choose "Reset Password".
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Where can I view my invoices?</AccordionTrigger>
            <AccordionContent>
              All invoices are available under "Billing & Payments" in your dashboard.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>How do I contact support?</AccordionTrigger>
            <AccordionContent>
              You can reach us through the "Contact Support" button at the bottom of this page.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}

export default HelpPage