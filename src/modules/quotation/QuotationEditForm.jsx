

"use client";
import { addDays } from "date-fns";
import { useMemo, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { getQuotationById, updateQuotation } from "@/features/quotationSlice";
import { serviceProviderDetails } from "@/constants/constants";
import { toast } from "sonner";
import { useContactDetails } from "@/hooks/useContact";
import { fetchUserByEmail } from "@/features/shared/userSlice";
import { useRouter } from "next/navigation";
import { PlusCircle, Trash2, FileText, User, Building, Mail, Phone, Globe, Percent, DollarSign, Loader2 } from "lucide-react";

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
  currency: z.enum(["INR", "USD"]),
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

  function EditQuotationForm({ quotationNumber }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentDate = new Date();
  const validTillDate = addDays(currentDate, 7);

  const { loading, error, quotation } = useSelector((state) => state.quotation);
  const { userData, employeeData, loading: userLoading } = useSelector((state) => state.user) || {};

  useEffect(() => {
    dispatch(fetchUserByEmail());
  }, [dispatch]);

  useEffect(() => {
    if (quotationNumber) {
      dispatch(getQuotationById(quotationNumber));
    }
  }, [dispatch, quotationNumber]);

  const { contact } = useContactDetails(quotation?.clientDetails?.contactId || "");

  const staticData = useMemo(() => ({
    clientDetails: {
      contactId: quotation?.clientDetails?.contactId || contact?.contactId || "",
      name: quotation?.clientDetails?.name || contact?.fullName || "",
      company: quotation?.clientDetails?.company || contact?.companyName || "",
      email: quotation?.clientDetails?.email || contact?.email || "",
      phone: quotation?.clientDetails?.phone || contact?.phone || "",
    },
    serviceProviderDetails,
    preparedBy: {
      name: `${employeeData?.firstName || ""} ${employeeData?.lastName || ""}`.trim(),
      designation: employeeData?.designation || "",
      email: employeeData?.email || "",
    },
  }), [quotation, contact, employeeData]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      projectTitle: "",
      scopeOfWork: "",
      deliverables: "",
      timeline: "",
      items: [{ serviceName: "", basePrice: "", sellPrice: "", currency: "INR" }],
      taxPercent: 18,
      currency: "INR",
      paymentTerms: "",
      termsAndConditions: "",
    },
  });

  // Populate form with fetched quotation data
  useEffect(() => {
    if (quotation) {
      console.log("Quotation data:", quotation); // Moved console.log here for clarity
      reset({
        projectTitle: quotation.projectTitle || "",
        scopeOfWork: quotation.scopeOfWork || "",
        deliverables: quotation.deliverables || "",
        timeline: quotation.timeline || "",
        items: quotation.items?.length > 0
          ? quotation.items.map(item => ({
              serviceName: item.serviceName || "",
              basePrice: item.basePrice || "",
              sellPrice: item.sellPrice || "",
              currency: item.currency || "INR",
            }))
          : [{ serviceName: "", basePrice: "", sellPrice: "", currency: "INR" }],
        taxPercent: quotation.taxPercent || 18,
        currency: quotation.currency || "INR",
        paymentTerms: quotation.paymentTerms || "",
        termsAndConditions: quotation.termsAndConditions || "",
      });
    }
  }, [quotation, reset]);

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const currency = watch("currency");
  const items = watch("items");
  const taxPercent = watch("taxPercent");

  // Sync item currencies with global currency
  useEffect(() => {
    items.forEach((_, idx) => {
      setValue(`items.${idx}.currency`, currency);
    });
  }, [currency, items, setValue]);

  // Calculate totals
  const subtotal = items.reduce((acc, item) => acc + Number(item.sellPrice || 0), 0);
  const taxAmount = (subtotal * Number(taxPercent || 0)) / 100;
  const total = subtotal + taxAmount;

  // Handle form submission
  const onSubmit = (Status) => async (data) => {
    const now = new Date();
    const validTill = addDays(now, 7);

    const updatedData = {
      ...data,
      quotationNumber,
      date: now.toISOString(),
      validTill: validTill.toISOString(),
      clientDetails: staticData.clientDetails,
      serviceProviderDetails: staticData.serviceProviderDetails,
      preparedBy: staticData.preparedBy,
      updatedBy: employeeData?.email,
      Status, // Include Status inside updatedData
    };

    console.log("Payload being sent:", updatedData); // Debug payload

    try {
      const result = await dispatch(updateQuotation(updatedData)).unwrap();
      if (result.pdf) {
        const blob = new Blob([result.pdf], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `quotation-${result.quotationNumber || "document"}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      }
      toast.success(`Quotation ${result.quotationNumber || "updated"} successfully as ${Status}!`, {
        description: result.pdfUrl ? (
          <a href={result.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">
            View Quotation PDF
          </a>
        ) : null,
      });
      router.push("/quotation");
    } catch (error) {
      toast.error(`Failed to update quotation: ${error || "Unknown error"}`);
    }
  };

  // Handle Redux errors
  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-[#f1f1f1] p-6">
      <div className="w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-indigo-900 flex items-center">
            <FileText className="h-8 w-8 mr-3 text-indigo-600" />
            Edit Quotation
          </h1>
          <form className="space-y-6 mt-6">
            {/* Client and Provider Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#f1f1f1] p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-indigo-900 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Client Details
                </h2>
                <div className="mt-3 space-y-2 text-sm text-gray-400">
                  <p className="flex items-center"><User className="h-4 w-4 mr-2" /> {staticData.clientDetails.name}</p>
                  <p className="flex items-center"><Building className="h-4 w-4 mr-2" /> {staticData.clientDetails.company}</p>
                  <p className="flex items-center"><Mail className="h-4 w-4 mr-2" /> {staticData.clientDetails.email}</p>
                  <p className="flex items-center"><Phone className="h-4 w-4 mr-2" /> {staticData.clientDetails.phone}</p>
                </div>
              </div>
              <div className="bg-[#f1f1f1] p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-indigo-900 flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Provider Details
                </h2>
                <div className="mt-3 space-y-2 text-sm text-gray-400">
                  <p className="flex items-center"><Building className="h-4 w-4 mr-2" /> {staticData.serviceProviderDetails.companyName}</p>
                  <p className="flex items-center"><Mail className="h-4 w-4 mr-2" /> {staticData.serviceProviderDetails.email}</p>
                  <p className="flex items-center"><Phone className="h-4 w-4 mr-2" /> {staticData.serviceProviderDetails.phone}</p>
                  <p className="flex items-center"><Globe className="h-4 w-4 mr-2" /> {staticData.serviceProviderDetails.website}</p>
                  <p className="flex items-center"><FileText className="h-4 w-4 mr-2" /> {staticData.serviceProviderDetails.gstin}</p>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-[#f1f1f1] p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-indigo-900 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Project Details
              </h2>
              <div className="grid grid-cols-1 gap-4 mt-3">
                <div>
                  <label className="text-sm font-medium text-indigo-900 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Project Title
                  </label>
                  <input
                    {...register("projectTitle")}
                    placeholder="Enter project title"
                    className="mt-2 w-full h-10 text-sm bg-white border border-indigo-200 rounded-lg px-3 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                  />
                  {errors.projectTitle && (
                    <p className="text-red-500 text-xs mt-1">{errors.projectTitle.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-indigo-900 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Timeline
                  </label>
                  <input
                    {...register("timeline")}
                    placeholder="e.g., 4 weeks"
                    className="mt-2 w-full h-10 text-sm bg-white border border-indigo-200 rounded-lg px-3 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                  />
                  {errors.timeline && (
                    <p className="text-red-500 text-xs mt-1">{errors.timeline.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-indigo-900 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Scope of Work
                  </label>
                  <textarea
                    {...register("scopeOfWork")}
                    placeholder="Describe scope of work"
                    className="mt-2 w-full h-20 text-sm bg-white border border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                  />
                  {errors.scopeOfWork && (
                    <p className="text-red-500 text-xs mt-1">{errors.scopeOfWork.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-indigo-900 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Deliverables
                  </label>
                  <textarea
                    {...register("deliverables")}
                    placeholder="List deliverables"
                    className="mt-2 w-full h-20 text-sm bg-white border border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                  />
                  {errors.deliverables && (
                    <p className="text-red-500 text-xs mt-1">{errors.deliverables.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Currency Selection */}
            <div className="flex justify-between items-center bg-[#f1f1f1] p-4 rounded-lg">
              <div>
                <label className="text-sm font-medium text-indigo-900 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Currency
                </label>
                <select
                  {...register("currency")}
                  className="mt-2 w-32 h-10 text-sm bg-white border border-indigo-200 rounded-lg px-3 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                </select>
                {errors.currency && (
                  <p className="text-red-500 text-xs mt-1">{errors.currency.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-indigo-900 flex items-center">
                  <Percent className="h-4 w-4 mr-2" />
                  Tax Percent
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("taxPercent")}
                  placeholder="Tax % (e.g., 18)"
                  className="mt-2 w-24 h-10 text-sm bg-white border border-indigo-200 rounded-lg px-3 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                />
                {errors.taxPercent && (
                  <p className="text-red-500 text-xs mt-1">{errors.taxPercent.message}</p>
                )}
              </div>
            </div>

            {/* Quotation Items */}
            <div className="bg-[#f1f1f1] p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-indigo-900 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Quotation Items
              </h2>
              <div className="mt-3 space-y-3">
                {fields.map((item, index) => (
                  <div key={item.id} className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                    <input
                      placeholder="Service Name"
                      {...register(`items.${index}.serviceName`)}
                      className="flex-1 h-10 text-sm bg-white border border-indigo-200 rounded-lg px-3 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 min-w-[150px]"
                    />
                    <div className="relative w-32">
                      <span className="absolute top-2.5 left-3 text-sm text-indigo-900">
                        {currency === "USD" ? "$" : "₹"}
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Base Price"
                        {...register(`items.${index}.basePrice`)}
                        className="pl-8 w-full h-10 text-sm bg-white border border-indigo-200 rounded-lg px-3 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                      />
                    </div>
                    <div className="relative w-32">
                      <span className="absolute top-2.5 left-3 text-sm text-indigo-900">
                        {currency === "USD" ? "$" : "₹"}
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Sell Price"
                        {...register(`items.${index}.sellPrice`)}
                        className="pl-8 w-full h-10 text-sm bg-white border border-indigo-200 rounded-lg px-3 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="h-10 w-10 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => append({ serviceName: "", basePrice: "", sellPrice: "", currency })}
                  className="mt-3 h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Item
                </button>
                {errors.items && typeof errors.items.message === "string" && (
                  <p className="text-red-500 text-xs mt-1">{errors.items.message}</p>
                )}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-[#f1f1f1] p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-indigo-900 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Totals
              </h2>
              <div className="mt-3 space-y-2 text-sm text-indigo-800">
                <div className="flex justify-between">
                  <span className="flex items-center"><DollarSign className="h-4 w-4 mr-2" /> Subtotal</span>
                  <span>{formatCurrency(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center"><Percent className="h-4 w-4 mr-2" /> Tax ({taxPercent || 0}%)</span>
                  <span>{formatCurrency(taxAmount, currency)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="flex items-center"><DollarSign className="h-4 w-4 mr-2" /> Total</span>
                  <span>{formatCurrency(total, currency)}</span>
                </div>
              </div>
            </div>

            {/* Payment Terms and Conditions */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-[#f1f1f1] p-4 rounded-lg">
                <label className="text-sm font-medium text-indigo-900 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Payment Terms
                </label>
                <textarea
                  {...register("paymentTerms")}
                  placeholder="Enter payment terms"
                  className="mt-2 w-full h-24 text-sm bg-white border border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                />
                {errors.paymentTerms && (
                  <p className="text-red-500 text-xs mt-1">{errors.paymentTerms.message}</p>
                )}
              </div>
              <div className="bg-[#f1f1f1] p-4 rounded-lg">
                <label className="text-sm font-medium text-indigo-900 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Terms & Conditions
                </label>
                <textarea
                  {...register("termsAndConditions")}
                  placeholder="Enter terms and conditions"
                  className="mt-2 w-full h-24 text-sm bg-white border border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                />
                {errors.termsAndConditions && (
                  <p className="text-red-500 text-xs mt-1">{errors.termsAndConditions.message}</p>
                )}
              </div>
            </div>

            {/* Prepared By */}
            <div className="bg-[#f1f1f1] p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-indigo-900 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Prepared By
              </h2>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-indigo-800">
                <p className="flex items-center"><User className="h-4 w-4 mr-2" /> {staticData.preparedBy.name}</p>
                <p className="flex items-center"><FileText className="h-4 w-4 mr-2" /> {staticData.preparedBy.designation}</p>
                <p className="flex items-center"><Mail className="h-4 w-4 mr-2" /> {staticData.preparedBy.email}</p>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4">
             
              <button
                type="button"
                onClick={handleSubmit(onSubmit("final"))}
                className="h-10 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Create Quotation
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}




export default EditQuotationForm;