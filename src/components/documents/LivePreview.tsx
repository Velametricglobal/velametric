import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { DocumentDataPayload, DocumentTypeCode } from '../../types/document.types';
import { loadGoogleFont } from '../../utils/fontLoader';

interface LivePreviewProps {
  payload: DocumentDataPayload;
  typeCode: DocumentTypeCode;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

const LivePreview: React.FC<LivePreviewProps> = ({ payload, typeCode }) => {
  const { 
    company_details, client_details, items, subtotal, total_tax, total_discount, 
    grand_total, advance_paid, balance_due, issue_date, due_date, notes, terms, customization, payment_details 
  } = payload;
  
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    if (customization?.font_family) {
      loadGoogleFont(customization.font_family, [400, 500, 600, 700]).then(() => {
        setFontLoaded(true);
      });
    }
  
  }, [customization?.font_family]);

  const getDocumentTitle = () => {
    switch (typeCode) {
      case 'INVOICE': return 'TAX INVOICE';
      case 'QUOTATION': return 'QUOTATION';
      case 'PO': return 'PURCHASE ORDER';
      case 'RECEIPT': return 'RECEIPT';
      default: return 'DOCUMENT';
    }
  };

  // Customization helpers
  const primaryColor = customization?.primary_color || '#111827';
  const secondaryColor = customization?.secondary_color || '#374151';
  const accentColor = customization?.accent_color || '#F3F4F6';
  const textColor = customization?.text_color || '#111827';
  const fontFamily = customization?.font_family || 'Inter, sans-serif';
  const headerLayout = customization?.header_layout || 'logo-left';
  const logoSize = customization?.logo_size || 'medium';

  const logoClasses = {
    small: 'h-10',
    medium: 'h-16',
    large: 'h-24'
  }[logoSize];

  return (
    <div className="w-full h-full bg-white p-8 md:p-12 overflow-y-auto print:p-0 print:m-0 print:overflow-visible print:h-auto print:w-full print:bg-white" style={{ color: textColor, fontFamily }}>
      {/* Print-specific styles are applied globally, but we keep inline styles for predictable HTML rendering */}
      
      <div className="max-w-[800px] mx-auto print:max-w-none print:w-full print:m-0">
        {/* Header Section */}
        <div 
          className={`flex border-b-2 pb-8 mb-8 ${
            headerLayout === 'logo-right' ? 'flex-row-reverse text-right' : 
            headerLayout === 'logo-center' ? 'flex-col items-center text-center' : 
            'flex-row justify-between items-start'
          }`}
          style={{ borderColor: primaryColor }}
        >
          <div className={`${headerLayout === 'logo-center' ? 'mb-6 flex flex-col items-center' : 'flex-1'}`}>
            {company_details.logo_url ? (
              <img src={company_details.logo_url} alt="Logo" className={`${logoClasses} mb-4 object-contain`} />
            ) : (
              <div className={`${logoClasses} w-auto min-w-[64px] bg-gray-100 rounded flex items-center justify-center mb-4 text-gray-400 font-bold px-4`}>
                LOGO
              </div>
            )}
            <h2 className="text-2xl font-bold" style={{ color: primaryColor }}>{company_details.company_name || 'Your Company Name'}</h2>
            <div className="text-sm mt-2 whitespace-pre-line" style={{ color: secondaryColor }}>
              {company_details.address || 'Your Business Address'}
            </div>
            {company_details.gstin && (
              <div className="text-sm font-medium mt-1">GSTIN: {company_details.gstin}</div>
            )}
            <div className="text-sm mt-1">
              {company_details.phone && <span>{company_details.phone} {company_details.email ? '| ' : ''}</span>}
              {company_details.email && <span>{company_details.email}</span>}
            </div>
          </div>
          
          <div className={`${headerLayout === 'logo-center' ? 'w-full text-center border-t pt-6' : 'text-right'}`} style={{ borderColor: accentColor }}>
            <h1 className="text-4xl font-black tracking-wider uppercase" style={{ color: primaryColor }}>{getDocumentTitle()}</h1>
            <div className={`mt-4 text-sm flex flex-col gap-1 ${headerLayout === 'logo-center' ? 'items-center' : 'items-end'}`}>
              <div className="flex gap-2">
                <span className="font-bold w-24">Date:</span>
                <span className="w-24 text-left">{issue_date}</span>
              </div>
              {due_date && (
                <div className="flex gap-2">
                  <span className="font-bold w-24">Due Date:</span>
                  <span className="w-24 text-left">{due_date}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Billed To Section */}
        <div className="mb-10">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>Billed To</h3>
          <h4 className="text-xl font-bold">{client_details.name || 'Client Name'}</h4>
          <div className="text-sm mt-1 whitespace-pre-line" style={{ color: secondaryColor }}>
            {client_details.address || 'Client Address'}
          </div>
          {client_details.gstin && (
            <div className="text-sm font-medium mt-1">GSTIN: {client_details.gstin}</div>
          )}
        </div>

        {/* Items Table */}
        <div className="mb-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-sm font-bold" style={{ backgroundColor: accentColor, color: primaryColor }}>
                <th className="p-3 rounded-tl-lg">Description</th>
                <th className="p-3 text-right">Qty</th>
                <th className="p-3 text-right">Rate</th>
                {(items.some(i => i.discount_percentage) || items.some(i => i.tax_percentage)) && (
                  <th className="p-3 text-right">Tax/Disc</th>
                )}
                <th className="p-3 text-right rounded-tr-lg">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="border-b text-sm" style={{ borderColor: accentColor }}>
                  <td className="p-3 font-medium">{item.description || `Item ${idx + 1}`}</td>
                  <td className="p-3 text-right">{item.quantity}</td>
                  <td className="p-3 text-right">{formatCurrency(item.unit_price)}</td>
                  {(items.some(i => i.discount_percentage) || items.some(i => i.tax_percentage)) && (
                    <td className="p-3 text-right text-xs opacity-75">
                      {item.tax_percentage ? `+${item.tax_percentage}% Tax ` : ''}
                      {item.discount_percentage ? `-${item.discount_percentage}% Disc` : ''}
                    </td>
                  )}
                  <td className="p-3 text-right font-bold">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          <div className="flex-1 text-sm">
            {notes && (
              <div className="mb-6">
                <h4 className="font-bold mb-1" style={{ color: primaryColor }}>Notes:</h4>
                <p className="whitespace-pre-line" style={{ color: secondaryColor }}>{notes}</p>
              </div>
            )}
            {terms && (
              <div className="mb-6">
                <h4 className="font-bold mb-1" style={{ color: primaryColor }}>Terms & Conditions:</h4>
                <p className="whitespace-pre-line text-xs" style={{ color: secondaryColor }}>{terms}</p>
              </div>
            )}
            
            {/* Payment Details */}
            {(payment_details?.bank_name || payment_details?.upi_id) && (
              <div className="mt-6 p-4 rounded-lg border" style={{ borderColor: accentColor, backgroundColor: '#fcfcfc' }}>
                <h4 className="font-bold mb-2 text-sm" style={{ color: primaryColor }}>Payment Details:</h4>
                <div className="flex flex-row justify-between items-center gap-4">
                  <div className="text-xs space-y-1">
                    {payment_details.bank_name && <p><strong>Bank:</strong> {payment_details.bank_name}</p>}
                    {payment_details.account_name && <p><strong>Name:</strong> {payment_details.account_name}</p>}
                    {payment_details.account_number && <p><strong>A/C No:</strong> {payment_details.account_number}</p>}
                    {payment_details.ifsc_code && <p><strong>IFSC:</strong> {payment_details.ifsc_code}</p>}
                    {payment_details.upi_id && <p><strong>UPI ID:</strong> {payment_details.upi_id}</p>}
                  </div>
                  {customization.show_qr && payment_details.upi_id && (
                    <div className="flex flex-col items-center p-2 bg-white rounded border border-gray-100">
                      <QRCodeSVG 
                        value={`upi://pay?pa=${payment_details.upi_id}&pn=${payment_details.account_name || company_details.company_name}`} 
                        size={80} 
                      />
                      <span className="text-[10px] mt-1 text-gray-500 font-bold">SCAN TO PAY</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="w-full md:w-64">
            <div className="rounded-xl p-4" style={{ backgroundColor: accentColor }}>
              <div className="flex justify-between mb-2 text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {total_discount > 0 && (
                <div className="flex justify-between mb-2 text-sm text-red-600 font-medium">
                  <span>Discount</span>
                  <span>-{formatCurrency(total_discount)}</span>
                </div>
              )}
              {total_tax > 0 && (
                <div className="flex justify-between mb-2 text-sm">
                  <span>Tax (GST)</span>
                  <span>+{formatCurrency(total_tax)}</span>
                </div>
              )}
              <div className="border-t my-2 pt-2 flex justify-between font-bold text-lg" style={{ borderColor: secondaryColor, color: primaryColor }}>
                <span>Total</span>
                <span>{formatCurrency(grand_total)}</span>
              </div>
              {(advance_paid ?? 0) > 0 && (
                <>
                  <div className="flex justify-between mt-2 pt-2 border-t border-dashed border-gray-300 text-sm text-green-700 font-bold">
                    <span>Advance Paid</span>
                    <span>-{formatCurrency(advance_paid || 0)}</span>
                  </div>
                  <div className="flex justify-between mt-1 pt-1 font-black text-base" style={{ color: primaryColor }}>
                    <span>Balance Due</span>
                    <span>{formatCurrency(balance_due !== undefined ? balance_due : Math.max(0, grand_total - (advance_paid || 0)))}</span>
                  </div>
                </>
              )}
            </div>
            
            {/* Signature Area */}
            <div className="mt-16 text-center border-t pt-2 w-48 ml-auto" style={{ borderColor: primaryColor }}>
              {customization.signature_url && (
                <img src={customization.signature_url} alt="Signature" className="h-12 mx-auto mb-1 object-contain -mt-14" />
              )}
              <p className="text-xs font-bold" style={{ color: primaryColor }}>Authorized Signatory</p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center text-xs mt-12 pt-8 border-t" style={{ borderColor: accentColor, color: secondaryColor }}>
          Generated via Vela Metric
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
