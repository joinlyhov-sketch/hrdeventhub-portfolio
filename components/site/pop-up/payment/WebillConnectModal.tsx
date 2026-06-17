"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, X, User, Eye, EyeOff, LockKeyhole } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { connectBankCredentialAction } from "@/actions/payment.action";

interface ConnectBankModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConnectBankModal({
  isOpen,
  onClose,
}: ConnectBankModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [showClientSecret, setShowClientSecret] = useState(false);
  const [showAccountNo, setShowAccountNo] = useState(false);

  const [formData, setFormData] = useState({
    accountName: "",
    accountNo: "",
    clientId: "",
    clientSecret: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<typeof formData>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleResetAndClose = () => {
    if (isPending) return;
    setFormData({
      accountName: "",
      accountNo: "",
      clientId: "",
      clientSecret: "",
    });
    setFormErrors({});
    setServerError(null);
    setShowConfirmation(false);
    onClose();
  };

  const validateForm = () => {
    const errors: Partial<typeof formData> = {};
    if (!formData.accountName.trim())
      errors.accountName = "Account name is required";
    if (!formData.accountNo.trim())
      errors.accountNo = "Account number is required";
    if (!formData.clientId.trim())
      errors.clientId = "Client ID credential is required";
    if (!formData.clientSecret.trim())
      errors.clientSecret = "Client secret credential is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setServerError(null);
    setShowConfirmation(true);
  };

  const handleConfirmDisconnect = () => {
    startTransition(async () => {
      const result = await connectBankCredentialAction(formData);
      if (!result.ok) {
        setServerError(
          result.error || "Failed to process bank link credentials.",
        );
        setShowConfirmation(false);
        return;
      }
      handleResetAndClose();
      router.push(pathname);
      router.refresh();
    });
  };

  const handleCancelAndNavigate = () => {
    handleResetAndClose();
    router.push(pathname);
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => !open && handleResetAndClose()}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" />
        <Dialog.Content
          onPointerDownOutside={(e) => isPending && e.preventDefault()}
          onInteractOutside={(e) => isPending && e.preventDefault()}
          onEscapeKeyDown={(e) => isPending && e.preventDefault()}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-[calc(100%-24px)] sm:w-full max-w-[520px]
            bg-white rounded-2xl sm:rounded-3xl shadow-2xl z-50 outline-none overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 pt-5 pb-4 sm:items-start sm:px-8 sm:pt-8 sm:pb-5 border-b border-gray-100">
            <div>
              <Image
                src="/images/WeBill.png"
                alt="WeBill365"
                width={160}
                height={48}
                className="h-8 sm:h-11 w-auto object-contain object-left"
              />
              <p className="text-[11px] sm:text-xs text-gray-400 mt-1 sm:mt-1.5 font-medium">
                Payment Gateway
              </p>
            </div>
            <button
              type="button"
              disabled={isPending}
              onClick={handleResetAndClose}
              aria-label="Close modal"
              className="text-gray-300 hover:text-gray-500 transition-colors disabled:opacity-50 sm:mt-1 cursor-pointer"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>
          <div className="px-5 pt-4 pb-5 sm:px-8 sm:py-6">
            <AnimatePresence mode="wait">
              {!showConfirmation ? (
                <motion.form
                  key="form-view"
                  onSubmit={handleProceedToConfirm}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex flex-col gap-2.5 sm:gap-4"
                >
                  <Dialog.Title className="sr-only">
                    Connect WeBill365 Account
                  </Dialog.Title>

                  <div className="flex flex-col gap-1 sm:gap-1.5">
                    <label className="text-[11px] sm:text-sm font-semibold text-secondary uppercase sm:normal-case sm:tracking-normal tracking-wide">
                      Account Name
                    </label>
                    <div
                      className={`flex items-center gap-2.5 rounded-xl bg-[#f8f9fc] px-4 py-2.5 sm:py-3.5 border transition-all
                      ${formErrors.accountName ? "border-red-400" : "border-transparent focus-within:border-gray-300"}`}
                    >
                      <User
                        size={15}
                        className="text-gray-300 shrink-0"
                        strokeWidth={2}
                      />
                      <input
                        placeholder="Developer GenZ"
                        type="text"
                        value={formData.accountName}
                        disabled={isPending}
                        onChange={(e) =>
                          handleInputChange("accountName", e.target.value)
                        }
                        className="w-full bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400"
                      />
                    </div>
                    {formErrors.accountName && (
                      <p className="text-xs text-red-500">
                        {formErrors.accountName}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 sm:gap-1.5">
                    <label className="text-[11px] sm:text-sm font-semibold text-secondary uppercase sm:normal-case sm:tracking-normal tracking-wide">
                      Account No.
                    </label>
                    <div
                      className={`flex items-center gap-2.5 rounded-xl bg-[#f8f9fc] px-4 py-2.5 sm:py-3.5 border transition-all
                      ${formErrors.accountNo ? "border-red-400" : "border-transparent focus-within:border-gray-300"}`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="shrink-0"
                      >
                        <path
                          d="M9.78269 14.7885H14.716C14.641 14.8552 14.566 14.9136 14.491 14.9802L10.9327 17.6469C9.75768 18.5219 7.84102 18.5219 6.65769 17.6469L3.09102 14.9802C2.30769 14.3969 1.66602 13.1052 1.66602 12.1302V5.9552C1.66602 4.93854 2.44102 3.81354 3.39102 3.4552L7.54102 1.89687C8.22435 1.63854 9.35768 1.63854 10.041 1.89687L14.1827 3.4552C14.9744 3.7552 15.6493 4.58854 15.8577 5.43854H9.77435C9.59101 5.43854 9.42434 5.44688 9.26601 5.44688C7.72434 5.53855 7.32434 6.09687 7.32434 7.8552V12.3802C7.33268 14.2969 7.82435 14.7885 9.78269 14.7885Z"
                          stroke="#BCC5CD"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.33203 9.34375H18.332"
                          stroke="#BCC5CD"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.332 7.84688V12.4719C18.3154 14.3219 17.807 14.7802 15.882 14.7802H9.78203C7.8237 14.7802 7.33203 14.2885 7.33203 12.3635V7.83854C7.33203 6.08854 7.73203 5.53019 9.2737 5.43019C9.43203 5.43019 9.5987 5.42188 9.78203 5.42188H15.882C17.8404 5.43021 18.332 5.91354 18.332 7.84688Z"
                          stroke="#BCC5CD"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.43359 12.7109H10.5419"
                          stroke="#BCC5CD"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12.291 12.7109H15.016"
                          stroke="#BCC5CD"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <input
                        placeholder="1120000811230"
                        type={showAccountNo ? "text" : "password"}
                        value={formData.accountNo}
                        disabled={isPending}
                        onChange={(e) =>
                          handleInputChange("accountNo", e.target.value)
                        }
                        className="w-full min-w-0 bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAccountNo(!showAccountNo)}
                        className="text-gray-300 hover:text-gray-500 shrink-0"
                      >
                        {showAccountNo ? (
                          <Eye size={16} />
                        ) : (
                          <EyeOff size={16} />
                        )}
                      </button>
                    </div>
                    {formErrors.accountNo && (
                      <p className="text-xs text-red-500">
                        {formErrors.accountNo}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 sm:gap-1.5">
                    <label className="text-[11px] sm:text-sm font-semibold text-secondary uppercase sm:normal-case sm:tracking-normal tracking-wide">
                      Client ID
                    </label>
                    <div
                      className={`flex items-center gap-2.5 rounded-xl bg-[#f8f9fc] px-4 py-2.5 sm:py-3.5 border transition-all
                      ${formErrors.clientId ? "border-red-400" : "border-transparent focus-within:border-gray-300"}`}
                    >
                      <LockKeyhole
                        size={16}
                        className="text-gray-300 shrink-0"
                        strokeWidth={2}
                      />
                      <input
                        placeholder="2bf667d0112d5817feb17b2090b84e24"
                        type="text"
                        value={formData.clientId}
                        disabled={isPending}
                        onChange={(e) =>
                          handleInputChange("clientId", e.target.value)
                        }
                        className="w-full min-w-0 bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400 truncate"
                      />
                    </div>
                    {formErrors.clientId && (
                      <p className="text-xs text-red-500">
                        {formErrors.clientId}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 sm:gap-1.5">
                    <label className="text-[11px] sm:text-sm font-semibold text-secondary uppercase sm:normal-case sm:tracking-normal tracking-wide">
                      Client Secret
                    </label>
                    <div
                      className={`flex items-center gap-2.5 rounded-xl bg-[#f8f9fc] px-4 py-2.5 sm:py-3.5 border transition-all
                      ${formErrors.clientSecret ? "border-red-400" : "border-transparent focus-within:border-gray-300"}`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="shrink-0"
                      >
                        <path
                          d="M16.4912 12.4406C14.7746 14.149 12.3162 14.674 10.1579 13.999L6.23289 17.9156C5.94955 18.2073 5.39122 18.3823 4.99122 18.324L3.17455 18.074C2.57455 17.9906 2.01622 17.424 1.92455 16.824L1.67455 15.0073C1.61622 14.6073 1.80789 14.049 2.08289 13.7656L5.99955 9.84896C5.33289 7.68229 5.84955 5.22396 7.56622 3.51563C10.0246 1.05729 14.0162 1.05729 16.4829 3.51563C18.9496 5.97396 18.9496 9.98229 16.4912 12.4406Z"
                          stroke="#BCC5CD"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5.74219 14.5781L7.65885 16.4948"
                          stroke="#BCC5CD"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12.084 9.16406C12.7743 9.16406 13.334 8.60442 13.334 7.91406C13.334 7.22371 12.7743 6.66406 12.084 6.66406C11.3936 6.66406 10.834 7.22371 10.834 7.91406C10.834 8.60442 11.3936 9.16406 12.084 9.16406Z"
                          stroke="#BCC5CD"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <input
                        placeholder="........................"
                        type={showClientSecret ? "text" : "password"}
                        value={formData.clientSecret}
                        disabled={isPending}
                        onChange={(e) =>
                          handleInputChange("clientSecret", e.target.value)
                        }
                        className="flex-1 min-w-0 bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400 tracking-widest"
                      />
                      <button
                        type="button"
                        onClick={() => setShowClientSecret(!showClientSecret)}
                        className="text-gray-300 hover:text-gray-500 shrink-0"
                      >
                        {showClientSecret ? (
                          <Eye size={16} />
                        ) : (
                          <EyeOff size={16} />
                        )}
                      </button>
                    </div>
                    {formErrors.clientSecret && (
                      <p className="text-xs text-red-500">
                        {formErrors.clientSecret}
                      </p>
                    )}
                  </div>

                  {serverError && (
                    <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                      {serverError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full mt-1 h-11 sm:h-12 rounded-xl bg-[#FAA228] hover:bg-[#F2941E] text-white text-sm font-semibold transition-colors disabled:opacity-60 cursor-pointer"
                  >
                    Disconnect
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="disconnect-view"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="flex flex-col gap-4 pt-2"
                >
                  <div>
                    <h3 className="text-lg font-bold text-secondary">
                      Disconnect Account
                    </h3>
                    <p className="text-sm text-gray-500 mt-1.5">
                      Are you sure you want to disconnect your WeBill365
                      account?
                    </p>
                  </div>

                  {serverError && (
                    <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                      {serverError}
                    </div>
                  )}

                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={handleConfirmDisconnect}
                      className="flex-1 h-11 sm:h-12 text-white bg-primary hover:bg-primary/90 text-sm font-semibold rounded-xl transition-all flex items-center justify-center cursor-pointer disabled:opacity-60"
                    >
                      {isPending ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        "Yes, Disconnect"
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={handleCancelAndNavigate}
                      className="flex-1 h-11 sm:h-12 bg-white border border-red-300 hover:bg-red-50 text-red-500 text-sm font-semibold rounded-xl transition-all flex items-center justify-center cursor-pointer disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
