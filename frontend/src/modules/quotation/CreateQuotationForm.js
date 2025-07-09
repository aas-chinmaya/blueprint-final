"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { createQuotation } from "@/store/features/pre-project/quotationSlice";
import { serviceProviderDetails } from "@/utils/constant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, FileText, User, Building, Mail, Phone, Globe, Percent, DollarSign, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useContactDetails } from "@/hooks/useContact";
import { useSearchParams } from "next/navigation";
import { fetchUserByEmail } from "@/store/features/shared/userSlice";

// Currency formatting utility
const formatCurrency = (amount, currency) => {
  const symbols = { INR: "₹", USD: "$" };
  return `${symbols[currency] || currency} ${amount.toFixed(2)}`;
};

// Zod schema for validation
const itemSchema = z.object({
  serviceName: z.string().min(1, "Service name is required"),
  basePrice: z.coerce.number().gt(0, "Base price must be > 0"),
  sellPrice: z.coerce.number().gt(0, "Sell price must be > 0"),
});

const quotationSchema = z.object({
  projectTitle: z.string().min(1, "Project title is required"),
  scopeOfWork: z.string().min(1, "Scope of work is required"),
  deliverables: z.string().min(1, "Deliverables are required"),
  timeline: z.string().min(1, "Timeline is required"),
  items: z.array(itemSchema).min(1, "At least one item is required"),
  taxPercent: z.coerce.number().min(0, "Tax % cannot be negative").default(18),
  currency: z.enum(["INR", "USD"]).default("INR"),
  paymentTerms: z.string().min(1, "Payment terms are required"),
  termsAndConditions: z.string().min(1, "Terms and conditions are required"),
});

export default function CreateQuotationForm() {
  const dispatch = useDispatch();
  const { loading, error, quotation } = useSelector((state) => state.quotation);
  const {
    userData,
    employeeData,
    loading: userLoading,
  } = useSelector((state) => state.user) || {};

  const currentUser = {
    // role: "employee", // Change to 'employee' or 'team_lead' for testing
    role: employeeData?.designation, // Change to 'employee' or 'team_lead' for testing
    name: employeeData?.name,
  };
useEffect(() => {
    dispatch(fetchUserByEmail())
  }, [dispatch])
   const searchParams = useSearchParams()
  const contactId = searchParams.get('contactId') // or pass directly as prop
//tobe update or deleted
const { contact } = useContactDetails(contactId)
const clientDetails={
      name:contact?.fullName ,
      company:contact?.companyName,
      email: contact?.email,
      phone:contact?.phone,
}

  
  const [staticData] = useState({
    clientDetails,
  
    serviceProviderDetails,
    preparedBy: {
      name: `${employeeData.firstName || ''} ${employeeData.lastName || ''}`.trim(),
      designation: employeeData.designation,
      email: employeeData.email,
    },
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      projectTitle: "",
      scopeOfWork: "",
      deliverables: "",
      timeline: "",
      items: [{ serviceName: "", basePrice: "", sellPrice: "" }],
      taxPercent: 18,
      currency: "INR",
      paymentTerms: "",
      termsAndConditions: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");
  const taxPercent = watch("taxPercent");
  const currency = watch("currency");

  // Calculate totals based on sellPrice
  const subtotal = items.reduce((acc, item) => acc + Number(item.sellPrice || 0), 0);
  const taxAmount = (subtotal * Number(taxPercent || 0)) / 100;
  const total = subtotal + taxAmount;

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const quotationData = {
        ...data,
        clientDetails: staticData.clientDetails,
        serviceProvider: staticData.serviceProviderDetails,
        preparedBy: staticData.preparedBy,
        createdBy: employeeData?.email,
      };
      const result = await dispatch(createQuotation(quotationData)).unwrap();
      if (result.pdf) {
        const blob = new Blob([result.pdf], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `quotation-${result.quotationNumber || "document"}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      }
      toast.success(`Quotation ${result.quotationNumber || "created"} successfully!`, {
        description: result.pdfUrl ? (
          <a href={result.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">
            View Quotation PDF
          </a>
        ) : null,
      });
    } catch (error) {
      toast.error(`Failed to create quotation: ${error || "Unknown error"}`);
    }
  };

  // Handle Redux errors
  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`);
    }
  }, [error]);

  return (
    <div className="w-full max-w-4xl mx-auto p-3 bg-gradient-to-br from-green-50 to-green-200 rounded-xl shadow-xl">
      <Card className="bg-white border border-green-200 rounded-xl shadow-md">
        <CardHeader className="p-4">
          <CardTitle className="text-lg font-semibold text-green-800 flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Create Quotation
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Client and Service Provider Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-green-800 flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  Client
                </h4>
                <div className="bg-green-50 p-3 rounded-lg space-y-1 text-xs">
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1 text-green-700" />
                    <span>{staticData.clientDetails.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Building className="h-3 w-3 mr-1 text-green-700" />
                    <span>{staticData.clientDetails.company}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-3 w-3 mr-1 text-green-700" />
                    <span>{staticData.clientDetails.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-3 w-3 mr-1 text-green-700" />
                    <span>{staticData.clientDetails.phone}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-green-800 flex items-center">
                  <Building className="h-3 w-3 mr-1" />
                  Provider
                </h4>
                <div className="bg-green-50 p-3 rounded-lg space-y-1 text-xs">
                  <div className="flex items-center">
                    <Building className="h-3 w-3 mr-1 text-green-700" />
                    <span>{staticData.serviceProviderDetails.companyName}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-3 w-3 mr-1 text-green-700" />
                    <span>{staticData.serviceProviderDetails.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-3 w-3 mr-1 text-green-700" />
                    <span>{staticData.serviceProviderDetails.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-3 w-3 mr-1 text-green-700" />
                    <span>{staticData.serviceProviderDetails.website}</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-3 w-3 mr-1 text-green-700" />
                    <span>{staticData.serviceProviderDetails.gstin}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-green-200 h-px" />

            {/* Project Details */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-green-800 flex items-center">
                <FileText className="h-3 w-3 mr-1" />
                Project
              </h4>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <Label className="text-green-700 text-xs flex items-center">
                    <FileText className="h-3 w-3 mr-1" />
                    Title
                  </Label>
                  <Input
                    {...register("projectTitle")}
                    placeholder="Project title"
                    className="mt-1 h-8 text-sm border-green-300 focus:ring-1 focus:ring-green-500 bg-green-50 rounded-md"
                  />
                  {errors.projectTitle && (
                    <p className="text-red-500 text-xs mt-1">{errors.projectTitle.message}</p>
                  )}
                </div>
                <div>
                  <Label className="text-green-700 text-xs flex items-center">
                    <FileText className="h-3 w-3 mr-1" />
                    Scope
                  </Label>
                  <Textarea
                    {...register("scopeOfWork")}
                    placeholder="Scope of work"
                    className="mt-1 h-12 text-sm border-green-300 focus:ring-1 focus:ring-green-500 bg-green-50 rounded-md resize-none"
                    rows={2}
                  />
                  {errors.scopeOfWork && (
                    <p className="text-red-500 text-xs mt-1">{errors.scopeOfWork.message}</p>
                  )}
                </div>
                <div>
                  <Label className="text-green-700 text-xs flex items-center">
                    <FileText className="h-3 w-3 mr-1" />
                    Deliverables
                  </Label>
                  <Textarea
                    {...register("deliverables")}
                    placeholder="Deliverables"
                    className="mt-1 h-12 text-sm border-green-300 focus:ring-1 focus:ring-green-500 bg-green-50 rounded-md resize-none"
                    rows={2}
                  />
                  {errors.deliverables && (
                    <p className="text-red-500 text-xs mt-1">{errors.deliverables.message}</p>
                  )}
                </div>
                <div>
                  <Label className="text-green-700 text-xs flex items-center">
                    <FileText className="h-3 w-3 mr-1" />
                    Timeline
                  </Label>
                  <Input
                    {...register("timeline")}
                    placeholder="Timeline (e.g., 4 weeks)"
                    className="mt-1 h-8 text-sm border-green-300 focus:ring-1 focus:ring-green-500 bg-green-50 rounded-md"
                  />
                  {errors.timeline && (
                    <p className="text-red-500 text-xs mt-1">{errors.timeline.message}</p>
                  )}
                </div>
              </div>
            </div>

            <Separator className="bg-green-200 h-px" />

          
           {/* Quotation Items */}
<div className="space-y-3">
  <h4 className="text-sm font-medium text-green-800 flex items-center">
    <FileText className="h-3 w-3 mr-1" />
    Items
  </h4>

  <div className="space-y-2">
    {fields.map((item, index) => (
      <div
        key={item.id}
        className="flex flex-wrap sm:flex-nowrap items-center gap-2"
      >
        <Input
          placeholder="Service Name"
          {...register(`items.${index}.serviceName`)}
          className="h-8 text-sm border-green-300 focus:ring-1 focus:ring-green-500 bg-green-50 rounded-md flex-1 min-w-[150px]"
        />
        <Input
          type="number"
          step="0.01"
          placeholder="Base Price"
          {...register(`items.${index}.basePrice`)}
          className="h-8 text-sm border-green-300 focus:ring-1 focus:ring-green-500 bg-green-50 rounded-md w-32"
        />
        <Input
          type="number"
          step="0.01"
          placeholder="Sell Price"
          {...register(`items.${index}.sellPrice`)}
          className="h-8 text-sm border-green-300 focus:ring-1 focus:ring-green-500 bg-green-50 rounded-md w-32"
        />
        <Button
          type="button"
          variant="destructive"
          onClick={() => remove(index)}
          className="h-8 px-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    ))}

    {/* Add Button */}
    <div className="pt-2">
      <Button
        type="button"
        onClick={() => append({ serviceName: "", basePrice: "", sellPrice: "" })}
        className="h-8 text-sm bg-green-700 hover:bg-green-800 text-white rounded-md"
      >
        <PlusCircle className="h-3 w-3 mr-1" />
        Add Item
      </Button>
    </div>

    {/* Global item error */}
    {errors.items && typeof errors.items.message === 'string' && (
      <p className="text-red-500 text-xs mt-1">{errors.items.message}</p>
    )}
  </div>
</div>


            <Separator className="bg-green-200 h-px" />

            {/* Currency and Tax Percent */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <Label className="text-green-700 text-xs flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Currency
                </Label>
                <Select {...register("currency")} defaultValue="INR">
                  <SelectTrigger className="mt-1 h-8 text-sm border-green-300 focus:ring-1 focus:ring-green-500 bg-green-50 rounded-md">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.currency && <p className="text-red-500 text-xs mt-1">{errors.currency.message}</p>}
              </div>
              <div>
                <Label className="text-green-700 text-xs flex items-center">
                  <Percent className="h-3 w-3 mr-1" />
                  Tax Percent
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("taxPercent")}
                  placeholder="Tax % (e.g., 18)"
                  className="mt-1 h-8 w-24 text-sm border-green-300 focus:ring-1 focus:ring-green-500 bg-green-50 rounded-md"
                />
                {errors.taxPercent && (
                  <p className="text-red-500 text-xs mt-1">{errors.taxPercent.message}</p>
                )}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-green-50 rounded-lg p-3 space-y-1 text-xs">
              <div className="flex justify-between text-green-700">
                <span className="flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Subtotal
                </span>
                <span>{formatCurrency(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-green-700">
                <span className="flex items-center">
                  <Percent className="h-3 w-3 mr-1" />
                  Tax ({taxPercent || 0}%)
                </span>
                <span>{formatCurrency(taxAmount, currency)}</span>
              </div>
              <div className="flex justify-between text-green-800 font-medium">
                <span className="flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Total
                </span>
                <span>{formatCurrency(total, currency)}</span>
              </div>
            </div>

            <Separator className="bg-green-200 h-px" />

            {/* Payment Terms */}
            <div>
              <Label className="text-green-700 text-xs flex items-center">
                <FileText className="h-3 w-3 mr-1" />
                Payment Terms
              </Label>
              <Textarea
                {...register("paymentTerms")}
                placeholder="Payment terms"
                className="mt-1 h-12 text-sm border-green-300 focus:ring-1 focus:ring-green-500 bg-green-50 rounded-md resize-none"
                rows={2}
              />
              {errors.paymentTerms && (
                <p className="text-red-500 text-xs mt-1">{errors.paymentTerms.message}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div>
              <Label className="text-green-700 text-xs flex items-center">
                <FileText className="h-3 w-3 mr-1" />
                Terms & Conditions
              </Label>
              <Textarea
                {...register("termsAndConditions")}
                placeholder="Terms and conditions"
                className="mt-1 h-12 text-sm border-green-300 focus:ring-1 focus:ring-green-500 bg-green-50 rounded-md resize-none"
                rows={2}
              />
              {errors.termsAndConditions && (
                <p className="text-red-500 text-xs mt-1">{errors.termsAndConditions.message}</p>
              )}
            </div>

            <Separator className="bg-green-200 h-px" />

            {/* Prepared By */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-green-800 flex items-center">
                <User className="h-3 w-3 mr-1" />
                Prepared By
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-green-50 p-3 rounded-lg text-xs">
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-1 text-green-700" />
                  <span>{staticData.preparedBy.name}</span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-3 w-3 mr-1 text-green-700" />
                  <span>{staticData.preparedBy.designation}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-3 w-3 mr-1 text-green-700" />
                  <span>{staticData.preparedBy.email}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                className="h-8 text-sm bg-green-700 hover:bg-green-800 text-white rounded-md"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Submitting
                  </>
                ) : (
                  <>
                    <FileText className="h-3 w-3 mr-1" />
                    Create
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}













