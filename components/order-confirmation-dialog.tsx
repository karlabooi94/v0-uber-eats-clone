"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CountdownTimer } from "@/components/countdown-timer"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface OrderItem {
  id: string
  name: string
  quantity: number
  basePrice?: number
  image?: string
  addOns?: Array<{ name: string; price: number }>
  addOnsPrice?: number
  specialInstructions?: string
}

interface OrderConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: OrderItem[]
  subtotal: number
  tax: number
  serviceCharge: number
  deliveryFee: number
  total: number
  serviceType: string
  address: string
  deliveryDate?: string
  deliveryTime?: string
  serviceDate?: string
  serviceStartTime?: string
  serviceDuration?: number
  paymentMethod: string
  onConfirm: () => void
  onEdit: () => void
}

export function OrderConfirmationDialog({
  open,
  onOpenChange,
  items,
  subtotal,
  tax,
  serviceCharge,
  deliveryFee,
  total,
  serviceType,
  address,
  deliveryDate,
  deliveryTime,
  serviceDate,
  serviceStartTime,
  serviceDuration,
  paymentMethod,
  onConfirm,
  onEdit,
}: OrderConfirmationDialogProps) {
  const [showCountdown, setShowCountdown] = useState(false)

  // Start countdown when dialog is opened
  useEffect(() => {
    if (open) {
      setShowCountdown(true)
    } else {
      setShowCountdown(false)
    }
  }, [open])

  const handleCountdownComplete = () => {
    onConfirm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Review Your Order</DialogTitle>
          <DialogDescription className="text-center">
            Please review your order details before confirming.
          </DialogDescription>
        </DialogHeader>

        {showCountdown && (
          <div className="mb-4">
            <CountdownTimer seconds={8} onComplete={handleCountdownComplete} />
          </div>
        )}

        <div className="max-h-[60vh] overflow-y-auto py-2">
          <h3 className="mb-3 font-medium">Order Items</h3>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-lg border bg-gray-50 p-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={item.image || "/placeholder.svg?height=80&width=80&query=food"}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="text-lg font-medium">
                        {item.quantity}x {item.name}
                      </h4>
                      <p className="font-medium">${((item.basePrice || 0) * (item.quantity || 1)).toFixed(2)}</p>
                    </div>
                    {item.addOns && item.addOns.length > 0 && (
                      <div className="mt-2 space-y-1 rounded-md bg-white p-2">
                        <p className="text-xs font-medium text-gray-500">Add-ons:</p>
                        {item.addOns.map((addon, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>+ {addon.name}</span>
                            <span>${addon.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {item.specialInstructions && (
                      <div className="mt-2 rounded-md bg-white p-2">
                        <p className="text-xs font-medium text-gray-500">Special Instructions:</p>
                        <p className="text-sm italic">{item.specialInstructions}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="rounded-lg border bg-white p-4">
            <h3 className="mb-2 font-medium">Price Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {serviceCharge > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Service Charge (15%)</span>
                  <span>${serviceCharge.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? "Included" : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (12%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="rounded-lg border bg-white p-4">
            <h3 className="mb-2 font-medium">Delivery Details</h3>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Address:</span>
                <span className="text-right">{address}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Service Type:</span>
                <span className="capitalize">{serviceType}</span>
              </div>
              {serviceType === "delivery" ? (
                <div className="flex justify-between">
                  <span className="font-medium">Delivery Time:</span>
                  <span>
                    {deliveryDate} at {deliveryTime}
                  </span>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span className="font-medium">Service Time:</span>
                  <span>
                    {serviceDate} at {serviceStartTime} ({serviceDuration} hours)
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium">Payment Method:</span>
                <span className="capitalize">{paymentMethod.replace("-", " ")}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col space-y-2 sm:flex-col">
          <Button onClick={onConfirm} className="w-full bg-black text-white hover:bg-black/90">
            Proceed to Payment
          </Button>
          <Button type="button" variant="outline" onClick={onEdit} className="w-full">
            Edit Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
