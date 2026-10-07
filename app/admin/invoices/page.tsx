"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from "@/components/shared";
import { Plus, Trash2, Send, Eye } from "lucide-react";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export default function InvoicesPage() {
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "", quantity: 1, unitPrice: 0, total: 0 },
  ]);
  
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientCompany: "",
    clientAddress: "",
    notes: "",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<{
    invoiceNumber: string;
    html: string;
  } | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };

    // Recalculate total
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }

    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateVAT = () => {
    return calculateSubtotal() * 0.16;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVAT();
  };

  const handleGenerate = async (sendToClient: boolean = false) => {
    // Validation
    if (!formData.clientName || !formData.clientEmail) {
      setMessage({ type: 'error', text: 'Client name and email are required' });
      return;
    }

    const validItems = items.filter(item => 
      item.description.trim() && item.quantity > 0 && item.unitPrice > 0
    );

    if (validItems.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one valid invoice item' });
      return;
    }

    setIsGenerating(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/invoices/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: validItems,
          sendToClient,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedInvoice({
          invoiceNumber: data.invoiceNumber,
          html: data.invoiceHTML,
        });
        setMessage({ 
          type: 'success', 
          text: sendToClient 
            ? `Invoice generated and sent to ${formData.clientEmail}!`
            : 'Invoice generated successfully! Click Preview to view.'
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to generate invoice' });
      }
    } catch (error) {
      console.error('Generate invoice error:', error);
      setMessage({ type: 'error', text: 'An error occurred while generating the invoice' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreview = () => {
    if (generatedInvoice) {
      const blob = new Blob([generatedInvoice.html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-sora font-bold text-text-primary">Invoice Generator</h1>
          <p className="text-text-secondary mt-1">Create professional invoices with VeyraTech branding</p>
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Client Name *"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                required
                placeholder="John Doe"
              />
              <Input
                label="Client Email *"
                name="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={handleInputChange}
                required
                placeholder="john@example.com"
              />
              <Input
                label="Company Name"
                name="clientCompany"
                value={formData.clientCompany}
                onChange={handleInputChange}
                placeholder="Acme Corporation"
              />
              <Input
                label="Address"
                name="clientAddress"
                value={formData.clientAddress}
                onChange={handleInputChange}
                placeholder="Nairobi, Kenya"
              />
            </div>
          </CardContent>
        </Card>

        {/* Invoice Items */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Invoice Items</CardTitle>
              <Button onClick={addItem} size="sm" variant="outline">
                <Plus size={16} className="mr-2" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-background-secondary rounded-lg">
                  <div className="md:col-span-5">
                    <Input
                      label={index === 0 ? "Description" : undefined}
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      placeholder="Service or product description"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      label={index === 0 ? "Quantity" : undefined}
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      label={index === 0 ? "Unit Price (KSH)" : undefined}
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      label={index === 0 ? "Total (KSH)" : undefined}
                      value={item.total.toFixed(2)}
                      disabled
                    />
                  </div>
                  <div className="md:col-span-1 flex items-end">
                    {items.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Summary */}
            <div className="mt-6 p-4 bg-background-secondary rounded-lg">
              <div className="flex justify-end">
                <div className="w-full md:w-1/2 space-y-2">
                  <div className="flex justify-between text-text-secondary">
                    <span>Subtotal:</span>
                    <span className="font-medium">KSH {calculateSubtotal().toLocaleString('en-KE', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>VAT (16%):</span>
                    <span className="font-medium">KSH {calculateVAT().toLocaleString('en-KE', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-secondary border-t pt-2">
                    <span>Total:</span>
                    <span>KSH {calculateTotal().toLocaleString('en-KE', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              placeholder="Any additional notes or payment terms..."
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          {generatedInvoice && (
            <Button
              variant="outline"
              onClick={handlePreview}
              className="flex items-center justify-center gap-2"
            >
              <Eye size={16} />
              Preview Invoice
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => handleGenerate(false)}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2"
          >
            {isGenerating ? 'Generating...' : 'Generate Invoice'}
          </Button>
          <Button
            onClick={() => handleGenerate(true)}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90"
          >
            <Send size={16} />
            {isGenerating ? 'Sending...' : 'Generate & Send to Client'}
          </Button>
        </div>
      </div>
    </div>
  );
}
