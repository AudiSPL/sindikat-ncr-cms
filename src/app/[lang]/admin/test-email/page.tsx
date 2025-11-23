'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function TestEmailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'email' | 'pdf'>('email');
  
  // Email form state
  const [emailData, setEmailData] = useState({
    recipientEmail: 'test@example.com',
    subject: 'Test Subject',
    message: 'Test message',
  });

  // PDF form state
  const [pdfData, setPdfData] = useState({
    memberId: '12345',
    fullName: 'Marko Petrović',
    email: 'marko@example.com',
    city: 'Beograd',
    organization: 'NCR Atleos',
    membershipNumber: 'M123456789',
    status: 'active',
    joinDate: new Date().toISOString().split('T')[0],
  });

  if (status === 'unauthenticated') {
    router.push('/sr/login');
    return null;
  }

  if ((session?.user as any)?.role !== 'super_admin') {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-red-600">
          Access Denied - Admin Only
        </h2>
      </div>
    );
  }

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePdfInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPdfData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendEmail = async () => {
    if (!emailData.recipientEmail) {
      toast.error('Please enter recipient email');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/test/send-simple-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      toast.success('✅ Email sent successfully!');
      setEmailData({
        recipientEmail: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to send email'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePdf = async () => {
    if (!pdfData.memberId || !pdfData.fullName) {
      toast.error('Please fill in Member ID and Full Name');
      return;
    }

    setLoading(true);
    try {
      console.log('🔵 Generating PDF confirmation...');

      const response = await fetch('/api/generate-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: pdfData.memberId,
          memberData: {
            fullName: pdfData.fullName,
            email: pdfData.email,
            city: pdfData.city,
            organization: pdfData.organization,
            membershipNumber: pdfData.membershipNumber,
            status: pdfData.status,
            joinDate: pdfData.joinDate,
          },
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate confirmation');
      }

      // Download the PDF
      if (data.pdfUrl) {
        const link = document.createElement('a');
        link.href = data.pdfUrl;
        link.download = `confirmation-${pdfData.memberId}.pdf`;
        link.click();

        toast.success('✅ Confirmation PDF generated and downloaded!');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to generate PDF'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🧪 Test Panel</h1>
          <p className="text-slate-400">Test email sending and PDF confirmation generation</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('email')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'email'
                ? 'bg-[#60A5FA] text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            📧 Test Email
          </button>
          <button
            onClick={() => setActiveTab('pdf')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'pdf'
                ? 'bg-[#60A5FA] text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            📄 Test PDF Confirmation
          </button>
        </div>

        {/* Email Tab */}
        {activeTab === 'email' && (
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Send Test Email</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Recipient Email
                </label>
                <input
                  type="email"
                  name="recipientEmail"
                  value={emailData.recipientEmail}
                  onChange={handleEmailInputChange}
                  placeholder="test@example.com"
                  className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-[#60A5FA] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={emailData.subject}
                  onChange={handleEmailInputChange}
                  placeholder="Email subject"
                  className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-[#60A5FA] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={emailData.message}
                  onChange={handleEmailInputChange}
                  placeholder="Email message"
                  rows={5}
                  className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-[#60A5FA] focus:border-transparent"
                />
              </div>

              <button
                onClick={handleSendEmail}
                disabled={loading}
                className="w-full bg-[#60A5FA] hover:bg-[#4A90E2] disabled:bg-slate-600 text-white font-semibold py-3 rounded-lg transition"
              >
                {loading ? '⏳ Sending...' : '📧 Send Test Email'}
              </button>
            </div>
          </div>
        )}

        {/* PDF Tab */}
        {activeTab === 'pdf' && (
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Generate PDF Confirmation</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Member ID
                  </label>
                  <input
                    type="text"
                    name="memberId"
                    value={pdfData.memberId}
                    onChange={handlePdfInputChange}
                    placeholder="12345"
                    className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-[#60A5FA] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Membership Number
                  </label>
                  <input
                    type="text"
                    name="membershipNumber"
                    value={pdfData.membershipNumber}
                    onChange={handlePdfInputChange}
                    placeholder="M123456789"
                    className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-[#60A5FA] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Full Name (Ime i prezime)
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={pdfData.fullName}
                  onChange={handlePdfInputChange}
                  placeholder="Marko Petrović"
                  className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-[#60A5FA] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    City (Mesto)
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={pdfData.city}
                    onChange={handlePdfInputChange}
                    placeholder="Beograd"
                    className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-[#60A5FA] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Organization
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={pdfData.organization}
                    onChange={handlePdfInputChange}
                    placeholder="NCR Atleos"
                    className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-[#60A5FA] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={pdfData.email}
                  onChange={handlePdfInputChange}
                  placeholder="marko@example.com"
                  className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-[#60A5FA] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Join Date (Datum učlanjenja)
                  </label>
                  <input
                    type="date"
                    name="joinDate"
                    value={pdfData.joinDate}
                    onChange={handlePdfInputChange}
                    className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-[#60A5FA] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={pdfData.status}
                    onChange={handlePdfInputChange}
                    className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-[#60A5FA] focus:border-transparent"
                  >
                    <option value="active">Aktivan</option>
                    <option value="inactive">Neaktivan</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGeneratePdf}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white font-semibold py-3 rounded-lg transition"
              >
                {loading ? '⏳ Generating PDF...' : '📄 Generate & Download PDF'}
              </button>
            </div>

            {/* Preview Info */}
            <div className="mt-8 p-4 bg-slate-700 rounded-lg border border-slate-600">
              <h3 className="text-sm font-semibold text-slate-300 mb-2">📋 PDF Preview Info:</h3>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>✅ Serbian Latin fonts (DejaVu) - supports Č, Š, Ž, Đ, ć</li>
                <li>✅ Logo on left, title &quot;POTVRDA O ČLANSTVU&quot; inline</li>
                <li>✅ Footer &quot;S poštovanjem,&quot; on right side</li>
                <li>✅ Professional layout with all member details</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
