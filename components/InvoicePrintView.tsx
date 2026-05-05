import Image from 'next/image'

type InvoiceItem = {
  id: string
  description: string
  quantity: number
  unit_price: number
  unit: string
}

type Section = {
  id: string
  title: string
  invoice_items: InvoiceItem[]
}

type Payment = {
  id: string
  amount: number
  method: string | null
  received_at: string | null
}

type Invoice = {
  id: string
  invoice_number: string | null
  status: string
  issue_date: string | null
  due_date: string | null
  representative?: string | null
  terms?: string | null
  subtotal: number
  discount: number
  total: number
  total_paid: number
  notes: string | null
  customers: {
    customer_name: string
    email?: string | null
    phone?: string | null
    address?: string | null
    city_state?: string | null
  } | null
  projects: { project_name: string; project_code?: string | null } | null
  invoice_sections: Section[]
  payments: Payment[]
}

export default function InvoicePrintView({ invoice }: { invoice: Invoice }) {
  const balance = Number(invoice.total) - Number(invoice.total_paid)

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 print:shadow-none print:rounded-none print:p-0">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-start gap-3">
          <Image src="/logo/logo.svg" alt="Biaggio Flooring" width={120} height={36} className="h-auto w-auto" />
          <div>
            <h2 className="text-xl font-extrabold text-[#212121]">Biaggio Flooring LLC</h2>
            <p className="text-xs text-gray-500 mt-1">1118 N John Young Pkwy #610</p>
            <p className="text-xs text-gray-500">Central Florida, USA</p>
            <p className="text-xs text-gray-500">321-682-1090</p>
            <p className="text-xs text-gray-500">biaggioflooringllc@gmail.com</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-[#46C038]">INVOICE</p>
          {invoice.invoice_number && (
            <p className="text-sm text-gray-600 mt-1">#{invoice.invoice_number}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Date: {invoice.issue_date || '—'}
          </p>
          {invoice.due_date && (
            <p className="text-sm text-gray-500">Due: {invoice.due_date}</p>
          )}
          {invoice.terms && (
            <p className="text-sm text-gray-500">Terms: {invoice.terms}</p>
          )}
          {invoice.representative && (
            <p className="text-sm text-gray-500">Rep: {invoice.representative}</p>
          )}
        </div>
      </div>

      {/* Bill to */}
      <div className="mb-8">
        <p className="text-xs text-gray-400 uppercase font-medium mb-1">Bill To</p>
        <p className="font-semibold text-gray-800">{invoice.customers?.customer_name || '—'}</p>
        {invoice.customers?.address  && <p className="text-sm text-gray-500">{invoice.customers.address}</p>}
        {invoice.customers?.city_state && <p className="text-sm text-gray-500">{invoice.customers.city_state}</p>}
        {invoice.customers?.phone    && <p className="text-sm text-gray-500">{invoice.customers.phone}</p>}
        {invoice.customers?.email    && <p className="text-sm text-gray-500">{invoice.customers.email}</p>}
        {invoice.projects            && (
          <p className="text-sm text-gray-500 mt-1">
            Project: {invoice.projects.project_code || invoice.projects.project_name}
          </p>
        )}
      </div>

      {/* Items table */}
      {invoice.invoice_sections?.map(section => (
        <div key={section.id} className="mb-6">
          {invoice.invoice_sections.length > 1 && (
            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">{section.title}</h3>
          )}
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#212121] text-white text-xs uppercase">
                <th className="text-left px-4 py-2 rounded-tl">Description</th>
                <th className="text-center px-4 py-2">Qty</th>
                <th className="text-center px-4 py-2">Unit</th>
                <th className="text-right px-4 py-2">Unit Price</th>
                <th className="text-right px-4 py-2 rounded-tr">Amount</th>
              </tr>
            </thead>
            <tbody>
              {section.invoice_items?.map((item, idx) => (
                <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2">{item.description}</td>
                  <td className="px-4 py-2 text-center">{item.quantity}</td>
                  <td className="px-4 py-2 text-center text-gray-500">{item.unit}</td>
                  <td className="px-4 py-2 text-right">${Number(item.unit_price).toFixed(2)}</td>
                  <td className="px-4 py-2 text-right font-medium">
                    ${(Number(item.quantity) * Number(item.unit_price)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Totals */}
      <div className="flex justify-end mt-4">
        <div className="w-56 space-y-1 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span><span>${Number(invoice.subtotal).toFixed(2)}</span>
          </div>
          {Number(invoice.discount) > 0 && (
            <div className="flex justify-between text-gray-500">
              <span>Discount</span><span>-${Number(invoice.discount).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-gray-800 border-t border-gray-300 pt-1">
            <span>Total</span><span>${Number(invoice.total).toFixed(2)}</span>
          </div>
          {Number(invoice.total_paid) > 0 && (
            <div className="flex justify-between text-gray-500">
              <span>Paid</span><span>${Number(invoice.total_paid).toFixed(2)}</span>
            </div>
          )}
          {Number(invoice.total_paid) > 0 && (
            <div className="flex justify-between font-bold text-[#46C038] border-t border-gray-300 pt-1">
              <span>Balance</span><span>${balance.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mt-8 border-t pt-4">
          <p className="text-xs text-gray-400 uppercase font-medium mb-1">Notes / Terms</p>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
        </div>
      )}

      {/* Standard footer terms */}
      <div className="mt-8 border-t pt-4 space-y-2 text-sm text-gray-700">
        <p className="font-semibold text-gray-800">PREPARATION RATES (LABOR ONLY - billed if needed)</p>
        <p>*** Grinder - $75.00 / hour</p>
        <p>*** Self Leveler - $45.00 / bag</p>
        <p>Terms: 50% due to order/schedule. Balance due upon completion.</p>
        <p>Make all checks payable to Biaggio Flooring LLC</p>
        <p>If you have any questions, please call us at 321-682-1090</p>
        <p className="font-semibold">THANK YOU! May God Bless,</p>
      </div>

      {/* Footer */}
      <div className="mt-10 pt-6 border-t text-center text-xs text-gray-400">
        <p>Thank you for choosing Biaggio Flooring LLC!</p>
        <p className="mt-1">For questions, contact biaggioflooringllc@gmail.com</p>
      </div>
    </div>
  )
}
