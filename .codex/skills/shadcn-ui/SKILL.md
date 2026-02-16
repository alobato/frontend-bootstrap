---
name: shadcn-ui
description: Adds and uses shadcn/ui components (Radix UI + Tailwind). Use when installing components (button, form, dialog, select, table, etc.), building forms with React Hook Form and Zod, customizing themes, or implementing UI patterns like buttons, modals, dropdowns, and tables.
---

# shadcn/ui – Components and usage

Guide for adding components and implementing patterns with shadcn/ui, Radix UI, and Tailwind CSS. The project should already have shadcn/ui initialized.

## When to use

- Installing or configuring individual components
- Building forms with React Hook Form and Zod validation
- Creating accessible UI (buttons, dialogs, dropdowns, sheets)
- Customizing styles with Tailwind CSS
- Displaying data in tables, toasts, and charts

## Adding components

Install one or more components:

```bash
# Single component
npx shadcn@latest add button

# Multiple
npx shadcn@latest add button input form card dialog select

# All
npx shadcn@latest add --all
```

Import from `@/components/ui/` (or the alias configured in the project).

## Core components

### Button

```tsx
import { Button } from "@/components/ui/button"

<Button>Click</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline" size="sm">Small</Button>
<Button size="icon"><Icon className="h-4 w-4" /></Button>
```

Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`. Sizes: `default`, `sm`, `lg`, `icon`.

### Input and Label

```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<div className="grid gap-1.5">
  <Label htmlFor="email">Email</Label>
  <Input type="email" id="email" placeholder="Email" />
</div>
```

### Form with validation (React Hook Form + Zod)

Install: `npx shadcn@latest add form`

```tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Minimum 8 characters"),
})

export function LoginForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl><Input type="password" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Sign in</Button>
      </form>
    </Form>
  )
}
```

### Card

```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent><p>Content</p></CardContent>
  <CardFooter><p>Footer</p></CardFooter>
</Card>
```

### Dialog (modal)

```tsx
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<Dialog>
  <DialogTrigger asChild><Button variant="outline">Open</Button></DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Edit</DialogTitle>
      <DialogDescription>Make changes and save.</DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Name</Label>
        <Input id="name" className="col-span-3" />
      </div>
    </div>
    <DialogFooter><Button type="submit">Save</Button></DialogFooter>
  </DialogContent>
</Dialog>
```

### Select (dropdown)

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Choose" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="a">Option A</SelectItem>
    <SelectItem value="b">Option B</SelectItem>
  </SelectContent>
</Select>
```

Inside a form with FormField:

```tsx
<FormField
  control={form.control}
  name="role"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Role</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="user">User</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Sheet (slide-over panel)

```tsx
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

<Sheet>
  <SheetTrigger asChild><Button variant="outline">Open</Button></SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Settings</SheetTitle>
      <SheetDescription>Adjust settings here.</SheetDescription>
    </SheetHeader>
    <div className="grid gap-4 py-4">{/* content */}</div>
  </SheetContent>
</Sheet>
```

Side: `side="right"` (default), `"left"`, `"top"`, `"bottom"`.

### Table

```tsx
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

<Table>
  <TableCaption>Caption</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Column 1</TableHead>
      <TableHead>Column 2</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {items.map((item) => (
      <TableRow key={item.id}>
        <TableCell className="font-medium">{item.name}</TableCell>
        <TableCell>{item.value}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Toast

Include `<Toaster />` in the root layout. Usage:

```tsx
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"

const { toast } = useToast()

toast({ title: "Success", description: "Saved." })
toast({ variant: "destructive", title: "Error", description: "Something went wrong." })
toast({ title: "Action", action: <ToastAction altText="Undo">Undo</ToastAction> })
```

### Charts (Recharts)

Install: `npx shadcn@latest add chart`. Use `ChartContainer` and CSS variables `--chart-1`, `--chart-2`, etc. for theming.

```tsx
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const config = { desktop: { label: "Desktop", color: "var(--chart-1)" } }
<ChartContainer config={config} className="min-h-[200px] w-full">
  <BarChart data={data}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
    <ChartTooltip content={<ChartTooltipContent />} />
  </BarChart>
</ChartContainer>
```

## Customization

- **Theme**: CSS variables in `globals.css` (`--primary`, `--background`, `--radius`, etc.).
- **Components**: code lives in `@/components/ui/`; edit directly (variants, sizes, classes).

Example of an extra variant in Button (CVA):

```tsx
// in buttonVariants
custom: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
```

## Best practices

1. Use Radix primitives for accessibility (ARIA, keyboard).
2. Validate forms with Zod + `zodResolver`.
3. Keep the `@/` alias in tsconfig for imports.
4. Interactive components: use `"use client"` when needed (Next.js App Router).
5. Tailwind + CSS variables for consistent colors and radius.

## Constraints

- Not an npm package: components are copied into the project.
- Most components need `"use client"` in apps with Server Components.
- Radix dependencies must be installed for each component.
- Tailwind required; path alias `@/` configured.

## References

- Docs: https://ui.shadcn.com
- Radix UI: https://www.radix-ui.com
- React Hook Form: https://react-hook-form.com
- Zod: https://zod.dev
