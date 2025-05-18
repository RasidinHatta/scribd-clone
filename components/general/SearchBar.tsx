"use client"

import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
    Form,
    FormField,
    FormControl,
    FormItem,
} from '../ui/form'

const formSchema = z.object({
    search: z.string().optional(),
})

const SearchBar = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentQuery = searchParams.get("q") || ""

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            search: currentQuery,
        },
    })

    const query = form.watch("search") || ''

    // Debounce navigation effect
    useEffect(() => {
        const trimmed = query.trim();

        const currentPath = window.location.pathname;
        if (!currentPath.startsWith("/community")) return;

        const timeoutId = setTimeout(() => {
            if (trimmed) {
                router.push(`/community?q=${encodeURIComponent(trimmed)}`)
            } else {
                router.push('/community')
            }
        }, 1500);

        return () => clearTimeout(timeoutId);
    }, [query, router]);

    // Immediate submit on Enter
    const onSubmit = (data: { search?: string }) => {
        const trimmed = data.search?.trim() || ''
        if (trimmed) {
            router.push(`/community?q=${encodeURIComponent(trimmed)}`)
        } else {
            router.push('/community')
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="relative w-full max-w-md"
            >
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <FormField
                    control={form.control}
                    name="search"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="search"
                                    placeholder="Search documents..."
                                    className="pl-10 pr-20"
                                    autoComplete="off"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-1/2 -translate-y-1/2 h-8 px-3"
                >
                    Search
                </Button>
            </form>
        </Form>
    )
}

export default SearchBar