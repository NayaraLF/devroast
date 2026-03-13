"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";

export default function ComponentsPage() {
  const [togglePressed, setTogglePressed] = useState(false);

  const buttonVariants = [
    "default",
    "secondary",
    "outline",
    "ghost",
    "destructive",
  ] as const;
  const buttonSizes = ["sm", "default", "lg", "icon"] as const;

  const badgeVariants = ["critical", "warning", "good"] as const;

  return (
    <div className="min-h-screen bg-bg-page p-8 font-mono">
      <div className="mx-auto max-w-4xl space-y-12">
        <h1 className="text-3xl font-bold text-text-primary">Componentes UI</h1>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-text-primary">Button</h2>

          <div className="space-y-8">
            <div>
              <h3 className="mb-4 text-sm font-medium text-text-tertiary">
                Variantes
              </h3>
              <div className="flex flex-wrap gap-4">
                {buttonVariants.map((variant) => (
                  <Button key={variant} variant={variant}>
                    {variant}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-medium text-text-tertiary">
                Tamanhos
              </h3>
              <div className="flex flex-wrap items-center gap-4">
                {buttonSizes.map((size) => (
                  <Button key={size} size={size}>
                    {size === "icon" ? "●" : size}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-medium text-text-tertiary">
                Estados
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button>Normal</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-text-primary">Badge</h2>

          <div>
            <h3 className="mb-4 text-sm font-medium text-text-tertiary">
              Variantes
            </h3>
            <div className="flex flex-wrap gap-4">
              {badgeVariants.map((variant) => (
                <Badge key={variant} variant={variant}>
                  {variant}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium text-text-tertiary">
              Sem dot
            </h3>
            <div className="flex flex-wrap gap-4">
              <Badge variant="warning" dot={false}>
                warning
              </Badge>
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-text-primary">Card</h2>

          <div className="grid max-w-2xl gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary">
                  Card content goes here.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary">
                  Card with elevated variant.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-text-primary">Toggle</h2>

          <div className="flex flex-wrap gap-4">
            <Toggle pressed={togglePressed} onPressedChange={setTogglePressed}>
              {togglePressed ? "Pressed" : "Not pressed"}
            </Toggle>

            <Toggle variant="outline">Outline</Toggle>

            <Toggle size="sm">Small</Toggle>

            <Toggle disabled>Disabled</Toggle>
          </div>
        </section>
      </div>
    </div>
  );
}
