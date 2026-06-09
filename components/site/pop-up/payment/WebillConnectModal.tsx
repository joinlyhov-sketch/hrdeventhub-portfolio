"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, X, CheckCircle2 } from "lucide-react";
import { useState, useTransition } from "react";
import { connectBankCredentialAction } from "@/actions/payment.action";

interface ConnectBankModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConnectBankModal({ isOpen, onClose }: ConnectBankModalProps) {
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    accountName: "",
    accountNo: "",
    clientId: "",
    clientSecret: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<typeof formData>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleResetAndClose = () => {
    if (isPending) return;
    setFormData({ accountName: "", accountNo: "", clientId: "", clientSecret: "" });
    setFormErrors({});
    setServerError(null);
    setIsSuccess(false);
    onClose();
  };

  const validateForm = () => {
    const errors: Partial<typeof formData> = {};
    if (!formData.accountName.trim()) errors.accountName = "Account name is required";
    if (!formData.accountNo.trim()) errors.accountNo = "Account number is required";
    if (!formData.clientId.trim()) errors.clientId = "Client ID credential is required";
    if (!formData.clientSecret.trim()) errors.clientSecret = "Client secret credential is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    startTransition(async () => {
      const result = await connectBankCredentialAction(formData);
      
      if (!result.ok) {
        setServerError(result.error || "Failed to process bank link credentials.");
        return;
      }

      setIsSuccess(true);
    });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleResetAndClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50" />

        <Dialog.Content
          onPointerDownOutside={(e) => isPending && e.preventDefault()}
          onInteractOutside={(e) => isPending && e.preventDefault()}
          onEscapeKeyDown={(e) => isPending && e.preventDefault()}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[640px] bg-[#f9fbff] rounded-[24px] shadow-xl border border-[#c8d6ee] z-50 overflow-hidden outline-none flex flex-col min-h-[520px]"
        >
          <div className="bg-slate-50/50 border-b border-[#dce6f0] p-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex flex-col">
                <Dialog.Title className="text-lg font-bold text-[#17356f] tracking-tight">
                  Connect WeBill365 Payment Gateway
                </Dialog.Title>
                <p className="text-xs font-semibold text-[#24529a] tracking-wide mt-0.5">
                  {isSuccess ? "Configuration Complete" : "Secure API Integration Credentials"}
                </p>
              </div>
            </div>
            <button
              disabled={isPending}
              onClick={handleResetAndClose}
              className="text-[#94a3b8] hover:text-[#17356f] p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 sm:p-8 flex flex-col justify-between grow">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form
                  key="form-view"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4 grow flex flex-col justify-center"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#17356f] px-0.5">Account Holder Name</label>
                      <div className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 transition-all focus-within:border-[#24529a] ${formErrors.accountName ? "border-red-400" : "border-[#dce6f0]"}`}>
                        <input
                          placeholder="e.g. John Doe"
                          type="text"
                          value={formData.accountName}
                          disabled={isPending}
                          onChange={(e) => handleInputChange("accountName", e.target.value)}
                          className="w-full bg-transparent text-sm outline-none text-[#2d3748]"
                        />
                      </div>
                      {formErrors.accountName && <p className="text-xs text-red-500 px-0.5">{formErrors.accountName}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#17356f] px-0.5">Account Number</label>
                      <div className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 transition-all focus-within:border-[#24529a] ${formErrors.accountNo ? "border-red-400" : "border-[#dce6f0]"}`}>
                        <input
                          placeholder="e.g. 00293848123"
                          type="text"
                          value={formData.accountNo}
                          disabled={isPending}
                          onChange={(e) => handleInputChange("accountNo", e.target.value)}
                          className="w-full bg-transparent text-sm outline-none text-[#2d3748]"
                        />
                      </div>
                      {formErrors.accountNo && <p className="text-xs text-red-500 px-0.5">{formErrors.accountNo}</p>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#17356f] px-0.5">Client ID</label>
                    <div className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 transition-all focus-within:border-[#24529a] ${formErrors.clientId ? "border-red-400" : "border-[#dce6f0]"}`}>
                      <input
                        placeholder="Enter gateway client ID string"
                        type="text"
                        value={formData.clientId}
                        disabled={isPending}
                        onChange={(e) => handleInputChange("clientId", e.target.value)}
                        className="w-full bg-transparent text-sm outline-none text-[#2d3748]"
                      />
                    </div>
                    {formErrors.clientId && <p className="text-xs text-red-500 px-0.5">{formErrors.clientId}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#17356f] px-0.5">Client Secret</label>
                    <div className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 transition-all focus-within:border-[#24529a] ${formErrors.clientSecret ? "border-red-400" : "border-[#dce6f0]"}`}>
                      <input
                        placeholder="Enter merchant client secret key"
                        type="password"
                        value={formData.clientSecret}
                        disabled={isPending}
                        onChange={(e) => handleInputChange("clientSecret", e.target.value)}
                        className="w-full bg-transparent text-sm outline-none text-[#2d3748]"
                      />
                    </div>
                    {formErrors.clientSecret && <p className="text-xs text-red-500 px-0.5">{formErrors.clientSecret}</p>}
                  </div>

                  {serverError && (
                    <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-xs font-medium text-red-600">
                      {serverError}
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-4 border-t border-[#dce6f0]">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={handleResetAndClose}
                      className="px-6 h-[48px] border border-[#dce6f0] text-[#6e7580] text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="flex-1 flex items-center justify-center gap-2 h-[48px] rounded-xl bg-[#24529a] text-sm font-semibold text-white transition-all hover:bg-[#1f4685] disabled:opacity-70 cursor-pointer shadow-xs"
                    >
                      {isPending && <Loader2 size={14} className="animate-spin" />}
                      {isPending ? "Connecting Securely..." : "Save Connection Details"}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success-view"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center gap-5 my-auto py-6"
                >
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-20" />
                    <CheckCircle2 size={64} className="text-green-500 relative z-10" />
                  </div>
                  
                  <div className="space-y-2 max-w-sm">
                    <h3 className="text-xl font-bold text-[#17356f]">Gateway Hook Verified!</h3>
                    <p className="text-sm text-[#6e7580] leading-relaxed">
                      Your WeBill365 gateway credentials have been validated and saved. Account <span className="font-semibold text-[#24529a]">{formData.accountNo}</span> is linked.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="w-full max-w-xs mt-4 h-[48px] rounded-xl bg-[#24529a] text-sm font-semibold text-white transition-all hover:bg-[#1f4685] cursor-pointer shadow-xs"
                  >
                    Dismiss
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}