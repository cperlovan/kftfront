import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardHeader({
  className,
  children,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn("p-6 border-b border-slate-100 dark:border-slate-800", className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardContent({
  className,
  children,
  ...props
}: CardContentProps) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardFooter({
  className,
  children,
  ...props
}: CardFooterProps) {
  return (
    <div
      className={cn("px-6 pb-6 pt-2 flex items-center gap-2 text-orange-600 dark:text-orange-400", className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function CardTitle({
  className,
  children,
  ...props
}: CardTitleProps) {
  return (
    <h3
      className={cn("text-lg font-semibold text-orange-600 dark:text-orange-400", className)}
      {...props}
    >
      {children}
    </h3>
  );
}
