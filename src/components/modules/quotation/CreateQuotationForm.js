




'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const itemSchema = z.object({
  serviceDescription: z.string().min(1, 'Service description is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.coerce.number().gt(0, 'Unit price must be greater than 0'),
});

const quotationSchema = z.object({
  quotationNumber: z.string().min(1, 'Quotation number is required'),
  date: z.string().min(1, 'Date is required'),
  validTill: z.string().min(1, 'Valid till date is required'),
  client: z.object({
    name: z.string().min(1, 'Client name is required'),
    company: z.string().min(1, 'Company name is required'),
    email: z.string().email('Invalid email format'),
    phone: z.string().min(1, 'Phone number is required'),
  }),
  serviceProvider: z.object({
    companyName: z.string().min(1, 'Company name is required'),
    email: z.string().email('Invalid email format'),
    phone: z.string().min(1, 'Phone number is required'),
    website: z.string().url('Invalid URL format').optional(),
    gstin: z.string().min(1, 'GSTIN is required'),
  }),
  projectTitle: z.string().min(1, 'Project title is required'),
  scopeOfWork: z.string().min(1, 'Scope of work is required'),
  deliverables: z.string().min(1, 'Deliverables are required'),
  timeline: z.string().min(1, 'Timeline is required'),
  items: z.array(itemSchema).min(1, 'At least one item is required'),
  taxPercent: z.coerce.number().min(0, 'Tax percentage cannot be negative').default(18),
  currency: z.string().default('INR'),
  paymentTerms: z.string().min(1, 'Payment terms are required'),
  termsAndConditions: z.string().min(1, 'Terms and conditions are required'),
  preparedBy: z.object({
    name: z.string().min(1, 'Prepared by name is required'),
    designation: z.string().min(1, 'Designation is required'),
    email: z.string().email('Invalid email format'),
  }),
});

export default function CreateQuotationForm() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      items: [{ serviceDescription: '', quantity: 1, unitPrice: 0 }],
      taxPercent: 18,
      currency: 'INR',
      date: new Date().toISOString().split('T')[0],
      validTill: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const items = watch('items');
  const taxPercent = watch('taxPercent');

  const subtotal = items.reduce((acc, item) => acc + Number(item.quantity || 1) * Number(item.unitPrice || 0), 0);
  const taxAmount = (subtotal * Number(taxPercent)) / 100;
  const total = subtotal + taxAmount;

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('/api/quotation', data);
      console.log('Quotation created:', response.data);
      alert('Quotation created successfully!');
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Error creating quotation.');
    }
  };

  return (
    <Card className=" mx-auto p-6">
      <CardHeader>
        <CardTitle>Quotation for Website Development Services</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Quotation Details */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Quotation Number</Label>
              <Input {...register('quotationNumber')} placeholder="QUO/2025/001" />
              {errors.quotationNumber && <p className="text-red-500 text-sm">{errors.quotationNumber.message}</p>}
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" {...register('date')} />
              {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
            </div>
            <div>
              <Label>Valid Till</Label>
              <Input type="date" {...register('validTill')} />
              {errors.validTill && <p className="text-red-500 text-sm">{errors.validTill.message}</p>}
            </div>
          </div>

          {/* Client Details */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Client Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Client Name</Label>
                <Input {...register('client.name')} placeholder="Mr. Rakesh Sharma" />
                {errors.client?.name && <p className="text-red-500 text-sm">{errors.client.name.message}</p>}
              </div>
              <div>
                <Label>Company</Label>
                <Input {...register('client.company')} placeholder="XYZ Traders Pvt. Ltd." />
                {errors.client?.company && <p className="text-red-500 text-sm">{errors.client.company.message}</p>}
              </div>
              <div>
                <Label>Email</Label>
                <Input {...register('client.email')} placeholder="rakesh.sharma@xyztraders.com" />
                {errors.client?.email && <p className="text-red-500 text-sm">{errors.client.email.message}</p>}
              </div>
              <div>
                <Label>Phone</Label>
                <Input {...register('client.phone')} placeholder="+91-9876543210" />
                {errors.client?.phone && <p className="text-red-500 text-sm">{errors.client.phone.message}</p>}
              </div>
            </div>
          </div>

          {/* Service Provider Details */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Service Provider Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Company Name</Label>
                <Input {...register('serviceProvider.companyName')} placeholder="Blueprint IT Solutions Pvt. Ltd." />
                {errors.serviceProvider?.companyName && (
                  <p className="text-red-500 text-sm">{errors.serviceProvider.companyName.message}</p>
                )}
              </div>
              <div>
                <Label>Email</Label>
                <Input {...register('serviceProvider.email')} placeholder="hello@blueprintitsolutions.com" />
                {errors.serviceProvider?.email && (
                  <p className="text-red-500 text-sm">{errors.serviceProvider.email.message}</p>
                )}
              </div>
              <div>
                <Label>Phone</Label>
                <Input {...register('serviceProvider.phone')} placeholder="+91-9123456780" />
                {errors.serviceProvider?.phone && (
                  <p className="text-red-500 text-sm">{errors.serviceProvider.phone.message}</p>
                )}
              </div>
              <div>
                <Label>Website</Label>
                <Input {...register('serviceProvider.website')} placeholder="www.blueprintitsolutions.com" />
                {errors.serviceProvider?.website && (
                  <p className="text-red-500 text-sm">{errors.serviceProvider.website.message}</p>
                )}
              </div>
              <div>
                <Label>GSTIN</Label>
                <Input {...register('serviceProvider.gstin')} placeholder="27XXXXXXXXXXZ5" />
                {errors.serviceProvider?.gstin && (
                  <p className="text-red-500 text-sm">{errors.serviceProvider.gstin.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div>
            <Label>Project Title</Label>
            <Input {...register('projectTitle')} placeholder="Website Design and Development" />
            {errors.projectTitle && <p className="text-red-500 text-sm">{errors.projectTitle.message}</p>}
          </div>

          <div>
            <Label>Scope of Work</Label>
            <Textarea {...register('scopeOfWork')} placeholder="Custom responsive website with up to 7 pages..." />
            {errors.scopeOfWork && <p className="text-red-500 text-sm">{errors.scopeOfWork.message}</p>}
          </div>

          <div>
            <Label>Deliverables</Label>
            <Textarea {...register('deliverables')} placeholder="Complete Source Code, Admin Dashboard Access..." />
            {errors.deliverables && <p className="text-red-500 text-sm">{errors.deliverables.message}</p>}
          </div>

          <div>
            <Label>Timeline</Label>
            <Input {...register('timeline')} placeholder="4 weeks from project kickoff" />
            {errors.timeline && <p className="text-red-500 text-sm">{errors.timeline.message}</p>}
          </div>

          {/* Items */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Quotation Summary</h3>
            <div className="space-y-2">
              {fields.map((item, index) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Input
                    placeholder="Service Description"
                    {...register(`items.${index}.serviceDescription`)}
                  />
                  <Input
                    type="number"
                    placeholder="Quantity"
                    {...register(`items.${index}.quantity`)}
                    defaultValue={1}
                  />
                  <Input
                    type="number"
                    placeholder="Unit Price (INR)"
                    {...register(`items.${index}.unitPrice`)}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                    className="px-2"
                  >
                    X
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => append({ serviceDescription: '', quantity: 1, unitPrice: 0 })}
              >
                + Add Item
              </Button>
            </div>
            {errors.items && <p className="text-red-500 text-sm">{errors.items.message}</p>}
          </div>

          {/* Totals */}
          <div className="bg-gray-100 rounded p-4">
            <p>Subtotal: {watch('currency')} {subtotal.toFixed(2)}</p>
            <p>Tax: {watch('currency')} {taxAmount.toFixed(2)} ({taxPercent}%)</p>
            <p className="font-bold">Total: {watch('currency')} {total.toFixed(2)}</p>
          </div>

          {/* Payment Terms */}
          <div>
            <Label>Payment Terms</Label>
            <Textarea
              {...register('paymentTerms')}
              placeholder="50% advance before project start..."
            />
            {errors.paymentTerms && <p className="text-red-500 text-sm">{errors.paymentTerms.message}</p>}
          </div>

          {/* Terms and Conditions */}
          <div>
            <Label>Terms and Conditions</Label>
            <Textarea
              {...register('termsAndConditions')}
              placeholder="Any additional feature or page not listed above will be charged extra..."
            />
            {errors.termsAndConditions && (
              <p className="text-red-500 text-sm">{errors.termsAndConditions.message}</p>
            )}
          </div>

          {/* Prepared By */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Prepared By</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Name</Label>
                <Input {...register('preparedBy.name')} placeholder="Chinmaya Pradhan" />
                {errors.preparedBy?.name && (
                  <p className="text-red-500 text-sm">{errors.preparedBy.name.message}</p>
                )}
              </div>
              <div>
                <Label>Designation</Label>
                <Input {...register('preparedBy.designation')} placeholder="Business Consultant" />
                {errors.preparedBy?.designation && (
                  <p className="text-red-500 text-sm">{errors.preparedBy.designation.message}</p>
                )}
              </div>
              <div>
                <Label>Email</Label>
                <Input {...register('preparedBy.email')} placeholder="chinmaya@blueprintitsolutions.com" />
                {errors.preparedBy?.email && (
                  <p className="text-red-500 text-sm">{errors.preparedBy.email.message}</p>
                )}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Submit Quotation
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}